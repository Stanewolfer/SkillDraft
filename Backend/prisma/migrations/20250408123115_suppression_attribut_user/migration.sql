/*
  Warnings:

  - You are about to drop the column `userId` on the `message` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `feeditem` DROP FOREIGN KEY `FeedItem_userId_fkey`;

-- DropForeignKey
ALTER TABLE `message` DROP FOREIGN KEY `Message_userId_fkey`;

-- DropIndex
DROP INDEX `FeedItem_userId_createdAt_idx` ON `feeditem`;

-- DropIndex
DROP INDEX `Message_userId_fkey` ON `message`;

-- AlterTable
ALTER TABLE `message` DROP COLUMN `userId`;

-- CreateIndex
CREATE INDEX `FeedItem_userId_createdAt_idx` ON `FeedItem`(`userId`, `createdAt` DESC);

-- AddForeignKey
ALTER TABLE `FeedItem` ADD CONSTRAINT `FeedItem_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
