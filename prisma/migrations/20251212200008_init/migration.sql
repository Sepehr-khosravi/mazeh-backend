-- AlterTable
ALTER TABLE "User" ADD COLUMN     "profile" TEXT NOT NULL DEFAULT 'https://www.transparentpng.com/download/user/gray-user-profile-icon-png-fP8Q1P.png';

-- CreateTable
CREATE TABLE "Refrigerator" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 1,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Refrigerator_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Refrigerator_name_key" ON "Refrigerator"("name");

-- AddForeignKey
ALTER TABLE "Refrigerator" ADD CONSTRAINT "Refrigerator_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
