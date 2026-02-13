/*
  Warnings:

  - You are about to drop the column `kinshipId` on the `responsibleOnChildren` table. All the data in the column will be lost.
  - You are about to drop the `kinship` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "responsibleOnChildren" DROP CONSTRAINT "responsibleOnChildren_kinshipId_fkey";

-- AlterTable
ALTER TABLE "responsibleOnChildren" DROP COLUMN "kinshipId";

-- DropTable
DROP TABLE "kinship";
