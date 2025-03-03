/*
  Warnings:

  - The primary key for the `games` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `team` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `user` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[gameLogo]` on the table `Games` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `gameLogo` to the `Games` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `_fastsearchingtoteam` DROP FOREIGN KEY `_FastSearchingToTeam_B_fkey`;

-- DropForeignKey
ALTER TABLE `fastsearching` DROP FOREIGN KEY `FastSearching_swiperId_fkey`;

-- DropForeignKey
ALTER TABLE `notifications` DROP FOREIGN KEY `Notifications_receiverId_fkey`;

-- DropForeignKey
ALTER TABLE `offerpost` DROP FOREIGN KEY `OfferPost_teamId_fkey`;

-- DropForeignKey
ALTER TABLE `regularpost` DROP FOREIGN KEY `RegularPost_posterId_fkey`;

-- DropForeignKey
ALTER TABLE `user` DROP FOREIGN KEY `User_teamId_fkey`;

-- DropIndex
DROP INDEX `FastSearching_swiperId_fkey` ON `fastsearching`;

-- DropIndex
DROP INDEX `Notifications_receiverId_fkey` ON `notifications`;

-- DropIndex
DROP INDEX `OfferPost_teamId_fkey` ON `offerpost`;

-- DropIndex
DROP INDEX `RegularPost_posterId_fkey` ON `regularpost`;

-- DropIndex
DROP INDEX `User_teamId_fkey` ON `user`;

-- AlterTable
ALTER TABLE `_fastsearchingtoteam` MODIFY `B` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `fastsearching` MODIFY `swiperId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `games` DROP PRIMARY KEY,
    ADD COLUMN `gameLogo` VARCHAR(191) NOT NULL,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `notifications` MODIFY `receiverId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `offerpost` MODIFY `teamId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `regularpost` MODIFY `posterId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `team` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `user` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    MODIFY `teamId` VARCHAR(191) NULL,
    ADD PRIMARY KEY (`id`);

-- CreateIndex
CREATE UNIQUE INDEX `Games_gameLogo_key` ON `Games`(`gameLogo`);

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_teamId_fkey` FOREIGN KEY (`teamId`) REFERENCES `Team`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RegularPost` ADD CONSTRAINT `RegularPost_posterId_fkey` FOREIGN KEY (`posterId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OfferPost` ADD CONSTRAINT `OfferPost_teamId_fkey` FOREIGN KEY (`teamId`) REFERENCES `Team`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FastSearching` ADD CONSTRAINT `FastSearching_swiperId_fkey` FOREIGN KEY (`swiperId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notifications` ADD CONSTRAINT `Notifications_receiverId_fkey` FOREIGN KEY (`receiverId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_FastSearchingToTeam` ADD CONSTRAINT `_FastSearchingToTeam_B_fkey` FOREIGN KEY (`B`) REFERENCES `Team`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
