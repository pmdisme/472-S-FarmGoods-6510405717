/*
  Warnings:

  - The `paymentMethods` column on the `Order` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "PaymentMethods" AS ENUM ('cash', 'qr', 'card');

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "paymentMethods",
ADD COLUMN     "paymentMethods" "PaymentMethods";
