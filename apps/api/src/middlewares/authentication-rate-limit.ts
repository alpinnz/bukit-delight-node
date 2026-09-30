import type { NextFunction, Request, Response } from "express";

const { rateLimit } = require("express-rate-limit");

const createRateLimit = (windowMs: number, limit: number) =>
  rateLimit({
    windowMs,
    limit,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (_request: Request, _response: Response, next: NextFunction) => {
      next(
        Object.assign(new Error("Too many authentication attempts"), {
          status: 429,
          code: "TOO_MANY_REQUESTS",
        }),
      );
    },
  });

exports.login = createRateLimit(15 * 60 * 1000, 10);
exports.recovery = createRateLimit(60 * 60 * 1000, 5);
exports.registration = createRateLimit(60 * 60 * 1000, 5);
exports.tokenVerification = createRateLimit(15 * 60 * 1000, 10);
