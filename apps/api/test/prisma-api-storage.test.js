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
    const { JwtAccessToken } = require("../src/services/authentication-tokens.service");
    const database = new PrismaClient({
      adapter: new PrismaPg({ connectionString: databaseUrl }),
    });
    const suffix = randomBytes(8).toString("hex");
    const roleUsername = `phase4-api-${suffix}`;
    const customerUsername = `phase4-customer-${suffix}`;
    const category_id = randomBytes(12).toString("hex");
    const menu_id = randomBytes(12).toString("hex");
    const table_id = randomBytes(12).toString("hex");
    const accountId = randomBytes(12).toString("hex");
    const order_id = { value: undefined };
    const customer_id = { value: undefined };
    const customerAccountId = { value: undefined };
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
      assert.ok(
        await database.role.findUnique({ where: { name: "customer" } }),
        "local target database must contain the customer role",
      );

      await database.category.create({
        data: {
          id: category_id,
          name: `phase4-api-category-${suffix}`,
          desc: "API storage route fixture",
          image: "category.png",
        },
      });
      await database.menu.create({
        data: {
          id: menu_id,
          name: `phase4-api-menu-${suffix}`,
          desc: "API storage route fixture",
          image: "menu.png",
          category_id,
          price: 10,
          promo: 1,
          duration: 2,
          is_available: true,
          is_favorite: false,
        },
      });
      await database.diningTable.create({
        data: { id: table_id, name: `phase4-api-table-${suffix}` },
      });
      await database.user.create({
        data: {
          id: accountId,
          username: roleUsername,
          email: `${roleUsername}@example.invalid`,
          password: "unused-route-fixture-password",
        },
      });
      await database.userRole.create({
        data: { user_id: accountId, role_id: cashierRole.id },
      });
      const cashierToken = await JwtAccessToken({
        id: accountId,
        username: roleUsername,
        role: { id: cashierRole.id, name: "cashier" },
      });

      await new Promise((resolve) => server.listen(0, resolve));
      baseUrl = `http://127.0.0.1:${server.address().port}`;

      const customerRegisterResponse = await fetch(
        `${baseUrl}/api/v1/auth/register`,
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            username: customerUsername,
            email: `${customerUsername}@example.invalid`,
            password: "Phase4Customer123!",
            repeat_password: "Phase4Customer123!",
          }),
        },
      );
      assert.equal(customerRegisterResponse.status, 200);

      const customerLoginResponse = await fetch(
        `${baseUrl}/api/v1/auth/login`,
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            username: `${customerUsername}@example.invalid`,
            password: "Phase4Customer123!",
          }),
        },
      );
      assert.equal(customerLoginResponse.status, 200);
      const customerLogin = await customerLoginResponse.json();
      customerAccountId.value = customerLogin.data.id;
      customer_id.value = customerLogin.data.id;
      assert.equal(customerLogin.data.role, "customer");
      assert.ok(customer_id.value);
      assert.equal(customer_id.value, customerAccountId.value);

      const customerOrdersResponse = await fetch(
        `${baseUrl}/api/v1/orders`,
        { headers: { "x-access-token": customerLogin.data.access_token } },
      );
      assert.equal(customerOrdersResponse.status, 200);

      const catalogResponse = await fetch(`${baseUrl}/api/v1/menus`);
      assert.equal(catalogResponse.status, 200);
      const catalog = await catalogResponse.json();
      assert.ok(catalog.data.some((menu) => menu.id === menu_id));

      const orderCreateResponse = await fetch(`${baseUrl}/api/v1/orders`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-access-token": customerLogin.data.access_token,
        },
        body: JSON.stringify({
          customer_id: customer_id.value,
          table_id: table_id,
          items: [{ menu_id: menu_id, quality: "1", note: "initial item" }],
        }),
      });
      assert.equal(orderCreateResponse.status, 200);
      const orderCreate = await orderCreateResponse.json();
      order_id.value = orderCreate.data.id;
      assert.match(order_id.value, /^[0-9a-f]{24}$/);
      assert.ok(Number.isFinite(Date.parse(orderCreate.data.estimated_ready_at)));

      const itemCreateResponse = await fetch(`${baseUrl}/api/v1/order-items`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-access-token": cashierToken,
        },
        body: JSON.stringify({
          order_id: order_id.value,
          menu_id: menu_id,
          quality: 2,
          note: "extra items",
        }),
      });
      assert.equal(itemCreateResponse.status, 200);
      assert.equal((await itemCreateResponse.json()).data.quality, 2);
      const storedOrder = await database.order.findUnique({
        where: { id: order_id.value },
      });
      assert.equal(storedOrder.quality, 3);
      assert.equal(storedOrder.duration, 6);
      assert.equal(storedOrder.total_price, 27);

      const transactionCreateResponse = await fetch(
        `${baseUrl}/api/v1/transactions`,
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
            "x-access-token": cashierToken,
          },
          body: JSON.stringify({ order_id: order_id.value, payment: "cash" }),
        },
      );
      assert.equal(transactionCreateResponse.status, 200);
      const transactionCreate = await transactionCreateResponse.json();
      assert.equal(transactionCreate.data.order_id, order_id.value);
      assert.equal(
        await database.transaction.count({ where: { order_id: order_id.value } }),
        1,
      );

      const transactionStatusResponse = await fetch(
        `${baseUrl}/api/v1/transactions/${transactionCreate.data.id}/status`,
        {
          method: "PATCH",
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
        `${baseUrl}/api/v1/orders/${order_id.value}/status`,
        {
          method: "PATCH",
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
      const customerOrders = customer_id.value
        ? await database.order.findMany({
            where: { customer_id: customer_id.value },
            select: { id: true },
          })
        : [];
      const fixtureOrderIds = [
        ...new Set([
          ...customerOrders.map(({ id }) => id),
          ...(order_id.value ? [order_id.value] : []),
        ]),
      ];
      await database.transaction.deleteMany({
        where: { order_id: { in: fixtureOrderIds } },
      });
      await database.orderItem.deleteMany({
        where: { order_id: { in: fixtureOrderIds } },
      });
      await database.order.deleteMany({
        where: { id: { in: fixtureOrderIds } },
      });
      if (customer_id.value) {
        await database.user.deleteMany({ where: { id: customer_id.value } });
      } else {
        await database.user.deleteMany({
          where: { username: customerUsername },
        });
      }
      if (customerAccountId.value) {
        await database.refreshToken.deleteMany({
          where: { user_id: customerAccountId.value },
        });
        await database.user.deleteMany({
          where: { id: customerAccountId.value },
        });
      } else {
        await database.user.deleteMany({
          where: { email: `${customerUsername}@example.invalid` },
        });
      }
      await database.user.deleteMany({ where: { id: accountId } });
      await database.diningTable.deleteMany({ where: { id: table_id } });
      await database.menu.deleteMany({ where: { id: menu_id } });
      await database.category.deleteMany({ where: { id: category_id } });
      assert.equal(
        await database.order.count({ where: { id: { in: fixtureOrderIds } } }),
        0,
      );
      assert.equal(
        await database.order.count({
          where: { customer_id: customer_id.value ?? "" },
        }),
        0,
      );
      assert.equal(
        await database.orderItem.count({
          where: { order_id: { in: fixtureOrderIds } },
        }),
        0,
      );
      assert.equal(
        await database.transaction.count({
          where: { order_id: { in: fixtureOrderIds } },
        }),
        0,
      );
      assert.equal(
        await database.user.count({
          where: { username: customerUsername },
        }),
        0,
      );
      assert.equal(
        await database.user.findUnique({ where: { id: accountId } }),
        null,
      );
      assert.equal(
        await database.diningTable.findUnique({ where: { id: table_id } }),
        null,
      );
      assert.equal(
        await database.menu.findUnique({ where: { id: menu_id } }),
        null,
      );
      assert.equal(
        await database.category.findUnique({ where: { id: category_id } }),
        null,
      );
      await database.$disconnect();
      const { prisma: applicationPrisma } = require("../src/config/prisma");
      await applicationPrisma?.$disconnect();
      assert.equal(app != null, true);
    }
  },
);
