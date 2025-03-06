/*
  Warnings:

  - The primary key for the `fastsearching` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `notifications` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `offerpost` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `regularpost` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE `_fastsearchingtoteam` DROP FOREIGN KEY `_FastSearchingToTeam_A_fkey`;

-- AlterTable
ALTER TABLE `_fastsearchingtoteam` MODIFY `A` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `fastsearching` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `notifications` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `offerpost` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `regularpost` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AddForeignKey
ALTER TABLE `_FastSearchingToTeam` ADD CONSTRAINT `_FastSearchingToTeam_A_fkey` FOREIGN KEY (`A`) REFERENCES `FastSearching`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
