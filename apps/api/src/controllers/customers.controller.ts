import type {
  NextFunction,
  Request,
  Response as ExpressResponse,
} from "express";
import type {
  UpdateCustomerRequest,
} from "@bukit-delight/shared";

const Joi = require("joi");
const { response } = require("../middlewares");
const { prisma } = require("../config/prisma");
const logger = require("../utils/logger");
const {
  removeCustomerRole,
  findCustomerUserById,
  listCustomers,
  updateCustomerUser,
} = require("../services/authentication.service");

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
  id,
  ...customer,
});

type CustomerRequest = Request;

const customerIdFromRequest = (req: CustomerRequest) => {
  const customerId = req.params.id;
  return typeof customerId === "string" ? customerId : null;
};

exports.readAll = async (
  req: CustomerRequest,
  res: ExpressResponse,
  next: NextFunction,
) => {
  try {
    const customers = await listCustomers(requirePrisma());
    return response.success(
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

exports.readOne = async (
  req: CustomerRequest,
  res: ExpressResponse,
  next: NextFunction,
) => {
  const customerId = customerIdFromRequest(req);
  if (!customerId) return next(error("Invalid customer identifier", 400));
  try {
    const customer = await findCustomerUserById(requirePrisma(), customerId);
    if (!customer) return next(error("Customer not found", 404));
    return response.success(
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

exports.update = async (
  req: CustomerRequest,
  res: ExpressResponse,
  next: NextFunction,
) => {
  const customerId = customerIdFromRequest(req);
  if (!customerId) return next(error("Invalid customer identifier", 400));
  const { error: validationError, value } = Joi.object({
    username: Joi.string().required(),
  }).validate(req.body);
  if (validationError) {
    return next(error(validationError.details[0].message, 400));
  }
  const request = value as UpdateCustomerRequest;

  try {
    const database = requirePrisma();
    if (!(await findCustomerUserById(database, customerId))) {
      return next(error("Customer not found", 404));
    }
    const customer = await updateCustomerUser(
      database,
      customerId,
      request.username,
    );
    return response.success(res, "Update", 0, 200, customerResponse(customer));
  } catch (cause) {
    if ((cause as { code?: string })?.code === "P2025") {
      return next(error("Customer not found", 404));
    }
    return sendError(cause, next);
  }
};

exports.delete = async (
  req: CustomerRequest,
  res: ExpressResponse,
  next: NextFunction,
) => {
  const customerId = customerIdFromRequest(req);
  if (!customerId) return next(error("Invalid customer identifier", 400));
  try {
    const customer = await removeCustomerRole(requirePrisma(), customerId);
    return response.success(
      res,
      "Delete",
      0,
      200,
      customerResponse(customer),
    );
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
