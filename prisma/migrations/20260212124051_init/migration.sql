/*
  Warnings:

  - You are about to drop the column `amount` on the `Refrigerator` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name,type,userId]` on the table `Refrigerator` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `type` to the `Refrigerator` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Refrigerator_name_key";

-- AlterTable
ALTER TABLE "Refrigerator" DROP COLUMN "amount",
ADD COLUMN     "count" INTEGER NOT NULL DEFAULT 100,
ADD COLUMN     "type" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Refrigerator_name_type_userId_key" ON "Refrigerator"("name", "type", "userId");
