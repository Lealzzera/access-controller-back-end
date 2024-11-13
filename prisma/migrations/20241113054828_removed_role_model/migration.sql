/*
  Warnings:

  - You are about to drop the column `roleId` on the `institutions` table. All the data in the column will be lost.
  - You are about to drop the column `roleId` on the `responsible` table. All the data in the column will be lost.
  - You are about to drop the `role` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `role` to the `institutions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `role` to the `responsible` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('INSTITUTION', 'RESPONSIBLE');

-- DropForeignKey
ALTER TABLE "institutions" DROP CONSTRAINT "institutions_roleId_fkey";

-- DropForeignKey
ALTER TABLE "responsible" DROP CONSTRAINT "responsible_roleId_fkey";

-- AlterTable
ALTER TABLE "institutions" DROP COLUMN "roleId",
ADD COLUMN     "role" "Role" NOT NULL;

-- AlterTable
ALTER TABLE "responsible" DROP COLUMN "roleId",
ADD COLUMN     "role" "Role" NOT NULL;

-- DropTable
DROP TABLE "role";

-- DropEnum
DROP TYPE "RoleEnum";
