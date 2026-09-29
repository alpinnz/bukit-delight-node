const { randomUUID } = require("node:crypto");
const { it } = require("node:test");
const assert = require("node:assert/strict");
const { PrismaPg } = require("@prisma/adapter-pg");
const { PrismaClient } = require("../src/generated/prisma/client");
const {
  createCategoryInTransaction,
  createMenuInTransaction,
  createTableInTransaction,
  deleteCategoryInTransaction,
  deleteMenuInTransaction,
  deleteTableInTransaction,
  findCategoryById,
  findMenuById,
  findTableById,
  listCategories,
  listMenus,
  listTables,
  updateCategoryInTransaction,
  updateMenuAvailability,
  updateMenuInTransaction,
  updateTableInTransaction,
} = require("../src/services/PrismaCatalog");

const databaseUrl = process.env.PRISMA_TEST_DATABASE_URL;
const parsedDatabaseUrl = databaseUrl ? new URL(databaseUrl) : null;
const isLocalTestDatabase =
  parsedDatabaseUrl &&
  ["localhost", "127.0.0.1", "::1"].includes(parsedDatabaseUrl.hostname) &&
  parsedDatabaseUrl.pathname === "/bukit_delight";

const prismaTest = isLocalTestDatabase ? it : it.skip;

prismaTest(
  "persists catalog records and protects referenced rows",
  async () => {
    const prisma = new PrismaClient({
      adapter: new PrismaPg({ connectionString: databaseUrl }),
    });
    const suffix = randomUUID();
    const categoryId = `phase4-catalog-${suffix}-category`;
    const menuId = `phase4-catalog-${suffix}-menu`;
    const tableId = `phase4-catalog-${suffix}-table`;
    const customerId = `phase4-catalog-${suffix}-customer`;
    const orderId = `phase4-catalog-${suffix}-order`;
    const itemId = `phase4-catalog-${suffix}-item`;
    const rollback = new Error("rollback catalog fixtures");

    try {
      await assert.rejects(
        prisma.$transaction(async (transaction) => {
          const category = await createCategoryInTransaction(transaction, {
            id: categoryId,
            name: `phase4-catalog-${suffix}`,
            desc: "fixture category",
            image: "category.png",
          });
          assert.equal(category.name, `phase4-catalog-${suffix}`.toUpperCase());
          assert.ok(
            (await listCategories(transaction)).some(
              ({ id }) => id === categoryId,
            ),
          );
          assert.equal(
            (await findCategoryById(transaction, categoryId)).id,
            categoryId,
          );
          await assert.rejects(
            createCategoryInTransaction(transaction, {
              id: `${categoryId}-duplicate`,
              name: `phase4-CATALOG-${suffix}`,
              desc: "duplicate",
            }),
            { status: 409 },
          );
          const updatedCategory = await updateCategoryInTransaction(
            transaction,
            categoryId,
            {
              name: `phase4-catalog-${suffix}`,
              desc: "updated category",
              image: "updated.png",
            },
          );
          assert.equal(updatedCategory.desc, "updated category");

          const menu = await createMenuInTransaction(transaction, {
            id: menuId,
            name: `Phase4 Menu ${suffix}`,
            desc: "fixture menu",
            image: "menu.png",
            categoryId,
            price: 12,
            promo: 2,
            duration: 3,
            isAvailable: true,
            isFavorite: false,
          });
          assert.equal(menu.category.id, categoryId);
          assert.equal((await findMenuById(transaction, menuId)).id, menuId);
          assert.ok(
            (await listMenus(transaction)).some(({ id }) => id === menuId),
          );
          await assert.rejects(
            createMenuInTransaction(transaction, {
              id: `${menuId}-duplicate`,
              name: `phase4 menu ${suffix}`,
              image: "duplicate.png",
              categoryId,
              price: 1,
              promo: 0,
              duration: 1,
              isAvailable: true,
              isFavorite: false,
            }),
            { status: 409 },
          );
          const updatedMenu = await updateMenuInTransaction(
            transaction,
            menuId,
            {
              name: `Phase4 Menu ${suffix}`,
              desc: "updated menu",
              image: "menu.png",
              categoryId,
              price: 13,
              promo: 1,
              duration: 4,
              isAvailable: true,
              isFavorite: true,
            },
          );
          assert.equal(updatedMenu.price, 13);
          assert.equal(
            (await updateMenuAvailability(transaction, menuId, false))
              .isAvailable,
            false,
          );

          const table = await createTableInTransaction(
            transaction,
            tableId,
            `Phase4 Table ${suffix}`,
          );
          assert.equal(table.name, `phase4 table ${suffix}`);
          assert.equal((await findTableById(transaction, tableId)).id, tableId);
          assert.ok(
            (await listTables(transaction)).some(({ id }) => id === tableId),
          );
          await assert.rejects(
            createTableInTransaction(
              transaction,
              `${tableId}-duplicate`,
              `PHASE4 TABLE ${suffix}`,
            ),
            { status: 409 },
          );
          assert.equal(
            (
              await updateTableInTransaction(
                transaction,
                tableId,
                `Phase4 Table ${suffix}`,
              )
            ).name,
            `phase4 table ${suffix}`,
          );

          await transaction.customer.create({
            data: { id: customerId, username: `phase4-catalog-${suffix}` },
          });
          await transaction.order.create({
            data: {
              id: orderId,
              customerId,
              tableId,
              quality: 1,
              duration: 3,
              promo: 2,
              price: 12,
              totalPrice: 10,
              status: "PENDING",
              estimatedReadyAt: new Date(Date.now() + 60_000),
              expires: new Date(Date.now() + 60_000),
            },
          });
          await transaction.orderItem.create({
            data: {
              id: itemId,
              orderId,
              menuId,
              quality: 1,
              duration: 3,
              promo: 2,
              price: 12,
              totalPrice: 10,
            },
          });
          await assert.rejects(
            deleteCategoryInTransaction(transaction, categoryId),
            {
              status: 409,
            },
          );
          await assert.rejects(deleteMenuInTransaction(transaction, menuId), {
            status: 409,
          });
          await assert.rejects(deleteTableInTransaction(transaction, tableId), {
            status: 409,
          });

          await transaction.orderItem.delete({ where: { id: itemId } });
          await transaction.order.delete({ where: { id: orderId } });
          const deletedMenu = await deleteMenuInTransaction(
            transaction,
            menuId,
          );
          const deletedTable = await deleteTableInTransaction(
            transaction,
            tableId,
          );
          const deletedCategory = await deleteCategoryInTransaction(
            transaction,
            categoryId,
          );
          assert.equal(deletedMenu.id, menuId);
          assert.equal(deletedTable.id, tableId);
          assert.equal(deletedCategory.id, categoryId);
          throw rollback;
        }),
        (error) => error === rollback,
      );

      assert.equal(
        await prisma.category.findUnique({ where: { id: categoryId } }),
        null,
      );
      assert.equal(
        await prisma.menu.findUnique({ where: { id: menuId } }),
        null,
      );
      assert.equal(
        await prisma.diningTable.findUnique({ where: { id: tableId } }),
        null,
      );
      assert.equal(
        await prisma.order.findUnique({ where: { id: orderId } }),
        null,
      );
      assert.equal(
        await prisma.orderItem.findUnique({ where: { id: itemId } }),
        null,
      );
      assert.equal(
        await prisma.customer.findUnique({ where: { id: customerId } }),
        null,
      );
    } finally {
      await prisma.$disconnect();
    }
  },
);
