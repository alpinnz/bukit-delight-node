const { randomUUID } = require("node:crypto");
const { it } = require("node:test");
const assert = require("node:assert/strict");
const { PrismaPg } = require("@prisma/adapter-pg");
const { PrismaClient } = require("../src/generated/prisma/client");
const {
  createRefreshToken,
  findUserByEmail,
  findUserForLogin,
  findUserForToken,
  listCustomers,
  listRoles,
  findRoleByName,
  revokeRefreshTokenInTransaction,
  rotateRefreshTokenInTransaction,
} = require("../src/services/PrismaAuthentication");

const databaseUrl = process.env.PRISMA_TEST_DATABASE_URL;
const parsedDatabaseUrl = databaseUrl ? new URL(databaseUrl) : null;
const isLocalTestDatabase =
  parsedDatabaseUrl &&
  ["localhost", "127.0.0.1", "::1"].includes(parsedDatabaseUrl.hostname) &&
  parsedDatabaseUrl.pathname === "/bukit_delight";

const prismaTest = isLocalTestDatabase ? it : it.skip;

prismaTest("reads users and rotates refresh tokens atomically", async () => {
  const prisma = new PrismaClient({
    adapter: new PrismaPg({ connectionString: databaseUrl }),
  });
  const suffix = randomUUID();
  const roleId = `auth-${suffix}-role`;
  const userId = `auth-${suffix}-user`;
  const refreshTokenId = `auth-${suffix}-refresh`;
  const currentToken = `auth-token-${suffix}`;
  const nextToken = `auth-token-next-${suffix}`;
  const rollback = new Error("rollback auth fixture");

  try {
    await assert.rejects(
      prisma.$transaction(async (transaction) => {
        const customerRole = await transaction.role.findUnique({
          where: { name: "customer" },
        });
        assert.ok(customerRole, "local target database must contain customer role");
        await transaction.role.create({
          data: { id: roleId, name: `auth-role-${suffix}` },
        });
        await transaction.user.create({
          data: {
            id: userId,
            username: `Auth-${suffix}`,
            email: `auth-${suffix}@example.invalid`,
            password: "fixture-only",
            roles: {
              create: [{ roleId }, { roleId: customerRole.id }],
            },
          },
        });
        await createRefreshToken(transaction, {
          id: refreshTokenId,
          userId,
          token: currentToken,
          expires: new Date(Date.now() + 60_000),
          createdByIp: "127.0.0.1",
        });

        const user = await findUserForLogin(transaction, `auth-${suffix}`);
        assert.equal(user.id, userId);
        assert.deepEqual(
          user.roles.map(({ role }) => role.name).sort(),
          ["auth-role-" + suffix, "customer"].sort(),
        );
        assert.equal((await findUserForToken(transaction, userId)).id, userId);
        assert.equal(
          (await findUserByEmail(transaction, `auth-${suffix}@example.invalid`))
            .id,
          userId,
        );
        assert.ok((await findRoleByName(transaction, `auth-role-${suffix}`)).id);
        assert.ok(
          (await listRoles(transaction)).some((role) => role.id === roleId),
        );
        assert.ok((await listCustomers(transaction)).some((item) => item.id === userId));

        const rotation = {
          currentToken,
          nextToken,
          userId,
          ipAddress: "127.0.0.1",
          expiresAt: new Date(Date.now() + 120_000),
        };
        assert.equal(
          await rotateRefreshTokenInTransaction(transaction, rotation),
          true,
        );
        assert.equal(
          await rotateRefreshTokenInTransaction(transaction, rotation),
          false,
        );

        const revokedToken = await transaction.refreshToken.findUnique({
          where: { id: refreshTokenId },
        });
        const replacementToken = await transaction.refreshToken.findFirst({
          where: { token: nextToken },
        });
        assert.ok(revokedToken.revoked);
        assert.equal(revokedToken.replacedByToken, nextToken);
        assert.equal(replacementToken.userId, userId);
        assert.equal(
          await revokeRefreshTokenInTransaction(
            transaction,
            nextToken,
            "127.0.0.1",
          ),
          true,
        );
        assert.equal(
          await revokeRefreshTokenInTransaction(
            transaction,
            nextToken,
            "127.0.0.1",
          ),
          false,
        );
        throw rollback;
      }),
      (error) => error === rollback,
    );

    assert.equal(await prisma.user.findUnique({ where: { id: userId } }), null);
    assert.equal(await prisma.role.findUnique({ where: { id: roleId } }), null);
    assert.equal(
      await prisma.refreshToken.findUnique({ where: { id: refreshTokenId } }),
      null,
    );
    assert.equal(
      await prisma.refreshToken.findFirst({ where: { token: nextToken } }),
      null,
    );
  } finally {
    await prisma.$disconnect();
  }
});
