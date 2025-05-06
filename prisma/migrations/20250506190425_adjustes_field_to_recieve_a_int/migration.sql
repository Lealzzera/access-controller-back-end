/*
  Warnings:

  - Changed the type of `value` on the `Kinship` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Kinship" DROP COLUMN "value",
ADD COLUMN     "value" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Kinship_value_key" ON "Kinship"("value");
