/*
  Warnings:

  - You are about to drop the column `kinship` on the `responsibleOnChildren` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "responsibleOnChildren" DROP COLUMN "kinship",
ADD COLUMN     "kinshipId" TEXT;

-- DropEnum
DROP TYPE "Kinship";

-- CreateTable
CREATE TABLE "Kinship" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Kinship_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Kinship_name_key" ON "Kinship"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Kinship_value_key" ON "Kinship"("value");

-- AddForeignKey
ALTER TABLE "responsibleOnChildren" ADD CONSTRAINT "responsibleOnChildren_kinshipId_fkey" FOREIGN KEY ("kinshipId") REFERENCES "Kinship"("id") ON DELETE SET NULL ON UPDATE CASCADE;
