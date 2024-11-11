-- CreateEnum
CREATE TYPE "Period" AS ENUM ('MORNING', 'AFTERNOON', 'ALLDAY');

-- CreateTable
CREATE TABLE "childrens" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "grade" TEXT,
    "teacher" TEXT,
    "birthDate" DATE,
    "picture" TEXT,
    "period" "Period" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "childrens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "responsibles" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "street" TEXT,
    "neighborhood" TEXT,
    "city" TEXT,
    "state" TEXT,
    "cep" TEXT,
    "picture" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "responsibles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "responsibleOnChildren" (
    "childId" TEXT NOT NULL,
    "responsibleId" TEXT NOT NULL,

    CONSTRAINT "responsibleOnChildren_pkey" PRIMARY KEY ("childId","responsibleId")
);

-- CreateIndex
CREATE UNIQUE INDEX "childrens_cpf_key" ON "childrens"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "responsibles_email_key" ON "responsibles"("email");

-- AddForeignKey
ALTER TABLE "responsibleOnChildren" ADD CONSTRAINT "responsibleOnChildren_childId_fkey" FOREIGN KEY ("childId") REFERENCES "childrens"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "responsibleOnChildren" ADD CONSTRAINT "responsibleOnChildren_responsibleId_fkey" FOREIGN KEY ("responsibleId") REFERENCES "responsibles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
