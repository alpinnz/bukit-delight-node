ALTER TYPE "TransactionStatus" RENAME VALUE 'proses' TO 'processing';

ALTER TABLE "orders"
RENAME COLUMN "estimasi" TO "estimated_ready_at";
