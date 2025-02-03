/*
  Warnings:

  - You are about to drop the column `productExpdate` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `productMfgdate` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "productExpdate",
DROP COLUMN "productMfgdate";
