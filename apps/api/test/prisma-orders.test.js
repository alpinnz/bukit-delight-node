const { randomUUID } = require("node:crypto");
const { it } = require("node:test");
const assert = require("node:assert/strict");
const { PrismaPg } = require("@prisma/adapter-pg");
const { PrismaClient } = require("../src/generated/prisma/client");
const {
  createOrderInTransaction,
  deleteOrderInTransaction,
  updateOrderInTransaction,
  updateOrderStatusInTransaction,
} = require("../src/services/PrismaOrders");

const databaseUrl = process.env.PRISMA_TEST_DATABASE_URL;
const parsedDatabaseUrl = databaseUrl ? new URL(databaseUrl) : null;
const isLocalTestDatabase =
  parsedDatabaseUrl &&
  ["localhost", "127.0.0.1", "::1"].includes(parsedDatabaseUrl.hostname) &&
  parsedDatabaseUrl.pathname === "/bukit_delight";

const prismaTest = isLocalTestDatabase ? it : it.skip;

prismaTest(
  "creates and updates orders atomically with their items",
  async () => {
    const prisma = new PrismaClient({
      adapter: new PrismaPg({ connectionString: databaseUrl }),
    });
    const suffix = randomUUID();
    const roleId = `phase4-order-${suffix}-role`;
    const accountId = `phase4-order-${suffix}-account`;
    const customerId = `phase4-order-${suffix}-customer`;
    const categoryId = `phase4-order-${suffix}-category`;
    const menuId = `phase4-order-${suffix}-menu`;
    const tableId = `phase4-order-${suffix}-table`;
    const transactionId = `phase4-order-${suffix}-transaction`;
    const rollback = new Error("rollback order fixtures");

    try {
      await assert.rejects(
        prisma.$transaction(async (transaction) => {
          await transaction.role.create({
            data: { id: roleId, name: `phase4-order-role-${suffix}` },
          });
          await transaction.account.create({
            data: {
              id: accountId,
              username: `phase4-order-${suffix}`,
              email: `phase4-order-${suffix}@example.invalid`,
              password: "fixture-only",
              roleId,
            },
          });
          await transaction.customer.create({
            data: { id: customerId, username: `phase4-customer-${suffix}` },
          });
          await transaction.category.create({
            data: {
              id: categoryId,
              name: `phase4-order-category-${suffix}`,
              desc: "fixture category",
            },
          });
          await transaction.menu.create({
            data: {
              id: menuId,
              name: `phase4-order-menu-${suffix}`,
              desc: "fixture menu",
              image: "fixture.png",
              categoryId,
              price: 10.5,
              promo: 1.5,
              duration: 2,
              isAvailable: true,
              isFavorite: false,
            },
          });
          await transaction.diningTable.create({
            data: { id: tableId, name: `phase4-order-table-${suffix}` },
          });

          const input = {
            customerId,
            tableId,
            note: "first note",
            menus: [{ id: menuId, quality: "2", note: "no ice" }],
            expiresAt: new Date(Date.now() + 60_000),
          };
          const createdOrder = await createOrderInTransaction(
            transaction,
            input,
          );
          assert.equal(createdOrder.quality, 2);
          assert.equal(createdOrder.price, 21);
          assert.equal(createdOrder.promo, 3);
          assert.equal(createdOrder.totalPrice, 18);
          const createdItems = await transaction.orderItem.findMany({
            where: { orderId: createdOrder.id },
          });
          assert.equal(createdItems.length, 1);
          assert.equal(createdItems[0].quality, 2);
          assert.equal(createdItems[0].menuId, menuId);

          const updatedOrder = await updateOrderInTransaction(
            transaction,
            createdOrder.id,
            {
              ...input,
              note: "updated note",
              menus: [{ id: menuId, quality: 1 }],
            },
          );
          assert.equal(updatedOrder.quality, 1);
          assert.equal(updatedOrder.price, 10.5);
          assert.equal(updatedOrder.totalPrice, 9);
          assert.equal(updatedOrder.note, "updated note");
          const updatedItems = await transaction.orderItem.findMany({
            where: { orderId: createdOrder.id },
          });
          assert.equal(updatedItems.length, 1);
          assert.equal(updatedItems[0].quality, 1);
          assert.equal(
            (
              await transaction.order.findUnique({
                where: { id: createdOrder.id },
                select: { customerId: true },
              })
            ).customerId,
            customerId,
          );
          const paidOrder = await updateOrderStatusInTransaction(
            transaction,
            createdOrder.id,
            "CASH",
          );
          assert.equal(paidOrder.status, "CASH");

          await transaction.transaction.create({
            data: {
              id: transactionId,
              accountId,
              orderId: createdOrder.id,
              status: "PENDING",
            },
          });
          await assert.rejects(
            updateOrderStatusInTransaction(
              transaction,
              createdOrder.id,
              "PENDING",
            ),
            { status: 409 },
          );
          await assert.rejects(
            deleteOrderInTransaction(transaction, createdOrder.id),
            { status: 409 },
          );
          await transaction.transaction.delete({
            where: { orderId: createdOrder.id },
          });
          const deletedOrder = await deleteOrderInTransaction(
            transaction,
            createdOrder.id,
          );
          assert.equal(deletedOrder.id, createdOrder.id);
          assert.equal(
            await transaction.order.findUnique({
              where: { id: createdOrder.id },
            }),
            null,
          );
          throw rollback;
        }),
        (error) => error === rollback,
      );

      assert.equal(
        (await prisma.order.findMany({ where: { customerId } })).length,
        0,
      );
      assert.equal(await prisma.orderItem.count({ where: { menuId } }), 0);
      assert.equal(
        await prisma.menu.findUnique({ where: { id: menuId } }),
        null,
      );
      assert.equal(
        await prisma.role.findUnique({ where: { id: roleId } }),
        null,
      );
      assert.equal(
        await prisma.account.findUnique({ where: { id: accountId } }),
        null,
      );
      assert.equal(
        await prisma.customer.findUnique({ where: { id: customerId } }),
        null,
      );
      assert.equal(
        await prisma.category.findUnique({ where: { id: categoryId } }),
        null,
      );
      assert.equal(
        await prisma.diningTable.findUnique({ where: { id: tableId } }),
        null,
      );
      assert.equal(
        await prisma.transaction.findUnique({ where: { id: transactionId } }),
        null,
      );
    } finally {
      await prisma.$disconnect();
    }
  },
);
