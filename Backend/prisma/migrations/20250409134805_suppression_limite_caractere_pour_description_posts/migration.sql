-- DropForeignKey
ALTER TABLE `feeditem` DROP FOREIGN KEY `FeedItem_userId_fkey`;

-- DropIndex
DROP INDEX `FeedItem_userId_createdAt_idx` ON `feeditem`;

-- AlterTable
ALTER TABLE `regularpost` MODIFY `description` TEXT NOT NULL;

-- CreateIndex
CREATE INDEX `FeedItem_userId_createdAt_idx` ON `FeedItem`(`userId`, `createdAt` DESC);

-- AddForeignKey
ALTER TABLE `RegularPost` ADD CONSTRAINT `RegularPost_posterId_fkey` FOREIGN KEY (`posterId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
