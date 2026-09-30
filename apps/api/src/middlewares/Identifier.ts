import type { NextFunction, Request, Response } from "express";

const createError = (message: string, status = 400) =>
  Object.assign(new Error(message), { status });

exports.checkIdentifier = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const identifier = req.params.id;
  if (typeof identifier !== "string") {
    return next(createError("Id Error", 400));
  }
  const isMongoObjectId = /^[a-f\d]{24}$/i.test(identifier);
  const isPrismaCuid = /^c[a-z\d]{24}$/i.test(identifier);

  if (isMongoObjectId || isPrismaCuid) return next();
  return next(createError("Id Error", 400));
};
