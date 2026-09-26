import type { PrismaClient } from "../generated/prisma/client";

type AuthenticationDatabase = Pick<
  PrismaClient,
  "account" | "customer" | "role" | "refreshToken"
>;
type AuthenticationTransaction = AuthenticationDatabase &
  Pick<PrismaClient, "$queryRaw">;

type AccountIdentity = {
  id: string;
  username: string;
  email: string;
  password: string;
  roleId: string;
};

type AccountIdentityUpdate = Omit<AccountIdentity, "id" | "password"> & {
  password?: string;
};

type RefreshTokenRotation = {
  currentToken: string;
  nextToken: string;
  accountId: string;
  ipAddress: string;
  expiresAt: Date;
  now?: Date;
};

const accountSelection = {
  id: true,
  username: true,
  email: true,
  roleId: true,
  role: { select: { id: true, name: true } },
} as const;

const lockAccountIdentity = async (
  transaction: AuthenticationTransaction,
  username: string,
  email: string,
): Promise<void> => {
  const lockKeys = [
    `account-email:${email.toLowerCase()}`,
    `account-username:${username.toLowerCase()}`,
  ].sort();

  for (const lockKey of lockKeys) {
    await transaction.$queryRaw`
      SELECT 'locked'::text
      FROM pg_advisory_xact_lock(hashtext(${lockKey})::bigint)
    `;
  }
};

const assertAccountIdentityAvailable = async (
  database: AuthenticationDatabase,
  username: string,
  email: string,
  exceptAccountId?: string,
): Promise<void> => {
  const accountIdFilter = exceptAccountId
    ? { not: exceptAccountId }
    : undefined;
  const usernameMatch = await database.account.findFirst({
    where: {
      username: { equals: username, mode: "insensitive" },
      ...(accountIdFilter ? { id: accountIdFilter } : {}),
    },
    select: { id: true },
  });
  if (usernameMatch) {
    throw Object.assign(new Error("Username is already"), { status: 409 });
  }

  const emailMatch = await database.account.findFirst({
    where: {
      email: { equals: email, mode: "insensitive" },
      ...(accountIdFilter ? { id: accountIdFilter } : {}),
    },
    select: { id: true },
  });
  if (emailMatch) {
    throw Object.assign(new Error("Email is already"), { status: 409 });
  }
};

export const findAccountForLogin = (
  database: AuthenticationDatabase,
  username: string,
) =>
  database.account.findFirst({
    where: { username: { equals: username, mode: "insensitive" } },
    select: {
      id: true,
      username: true,
      email: true,
      password: true,
      roleId: true,
      role: { select: { id: true, name: true } },
    },
  });

export const findAccountForToken = (
  database: AuthenticationDatabase,
  accountId: string,
) =>
  database.account.findUnique({
    where: { id: accountId },
    select: {
      id: true,
      username: true,
      email: true,
      roleId: true,
      role: { select: { id: true, name: true } },
    },
  });

export const findCustomerForToken = (
  database: AuthenticationDatabase,
  customerId: string,
) =>
  database.customer.findUnique({
    where: { id: customerId },
    select: { id: true, username: true },
  });

export const findRoleByName = (
  database: AuthenticationDatabase,
  name: string,
) =>
  database.role.findUnique({
    where: { name },
    select: { id: true, name: true },
  });

export const findRoleById = (
  database: AuthenticationDatabase,
  roleId: string,
) =>
  database.role.findUnique({
    where: { id: roleId },
    select: { id: true, name: true },
  });

export const listRoles = (database: AuthenticationDatabase) =>
  database.role.findMany();

export const findAccountByEmail = (
  database: AuthenticationDatabase,
  email: string,
) =>
  database.account.findUnique({
    where: { email },
    select: { id: true, username: true, email: true },
  });

export const listAccounts = (database: AuthenticationDatabase) =>
  database.account.findMany({
    select: accountSelection,
  });

export const createAccountInTransaction = async (
  transaction: AuthenticationTransaction,
  account: AccountIdentity,
) => {
  const normalizedEmail = account.email.toLowerCase();
  await lockAccountIdentity(transaction, account.username, normalizedEmail);
  await assertAccountIdentityAvailable(
    transaction,
    account.username,
    normalizedEmail,
  );

  return transaction.account.create({
    data: { ...account, email: normalizedEmail },
    select: accountSelection,
  });
};

export const createAccount = (
  database: PrismaClient,
  account: AccountIdentity,
) =>
  database.$transaction((transaction) =>
    createAccountInTransaction(transaction, account),
  );

export const updateAccountInTransaction = async (
  transaction: AuthenticationTransaction,
  accountId: string,
  account: AccountIdentityUpdate,
) => {
  const normalizedEmail = account.email.toLowerCase();
  await lockAccountIdentity(transaction, account.username, normalizedEmail);
  await assertAccountIdentityAvailable(
    transaction,
    account.username,
    normalizedEmail,
    accountId,
  );

  return transaction.account.update({
    where: { id: accountId },
    data: { ...account, email: normalizedEmail },
    select: accountSelection,
  });
};

export const updateAccount = (
  database: PrismaClient,
  accountId: string,
  account: AccountIdentityUpdate,
) =>
  database.$transaction((transaction) =>
    updateAccountInTransaction(transaction, accountId, account),
  );

export const deleteAccount = (
  database: AuthenticationDatabase,
  accountId: string,
) =>
  database.account.delete({
    where: { id: accountId },
    select: accountSelection,
  });

export const listCustomers = (
  database: AuthenticationDatabase,
  customerId?: string,
) =>
  database.customer.findMany({
    where: customerId ? { id: customerId } : undefined,
  });

export const findCustomerById = (
  database: AuthenticationDatabase,
  customerId: string,
) => database.customer.findUnique({ where: { id: customerId } });

export const createCustomer = (
  database: AuthenticationDatabase,
  customer: { id: string; username: string },
) => database.customer.create({ data: customer });

export const updateCustomer = (
  database: AuthenticationDatabase,
  customerId: string,
  username: string,
) =>
  database.customer.update({ where: { id: customerId }, data: { username } });

export const deleteCustomer = (
  database: AuthenticationDatabase,
  customerId: string,
) => database.customer.delete({ where: { id: customerId } });

export const createRefreshToken = (
  database: AuthenticationDatabase,
  token: {
    id?: string;
    accountId?: string;
    customerId?: string;
    token: string;
    expires: Date;
    createdByIp: string;
  },
) => database.refreshToken.create({ data: token });

export const rotateRefreshTokenInTransaction = async (
  transaction: AuthenticationDatabase,
  rotation: RefreshTokenRotation,
): Promise<boolean> => {
  const now = rotation.now ?? new Date();

  const current = await transaction.refreshToken.findFirst({
    where: {
      token: rotation.currentToken,
      revoked: null,
      OR: [{ expires: null }, { expires: { gt: now } }],
    },
    select: { id: true },
  });
  if (!current) return false;

  const revoked = await transaction.refreshToken.updateMany({
    where: {
      id: current.id,
      revoked: null,
      OR: [{ expires: null }, { expires: { gt: now } }],
    },
    data: {
      revoked: now,
      revokedByIp: rotation.ipAddress,
      replacedByToken: rotation.nextToken,
    },
  });
  if (revoked.count !== 1) return false;

  await transaction.refreshToken.create({
    data: {
      accountId: rotation.accountId,
      token: rotation.nextToken,
      expires: rotation.expiresAt,
      createdByIp: rotation.ipAddress,
    },
  });
  return true;
};

export const rotateRefreshToken = (
  database: PrismaClient,
  rotation: RefreshTokenRotation,
): Promise<boolean> =>
  database.$transaction((transaction) =>
    rotateRefreshTokenInTransaction(transaction, rotation),
  );

export const revokeRefreshTokenInTransaction = async (
  transaction: AuthenticationDatabase,
  token: string,
  ipAddress: string,
  now = new Date(),
): Promise<boolean> => {
  const current = await transaction.refreshToken.findFirst({
    where: { token, revoked: null },
    select: { id: true, expires: true },
  });
  if (!current || (current.expires && current.expires <= now)) return false;

  const updated = await transaction.refreshToken.updateMany({
    where: {
      id: current.id,
      revoked: null,
      OR: [{ expires: null }, { expires: { gt: now } }],
    },
    data: { revoked: now, revokedByIp: ipAddress },
  });
  return updated.count === 1;
};

export const revokeRefreshToken = (
  database: PrismaClient,
  token: string,
  ipAddress: string,
  now = new Date(),
): Promise<boolean> =>
  database.$transaction((transaction) =>
    revokeRefreshTokenInTransaction(transaction, token, ipAddress, now),
  );
