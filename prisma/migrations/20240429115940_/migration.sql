-- CreateEnum
CREATE TYPE "ROLE" AS ENUM ('AMDIN', 'USER');

-- CreateEnum
CREATE TYPE "TicketStatus" AS ENUM ('CONFIRM', 'CANCELED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT,
    "role" "ROLE" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ticket" (
    "id" TEXT NOT NULL,
    "userID" TEXT NOT NULL,
    "status" "TicketStatus" NOT NULL DEFAULT 'CONFIRM',
    "value" INTEGER NOT NULL DEFAULT 1,
    "movieId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Ticket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Movie" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "show_time" TIMESTAMP(3) NOT NULL,
    "seat_available" INTEGER NOT NULL,
    "ceatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Movie_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movie"("id") ON DELETE CASCADE ON UPDATE CASCADE;
