/*
  Warnings:

  - You are about to drop the column `count` on the `Refrigerator` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Refrigerator" DROP COLUMN "count",
ADD COLUMN     "amount" INTEGER NOT NULL DEFAULT 100;
