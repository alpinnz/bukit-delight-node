const { randomBytes } = require("node:crypto");
const { it } = require("node:test");
const assert = require("node:assert/strict");

const databaseUrl = process.env.PRISMA_TEST_DATABASE_URL;
const parsedDatabaseUrl = databaseUrl ? new URL(databaseUrl) : null;
const isLocalTestDatabase =
  parsedDatabaseUrl &&
  ["localhost", "127.0.0.1", "::1"].includes(parsedDatabaseUrl.hostname) &&
  parsedDatabaseUrl.pathname === "/bukit_delight";

const prismaApiRouteTest = isLocalTestDatabase ? it : it.skip;

prismaApiRouteTest(
  "routes customer, order, item, and transaction APIs through unified Prisma storage",
  async () => {
    process.env.DATABASE_URL = databaseUrl;
    process.env.ACCESS_TOKEN_KEY = "phase4-api-storage-access-secret";
    process.env.ACCESS_TOKEN_TIMEOUT = "60000";
    process.env.REFRESH_TOKEN_KEY = "phase4-api-storage-refresh-secret";
    process.env.REFRESH_TOKEN_TIMEOUT = "60000";
    process.env.CLIENT_URL = "https://phase4.example.invalid";
    process.env.PATH_UPLOADS = "uploads";
    process.env.ORDERS_TIMEOUT = "60000";

    const { app, server } = require("../src/app");
    const { PrismaClient } = require("../src/generated/prisma/client");
    const { PrismaPg } = require("@prisma/adapter-pg");
    const { JwtAccessToken } = require("../src/services/Authentication");
    const database = new PrismaClient({
      adapter: new PrismaPg({ connectionString: databaseUrl }),
    });
    const suffix = randomBytes(8).toString("hex");
    const roleUsername = `phase4-api-${suffix}`;
    const customerUsername = `phase4-customer-${suffix}`;
    const categoryId = randomBytes(12).toString("hex");
    const menuId = randomBytes(12).toString("hex");
    const tableId = randomBytes(12).toString("hex");
    const accountId = randomBytes(12).toString("hex");
    const orderId = { value: undefined };
    const customerId = { value: undefined };
    let baseUrl;

    try {
      await database.$connect();
      const cashierRole = await database.role.findUnique({
        where: { name: "cashier" },
      });
      assert.ok(
        cashierRole,
        "local target database must contain the cashier role",
      );

      await database.category.create({
        data: {
          id: categoryId,
          name: `phase4-api-category-${suffix}`,
          desc: "API storage route fixture",
          image: "category.png",
        },
      });
      await database.menu.create({
        data: {
          id: menuId,
          name: `phase4-api-menu-${suffix}`,
          desc: "API storage route fixture",
          image: "menu.png",
          categoryId,
          price: 10,
          promo: 1,
          duration: 2,
          isAvailable: true,
          isFavorite: false,
        },
      });
      await database.diningTable.create({
        data: { id: tableId, name: `phase4-api-table-${suffix}` },
      });
      await database.account.create({
        data: {
          id: accountId,
          username: roleUsername,
          email: `${roleUsername}@example.invalid`,
          password: "unused-route-fixture-password",
          roleId: cashierRole.id,
        },
      });
      const cashierToken = await JwtAccessToken({
        id: accountId,
        username: roleUsername,
        role: { id: cashierRole.id, name: "cashier" },
      });

      await new Promise((resolve) => server.listen(0, resolve));
      baseUrl = `http://127.0.0.1:${server.address().port}`;

      const customerCreateResponse = await fetch(
        `${baseUrl}/api/v1/customers`,
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ username: customerUsername }),
        },
      );
      assert.equal(customerCreateResponse.status, 200);
      const customerCreate = await customerCreateResponse.json();
      customerId.value = customerCreate.data._id;
      assert.match(customerId.value, /^[0-9a-f]{24}$/);

      const customerReadResponse = await fetch(
        `${baseUrl}/api/v1/customers/${customerId.value}`,
        { headers: { "x-access-token": customerCreate.data.accessToken } },
      );
      assert.equal(customerReadResponse.status, 200);
      assert.equal(
        (await customerReadResponse.json()).data.username,
        customerUsername,
      );

      const catalogResponse = await fetch(`${baseUrl}/api/v1/Menus`);
      assert.equal(catalogResponse.status, 200);
      const catalog = await catalogResponse.json();
      assert.ok(catalog.data.some((menu) => menu._id === menuId));

      const orderCreateResponse = await fetch(`${baseUrl}/api/v1/Orders`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-access-token": customerCreate.data.accessToken,
        },
        body: JSON.stringify({
          id_customer: customerId.value,
          id_table: tableId,
          Menus: [{ id_menu: menuId, quality: "1", note: "initial item" }],
        }),
      });
      assert.equal(orderCreateResponse.status, 200);
      const orderCreate = await orderCreateResponse.json();
      orderId.value = orderCreate.data._id;
      assert.match(orderId.value, /^[0-9a-f]{24}$/);
      assert.ok(Number.isFinite(Date.parse(orderCreate.data.estimatedReadyAt)));

      const itemCreateResponse = await fetch(`${baseUrl}/api/v1/item-orders`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-access-token": cashierToken,
        },
        body: JSON.stringify({
          id_order: orderId.value,
          id_menu: menuId,
          quality: 2,
          note: "extra items",
        }),
      });
      assert.equal(itemCreateResponse.status, 200);
      assert.equal((await itemCreateResponse.json()).data.quality, 2);
      const storedOrder = await database.order.findUnique({
        where: { id: orderId.value },
      });
      assert.equal(storedOrder.quality, 3);
      assert.equal(storedOrder.duration, 6);
      assert.equal(storedOrder.totalPrice, 27);

      const transactionCreateResponse = await fetch(
        `${baseUrl}/api/v1/Transactions`,
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
            "x-access-token": cashierToken,
          },
          body: JSON.stringify({ id_order: orderId.value, payment: "cash" }),
        },
      );
      assert.equal(transactionCreateResponse.status, 200);
      const transactionCreate = await transactionCreateResponse.json();
      assert.equal(transactionCreate.data.id_order, orderId.value);
      assert.equal(
        await database.transaction.count({ where: { orderId: orderId.value } }),
        1,
      );

      const transactionStatusResponse = await fetch(
        `${baseUrl}/api/v1/Transactions/status/${transactionCreate.data._id}`,
        {
          method: "PUT",
          headers: {
            "content-type": "application/json",
            "x-access-token": cashierToken,
          },
          body: JSON.stringify({ status: "processing" }),
        },
      );
      assert.equal(transactionStatusResponse.status, 200);
      assert.equal(
        (await transactionStatusResponse.json()).data.status,
        "processing",
      );

      const forbiddenOrderStatus = await fetch(
        `${baseUrl}/api/v1/Orders/status/${orderId.value}`,
        {
          method: "PUT",
          headers: {
            "content-type": "application/json",
            "x-access-token": cashierToken,
          },
          body: JSON.stringify({ status: "pending" }),
        },
      );
      assert.equal(forbiddenOrderStatus.status, 409);
    } finally {
      if (server.listening) {
        await new Promise((resolve, reject) =>
          server.close((closeError) =>
            closeError ? reject(closeError) : resolve(),
          ),
        );
      }
      const customerOrders = customerId.value
        ? await database.order.findMany({
            where: { customerId: customerId.value },
            select: { id: true },
          })
        : [];
      const fixtureOrderIds = [
        ...new Set([
          ...customerOrders.map(({ id }) => id),
          ...(orderId.value ? [orderId.value] : []),
        ]),
      ];
      await database.transaction.deleteMany({
        where: { orderId: { in: fixtureOrderIds } },
      });
      await database.orderItem.deleteMany({
        where: { orderId: { in: fixtureOrderIds } },
      });
      await database.order.deleteMany({
        where: { id: { in: fixtureOrderIds } },
      });
      if (customerId.value) {
        await database.customer.deleteMany({ where: { id: customerId.value } });
      } else {
        await database.customer.deleteMany({
          where: { username: customerUsername },
        });
      }
      await database.account.deleteMany({ where: { id: accountId } });
      await database.diningTable.deleteMany({ where: { id: tableId } });
      await database.menu.deleteMany({ where: { id: menuId } });
      await database.category.deleteMany({ where: { id: categoryId } });
      assert.equal(
        await database.order.count({ where: { id: { in: fixtureOrderIds } } }),
        0,
      );
      assert.equal(
        await database.order.count({
          where: { customerId: customerId.value ?? "" },
        }),
        0,
      );
      assert.equal(
        await database.orderItem.count({
          where: { orderId: { in: fixtureOrderIds } },
        }),
        0,
      );
      assert.equal(
        await database.transaction.count({
          where: { orderId: { in: fixtureOrderIds } },
        }),
        0,
      );
      assert.equal(
        await database.customer.count({
          where: { username: customerUsername },
        }),
        0,
      );
      assert.equal(
        await database.account.findUnique({ where: { id: accountId } }),
        null,
      );
      assert.equal(
        await database.diningTable.findUnique({ where: { id: tableId } }),
        null,
      );
      assert.equal(
        await database.menu.findUnique({ where: { id: menuId } }),
        null,
      );
      assert.equal(
        await database.category.findUnique({ where: { id: categoryId } }),
        null,
      );
      await database.$disconnect();
      const { prisma: applicationPrisma } = require("../src/config/Prisma");
      await applicationPrisma?.$disconnect();
      assert.equal(app != null, true);
    }
  },
);
