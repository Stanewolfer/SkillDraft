-- DropForeignKey
ALTER TABLE `feeditem` DROP FOREIGN KEY `FeedItem_userId_fkey`;

-- DropForeignKey
ALTER TABLE `message` DROP FOREIGN KEY `Message_conversationId_fkey`;

-- DropIndex
DROP INDEX `FeedItem_userId_createdAt_idx` ON `feeditem`;

-- DropIndex
DROP INDEX `Message_conversationId_key` ON `message`;

-- AlterTable
ALTER TABLE `conversation` ADD COLUMN `lastMessageid` VARCHAR(191) NULL;

-- CreateIndex
CREATE INDEX `FeedItem_userId_createdAt_idx` ON `FeedItem`(`userId`, `createdAt` DESC);

-- AddForeignKey
ALTER TABLE `FeedItem` ADD CONSTRAINT `FeedItem_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Conversation` ADD CONSTRAINT `Conversation_lastMessageid_fkey` FOREIGN KEY (`lastMessageid`) REFERENCES `Message`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
