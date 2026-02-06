/*
  Warnings:

  - You are about to drop the column `classId` on the `bookings` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `bookings` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `bookings` table. All the data in the column will be lost.
  - You are about to drop the `batches` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `classes` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[userId,scheduleId]` on the table `bookings` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `scheduleId` to the `bookings` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "bookings" DROP CONSTRAINT "bookings_classId_fkey";

-- DropForeignKey
ALTER TABLE "classes" DROP CONSTRAINT "classes_batchId_fkey";

-- DropIndex
DROP INDEX "bookings_userId_classId_key";

-- AlterTable
ALTER TABLE "bookings" DROP COLUMN "classId",
DROP COLUMN "status",
DROP COLUMN "updatedAt",
ADD COLUMN     "scheduleId" TEXT NOT NULL;

-- DropTable
DROP TABLE "batches";

-- DropTable
DROP TABLE "classes";

-- DropEnum
DROP TYPE "BookingStatus";

-- CreateTable
CREATE TABLE "schedules" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "topic" TEXT NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "schedules_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "schedules_date_idx" ON "schedules"("date");

-- CreateIndex
CREATE UNIQUE INDEX "bookings_userId_scheduleId_key" ON "bookings"("userId", "scheduleId");

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "schedules"("id") ON DELETE CASCADE ON UPDATE CASCADE;
