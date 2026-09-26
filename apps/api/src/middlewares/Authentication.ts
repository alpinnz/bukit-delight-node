import type { NextFunction, Request, Response } from "express";

const jwt = require("jsonwebtoken");
const { prisma } = require("./../config/Prisma");
const {
  findAccountForToken,
  findCustomerForToken,
} = require("./../services/PrismaAuthentication");

type DecodedToken = { id: string; type: "staff" | "customer" };
type AuthContext =
  | {
      type: "staff";
      accountId: string;
      role: string;
      account: any;
    }
  | {
      type: "customer";
      customerId: string;
      customer: any;
    };
type AuthenticatedRequest = Request & {
  decoded?: DecodedToken;
  auth?: AuthContext;
};

const createError = (message: unknown, status = 500) =>
  Object.assign(new Error(String(message)), { status });

const findStaffAccount = (accountId: string) => {
  if (!prisma) throw new Error("PostgreSQL authentication is not configured");
  return findAccountForToken(prisma, accountId);
};

const findCustomer = (customerId: string) => {
  if (!prisma) throw new Error("PostgreSQL customer storage is not configured");
  return findCustomerForToken(prisma, customerId);
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

const checkAccessToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  const accessToken = req.get("x-access-token");
  if (!accessToken) {
    return next(createError("Authentication required", 401));
  }

  try {
    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_KEY, {
      algorithms: ["HS256"],
    }) as DecodedToken;

    if (decoded.type !== "staff") {
      return next(createError("Staff authentication required", 403));
    }

    const account = await findStaffAccount(decoded.id);
    if (!account?.role) {
      return next(createError("Unauthorized access", 401));
    }

    req.decoded = decoded;
    req.auth = {
      type: "staff",
      accountId: account.id,
      role: account.role.name,
      account,
    };
    return next();
  } catch (error) {
    return next(createError("Unauthorized access", 401));
  }
};

const requireRoles = (...allowedRoles: string[]) => {
  const roles = allowedRoles.map((role) => role.toLowerCase());

  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const role =
      req.auth?.type === "staff" ? req.auth.role.toLowerCase() : undefined;
    if (!role || !roles.includes(role)) {
      return next(createError("Forbidden", 403));
    }
    return next();
  };
};

const checkCustomerOrStaffToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  const accessToken = req.get("x-access-token");
  if (!accessToken) {
    return next(createError("Authentication required", 401));
  }

  try {
    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_KEY, {
      algorithms: ["HS256"],
    }) as DecodedToken;

    if (decoded.type === "customer") {
      const customer = await findCustomer(decoded.id);
      if (!customer) return next(createError("Unauthorized access", 401));
      req.auth = {
        type: "customer",
        customerId: customer.id,
        customer,
      };
      return next();
    }

    if (decoded.type !== "staff") {
      return next(
        createError("Staff or customer authentication required", 403),
      );
    }

    const account = await findStaffAccount(decoded.id);
    if (!account?.role) {
      return next(createError("Unauthorized access", 401));
    }
    req.decoded = decoded;
    req.auth = {
      type: "staff",
      accountId: account.id,
      role: account.role.name,
      account,
    };
    return next();
  } catch (error) {
    return next(createError("Unauthorized access", 401));
  }
};

const checkCustomerToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  const accessToken = req.get("x-access-token");
  if (!accessToken) {
    return next(createError("Customer authentication required", 401));
  }

  try {
    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_KEY, {
      algorithms: ["HS256"],
    }) as DecodedToken;
    if (decoded.type !== "customer") {
      return next(createError("Customer authentication required", 403));
    }

    const customer = await findCustomer(decoded.id);
    if (!customer) {
      return next(createError("Unauthorized access", 401));
    }

    req.auth = {
      type: "customer",
      customerId: customer.id,
      customer,
    };
    return next();
  } catch (error) {
    return next(createError("Unauthorized access", 401));
  }
};

exports.createError = createError;
exports.checkApiKey = checkApiKey;
exports.checkAccessToken = checkAccessToken;
exports.checkCustomerToken = checkCustomerToken;
exports.checkCustomerOrStaffToken = checkCustomerOrStaffToken;
exports.requireRoles = requireRoles;
