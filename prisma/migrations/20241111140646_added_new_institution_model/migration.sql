/*
  Warnings:

  - You are about to drop the `responsibles` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `institutionId` to the `children` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "responsibleOnChildren" DROP CONSTRAINT "responsibleOnChildren_responsibleId_fkey";

-- AlterTable
ALTER TABLE "children" ADD COLUMN     "institutionId" TEXT NOT NULL;

-- DropTable
DROP TABLE "responsibles";

-- CreateTable
CREATE TABLE "responsible" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "cpf" TEXT,
    "password" TEXT NOT NULL,
    "street" TEXT,
    "neighborhood" TEXT,
    "city" TEXT,
    "state" TEXT,
    "cep" TEXT,
    "picture" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "responsible_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "institutions" (
    "id" TEXT NOT NULL,
    "cnpj" TEXT,
    "street" TEXT,
    "neighborhood" TEXT,
    "city" TEXT,
    "state" TEXT,
    "cep" TEXT,
    "picture" TEXT,
    "email" TEXT NOT NULL,
    "responsible" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "institutions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "responsibleOnInstitution" (
    "institutionId" TEXT NOT NULL,
    "responsibleId" TEXT NOT NULL,

    CONSTRAINT "responsibleOnInstitution_pkey" PRIMARY KEY ("institutionId","responsibleId")
);

-- CreateIndex
CREATE UNIQUE INDEX "responsible_email_key" ON "responsible"("email");

-- CreateIndex
CREATE UNIQUE INDEX "responsible_cpf_key" ON "responsible"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "institutions_cnpj_key" ON "institutions"("cnpj");

-- CreateIndex
CREATE UNIQUE INDEX "institutions_email_key" ON "institutions"("email");

-- AddForeignKey
ALTER TABLE "children" ADD CONSTRAINT "children_institutionId_fkey" FOREIGN KEY ("institutionId") REFERENCES "institutions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "responsibleOnChildren" ADD CONSTRAINT "responsibleOnChildren_responsibleId_fkey" FOREIGN KEY ("responsibleId") REFERENCES "responsible"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "responsibleOnInstitution" ADD CONSTRAINT "responsibleOnInstitution_institutionId_fkey" FOREIGN KEY ("institutionId") REFERENCES "institutions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "responsibleOnInstitution" ADD CONSTRAINT "responsibleOnInstitution_responsibleId_fkey" FOREIGN KEY ("responsibleId") REFERENCES "responsible"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
