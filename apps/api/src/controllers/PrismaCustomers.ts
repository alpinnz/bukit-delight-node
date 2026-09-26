import type {
  NextFunction,
  Request,
  Response as ExpressResponse,
} from "express";
import type {
  CreateCustomerResponse,
  CreateCustomerRequest,
  UpdateCustomerRequest,
} from "@bukit-delight/shared";

const { randomBytes } = require("node:crypto");
const Joi = require("joi");
const { Response } = require("./../middlewares");
const { prisma } = require("./../config/Prisma");
const logger = require("./../utils/logger");
const {
  createCustomer,
  deleteCustomer,
  findCustomerById,
  listCustomers,
  updateCustomer,
} = require("./../services/PrismaAuthentication");
const { JwtCustomerToken } = require("./../services/Authentication");

type CustomerRequest = Request & {
  auth?: { type?: string; customerId?: string };
  app: Request["app"] & {
    io: { emit: (event: string, message: string) => void };
  };
};

const error = (message: string, status = 500) =>
  Object.assign(new Error(message), { status });

const requirePrisma = () => {
  if (!prisma) throw error("PostgreSQL customer storage is not configured");
  return prisma;
};

const sendError = (cause: unknown, next: NextFunction) => {
  const status = (cause as { status?: number })?.status;
  if (status && status < 500) {
    return next(error(String((cause as Error).message), status));
  }
  logger.error({ err: cause }, "Prisma customer operation failed");
  return next(error("Customer request failed"));
};

const customerResponse = ({ id, ...customer }: Record<string, unknown>) => ({
  _id: id,
  ...customer,
});

const isForbiddenCustomer = (req: CustomerRequest, customerId: string) =>
  req.auth?.type === "customer" && req.auth.customerId !== customerId;

const emitCustomersUpdate = (req: CustomerRequest) =>
  req.app.io.emit("CustomersUpdate", "CustomersUpdate");

exports.ReadAll = async (
  req: CustomerRequest,
  res: ExpressResponse,
  next: NextFunction,
) => {
  try {
    const customers = await listCustomers(
      requirePrisma(),
      req.auth?.type === "customer" ? req.auth.customerId : undefined,
    );
    return Response.Success(
      res,
      "Customers",
      0,
      200,
      customers.map(customerResponse),
    );
  } catch (cause) {
    return sendError(cause, next);
  }
};

exports.ReadOne = async (
  req: CustomerRequest,
  res: ExpressResponse,
  next: NextFunction,
) => {
  if (isForbiddenCustomer(req, req.params._id)) {
    return next(error("Forbidden", 403));
  }
  try {
    const customer = await findCustomerById(requirePrisma(), req.params._id);
    if (!customer) return next(error("Customer not found", 404));
    return Response.Success(
      res,
      "Customer",
      0,
      200,
      customerResponse(customer),
    );
  } catch (cause) {
    return sendError(cause, next);
  }
};

exports.Create = async (
  req: CustomerRequest,
  res: ExpressResponse,
  next: NextFunction,
) => {
  const { error: validationError, value } = Joi.object({
    username: Joi.string().required(),
  }).validate(req.body);
  if (validationError) {
    return next(error(validationError.details[0].message, 400));
  }
  const request = value as CreateCustomerRequest;

  try {
    const customer = await createCustomer(requirePrisma(), {
      id: randomBytes(12).toString("hex"),
      username: request.username,
    });
    const accessToken = await JwtCustomerToken(customer);
    emitCustomersUpdate(req);
    const customerResponse: CreateCustomerResponse = {
      _id: customer.id,
      username: customer.username,
      accessToken,
    };
    return Response.Success(res, "Register", 0, 200, customerResponse);
  } catch (cause) {
    return sendError(cause, next);
  }
};

exports.Update = async (
  req: CustomerRequest,
  res: ExpressResponse,
  next: NextFunction,
) => {
  if (isForbiddenCustomer(req, req.params._id)) {
    return next(error("Forbidden", 403));
  }
  const { error: validationError, value } = Joi.object({
    username: Joi.string().required(),
  }).validate(req.body);
  if (validationError) {
    return next(error(validationError.details[0].message, 400));
  }
  const request = value as UpdateCustomerRequest;

  try {
    const database = requirePrisma();
    if (!(await findCustomerById(database, req.params._id))) {
      return next(error("Customer not found", 404));
    }
    const customer = await updateCustomer(
      database,
      req.params._id,
      request.username,
    );
    emitCustomersUpdate(req);
    return Response.Success(res, "Update", 0, 200, customerResponse(customer));
  } catch (cause) {
    if ((cause as { code?: string })?.code === "P2025") {
      return next(error("Customer not found", 404));
    }
    return sendError(cause, next);
  }
};

exports.Delete = async (
  req: CustomerRequest,
  res: ExpressResponse,
  next: NextFunction,
) => {
  if (isForbiddenCustomer(req, req.params._id)) {
    return next(error("Forbidden", 403));
  }
  try {
    const customer = await deleteCustomer(requirePrisma(), req.params._id);
    emitCustomersUpdate(req);
    return Response.Success(res, "Delete", 0, 200, customer);
  } catch (cause) {
    if ((cause as { code?: string })?.code === "P2003") {
      return next(
        error("Customer is still referenced by related records", 409),
      );
    }
    if ((cause as { code?: string })?.code === "P2025") {
      return next(error("Customer not found", 404));
    }
    return sendError(cause, next);
  }
};
