/*
  Warnings:

  - You are about to drop the column `postList` on the `user` table. All the data in the column will be lost.
  - Added the required column `receiverId` to the `Notifications` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `fastsearching` DROP FOREIGN KEY `FastSearching_swiperId_fkey`;

-- DropIndex
DROP INDEX `FastSearching_swiperId_fkey` ON `fastsearching`;

-- AlterTable
ALTER TABLE `fastsearching` MODIFY `swiperId` INTEGER NULL;

-- AlterTable
ALTER TABLE `notifications` ADD COLUMN `receiverId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `postList`;

-- CreateTable
CREATE TABLE `_FastSearchingToTeam` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_FastSearchingToTeam_AB_unique`(`A`, `B`),
    INDEX `_FastSearchingToTeam_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `FastSearching` ADD CONSTRAINT `FastSearching_swiperId_fkey` FOREIGN KEY (`swiperId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notifications` ADD CONSTRAINT `Notifications_receiverId_fkey` FOREIGN KEY (`receiverId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_FastSearchingToTeam` ADD CONSTRAINT `_FastSearchingToTeam_A_fkey` FOREIGN KEY (`A`) REFERENCES `FastSearching`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_FastSearchingToTeam` ADD CONSTRAINT `_FastSearchingToTeam_B_fkey` FOREIGN KEY (`B`) REFERENCES `Team`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
