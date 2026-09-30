import type {
  NextFunction,
  Request,
  Response as ExpressResponse,
} from "express";

const { response } = require("../middlewares");
const { prisma } = require("../config/prisma");
const logger = require("../utils/logger");
const { analyzeFavorites } = require("../services/favorite-analysis.service");
const {
  listFavoriteMenuTransactions,
} = require("../services/recommendation-transactions.service");

const error = (message: string, status = 500) =>
  Object.assign(new Error(message), { status });

exports.getFavoriteAnalysis = async (
  _req: Request,
  res: ExpressResponse,
  next: NextFunction,
) => {
  if (!prisma) {
    return next(error("PostgreSQL recommendation storage is not configured"));
  }
  try {
    const menus = await listFavoriteMenuTransactions(prisma);
    return response.success(
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
