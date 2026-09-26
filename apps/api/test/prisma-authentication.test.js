const { randomUUID } = require("node:crypto");
const { it } = require("node:test");
const assert = require("node:assert/strict");
const { PrismaPg } = require("@prisma/adapter-pg");
const { PrismaClient } = require("../src/generated/prisma/client");
const {
  createAccountInTransaction,
  createCustomer,
  createRefreshToken,
  deleteCustomer,
  findAccountByEmail,
  findAccountForLogin,
  findAccountForToken,
  findCustomerForToken,
  listCustomers,
  listRoles,
  findRoleByName,
  revokeRefreshTokenInTransaction,
  rotateRefreshTokenInTransaction,
  updateAccountInTransaction,
  updateCustomer,
} = require("../src/services/PrismaAuthentication");

const databaseUrl = process.env.PRISMA_TEST_DATABASE_URL;
const parsedDatabaseUrl = databaseUrl ? new URL(databaseUrl) : null;
const isLocalTestDatabase =
  parsedDatabaseUrl &&
  ["localhost", "127.0.0.1", "::1"].includes(parsedDatabaseUrl.hostname) &&
  parsedDatabaseUrl.pathname === "/bukit_delight";

const prismaTest = isLocalTestDatabase ? it : it.skip;

prismaTest(
  "reads auth records and rotates refresh tokens atomically",
  async () => {
    const prisma = new PrismaClient({
      adapter: new PrismaPg({ connectionString: databaseUrl }),
    });
    const suffix = randomUUID();
    const roleId = `phase4-auth-${suffix}-role`;
    const accountId = `phase4-auth-${suffix}-account`;
    const managedAccountId = `phase4-auth-${suffix}-managed-account`;
    const customerId = `phase4-auth-${suffix}-customer`;
    const managedCustomerId = `phase4-auth-${suffix}-managed-customer`;
    const refreshTokenId = `phase4-auth-${suffix}-refresh`;
    const currentToken = `phase4-auth-token-${suffix}`;
    const nextToken = `phase4-auth-token-next-${suffix}`;
    const rollback = new Error("rollback auth fixture");

    try {
      await assert.rejects(
        prisma.$transaction(async (transaction) => {
          await transaction.role.create({
            data: { id: roleId, name: `phase4-auth-role-${suffix}` },
          });
          await transaction.account.create({
            data: {
              id: accountId,
              username: `Phase4Auth-${suffix}`,
              email: `phase4-auth-${suffix}@example.invalid`,
              password: "fixture-only",
              roleId,
            },
          });
          await transaction.customer.create({
            data: { id: customerId, username: `phase4-customer-${suffix}` },
          });
          await createRefreshToken(transaction, {
            id: refreshTokenId,
            accountId,
            token: currentToken,
            expires: new Date(Date.now() + 60_000),
            createdByIp: "127.0.0.1",
          });

          const account = await findAccountForLogin(
            transaction,
            `phase4auth-${suffix}`,
          );
          assert.equal(account.id, accountId);
          assert.equal(account.role.name, `phase4-auth-role-${suffix}`);
          assert.equal(
            (await findAccountForToken(transaction, accountId)).id,
            accountId,
          );
          assert.equal(
            (await findCustomerForToken(transaction, customerId)).id,
            customerId,
          );
          assert.equal(
            (await findRoleByName(transaction, `phase4-auth-role-${suffix}`))
              .id,
            roleId,
          );
          assert.ok(
            (await listRoles(transaction)).some((role) => role.id === roleId),
          );

          const managedAccount = await createAccountInTransaction(transaction, {
            id: managedAccountId,
            username: `Phase4Managed-${suffix}`,
            email: `Phase4-Managed-${suffix}@example.invalid`,
            password: "fixture-only",
            roleId,
          });
          assert.equal(
            managedAccount.email,
            `phase4-managed-${suffix}@example.invalid`,
          );
          assert.equal(
            (
              await findAccountByEmail(
                transaction,
                `phase4-managed-${suffix}@example.invalid`,
              )
            ).id,
            managedAccountId,
          );
          await assert.rejects(
            createAccountInTransaction(transaction, {
              id: `${managedAccountId}-duplicate`,
              username: `phase4MANAGED-${suffix}`,
              email: `another-${suffix}@example.invalid`,
              password: "fixture-only",
              roleId,
            }),
            { status: 409 },
          );
          const updatedAccount = await updateAccountInTransaction(
            transaction,
            managedAccountId,
            {
              username: `Phase4Managed-${suffix}`,
              email: `Updated-${suffix}@example.invalid`,
              roleId,
            },
          );
          assert.equal(
            updatedAccount.email,
            `updated-${suffix}@example.invalid`,
          );

          const managedCustomer = await createCustomer(transaction, {
            id: managedCustomerId,
            username: `phase4-managed-customer-${suffix}`,
          });
          assert.equal(managedCustomer.id, managedCustomerId);
          assert.equal(
            (await listCustomers(transaction, managedCustomerId)).length,
            1,
          );
          assert.equal(
            (
              await updateCustomer(
                transaction,
                managedCustomerId,
                `phase4-updated-customer-${suffix}`,
              )
            ).username,
            `phase4-updated-customer-${suffix}`,
          );
          await deleteCustomer(transaction, managedCustomerId);
          assert.equal(
            await findCustomerForToken(transaction, managedCustomerId),
            null,
          );

          const rotation = {
            currentToken,
            nextToken,
            accountId,
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
          assert.equal(replacementToken.token, nextToken);
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

      assert.equal(
        await prisma.account.findUnique({ where: { id: accountId } }),
        null,
      );
      assert.equal(
        await prisma.account.findUnique({ where: { id: managedAccountId } }),
        null,
      );
      assert.equal(
        await prisma.role.findUnique({ where: { id: roleId } }),
        null,
      );
      assert.equal(
        await prisma.customer.findUnique({ where: { id: customerId } }),
        null,
      );
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
  },
);
