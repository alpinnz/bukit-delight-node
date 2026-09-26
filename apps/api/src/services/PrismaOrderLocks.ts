import type { PrismaClient } from "../generated/prisma/client";

type AdvisoryLockDatabase = Pick<PrismaClient, "$queryRaw">;

export const lockOrdersForMutation = async (
  transaction: AdvisoryLockDatabase,
  orderIds: string[],
) => {
  const lockKeys = [...new Set(orderIds)].sort();
  for (const orderId of lockKeys) {
    const lockKey = `order:${orderId}`;
    await transaction.$queryRaw`
      SELECT 'locked'::text
      FROM pg_advisory_xact_lock(hashtext(${lockKey})::bigint)
    `;
  }
};

export const lockTransactionQueueForMutation = async (
  transaction: AdvisoryLockDatabase,
) => {
  await transaction.$queryRaw`
    SELECT 'locked'::text
    FROM pg_advisory_xact_lock(hashtext('transaction-queue')::bigint)
  `;
};
