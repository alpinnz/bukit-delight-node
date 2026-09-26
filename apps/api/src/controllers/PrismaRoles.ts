import type { NextFunction, Request, Response } from "express";
import type { RoleRecord } from "@bukit-delight/shared";

const { Response: ApiResponse } = require("./../middlewares");
const { prisma } = require("./../config/Prisma");
const { listRoles } = require("./../services/PrismaAuthentication");

exports.ReadAll = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const roles = await listRoles(prisma);
    const roleRecords: RoleRecord[] = roles.map(
      ({ id, ...role }: { id: string; [key: string]: unknown }) => ({
        _id: id,
        ...role,
      }),
    );
    return ApiResponse.Success(res, "Roles", 0, 200, roleRecords);
  } catch {
    return next(
      Object.assign(new Error("Roles could not be loaded"), { status: 500 }),
    );
  }
};
