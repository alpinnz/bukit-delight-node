const { randomBytes } = require("node:crypto");
const { it } = require("node:test");
const assert = require("node:assert/strict");

const databaseUrl = process.env.PRISMA_TEST_DATABASE_URL;
const parsedDatabaseUrl = databaseUrl ? new URL(databaseUrl) : null;
const isLocalTestDatabase =
  parsedDatabaseUrl &&
  ["localhost", "127.0.0.1", "::1"].includes(parsedDatabaseUrl.hostname) &&
  parsedDatabaseUrl.pathname === "/bukit_delight";

const prismaRouteTest = isLocalTestDatabase ? it : it.skip;

prismaRouteTest(
  "serves owner auth and user routes from Prisma",
  async () => {
    process.env.DATABASE_URL = databaseUrl;
    process.env.ACCESS_TOKEN_KEY = "phase4-prisma-access-secret";
    process.env.ACCESS_TOKEN_TIMEOUT = "60000";
    process.env.REFRESH_TOKEN_KEY = "phase4-prisma-refresh-secret";
    process.env.REFRESH_TOKEN_TIMEOUT = "60000";

    const { server } = require("../src/app");
    const { PrismaClient } = require("../src/generated/prisma/client");
    const { PrismaPg } = require("@prisma/adapter-pg");
    const { HashPassword } = require("../src/services/authentication-tokens.service");
    const { createUser } = require("../src/services/authentication.service");
    const prisma = new PrismaClient({
      adapter: new PrismaPg({ connectionString: databaseUrl }),
    });
    const suffix = randomBytes(8).toString("hex");
    const username = `phase4-route-${suffix}`;
    const accountId = randomBytes(12).toString("hex");
    let createdAccountId;
    let baseUrl;

    try {
      await prisma.$connect();
      const role = await prisma.role.findUnique({ where: { name: "owner" } });
      assert.ok(role, "local target database must contain the owner role");
      await createUser(prisma, {
        id: accountId,
        username,
        email: `${username}@example.invalid`,
        password: await HashPassword("phase4-route-password"),
        roleIds: [role.id],
      });

      await new Promise((resolve) => server.listen(0, resolve));
      baseUrl = `http://127.0.0.1:${server.address().port}`;

      const loginResponse = await fetch(
        `${baseUrl}/api/v1/auth/login`,
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ username, password: "phase4-route-password" }),
        },
      );
      assert.equal(loginResponse.status, 200);
      const login = await loginResponse.json();
      assert.equal(login.data.id, accountId);

      const rolesResponse = await fetch(`${baseUrl}/api/v1/roles`, {
        headers: { "x-access-token": login.data.access_token },
      });
      assert.equal(rolesResponse.status, 200);
      const roles = await rolesResponse.json();
      assert.ok(roles.data.some((item) => item.id === role.id));

      const accountsResponse = await fetch(`${baseUrl}/api/v1/users`, {
        headers: { "x-access-token": login.data.access_token },
      });
      assert.equal(accountsResponse.status, 200);
      const accounts = await accountsResponse.json();
      const visibleAccount = accounts.data.find(
        (item) => item.id === accountId,
      );
      assert.equal(visibleAccount.username, username);
      assert.deepEqual(visibleAccount.roles.map((item) => item.name), ["owner"]);
      assert.equal("password" in visibleAccount, false);

      const cashierRole = await prisma.role.findUnique({
        where: { name: "cashier" },
      });
      assert.ok(
        cashierRole,
        "local target database must contain the cashier role",
      );
      const accountCreateResponse = await fetch(`${baseUrl}/api/v1/users`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-access-token": login.data.access_token,
        },
        body: JSON.stringify({
          username: `phase4-created-${suffix}`,
          email: `phase4-created-${suffix}@example.com`,
          role_ids: [cashierRole.id],
          password: "phase4-route-password",
          repeat_password: "phase4-route-password",
        }),
      });
      const createdAccount = await accountCreateResponse.json();
      assert.equal(
        accountCreateResponse.status,
        200,
        JSON.stringify(createdAccount),
      );
      createdAccountId = (
        await prisma.user.findUnique({
          where: { username: `phase4-created-${suffix}` },
          select: { id: true },
        })
      ).id;
      assert.match(createdAccountId, /^[0-9a-f]{24}$/);
      assert.deepEqual(createdAccount.data.roles, [
        { id: cashierRole.id, name: "cashier" },
      ]);

      const accountUpdateResponse = await fetch(
        `${baseUrl}/api/v1/users/${createdAccountId}`,
        {
          method: "PUT",
          headers: {
            "content-type": "application/json",
            "x-access-token": login.data.access_token,
          },
          body: JSON.stringify({
            username: `phase4-updated-${suffix}`,
            email: `phase4-updated-${suffix}@example.com`,
            role_ids: [cashierRole.id],
          }),
        },
      );
      assert.equal(accountUpdateResponse.status, 200);
      assert.equal(
        (await accountUpdateResponse.json()).data.username,
        `phase4-updated-${suffix}`,
      );

      const accountDeleteResponse = await fetch(
        `${baseUrl}/api/v1/users/${createdAccountId}`,
        {
          method: "DELETE",
          headers: { "x-access-token": login.data.access_token },
        },
      );
      assert.equal(accountDeleteResponse.status, 200);
      assert.equal(
        await prisma.user.findUnique({ where: { id: createdAccountId } }),
        null,
      );
      createdAccountId = undefined;

      const refreshResponse = await fetch(
        `${baseUrl}/api/v1/auth/refresh-token`,
        {
          method: "POST",
          headers: { "x-refresh-token": login.data.refresh_token },
        },
      );
      assert.equal(refreshResponse.status, 200);
      const refreshed = await refreshResponse.json();

      const reusedTokenResponse = await fetch(
        `${baseUrl}/api/v1/auth/refresh-token`,
        {
          method: "POST",
          headers: { "x-refresh-token": login.data.refresh_token },
        },
      );
      assert.equal(reusedTokenResponse.status, 401);

      const logoutResponse = await fetch(
        `${baseUrl}/api/v1/auth/logout`,
        {
          method: "POST",
          headers: { "x-refresh-token": refreshed.data.refresh_token },
        },
      );
      assert.equal(logoutResponse.status, 200);
    } finally {
      if (server.listening) {
        await new Promise((resolve, reject) =>
          server.close((error) => (error ? reject(error) : resolve())),
        );
      }
      await prisma.refreshToken.deleteMany({ where: { user_id: accountId } });
      const createdAccountFixture = await prisma.user.findUnique({
        where: { username: `phase4-created-${suffix}` },
        select: { id: true },
      });
      const cleanupAccountId = createdAccountId ?? createdAccountFixture?.id;
      if (cleanupAccountId) {
        await prisma.refreshToken.deleteMany({
          where: { user_id: cleanupAccountId },
        });
        await prisma.user.deleteMany({ where: { id: cleanupAccountId } });
      }
      await prisma.user.deleteMany({ where: { id: accountId } });
      assert.equal(
        await prisma.refreshToken.count({ where: { user_id: accountId } }),
      0,
      );
      assert.equal(
        await prisma.user.findUnique({ where: { id: accountId } }),
        null,
      );
      if (cleanupAccountId) {
        assert.equal(
          await prisma.user.findUnique({ where: { id: cleanupAccountId } }),
          null,
        );
      }
      await prisma.$disconnect();
      const { prisma: applicationPrisma } = require("../src/config/prisma");
      await applicationPrisma?.$disconnect();
    }
  },
);
