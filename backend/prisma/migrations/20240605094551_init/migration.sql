-- CreateTable
CREATE TABLE "messages" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" INTEGER NOT NULL,
    "updatedAt" INTEGER NOT NULL,
    "deletedAt" INTEGER,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);
