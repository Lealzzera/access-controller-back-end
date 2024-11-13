/*
  Warnings:

  - A unique constraint covering the columns `[role]` on the table `role` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "role_role_key" ON "role"("role");
