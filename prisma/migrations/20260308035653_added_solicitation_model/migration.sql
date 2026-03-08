-- CreateEnum
CREATE TYPE "SolicitationType" AS ENUM ('DROP_OFF', 'PICK_UP');

-- CreateEnum
CREATE TYPE "SolicitationStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- CreateTable
CREATE TABLE "solicitations" (
    "id" TEXT NOT NULL,
    "type" "SolicitationType" NOT NULL,
    "status" "SolicitationStatus" NOT NULL DEFAULT 'PENDING',
    "childId" TEXT NOT NULL,
    "responsibleId" TEXT NOT NULL,
    "institutionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "solicitations_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "solicitations" ADD CONSTRAINT "solicitations_childId_fkey" FOREIGN KEY ("childId") REFERENCES "children"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "solicitations" ADD CONSTRAINT "solicitations_responsibleId_fkey" FOREIGN KEY ("responsibleId") REFERENCES "responsible"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "solicitations" ADD CONSTRAINT "solicitations_institutionId_fkey" FOREIGN KEY ("institutionId") REFERENCES "institutions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
