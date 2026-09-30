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
} = require("../src/services/catalog.service");

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
    const category_id = `phase4-catalog-${suffix}-category`;
    const menu_id = `phase4-catalog-${suffix}-menu`;
    const table_id = `phase4-catalog-${suffix}-table`;
    const customer_id = `phase4-catalog-${suffix}-customer`;
    const order_id = `phase4-catalog-${suffix}-order`;
    const itemId = `phase4-catalog-${suffix}-item`;
    const rollback = new Error("rollback catalog fixtures");

    try {
      await assert.rejects(
        prisma.$transaction(async (transaction) => {
          const category = await createCategoryInTransaction(transaction, {
            id: category_id,
            name: `phase4-catalog-${suffix}`,
            desc: "fixture category",
            image: "category.png",
          });
          assert.equal(category.name, `phase4-catalog-${suffix}`.toUpperCase());
          assert.ok(
            (await listCategories(transaction)).some(
              ({ id }) => id === category_id,
            ),
          );
          assert.equal(
            (await findCategoryById(transaction, category_id)).id,
            category_id,
          );
          await assert.rejects(
            createCategoryInTransaction(transaction, {
              id: `${category_id}-duplicate`,
              name: `phase4-CATALOG-${suffix}`,
              desc: "duplicate",
            }),
            { status: 409 },
          );
          const updatedCategory = await updateCategoryInTransaction(
            transaction,
            category_id,
            {
              name: `phase4-catalog-${suffix}`,
              desc: "updated category",
              image: "updated.png",
            },
          );
          assert.equal(updatedCategory.desc, "updated category");

          const menu = await createMenuInTransaction(transaction, {
            id: menu_id,
            name: `Phase4 Menu ${suffix}`,
            desc: "fixture menu",
            image: "menu.png",
            category_id,
            price: 12,
            promo: 2,
            duration: 3,
            is_available: true,
            is_favorite: false,
          });
          assert.equal(menu.category.id, category_id);
          assert.equal((await findMenuById(transaction, menu_id)).id, menu_id);
          assert.ok(
            (await listMenus(transaction)).some(({ id }) => id === menu_id),
          );
          await assert.rejects(
            createMenuInTransaction(transaction, {
              id: `${menu_id}-duplicate`,
              name: `phase4 menu ${suffix}`,
              image: "duplicate.png",
              category_id,
              price: 1,
              promo: 0,
              duration: 1,
              is_available: true,
              is_favorite: false,
            }),
            { status: 409 },
          );
          const updatedMenu = await updateMenuInTransaction(
            transaction,
            menu_id,
            {
              name: `Phase4 Menu ${suffix}`,
              desc: "updated menu",
              image: "menu.png",
              category_id,
              price: 13,
              promo: 1,
              duration: 4,
              is_available: true,
              is_favorite: true,
            },
          );
          assert.equal(updatedMenu.price, 13);
          assert.equal(
            (await updateMenuAvailability(transaction, menu_id, false))
              .is_available,
            false,
          );

          const table = await createTableInTransaction(
            transaction,
            table_id,
            `Phase4 Table ${suffix}`,
          );
          assert.equal(table.name, `phase4 table ${suffix}`);
          assert.equal((await findTableById(transaction, table_id)).id, table_id);
          assert.ok(
            (await listTables(transaction)).some(({ id }) => id === table_id),
          );
          await assert.rejects(
            createTableInTransaction(
              transaction,
              `${table_id}-duplicate`,
              `PHASE4 TABLE ${suffix}`,
            ),
            { status: 409 },
          );
          assert.equal(
            (
              await updateTableInTransaction(
                transaction,
                table_id,
                `Phase4 Table ${suffix}`,
              )
            ).name,
            `phase4 table ${suffix}`,
          );

          await transaction.user.create({
            data: {
              id: customer_id,
              username: `phase4-catalog-${suffix}`,
              email: `phase4-catalog-${suffix}@example.invalid`,
              password: "fixture-only",
            },
          });
          await transaction.order.create({
            data: {
              id: order_id,
              customer_id,
              table_id,
              quality: 1,
              duration: 3,
              promo: 2,
              price: 12,
              total_price: 10,
              status: "PENDING",
              estimated_ready_at: new Date(Date.now() + 60_000),
              expires_at: new Date(Date.now() + 60_000),
            },
          });
          await transaction.orderItem.create({
            data: {
              id: itemId,
              order_id,
              menu_id,
              quality: 1,
              duration: 3,
              promo: 2,
              price: 12,
              total_price: 10,
            },
          });
          await assert.rejects(
            deleteCategoryInTransaction(transaction, category_id),
            {
              status: 409,
            },
          );
          await assert.rejects(deleteMenuInTransaction(transaction, menu_id), {
            status: 409,
          });
          await assert.rejects(deleteTableInTransaction(transaction, table_id), {
            status: 409,
          });

          await transaction.orderItem.delete({ where: { id: itemId } });
          await transaction.order.delete({ where: { id: order_id } });
          const deletedMenu = await deleteMenuInTransaction(
            transaction,
            menu_id,
          );
          const deletedTable = await deleteTableInTransaction(
            transaction,
            table_id,
          );
          const deletedCategory = await deleteCategoryInTransaction(
            transaction,
            category_id,
          );
          assert.equal(deletedMenu.id, menu_id);
          assert.equal(deletedTable.id, table_id);
          assert.equal(deletedCategory.id, category_id);
          throw rollback;
        }),
        (error) => error === rollback,
      );

      assert.equal(
        await prisma.category.findUnique({ where: { id: category_id } }),
        null,
      );
      assert.equal(
        await prisma.menu.findUnique({ where: { id: menu_id } }),
        null,
      );
      assert.equal(
        await prisma.diningTable.findUnique({ where: { id: table_id } }),
        null,
      );
      assert.equal(
        await prisma.order.findUnique({ where: { id: order_id } }),
        null,
      );
      assert.equal(
        await prisma.orderItem.findUnique({ where: { id: itemId } }),
        null,
      );
      assert.equal(
        await prisma.user.findUnique({ where: { id: customer_id } }),
        null,
      );
    } finally {
      await prisma.$disconnect();
    }
  },
);
