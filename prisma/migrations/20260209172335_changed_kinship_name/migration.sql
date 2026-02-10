/*
  Warnings:

  - You are about to drop the `Kinship` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "responsibleOnChildren" DROP CONSTRAINT "responsibleOnChildren_kinshipId_fkey";

-- DropTable
DROP TABLE "Kinship";

-- CreateTable
CREATE TABLE "kinship" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "value" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "kinship_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "kinship_name_key" ON "kinship"("name");

-- CreateIndex
CREATE UNIQUE INDEX "kinship_value_key" ON "kinship"("value");

-- AddForeignKey
ALTER TABLE "responsibleOnChildren" ADD CONSTRAINT "responsibleOnChildren_kinshipId_fkey" FOREIGN KEY ("kinshipId") REFERENCES "kinship"("id") ON DELETE SET NULL ON UPDATE CASCADE;
