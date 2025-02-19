/*
  Warnings:

  - You are about to drop the column `purchaseOption` on the `Order` table. All the data in the column will be lost.
  - The `paymentMethods` column on the `Order` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Order" DROP COLUMN "purchaseOption",
DROP COLUMN "paymentMethods",
ADD COLUMN     "paymentMethods" INTEGER;
