-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "purchaseDatetime" DROP NOT NULL,
ALTER COLUMN "purchaseDatetime" DROP DEFAULT,
ALTER COLUMN "orderStatus" SET DEFAULT 0;
