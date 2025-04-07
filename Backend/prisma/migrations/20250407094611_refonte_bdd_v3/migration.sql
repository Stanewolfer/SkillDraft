-- DropForeignKey
ALTER TABLE `feeditem` DROP FOREIGN KEY `FeedItem_userId_fkey`;

-- DropForeignKey
ALTER TABLE `message` DROP FOREIGN KEY `Message_offerPostId_fkey`;

-- DropForeignKey
ALTER TABLE `user` DROP FOREIGN KEY `User_teamId_fkey`;

-- DropIndex
DROP INDEX `FeedItem_userId_createdAt_idx` ON `feeditem`;

-- DropIndex
DROP INDEX `Message_offerPostId_fkey` ON `message`;

-- DropIndex
DROP INDEX `User_teamId_fkey` ON `user`;

-- ALTER TABLE to add columns without NOT NULL constraint
ALTER TABLE `message` 
    ADD COLUMN `updatedAt` DATETIME(3),
    ADD COLUMN `userId` VARCHAR(191);

-- Update existing rows to fill `updatedAt` and `userId` with default values
UPDATE `message` 
SET `updatedAt` = NOW(), `userId` = 'default-user-id' 
WHERE `updatedAt` IS NULL OR `userId` IS NULL;

-- Alter the columns to make them NOT NULL
ALTER TABLE `message` 
    MODIFY COLUMN `updatedAt` DATETIME(3) NOT NULL,
    MODIFY COLUMN `userId` VARCHAR(191) NOT NULL;

-- Create `Comment` table
CREATE TABLE `Comment` (
    `id` VARCHAR(191) NOT NULL,
    `content` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `offerPostId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create `_MessageToUser` table
CREATE TABLE `_MessageToUser` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_MessageToUser_AB_unique`(`A`, `B`),
    INDEX `_MessageToUser_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create `FeedItem` index
CREATE INDEX `FeedItem_userId_createdAt_idx` ON `FeedItem`(`userId`, `createdAt` DESC);

-- Add Foreign Keys
ALTER TABLE `User` 
    ADD CONSTRAINT `User_teamId_fkey` FOREIGN KEY (`teamId`) REFERENCES `Team`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `Message` 
    ADD CONSTRAINT `Message_offerPostId_fkey` FOREIGN KEY (`offerPostId`) REFERENCES `OfferPost`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `Comment` 
    ADD CONSTRAINT `Comment_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `Comment` 
    ADD CONSTRAINT `Comment_offerPostId_fkey` FOREIGN KEY (`offerPostId`) REFERENCES `OfferPost`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `_MessageToUser` 
    ADD CONSTRAINT `_MessageToUser_A_fkey` FOREIGN KEY (`A`) REFERENCES `Message`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `_MessageToUser` 
    ADD CONSTRAINT `_MessageToUser_B_fkey` FOREIGN KEY (`B`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- Add indexes or constraints if needed for the new relations
