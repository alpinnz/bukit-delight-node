import type { PrismaClient } from "../generated/prisma/client";
import {
  lockOrdersForMutation,
  lockTransactionQueueForMutation,
} from "./PrismaOrderLocks";

type TransactionDatabase = Pick<
  PrismaClient,
  "user" | "transaction" | "order"
> &
  Pick<PrismaClient, "$queryRaw">;
type TransactionClient = TransactionDatabase;

type TransactionStatus = "PENDING" | "PROCESSING" | "DONE";
type PaymentType = "CASH" | "VIRTUAL";

type TransactionCreateInput = {
  userId: string;
  orderId: string;
  note?: string;
  payment: PaymentType;
  now?: Date;
};

type TransactionUpdateInput = {
  userId: string;
  orderId: string;
  note?: string;
  status: TransactionStatus;
};

const transactionRelations = {
  user: {
    select: {
      id: true,
      username: true,
      email: true,
      roles: { select: { role: { select: { id: true, name: true } } } },
    },
  },
  order: {
    include: {
      customer: { select: { id: true, username: true } },
      table: { select: { id: true, name: true } },
      items: {
        include: {
          menu: {
            include: {
              category: {
                select: { id: true, name: true, desc: true, image: true },
              },
            },
          },
        },
      },
    },
  },
} as const;

const fail = (message: string, status: number) =>
  Object.assign(new Error(message), { status });

const newId = () => require("node:crypto").randomBytes(12).toString("hex");

const requireCashier = async (
  database: TransactionDatabase,
  userId: string,
) => {
  const user = await database.user.findUnique({
    where: { id: userId },
    select: { id: true, roles: { select: { role: { select: { name: true } } } } },
  });
  if (!user) throw fail("user not found", 404);
  const canCreateTransaction = user.roles.some(({ role }) =>
    ["cashier", "owner"].includes(role.name),
  );
  if (!canCreateTransaction) throw fail("cashier or owner role required", 403);
};

const findOrder = async (database: TransactionDatabase, orderId: string) => {
  const order = await database.order.findUnique({
    where: { id: orderId },
    select: { id: true, duration: true },
  });
  if (!order) throw fail("order not found", 404);
  return order;
};

export const listTransactions = (database: TransactionDatabase) =>
  database.transaction.findMany({
    include: transactionRelations,
    orderBy: { createdAt: "desc" },
  });

export const findTransactionById = (
  database: TransactionDatabase,
  id: string,
) =>
  database.transaction.findUnique({
    where: { id },
    include: transactionRelations,
  });

export const createTransactionInTransaction = async (
  transaction: TransactionClient,
  input: TransactionCreateInput,
) => {
  await requireCashier(transaction, input.userId);
  await lockOrdersForMutation(transaction, [input.orderId]);
  await lockTransactionQueueForMutation(transaction);
  const order = await findOrder(transaction, input.orderId);
  const existingTransaction = await transaction.transaction.findUnique({
    where: { orderId: input.orderId },
    select: { id: true },
  });
  if (existingTransaction) throw fail("order is already", 409);

  const activeTransactions = await transaction.transaction.findMany({
    where: { status: { not: "DONE" } },
    select: { order: { select: { duration: true } } },
  });
  const activeDuration = activeTransactions.reduce(
    (total, item) => total + item.order.duration,
    0,
  );
  const now = input.now ?? new Date();
  const estimatedReadyAt = new Date(
    now.getTime() + Math.trunc((activeDuration + order.duration) * 60_000),
  );

  await transaction.order.update({
    where: { id: order.id },
    data: { status: input.payment, estimatedReadyAt },
  });
  return transaction.transaction.create({
    data: {
      id: newId(),
      userId: input.userId,
      orderId: order.id,
      note: input.note || "",
      status: "PENDING",
    },
  });
};

export const createTransaction = async (
  database: PrismaClient,
  input: TransactionCreateInput,
) => {
  const created = await database.$transaction((transaction) =>
    createTransactionInTransaction(transaction, input),
  );
  return findTransactionById(database, created.id);
};

export const updateTransactionInTransaction = async (
  transaction: TransactionClient,
  id: string,
  input: TransactionUpdateInput,
) => {
  const current = await transaction.transaction.findUnique({
    where: { id },
    select: { id: true, orderId: true },
  });
  if (!current) throw fail("transactions not found", 404);

  await lockOrdersForMutation(transaction, [current.orderId, input.orderId]);
  await lockTransactionQueueForMutation(transaction);
  const user = await transaction.user.findUnique({
    where: { id: input.userId },
    select: { id: true },
  });
  if (!user) throw fail("user not found", 404);
  await findOrder(transaction, input.orderId);

  const existingTransaction = await transaction.transaction.findUnique({
    where: { orderId: input.orderId },
    select: { id: true },
  });
  if (existingTransaction && existingTransaction.id !== id) {
    throw fail("order is already", 409);
  }
  return transaction.transaction.update({
    where: { id },
    data: {
      userId: input.userId,
      orderId: input.orderId,
      note: input.note || "",
      status: input.status,
    },
  });
};

export const updateTransaction = async (
  database: PrismaClient,
  id: string,
  input: TransactionUpdateInput,
) => {
  await database.$transaction((transaction) =>
    updateTransactionInTransaction(transaction, id, input),
  );
  return findTransactionById(database, id);
};

export const updateTransactionStatusInTransaction = async (
  transaction: TransactionClient,
  id: string,
  status: TransactionStatus,
) => {
  const current = await transaction.transaction.findUnique({
    where: { id },
    select: { id: true, orderId: true },
  });
  if (!current) throw fail("transactions not found", 404);
  await lockOrdersForMutation(transaction, [current.orderId]);
  await lockTransactionQueueForMutation(transaction);
  return transaction.transaction.update({ where: { id }, data: { status } });
};

export const updateTransactionStatus = async (
  database: PrismaClient,
  id: string,
  status: TransactionStatus,
) => {
  await database.$transaction((transaction) =>
    updateTransactionStatusInTransaction(transaction, id, status),
  );
  return findTransactionById(database, id);
};

export const deleteTransactionInTransaction = async (
  transaction: TransactionClient,
  id: string,
) => {
  const current = await transaction.transaction.findUnique({
    where: { id },
    select: { id: true, orderId: true },
  });
  if (!current) throw fail("Transactions not found", 404);
  await lockOrdersForMutation(transaction, [current.orderId]);
  await lockTransactionQueueForMutation(transaction);
  return transaction.transaction.delete({ where: { id } });
};

export const deleteTransaction = (database: PrismaClient, id: string) =>
  database.$transaction((transaction) =>
    deleteTransactionInTransaction(transaction, id),
  );
