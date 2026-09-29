ALTER TABLE "orders"
RENAME COLUMN "estimated_ready_at" TO "estimasi";

ALTER TYPE "TransactionStatus" RENAME VALUE 'processing' TO 'proses';
