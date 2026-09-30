import type { NextFunction, Request, Response } from "express";
import type { RoleRecord } from "@bukit-delight/shared";

const { response } = require("../middlewares");
const { prisma } = require("../config/prisma");
const { listRoles } = require("../services/authentication.service");

exports.readAll = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const roles = await listRoles(prisma);
    const roleRecords: RoleRecord[] = roles.map(
      ({ id, ...role }: { id: string; [key: string]: unknown }) => ({
        id,
        ...role,
      }),
    );
    return response.success(res, "Roles", 0, 200, roleRecords);
  } catch {
    return next(
      Object.assign(new Error("Roles could not be loaded"), { status: 500 }),
    );
  }
};
