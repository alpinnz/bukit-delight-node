import type { NextFunction, Request, Response } from "express";

const jwt = require("jsonwebtoken");
const { prisma } = require("./../config/Prisma");
const { findUserForToken } = require("./../services/PrismaAuthentication");

type DecodedToken = { id: string };
type AuthContext = {
  userId: string;
  roles: string[];
};
type AuthenticatedRequest = Request & {
  decoded?: DecodedToken;
  auth?: AuthContext;
};

const createError = (message: unknown, status = 500) =>
  Object.assign(new Error(String(message)), { status });

const findUser = (userId: string) => {
  if (!prisma) throw new Error("PostgreSQL authentication is not configured");
  return findUserForToken(prisma, userId);
};

const normalizedRoles = (user: any): string[] =>
  (user?.roles ?? []).map(({ role }: { role: { name: string } }) =>
    role.name.toLowerCase(),
  );

const hasStaffRole = (roles: string[]) =>
  roles.some((role) => ["owner", "cashier"].includes(role));

const attachUser = (req: AuthenticatedRequest, user: any) => {
  const roles = normalizedRoles(user);
  req.auth = {
    userId: user.id,
    roles,
  };
};

const checkApiKey = (req: Request, res: Response, next: NextFunction) => {
  if (req.get("x-api-key") !== process.env.API_KEY) {
    return next(createError("No api provided.", 403));
  }

  if (req.get("x-app-key") !== process.env.APP_KEY) {
    return next(createError("No app provided.", 403));
  }

  return next();
};

const authenticateUser = async (
  req: AuthenticatedRequest,
  next: NextFunction,
  expected: "any" | "staff" | "customer",
) => {
  const accessToken = req.get("x-access-token");
  if (!accessToken) return next(createError("Authentication required", 401));

  try {
    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_KEY, {
      algorithms: ["HS256"],
    }) as DecodedToken;
    if (!decoded?.id) return next(createError("Unauthorized access", 401));

    const user = await findUser(decoded.id);
    const roles = normalizedRoles(user);
    if (!user || roles.length === 0) {
      return next(createError("Unauthorized access", 401));
    }
    if (expected === "staff" && !hasStaffRole(roles)) {
      return next(createError("Staff authentication required", 403));
    }
    if (expected === "customer" && !roles.includes("customer")) {
      return next(createError("Customer authentication required", 403));
    }

    req.decoded = decoded;
    attachUser(req, user);
    return next();
  } catch {
    return next(createError("Unauthorized access", 401));
  }
};

const checkAccessToken = (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction,
) => authenticateUser(req, next, "staff");

const checkCustomerToken = (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction,
) => authenticateUser(req, next, "customer");

const checkCustomerOrStaffToken = (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction,
) => authenticateUser(req, next, "any");

const requireRoles = (...allowedRoles: string[]) => {
  const roles = allowedRoles.map((role) => role.toLowerCase());

  return (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
    if (!req.auth?.roles.some((role) => roles.includes(role))) {
      return next(createError("Forbidden", 403));
    }
    return next();
  };
};

exports.createError = createError;
exports.checkApiKey = checkApiKey;
exports.checkAccessToken = checkAccessToken;
exports.checkCustomerToken = checkCustomerToken;
exports.checkCustomerOrStaffToken = checkCustomerOrStaffToken;
exports.requireRoles = requireRoles;
