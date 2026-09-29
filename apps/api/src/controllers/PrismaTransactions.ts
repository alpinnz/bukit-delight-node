import type {
  NextFunction,
  Request,
  Response as ExpressResponse,
} from "express";
import type {
  CreateTransactionRequest,
  TransactionRecord,
  TransactionPaymentMethod,
  TransactionStatus,
  UpdateTransactionRequest,
  UpdateTransactionStatusRequest,
} from "@bukit-delight/shared";

const Joi = require("joi");
const { Response } = require("./../middlewares");
const { prisma } = require("./../config/Prisma");
const logger = require("./../utils/logger");
const { serializeOrder } = require("./PrismaOrders");
const {
  createTransaction,
  deleteTransaction,
  findTransactionById,
  listTransactions,
  updateTransaction,
  updateTransactionStatus,
} = require("./../services/PrismaTransactions");

type TransactionRequest = Request & {
  auth?: { userId?: string };
  app: Request["app"] & {
    io: { emit: (event: string, message: string) => void };
  };
};

const error = (message: string, status = 500) =>
  Object.assign(new Error(message), { status });

const requirePrisma = () => {
  if (!prisma) throw error("PostgreSQL transaction storage is not configured");
  return prisma;
};

const sendError = (cause: unknown, next: NextFunction) => {
  const status = (cause as { status?: number })?.status;
  if (status && status < 500) {
    return next(error(String((cause as Error).message), status));
  }
  const code = (cause as { code?: string })?.code;
  if (code === "P2025") {
    return next(error("Transaction or related record not found", 404));
  }
  if (code === "P2002") return next(error("order is already", 409));
  logger.error({ err: cause }, "Prisma transaction operation failed");
  return next(error("Transaction request failed"));
};

const emitTransactionsUpdate = (req: TransactionRequest) =>
  req.app.io.emit("TransactionsUpdate", "TransactionsUpdate");

const statusValue = (status: string) => status.toLowerCase();

const transactionOutput = (transaction: any): TransactionRecord => ({
  _id: transaction.id,
  id_account: transaction.user
    ? {
        _id: transaction.user.id,
        username: transaction.user.username,
        email: transaction.user.email,
        id_roles: transaction.user.roles.map(({ role }: any) => ({
          _id: role.id,
          name: role.name,
        })),
      }
    : transaction.userId,
  id_order: transaction.order
    ? serializeOrder(transaction.order, true)
    : transaction.orderId,
  note: transaction.note,
  status: statusValue(transaction.status),
  createdAt: transaction.createdAt,
  updatedAt: transaction.updatedAt,
});

const transactionRecord = (transaction: any) => ({
  _id: transaction.id,
  id_account: transaction.userId,
  id_order: transaction.orderId,
  note: transaction.note,
  status: statusValue(transaction.status),
  createdAt: transaction.createdAt,
  updatedAt: transaction.updatedAt,
});

const validate = (schema: unknown, req: Request, next: NextFunction) => {
  const { error: validationError, value } = (schema as any).validate(req.body);
  if (validationError) {
    next(error(validationError.details[0].message, 400));
    return null;
  }
  return value;
};

const statuses: readonly TransactionStatus[] = [
  "pending",
  "processing",
  "done",
];
const paymentMethods: readonly TransactionPaymentMethod[] = ["cash", "virtual"];
const serviceStatus = (status: TransactionStatus) => status.toUpperCase();

exports.ReadAll = async (
  _req: Request,
  res: ExpressResponse,
  next: NextFunction,
) => {
  try {
    const transactions = await listTransactions(requirePrisma());
    return Response.Success(
      res,
      "ReadAll",
      0,
      200,
      transactions.map((transaction: any) => transactionOutput(transaction)),
    );
  } catch (cause) {
    return sendError(cause, next);
  }
};

exports.ReadOne = async (
  req: Request,
  res: ExpressResponse,
  next: NextFunction,
) => {
  try {
    const transaction = await findTransactionById(
      requirePrisma(),
      req.params._id,
    );
    if (!transaction) return next(error("Transactions not found", 404));
    return Response.Success(
      res,
      "ReadOne",
      0,
      200,
      transactionOutput(transaction),
    );
  } catch (cause) {
    return sendError(cause, next);
  }
};

exports.Create = async (
  req: TransactionRequest,
  res: ExpressResponse,
  next: NextFunction,
) => {
  const body = validate(
    Joi.object({
      id_account: Joi.string(),
      id_order: Joi.string().required(),
      note: Joi.string(),
      payment: Joi.string()
        .valid(...paymentMethods)
        .required(),
    }),
    req,
    next,
  ) as CreateTransactionRequest | null;
  if (!body) return;
  const userId = req.auth?.userId;
  if (!userId) return next(error("Authentication required", 401));

  try {
    const transaction = await createTransaction(requirePrisma(), {
      userId,
      orderId: body.id_order,
      note: body.note,
      payment: body.payment.toUpperCase(),
    });
    if (!transaction) return next(error("Create failed"));
    emitTransactionsUpdate(req);
    return Response.Success(
      res,
      "Create",
      0,
      200,
      transactionRecord(transaction),
    );
  } catch (cause) {
    return sendError(cause, next);
  }
};

exports.Update = async (
  req: TransactionRequest,
  res: ExpressResponse,
  next: NextFunction,
) => {
  const body = validate(
    Joi.object({
      id_account: Joi.string().required(),
      id_order: Joi.string().required(),
      note: Joi.string().required(),
      status: Joi.string()
        .valid(...statuses)
        .required(),
    }),
    req,
    next,
  ) as UpdateTransactionRequest | null;
  if (!body) return;

  try {
    const transaction = await updateTransaction(
      requirePrisma(),
      req.params._id,
      {
        userId: body.id_account,
        orderId: body.id_order,
        note: body.note,
        status: serviceStatus(body.status),
      },
    );
    if (!transaction) return next(error("transactions not found", 404));
    emitTransactionsUpdate(req);
    return Response.Success(
      res,
      "Update",
      0,
      200,
      transactionRecord(transaction),
    );
  } catch (cause) {
    return sendError(cause, next);
  }
};

exports.UpdateStatus = async (
  req: TransactionRequest,
  res: ExpressResponse,
  next: NextFunction,
) => {
  const body = validate(
    Joi.object({
      status: Joi.string()
        .valid(...statuses)
        .required(),
    }),
    req,
    next,
  ) as UpdateTransactionStatusRequest | null;
  if (!body) return;

  try {
    const transaction = await updateTransactionStatus(
      requirePrisma(),
      req.params._id,
      serviceStatus(body.status),
    );
    if (!transaction) return next(error("transactions not found", 404));
    emitTransactionsUpdate(req);
    return Response.Success(
      res,
      "Update",
      0,
      200,
      transactionRecord(transaction),
    );
  } catch (cause) {
    return sendError(cause, next);
  }
};

exports.Delete = async (
  req: TransactionRequest,
  res: ExpressResponse,
  next: NextFunction,
) => {
  try {
    const transaction = await deleteTransaction(
      requirePrisma(),
      req.params._id,
    );
    emitTransactionsUpdate(req);
    return Response.Success(
      res,
      "Delete",
      0,
      200,
      transactionRecord(transaction),
    );
  } catch (cause) {
    return sendError(cause, next);
  }
};
