/*
  Warnings:

  - You are about to drop the column `created_at` on the `children` table. All the data in the column will be lost.
  - You are about to drop the column `deleted_at` on the `children` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `institutions` table. All the data in the column will be lost.
  - You are about to drop the column `deleted_at` on the `institutions` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `responsible` table. All the data in the column will be lost.
  - You are about to drop the column `deleted_at` on the `responsible` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "children" DROP COLUMN "created_at",
DROP COLUMN "deleted_at",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "institutions" DROP COLUMN "created_at",
DROP COLUMN "deleted_at",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "responsible" DROP COLUMN "created_at",
DROP COLUMN "deleted_at",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deletedAt" TIMESTAMP(3);
