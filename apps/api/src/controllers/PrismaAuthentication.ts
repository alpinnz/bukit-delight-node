import type {
  NextFunction,
  Request,
  Response as ExpressResponse,
} from "express";
import { Prisma } from "../generated/prisma/client";

const { randomBytes } = require("node:crypto");
const Joi = require("joi");
const { Response } = require("./../middlewares");
const { sendForgotPassword } = require("./../config/Nodemailer");
const { prisma } = require("./../config/Prisma");
const logger = require("./../utils/logger");
const {
  createAccount,
  createLoginRefreshToken,
  createRefreshToken,
  findAccountForLogin,
  findAccountForToken,
  findRoleByName,
  revokeRefreshToken,
  rotateRefreshToken,
} = require("./../services/PrismaAuthentication");
const {
  HashPassword,
  VerifyHashPassword,
  PasswordNeedsRehash,
  JwtAccessToken,
  JwtResetPasswordToken,
  JwtRefreshToken,
  VerifyRefreshToken,
  VerifyResetPasswordToken,
} = require("./../services/Authentication");

const error = (message: string, status = 500, code?: string) =>
  Object.assign(new Error(message), { status, code });

const requirePrisma = () => {
  if (!prisma) throw error("PostgreSQL authentication is not configured");
  return prisma;
};

const sendError = (cause: unknown, next: NextFunction) => {
  const status = (cause as { status?: number })?.status;
  if (status && status < 500)
    return next(error(String((cause as Error).message), status));
  logger.error({ err: cause }, "Prisma authentication operation failed");
  return next(error("Authentication request failed"));
};

const validate = (schema: unknown, req: Request, next: NextFunction) => {
  const { error: validationError, value } = (schema as any).validate(req.body);
  if (validationError) {
    next(error(validationError.details[0].message, 400));
    return null;
  }
  return value;
};

exports.Register = async (
  req: Request,
  res: ExpressResponse,
  next: NextFunction,
) => {
  const body = validate(
    Joi.object({
      username: Joi.string().required(),
      email: Joi.string().required().email(),
      password: Joi.string()
        .min(8)
        .pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/)
        .required(),
      repeat_password: Joi.string().valid(Joi.ref("password")).required(),
    }),
    req,
    next,
  );
  if (!body) return;
  try {
    const database = requirePrisma();
    const role = await findRoleByName(database, "customer");
    if (!role) return next(error("Role not found", 500));
    const account = await createAccount(database, {
      id: randomBytes(12).toString("hex"),
      username: body.username,
      email: body.email.toLowerCase(),
      password: await HashPassword(body.password),
      roleId: role.id,
    });
    return Response.Success(res, "Register", 0, 200, {
      username: account.username,
      email: account.email,
    });
  } catch (cause) {
    return sendError(cause, next);
  }
};

exports.Login = async (
  req: Request,
  res: ExpressResponse,
  next: NextFunction,
) => {
  const body = validate(
    Joi.object({
      username: Joi.string().required(),
      password: Joi.string().required(),
      replaceSession: Joi.boolean().default(false),
    }),
    req,
    next,
  );
  if (!body) return;
  try {
    const database = requirePrisma();
    const account = await findAccountForLogin(database, body.username);
    if (
      !account ||
      !(await VerifyHashPassword(body.password, account.password))
    ) {
      return next(error("Username or password is incorrect", 401));
    }
    if (!account.role)
      return next(error("Username or password is incorrect", 401));
    const isStaffAccount = ["admin", "cashier"].includes(
      account.role.name.toLowerCase(),
    );
    if (!isStaffAccount) {
      return next(error("Username or password is incorrect", 401));
    }

    if (PasswordNeedsRehash(account.password)) {
      await database.account.updateMany({
        where: { id: account.id, password: account.password },
        data: { password: await HashPassword(body.password) },
      });
    }

    const accessToken = await JwtAccessToken(account);
    const refreshToken = await JwtRefreshToken(account);
    const now = new Date();
    const refreshTokenRecord = {
      accountId: account.id,
      token: refreshToken,
      expires: new Date(
        now.getTime() + Number(process.env.REFRESH_TOKEN_TIMEOUT),
      ),
      createdByIp: req.ip,
    };
    const sessionCreated = await createLoginRefreshToken(
      database,
      refreshTokenRecord,
      body.replaceSession,
    );
    if (!sessionCreated) {
      return next(
        error(
          "This account is already signed in on another device",
          409,
          "ACTIVE_SESSION",
        ),
      );
    }
    return Response.Success(res, "Login", 0, 200, {
      _id: account.id,
      username: account.username,
      email: account.email,
      role: account.role.name,
      accessToken,
      refreshToken,
    });
  } catch (cause) {
    return sendError(cause, next);
  }
};

exports.RefreshToken = async (
  req: Request,
  res: ExpressResponse,
  next: NextFunction,
) => {
  try {
    const token = req.headers["x-refresh-token"];
    if (typeof token !== "string") return next(error("Invalid token", 401));
    const database = requirePrisma();
    const storedToken = await database.refreshToken.findFirst({
      where: { token, revoked: null },
      select: { expires: true, token: true },
    });
    if (
      !storedToken ||
      (storedToken.expires && storedToken.expires <= new Date())
    ) {
      return next(error("Invalid token", 401));
    }
    const decoded = await VerifyRefreshToken(token);
    if (!decoded?.id) return next(error("Invalid token", 401));
    const account = await findAccountForToken(database, decoded.id);
    if (!account?.role) return next(error("Invalid token", 401));

    const nextRefreshToken = await JwtRefreshToken(account);
    const now = new Date();
    const rotated = await rotateRefreshToken(database, {
      currentToken: token,
      nextToken: nextRefreshToken,
      accountId: account.id,
      ipAddress: req.ip,
      expiresAt: new Date(
        now.getTime() + Number(process.env.REFRESH_TOKEN_TIMEOUT),
      ),
      now,
    });
    if (!rotated) return next(error("Invalid token", 401));

    const accessToken = await JwtAccessToken(account);
    return Response.Success(res, "Refresh Token", 0, 200, {
      _id: account.id,
      username: account.username,
      email: account.email,
      role: account.role.name,
      accessToken,
      refreshToken: nextRefreshToken,
    });
  } catch (cause) {
    return sendError(cause, next);
  }
};

exports.Logout = async (
  req: Request,
  res: ExpressResponse,
  next: NextFunction,
) => {
  const token = req.headers["x-refresh-token"];
  if (typeof token !== "string")
    return next(error("Failed authorization", 401));
  try {
    const revoked = await revokeRefreshToken(requirePrisma(), token, req.ip);
    if (!revoked) return next(error("Invalid token", 401));
    return Response.Success(res, "Revoke token", 0, 200);
  } catch (cause) {
    return sendError(cause, next);
  }
};

exports.ForgotPassword = async (
  req: Request,
  res: ExpressResponse,
  next: NextFunction,
) => {
  const body = validate(
    Joi.object({ email: Joi.string().required().email() }),
    req,
    next,
  );
  if (!body) return;
  const genericResponse = () =>
    Response.Success(
      res,
      "If the email exists, reset instructions have been sent",
    );
  try {
    const database = requirePrisma();
    const account = await database.account.findUnique({
      where: { email: body.email.trim().toLowerCase() },
      select: { id: true, email: true },
    });
    if (!account) return genericResponse();
    const token = await JwtResetPasswordToken(account);
    await sendForgotPassword(account.email, token);
    await database.account.update({
      where: { id: account.id },
      data: { resetLink: token },
    });
    return genericResponse();
  } catch (cause) {
    return sendError(cause, next);
  }
};

exports.ResetPassword = async (
  req: Request,
  res: ExpressResponse,
  next: NextFunction,
) => {
  const body = validate(
    Joi.object({
      token: Joi.string().required(),
      password: Joi.string()
        .min(8)
        .pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/)
        .required(),
      repeat_password: Joi.string().valid(Joi.ref("password")).required(),
    }),
    req,
    next,
  );
  if (!body) return;
  try {
    const decoded = await VerifyResetPasswordToken(body.token);
    if (!decoded?.id) return next(error("Invalid token", 401));
    const database = requirePrisma();
    const password = await HashPassword(body.password);
    const reset = await database.$transaction(
      async (transaction: Prisma.TransactionClient) => {
        const updated = await transaction.account.updateMany({
          where: { id: decoded.id, resetLink: body.token },
          data: { resetLink: Prisma.DbNull, password },
        });
        if (updated.count !== 1) return false;

        await transaction.refreshToken.updateMany({
          where: { accountId: decoded.id, revoked: null },
          data: { revoked: new Date(), revokedByIp: req.ip },
        });
        return true;
      },
    );
    if (!reset) return next(error("Invalid token", 401));
    return Response.Success(res, "Reset password");
  } catch (cause) {
    return sendError(cause, next);
  }
};

exports.Activate = async (_req: Request, res: ExpressResponse) =>
  Response.Success(res, "Activate");
