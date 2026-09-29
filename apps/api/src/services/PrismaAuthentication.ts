import type { PrismaClient } from "../generated/prisma/client";

type AuthenticationDatabase = Pick<
  PrismaClient,
  "user" | "userRole" | "role" | "refreshToken"
>;
type AuthenticationTransaction = AuthenticationDatabase &
  Pick<PrismaClient, "$queryRaw">;

export type UserIdentity = {
  id: string;
  username: string;
  email: string;
  password: string;
  roleIds: string[];
};

type UserIdentityUpdate = Omit<UserIdentity, "id" | "password"> & {
  password?: string;
};

export type RefreshTokenRotation = {
  currentToken: string;
  nextToken: string;
  userId: string;
  ipAddress: string;
  expiresAt: Date;
  now?: Date;
};

const userSelection = {
  id: true,
  username: true,
  email: true,
  roles: { select: { role: { select: { id: true, name: true } } } },
} as const;

const lockUserIdentity = async (
  transaction: AuthenticationTransaction,
  username: string,
  email: string,
): Promise<void> => {
  const lockKeys = [
    `user-email:${email.toLowerCase()}`,
    `user-username:${username.toLowerCase()}`,
  ].sort();

  for (const lockKey of lockKeys) {
    await transaction.$queryRaw`
      SELECT 'locked'::text
      FROM pg_advisory_xact_lock(hashtext(${lockKey})::bigint)
    `;
  }
};

const assertUserIdentityAvailable = async (
  database: AuthenticationDatabase,
  username: string,
  email: string,
  exceptUserId?: string,
): Promise<void> => {
  const userIdFilter = exceptUserId ? { not: exceptUserId } : undefined;
  const usernameMatch = await database.user.findFirst({
    where: {
      username: { equals: username, mode: "insensitive" },
      ...(userIdFilter ? { id: userIdFilter } : {}),
    },
    select: { id: true },
  });
  if (usernameMatch) {
    throw Object.assign(new Error("Username is already"), { status: 409 });
  }

  const emailMatch = await database.user.findFirst({
    where: {
      email: { equals: email, mode: "insensitive" },
      ...(userIdFilter ? { id: userIdFilter } : {}),
    },
    select: { id: true },
  });
  if (emailMatch) {
    throw Object.assign(new Error("Email is already"), { status: 409 });
  }
};

export const findUserForLogin = async (
  database: AuthenticationDatabase,
  loginIdentifier: string,
) => {
  const user = await database.user.findFirst({
    where: {
      OR: [
        { username: { equals: loginIdentifier, mode: "insensitive" } },
        { email: { equals: loginIdentifier, mode: "insensitive" } },
      ],
    },
    select: {
      id: true,
      username: true,
      email: true,
      password: true,
      roles: { select: { role: { select: { id: true, name: true } } } },
    },
  });
  return user;
};

export const findUserForToken = async (
  database: AuthenticationDatabase,
  userId: string,
) => {
  const user = await database.user.findUnique({
    where: { id: userId },
    select: userSelection,
  });
  return user;
};

// These aliases keep the existing HTTP controller names while persistence uses users.
export const findRoleByName = (database: AuthenticationDatabase, name: string) =>
  database.role.findUnique({
    where: { name },
    select: { id: true, name: true },
  });

export const findRolesByIds = (database: AuthenticationDatabase, roleIds: string[]) =>
  database.role.findMany({
    where: { id: { in: [...new Set(roleIds)] } },
    select: { id: true, name: true },
  });

export const listRoles = (database: AuthenticationDatabase) =>
  database.role.findMany();

export const findUserByEmail = (database: AuthenticationDatabase, email: string) =>
  database.user.findUnique({
    where: { email },
    select: { id: true, username: true, email: true },
  });
export const listUsers = async (database: AuthenticationDatabase) =>
  database.user.findMany({ select: userSelection });

const createUserInTransaction = async (
  transaction: AuthenticationTransaction,
  user: UserIdentity,
) => {
  const normalizedEmail = user.email.toLowerCase();
  await lockUserIdentity(transaction, user.username, normalizedEmail);
  await assertUserIdentityAvailable(
    transaction,
    user.username,
    normalizedEmail,
  );

  const created = await transaction.user.create({
    data: {
      id: user.id,
      username: user.username,
      email: normalizedEmail,
      password: user.password,
      roles: {
        create: user.roleIds.map((roleId) => ({ roleId })),
      },
    },
    select: userSelection,
  });
  return created;
};

export const createUser = (database: PrismaClient, user: UserIdentity) =>
  database.$transaction((transaction) => createUserInTransaction(transaction, user));

export const updateUser = (
  database: PrismaClient,
  userId: string,
  user: UserIdentityUpdate,
) =>
  database.$transaction(async (transaction) => {
    const normalizedEmail = user.email.toLowerCase();
    await lockUserIdentity(transaction, user.username, normalizedEmail);
    await assertUserIdentityAvailable(
      transaction,
      user.username,
      normalizedEmail,
      userId,
    );

    await transaction.userRole.deleteMany({ where: { userId } });
    const updated = await transaction.user.update({
      where: { id: userId },
      data: {
        username: user.username,
        email: normalizedEmail,
        ...(user.password ? { password: user.password } : {}),
        roles: { create: user.roleIds.map((roleId) => ({ roleId })) },
      },
      select: userSelection,
    });
    return updated;
  });

export const deleteUser = (database: AuthenticationDatabase, userId: string) =>
  database.user.delete({ where: { id: userId }, select: userSelection });
export const listCustomers = (database: AuthenticationDatabase) =>
  database.user.findMany({
    where: { roles: { some: { role: { name: "customer" } } } },
    select: userSelection,
  });

export const findCustomerUserById = (database: AuthenticationDatabase, userId: string) =>
  database.user.findFirst({
    where: {
      id: userId,
      roles: { some: { role: { name: "customer" } } },
    },
    select: userSelection,
  });

export const updateCustomerUser = (
  database: AuthenticationDatabase,
  userId: string,
  username: string,
) => database.user.update({ where: { id: userId }, data: { username } });

export const removeCustomerRole = async (
  database: AuthenticationDatabase,
  userId: string,
) => {
  await database.userRole.deleteMany({
    where: { userId, role: { name: "customer" } },
  });
  return findUserForToken(database, userId);
};

export const createUserWithRoles = (
  database: PrismaClient,
  user: UserIdentity,
) => createUser(database, user);

export const createRefreshToken = (
  database: AuthenticationDatabase,
  token: {
    id?: string;
    userId: string;
    token: string;
    expires: Date;
    createdByIp: string;
  },
) => database.refreshToken.create({ data: token });

export const createLoginRefreshToken = (
  database: PrismaClient,
  token: {
    userId: string;
    token: string;
    expires: Date;
    createdByIp: string;
  },
  replaceActiveSession: boolean,
): Promise<boolean> =>
  database.$transaction(async (transaction) => {
    const lockKey = `user-login:${token.userId}`;
    await transaction.$queryRaw`
      SELECT 'locked'::text
      FROM pg_advisory_xact_lock(hashtext(${lockKey})::bigint)
    `;

    const now = new Date();
    const activeSessionFilter = {
      userId: token.userId,
      revoked: null,
      OR: [{ expires: null }, { expires: { gt: now } }],
    };
    const activeSession = await transaction.refreshToken.findFirst({
      where: activeSessionFilter,
      select: { id: true },
    });

    if (activeSession && !replaceActiveSession) return false;
    if (replaceActiveSession) {
      await transaction.refreshToken.updateMany({
        where: activeSessionFilter,
        data: { revoked: now, revokedByIp: token.createdByIp },
      });
    }

    await transaction.refreshToken.create({ data: token });
    return true;
  });

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
      userId: rotation.userId,
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
