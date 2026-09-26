import type {
  NextFunction,
  Request,
  Response as ExpressResponse,
} from "express";

const { Response } = require("./../middlewares");
const { prisma } = require("./../config/Prisma");
const logger = require("./../utils/logger");
const { analyzeFavorites } = require("./Machine");
const {
  transactionByItemOrder,
} = require("./../services/PrismaMachineTransactions");

const error = (message: string, status = 500) =>
  Object.assign(new Error(message), { status });

exports.Favorite = async (
  _req: Request,
  res: ExpressResponse,
  next: NextFunction,
) => {
  if (!prisma) {
    return next(error("PostgreSQL machine storage is not configured"));
  }
  try {
    const menus = await transactionByItemOrder(prisma);
    return Response.Success(
      res,
      "Menu Favorite",
      0,
      200,
      analyzeFavorites(menus),
    );
  } catch (cause) {
    const status = (cause as { status?: number })?.status;
    if (status && status < 500) {
      return next(error(String((cause as Error).message), status));
    }
    logger.error({ err: cause }, "Prisma favorite analysis failed");
    return next(error("Favorite analysis failed"));
  }
};
