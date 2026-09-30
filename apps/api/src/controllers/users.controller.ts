import type { NextFunction, Request, Response } from "express";
import type {
  UserRecord,
  CreateUserRequest,
  UpdateUserRequest,
} from "@bukit-delight/shared";

const { randomBytes } = require("node:crypto");
const Joi = require("joi");
const { response } = require("../middlewares");
const { prisma } = require("../config/prisma");
const {
  createUser,
  deleteUser,
  findUserForToken,
  findRolesByIds,
  listUsers,
  updateUser,
} = require("../services/authentication.service");
const { HashPassword } = require("../services/authentication-tokens.service");

const error = (message: string, status = 500) =>
  Object.assign(new Error(message), { status });

const serialize = (account: any): UserRecord => ({
  id: account.id,
  username: account.username,
  email: account.email,
  roles: account.roles.map(({ role }: any) => ({
    id: role.id,
    name: role.name,
  })),
});

const validate = (schema: unknown, req: Request, next: NextFunction) => {
  const { error: validationError, value } = (schema as any).validate(req.body);
  if (validationError) {
    next(error(validationError.details[0].message, 400));
    return null;
  }
  return value;
};

const emitUsersUpdate = (req: Request) => {
  const application = req.app as Request["app"] & {
    io: { emit: (event: string, message: string) => void };
  };
  application.io.emit("UsersUpdate", "UsersUpdate");
};

const parseRoleIds = (roleIds: string | string[]) =>
  (Array.isArray(roleIds) ? roleIds : roleIds.split(","))
    .map((roleId) => roleId.trim())
    .filter(Boolean);

exports.readAll = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await listUsers(prisma);
    return response.success(
      res,
      "Users",
      0,
      200,
      users.map(serialize),
    );
  } catch {
    return next(error("Users could not be loaded"));
  }
};

exports.readOne = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const account = await findUserForToken(prisma, req.params.id);
    if (!account) return next(error("User not found", 404));
    return response.success(res, "Users", 0, 200, serialize(account));
  } catch {
    return next(error("Account could not be loaded"));
  }
};

exports.create = async (req: Request, res: Response, next: NextFunction) => {
  const body = validate(
    Joi.object({
      username: Joi.string().required(),
      email: Joi.string().required().email(),
      role_ids: Joi.alternatives()
        .try(Joi.array().items(Joi.string()), Joi.string())
        .required(),
      password: Joi.string().required(),
      repeat_password: Joi.string().valid(Joi.ref("password")).required(),
    }),
    req,
    next,
  ) as CreateUserRequest | null;
  if (!body) return;
  try {
    const roleIds = parseRoleIds(body.role_ids);
    if (roleIds.length === 0) return next(error("At least one role is required", 400));
    const roles = await findRolesByIds(prisma, roleIds);
    if (roles.length !== new Set(roleIds).size)
      return next(error("Role not found", 404));
    const authenticated = (req as any).auth;
    if (roles.some(({ name }: { name: string }) => name === "owner") &&
        !authenticated?.roles?.includes("owner")) {
      return next(error("Forbidden", 403));
    }
    const account = await createUser(prisma, {
      id: randomBytes(12).toString("hex"),
      username: body.username,
      email: body.email,
      password: await HashPassword(body.password),
      roleIds: roles.map(({ id }: { id: string }) => id),
    });
    emitUsersUpdate(req);
    return response.success(res, "Register", 0, 200, serialize(account));
  } catch (cause) {
    if ((cause as any)?.status === 409) return next(cause);
    return next(error("Account could not be created"));
  }
};

exports.update = async (req: Request, res: Response, next: NextFunction) => {
  const body = validate(
    Joi.object({
      username: Joi.string().required(),
      email: Joi.string().required().email(),
      role_ids: Joi.alternatives()
        .try(Joi.array().items(Joi.string()), Joi.string())
        .required(),
      password: Joi.string(),
      repeat_password: Joi.string().valid(Joi.ref("password")),
    }),
    req,
    next,
  ) as UpdateUserRequest | null;
  if (!body) return;
  try {
    const authenticated = (req as any).auth;
    if (
      authenticated?.userId !== req.params.id &&
      !authenticated?.roles?.includes("owner")
    ) {
      return next(error("Forbidden", 403));
    }
    const roleIds = parseRoleIds(body.role_ids);
    if (roleIds.length === 0) return next(error("At least one role is required", 400));
    const roles = await findRolesByIds(prisma, roleIds);
    if (roles.length !== new Set(roleIds).size)
      return next(error("Role not found", 404));
    if (roles.some(({ name }: { name: string }) => name === "owner") &&
        !authenticated?.roles?.includes("owner")) {
      return next(error("Forbidden", 403));
    }
    const account = await updateUser(prisma, req.params.id, {
      username: body.username,
      email: body.email,
      roleIds: roles.map(({ id }: { id: string }) => id),
      ...(body.password ? { password: await HashPassword(body.password) } : {}),
    });
    emitUsersUpdate(req);
    return response.success(res, "Update", 0, 200, serialize(account));
  } catch (cause) {
    if ((cause as any)?.status === 409) return next(cause);
    if ((cause as any)?.code === "P2025")
      return next(error("Account not found", 404));
    return next(error("Account could not be updated"));
  }
};

exports.delete = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const account = await deleteUser(prisma, req.params.id);
    emitUsersUpdate(req);
    return response.success(res, "Delete", 0, 200, serialize(account));
  } catch (cause) {
    if ((cause as any)?.code === "P2025")
      return next(error("User not found", 404));
    if ((cause as any)?.code === "P2003") {
      return next(
        error("Account is still referenced and cannot be deleted", 409),
      );
    }
    return next(error("Account could not be deleted"));
  }
};
