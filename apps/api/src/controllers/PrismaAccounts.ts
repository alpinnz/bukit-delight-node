import type { NextFunction, Request, Response } from "express";
import type {
  AccountRecord,
  CreateAccountRequest,
  UpdateAccountRequest,
} from "@bukit-delight/shared";

const { randomBytes } = require("node:crypto");
const Joi = require("joi");
const { Response: ApiResponse } = require("./../middlewares");
const { prisma } = require("./../config/Prisma");
const {
  createAccount,
  deleteAccount,
  findAccountForToken,
  findRoleById,
  listAccounts,
  updateAccount,
} = require("./../services/PrismaAuthentication");
const { HashPassword } = require("./../services/Authentication");

const error = (message: string, status = 500) =>
  Object.assign(new Error(message), { status });

const serialize = (account: any): AccountRecord => ({
  _id: account.id,
  username: account.username,
  email: account.email,
  id_role: account.role
    ? { _id: account.role.id, name: account.role.name }
    : null,
});

const validate = (schema: unknown, req: Request, next: NextFunction) => {
  const { error: validationError, value } = (schema as any).validate(req.body);
  if (validationError) {
    next(error(validationError.details[0].message, 400));
    return null;
  }
  return value;
};

const emitAccountsUpdate = (req: Request) => {
  const application = req.app as Request["app"] & {
    io: { emit: (event: string, message: string) => void };
  };
  application.io.emit("AccountsUpdate", "AccountsUpdate");
};

exports.ReadAll = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const accounts = await listAccounts(prisma);
    return ApiResponse.Success(
      res,
      "Accounts",
      0,
      200,
      accounts.map(serialize),
    );
  } catch {
    return next(error("Accounts could not be loaded"));
  }
};

exports.ReadOne = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const account = await findAccountForToken(prisma, req.params._id);
    if (!account) return next(error("Accounts not found", 404));
    return ApiResponse.Success(res, "Accounts", 0, 200, serialize(account));
  } catch {
    return next(error("Account could not be loaded"));
  }
};

exports.Create = async (req: Request, res: Response, next: NextFunction) => {
  const body = validate(
    Joi.object({
      username: Joi.string().required(),
      email: Joi.string().required().email(),
      id_role: Joi.string().required(),
      password: Joi.string().required(),
      repeat_password: Joi.string().valid(Joi.ref("password")).required(),
    }),
    req,
    next,
  ) as CreateAccountRequest | null;
  if (!body) return;
  try {
    const role = await findRoleById(prisma, body.id_role);
    if (!role) return next(error("Role not found", 404));
    const authenticated = (req as any).auth;
    if (
      role.name === "admin" &&
      authenticated?.role?.toLowerCase() !== "admin"
    ) {
      return next(error("Forbidden", 403));
    }
    const account = await createAccount(prisma, {
      id: randomBytes(12).toString("hex"),
      username: body.username,
      email: body.email,
      password: await HashPassword(body.password),
      roleId: role.id,
    });
    emitAccountsUpdate(req);
    return ApiResponse.Success(res, "Register", 0, 200, {
      username: account.username,
      email: account.email,
      role: role.name,
    });
  } catch (cause) {
    if ((cause as any)?.status === 409) return next(cause);
    return next(error("Account could not be created"));
  }
};

exports.Update = async (req: Request, res: Response, next: NextFunction) => {
  const body = validate(
    Joi.object({
      username: Joi.string().required(),
      email: Joi.string().required().email(),
      id_role: Joi.string().required(),
      password: Joi.string(),
      repeat_password: Joi.string().valid(Joi.ref("password")),
    }),
    req,
    next,
  ) as UpdateAccountRequest | null;
  if (!body) return;
  try {
    const authenticated = (req as any).auth;
    if (
      authenticated?.accountId !== req.params._id &&
      authenticated?.role?.toLowerCase() !== "admin"
    ) {
      return next(error("Forbidden", 403));
    }
    const role = await findRoleById(prisma, body.id_role);
    if (!role) return next(error("Role not found", 404));
    if (role.name === "admin" && authenticated.role.toLowerCase() !== "admin") {
      return next(error("Forbidden", 403));
    }
    const account = await updateAccount(prisma, req.params._id, {
      username: body.username,
      email: body.email,
      roleId: role.id,
      ...(body.password ? { password: await HashPassword(body.password) } : {}),
    });
    emitAccountsUpdate(req);
    return ApiResponse.Success(res, "Update", 0, 200, {
      username: account.username,
      email: account.email,
      id_role: role.name,
    });
  } catch (cause) {
    if ((cause as any)?.status === 409) return next(cause);
    if ((cause as any)?.code === "P2025")
      return next(error("Account not found", 404));
    return next(error("Account could not be updated"));
  }
};

exports.Delete = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const account = await deleteAccount(prisma, req.params._id);
    emitAccountsUpdate(req);
    return ApiResponse.Success(res, "Delete", 0, 200, serialize(account));
  } catch (cause) {
    if ((cause as any)?.code === "P2025")
      return next(error("Accounts not found", 404));
    if ((cause as any)?.code === "P2003") {
      return next(
        error("Account is still referenced and cannot be deleted", 409),
      );
    }
    return next(error("Account could not be deleted"));
  }
};
