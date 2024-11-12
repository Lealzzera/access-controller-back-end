/*
  Warnings:

  - Added the required column `kinship` to the `responsibleOnChildren` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Kinship" AS ENUM ('MOTHER', 'FATHER', 'UNCLE', 'AUNT', 'GRANDPARENT', 'BROTHER', 'SISTER', 'STEPPARENT', 'COUSIN', 'GUARDIAN', 'GODPARENT', 'OTHER');

-- AlterTable
ALTER TABLE "children" ADD COLUMN     "deleted_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "institutions" ADD COLUMN     "deleted_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "responsible" ADD COLUMN     "deleted_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "responsibleOnChildren" ADD COLUMN     "allowed" BOOLEAN,
ADD COLUMN     "kinship" "Kinship" NOT NULL;
