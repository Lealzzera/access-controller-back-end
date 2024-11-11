/*
  Warnings:

  - You are about to drop the `childrens` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "responsibleOnChildren" DROP CONSTRAINT "responsibleOnChildren_childId_fkey";

-- DropTable
DROP TABLE "childrens";

-- CreateTable
CREATE TABLE "children" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "grade" TEXT,
    "teacher" TEXT,
    "birthDate" DATE,
    "picture" TEXT,
    "period" "Period" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "children_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "children_cpf_key" ON "children"("cpf");

-- AddForeignKey
ALTER TABLE "responsibleOnChildren" ADD CONSTRAINT "responsibleOnChildren_childId_fkey" FOREIGN KEY ("childId") REFERENCES "children"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
