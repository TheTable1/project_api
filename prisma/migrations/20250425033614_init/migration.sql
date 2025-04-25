-- CreateTable
CREATE TABLE "Project" (
    "pId" SERIAL NOT NULL,
    "pName" TEXT NOT NULL,
    "pDateStart" TIMESTAMP(3) NOT NULL,
    "pDateEnd" TIMESTAMP(3),
    "pDateCompleted" TIMESTAMP(3),
    "pStatus" VARCHAR(20),
    "pDescription" TEXT,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("pId")
);
