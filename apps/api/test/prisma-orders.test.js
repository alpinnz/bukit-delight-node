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
} = require("../src/services/orders.service");

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
    const userId = `phase4-order-${suffix}-user`;
    const category_id = `phase4-order-${suffix}-category`;
    const menu_id = `phase4-order-${suffix}-menu`;
    const table_id = `phase4-order-${suffix}-table`;
    const transactionId = `phase4-order-${suffix}-transaction`;
    const rollback = new Error("rollback order fixtures");

    try {
      await assert.rejects(
        prisma.$transaction(async (transaction) => {
          const customerRole = await transaction.role.findUnique({
            where: { name: "customer" },
          });
          assert.ok(customerRole, "local database must contain customer role");
          await transaction.user.create({
            data: {
              id: userId,
              username: `phase4-order-${suffix}`,
              email: `phase4-order-${suffix}@example.invalid`,
              password: "fixture-only",
            },
          });
          await transaction.userRole.create({
            data: { user_id: userId, role_id: customerRole.id },
          });
          await transaction.category.create({
            data: {
              id: category_id,
              name: `phase4-order-category-${suffix}`,
              desc: "fixture category",
            },
          });
          await transaction.menu.create({
            data: {
              id: menu_id,
              name: `phase4-order-menu-${suffix}`,
              desc: "fixture menu",
              image: "fixture.png",
              category_id,
              price: 10.5,
              promo: 1.5,
              duration: 2,
              is_available: true,
              is_favorite: false,
            },
          });
          await transaction.diningTable.create({
            data: { id: table_id, name: `phase4-order-table-${suffix}` },
          });

          const input = {
            customer_id: userId,
            table_id,
            note: "first note",
            menus: [{ id: menu_id, quality: "2", note: "no ice" }],
            expiresAt: new Date(Date.now() + 60_000),
          };
          const createdOrder = await createOrderInTransaction(
            transaction,
            input,
          );
          assert.equal(createdOrder.quality, 2);
          assert.equal(createdOrder.price, 21);
          assert.equal(createdOrder.promo, 3);
          assert.equal(createdOrder.total_price, 18);
          const createdItems = await transaction.orderItem.findMany({
            where: { order_id: createdOrder.id },
          });
          assert.equal(createdItems.length, 1);
          assert.equal(createdItems[0].quality, 2);
          assert.equal(createdItems[0].menu_id, menu_id);

          const updatedOrder = await updateOrderInTransaction(
            transaction,
            createdOrder.id,
            {
              ...input,
              note: "updated note",
              menus: [{ id: menu_id, quality: 1 }],
            },
          );
          assert.equal(updatedOrder.quality, 1);
          assert.equal(updatedOrder.price, 10.5);
          assert.equal(updatedOrder.total_price, 9);
          assert.equal(updatedOrder.note, "updated note");
          const updatedItems = await transaction.orderItem.findMany({
            where: { order_id: createdOrder.id },
          });
          assert.equal(updatedItems.length, 1);
          assert.equal(updatedItems[0].quality, 1);
          assert.equal(
            (
              await transaction.order.findUnique({
                where: { id: createdOrder.id },
                select: { customer_id: true },
              })
            ).customer_id,
            userId,
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
              userId,
              order_id: createdOrder.id,
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
            where: { order_id: createdOrder.id },
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
        (await prisma.order.findMany({ where: { customer_id: userId } })).length,
        0,
      );
      assert.equal(await prisma.orderItem.count({ where: { menu_id } }), 0);
      assert.equal(
        await prisma.menu.findUnique({ where: { id: menu_id } }),
        null,
      );
      assert.equal(await prisma.user.findUnique({ where: { id: userId } }), null);
      assert.equal(
        await prisma.category.findUnique({ where: { id: category_id } }),
        null,
      );
      assert.equal(
        await prisma.diningTable.findUnique({ where: { id: table_id } }),
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
