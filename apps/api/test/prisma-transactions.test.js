const { randomUUID } = require("node:crypto");
const { it } = require("node:test");
const assert = require("node:assert/strict");
const { PrismaPg } = require("@prisma/adapter-pg");
const { PrismaClient } = require("../src/generated/prisma/client");
const {
  createTransactionInTransaction,
  deleteTransactionInTransaction,
  updateTransactionInTransaction,
  updateTransactionStatusInTransaction,
} = require("../src/services/transactions.service");

const databaseUrl = process.env.PRISMA_TEST_DATABASE_URL;
const parsedDatabaseUrl = databaseUrl ? new URL(databaseUrl) : null;
const isLocalTestDatabase =
  parsedDatabaseUrl &&
  ["localhost", "127.0.0.1", "::1"].includes(parsedDatabaseUrl.hostname) &&
  parsedDatabaseUrl.pathname === "/bukit_delight";

const prismaTest = isLocalTestDatabase ? it : it.skip;

prismaTest("creates and updates payment transactions atomically", async () => {
  const prisma = new PrismaClient({
    adapter: new PrismaPg({ connectionString: databaseUrl }),
  });
  const suffix = randomUUID();
  const userId = `phase4-payment-${suffix}-user`;
  const table_id = `phase4-payment-${suffix}-table`;
  const oldOrderId = `phase4-payment-${suffix}-old-order`;
  const paidOrderId = `phase4-payment-${suffix}-paid-order`;
  const laterOrderId = `phase4-payment-${suffix}-later-order`;
  const oldTransactionId = `phase4-payment-${suffix}-old-transaction`;
  const rollback = new Error("rollback transaction fixtures");
  const now = new Date("2026-01-02T03:04:05.000Z");

  const createFixtureOrder = async (transaction, id, duration, status) =>
    transaction.order.create({
      data: {
        id,
        customer_id: userId,
        table_id,
        quality: 1,
        duration,
        promo: 0,
        price: 10,
        total_price: 10,
        status,
        estimated_ready_at: now,
        expires_at: new Date(now.getTime() + 60_000),
      },
    });

  try {
    await assert.rejects(
      prisma.$transaction(async (transaction) => {
        const cashierRole = await transaction.role.findUnique({
          where: { name: "cashier" },
        });
        assert.ok(cashierRole, "local database must contain the cashier role");
        await transaction.user.create({
          data: {
            id: userId,
            username: `phase4-payment-${suffix}`,
            email: `phase4-payment-${suffix}@example.invalid`,
            password: "fixture-only",
          },
        });
        await transaction.userRole.create({
          data: { user_id: userId, role_id: cashierRole.id },
        });
        await transaction.diningTable.create({
          data: { id: table_id, name: `phase4-payment-${suffix}` },
        });
        await createFixtureOrder(transaction, oldOrderId, 6, "CASH");
        await createFixtureOrder(transaction, paidOrderId, 4, "PENDING");
        await createFixtureOrder(transaction, laterOrderId, 2, "PENDING");
        await transaction.transaction.create({
          data: {
            id: oldTransactionId,
            userId,
            order_id: oldOrderId,
            status: "PROCESSING",
          },
        });

        const created = await createTransactionInTransaction(transaction, {
          userId,
          order_id: paidOrderId,
          payment: "VIRTUAL",
          note: "card payment",
          now,
        });
        assert.equal(created.status, "PENDING");
        assert.equal(created.user_id, userId);
        assert.equal(created.order_id, paidOrderId);
        const paidOrder = await transaction.order.findUnique({
          where: { id: paidOrderId },
        });
        assert.equal(paidOrder.status, "VIRTUAL");
        assert.equal(
          paidOrder.estimated_ready_at.getTime(),
          now.getTime() + 10 * 60_000,
        );

        await assert.rejects(
          createTransactionInTransaction(transaction, {
            userId,
            order_id: paidOrderId,
            payment: "CASH",
            now,
          }),
          { status: 409 },
        );

        await updateTransactionStatusInTransaction(
          transaction,
          created.id,
          "DONE",
        );
        const laterTransaction = await createTransactionInTransaction(
          transaction,
          { userId, order_id: laterOrderId, payment: "CASH", now },
        );
        const laterOrder = await transaction.order.findUnique({
          where: { id: laterOrderId },
        });
        assert.equal(
          laterOrder.estimated_ready_at.getTime(),
          now.getTime() + 8 * 60_000,
        );

        const updated = await updateTransactionInTransaction(
          transaction,
          laterTransaction.id,
          {
            userId,
            order_id: laterOrderId,
            note: "cash at counter",
            status: "PROCESSING",
          },
        );
        assert.equal(updated.note, "cash at counter");
        assert.equal(updated.status, "PROCESSING");
        const deleted = await deleteTransactionInTransaction(
          transaction,
          laterTransaction.id,
        );
        assert.equal(deleted.id, laterTransaction.id);
        assert.equal(
          await transaction.transaction.findUnique({
            where: { id: laterTransaction.id },
          }),
          null,
        );
        throw rollback;
      }),
      (error) => error === rollback,
    );

    assert.equal(
      await prisma.user.findUnique({ where: { id: userId } }),
      null,
    );
    assert.equal(
      await prisma.order.findUnique({ where: { id: paidOrderId } }),
      null,
    );
    assert.equal(
      await prisma.transaction.findUnique({ where: { id: oldTransactionId } }),
      null,
    );
  } finally {
    await prisma.$disconnect();
  }
});
