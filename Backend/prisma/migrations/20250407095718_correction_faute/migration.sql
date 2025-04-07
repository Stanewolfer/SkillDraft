-- DropIndex
DROP INDEX `FeedItem_userId_createdAt_idx` ON `feeditem`;

-- CreateIndex
CREATE INDEX `FeedItem_userId_createdAt_idx` ON `FeedItem`(`userId`, `createdAt` DESC);

-- AddForeignKey
ALTER TABLE `FeedItem` ADD CONSTRAINT `FeedItem_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
