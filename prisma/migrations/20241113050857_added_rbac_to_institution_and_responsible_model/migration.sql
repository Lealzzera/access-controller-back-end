/*
  Warnings:

  - Added the required column `roleId` to the `institutions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `roleId` to the `responsible` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "RoleEnum" AS ENUM ('INSTITUTION', 'RESPONSIBLE');

-- AlterTable
ALTER TABLE "institutions" ADD COLUMN     "roleId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "responsible" ADD COLUMN     "roleId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Role" (
    "id" TEXT NOT NULL,
    "role" "RoleEnum" NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "responsible" ADD CONSTRAINT "responsible_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "institutions" ADD CONSTRAINT "institutions_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
