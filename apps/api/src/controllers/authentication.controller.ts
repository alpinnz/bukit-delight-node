import type {
  NextFunction,
  Request,
  Response as ExpressResponse,
} from "express";
import { Prisma } from "../generated/prisma/client";

const { randomBytes } = require("node:crypto");
const Joi = require("joi");
const { response } = require("../middlewares");
const { sendForgotPassword } = require("../services/email.service");
const { prisma } = require("../config/prisma");
const logger = require("../utils/logger");
const {
  createUserWithRoles,
  createLoginRefreshToken,
  findUserForLogin,
  findUserForToken,
  findRoleByName,
  revokeRefreshToken,
  rotateRefreshToken,
} = require("../services/authentication.service");
const {
  HashPassword,
  VerifyHashPassword,
  PasswordNeedsRehash,
  JwtAccessToken,
  JwtResetPasswordToken,
  JwtRefreshToken,
  VerifyRefreshToken,
  VerifyResetPasswordToken,
} = require("../services/authentication-tokens.service");

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

exports.register = async (
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
    const user = await createUserWithRoles(
      database,
      {
        id: randomBytes(12).toString("hex"),
        username: body.username,
        email: body.email.toLowerCase(),
        password: await HashPassword(body.password),
        roleIds: [role.id],
      },
    );
    return response.success(res, "Register", 0, 200, {
      username: user.username,
      email: user.email,
    });
  } catch (cause) {
    return sendError(cause, next);
  }
};

exports.login = async (
  req: Request,
  res: ExpressResponse,
  next: NextFunction,
) => {
  const body = validate(
    Joi.object({
      username: Joi.string().required(),
      password: Joi.string().required(),
      replace_session: Joi.boolean().default(false),
    }),
    req,
    next,
  );
  if (!body) return;
  try {
    const database = requirePrisma();
    const account = await findUserForLogin(database, body.username);
    if (
      !account ||
      !(await VerifyHashPassword(body.password, account.password))
    ) {
      return next(error("Username or password is incorrect", 401));
    }
    const roles = account.roles.map(({ role }: any) => role);
    const roleNames = roles.map(({ name }: { name: string }) => name.toLowerCase());
    const primaryRole = ["owner", "cashier", "customer"].find((role) =>
      roleNames.includes(role),
    );
    if (!roleNames.some((role: string) => ["owner", "cashier", "customer"].includes(role))) {
      return next(error("Username or password is incorrect", 401));
    }

    if (PasswordNeedsRehash(account.password)) {
      await database.user.updateMany({
        where: { id: account.id, password: account.password },
        data: { password: await HashPassword(body.password) },
      });
    }

    const accessToken = await JwtAccessToken(account);
    const refreshToken = await JwtRefreshToken(account);
    const now = new Date();
    const refreshTokenRecord = {
      user_id: account.id,
      token: refreshToken,
      expires_at: new Date(
        now.getTime() + Number(process.env.REFRESH_TOKEN_TIMEOUT),
      ),
      created_by_ip: req.ip,
    };
    const sessionCreated = await createLoginRefreshToken(
      database,
      refreshTokenRecord,
      body.replace_session,
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
    return response.success(res, "Login", 0, 200, {
      id: account.id,
      username: account.username,
      email: account.email,
      role: primaryRole,
      roles: roleNames,
      access_token: accessToken,
      refresh_token: refreshToken,
    });
  } catch (cause) {
    return sendError(cause, next);
  }
};

exports.refreshToken = async (
  req: Request,
  res: ExpressResponse,
  next: NextFunction,
) => {
  try {
    const token = req.headers["x-refresh-token"];
    if (typeof token !== "string") return next(error("Invalid token", 401));
    const database = requirePrisma();
    const storedToken = await database.refreshToken.findFirst({
      where: { token, revoked_at: null },
      select: { expires_at: true, token: true, user_id: true },
    });
    if (
      !storedToken ||
      (storedToken.expires_at && storedToken.expires_at <= new Date())
    ) {
      return next(error("Invalid token", 401));
    }
    const decoded = await VerifyRefreshToken(token);
    if (!decoded?.id) return next(error("Invalid token", 401));
    const account = await findUserForToken(database, decoded.id);
    const roles = account?.roles.map(({ role }: any) => role) ?? [];
    const roleNames = roles.map(({ name }: { name: string }) => name.toLowerCase());
    const primaryRole = ["owner", "cashier", "customer"].find((role) =>
      roleNames.includes(role),
    );
    if (!account || storedToken.user_id !== account.id || !roleNames.some((role: string) => ["owner", "cashier", "customer"].includes(role))) {
      return next(error("Invalid token", 401));
    }

    const nextRefreshToken = await JwtRefreshToken(account);
    const now = new Date();
    const rotated = await rotateRefreshToken(database, {
      currentToken: token,
      nextToken: nextRefreshToken,
      userId: account.id,
      ipAddress: req.ip,
      expiresAt: new Date(
        now.getTime() + Number(process.env.REFRESH_TOKEN_TIMEOUT),
      ),
      now,
    });
    if (!rotated) return next(error("Invalid token", 401));

    const accessToken = await JwtAccessToken(account);
    return response.success(res, "Refresh Token", 0, 200, {
      id: account.id,
      username: account.username,
      email: account.email,
      role: primaryRole,
      roles: roleNames,
      access_token: accessToken,
      refresh_token: nextRefreshToken,
    });
  } catch (cause) {
    return sendError(cause, next);
  }
};

exports.logout = async (
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
    return response.success(res, "Revoke token", 0, 200);
  } catch (cause) {
    return sendError(cause, next);
  }
};

exports.forgotPassword = async (
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
    response.success(
      res,
      "If the email exists, reset instructions have been sent",
    );
  try {
    const database = requirePrisma();
    const account = await database.user.findUnique({
      where: { email: body.email.trim().toLowerCase() },
      select: { id: true, email: true },
    });
    if (!account) return genericResponse();
    const token = await JwtResetPasswordToken(account);
    await sendForgotPassword(account.email, token);
    await database.user.update({
      where: { id: account.id },
      data: { reset_link: token },
    });
    return genericResponse();
  } catch (cause) {
    return sendError(cause, next);
  }
};

exports.resetPassword = async (
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
        const updated = await transaction.user.updateMany({
          where: { id: decoded.id, reset_link: body.token },
          data: { reset_link: Prisma.DbNull, password },
        });
        if (updated.count !== 1) return false;

        await transaction.refreshToken.updateMany({
          where: { user_id: decoded.id, revoked_at: null },
          data: { revoked_at: new Date(), revoked_by_ip: req.ip },
        });
        return true;
      },
    );
    if (!reset) return next(error("Invalid token", 401));
    return response.success(res, "Reset password");
  } catch (cause) {
    return sendError(cause, next);
  }
};

exports.activate = async (_req: Request, res: ExpressResponse) =>
  response.success(res, "Activate");
