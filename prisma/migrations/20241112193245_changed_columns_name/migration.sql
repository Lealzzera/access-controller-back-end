/*
  Warnings:

  - You are about to drop the column `allowed` on the `responsibleOnChildren` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "responsibleOnChildren" DROP COLUMN "allowed",
ADD COLUMN     "notAllowed" BOOLEAN;
