/*
  Warnings:

  - Added the required column `title` to the `OfferPost` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `RegularPost` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `offerpost` ADD COLUMN `title` VARCHAR(191) NOT NULL,
    MODIFY `imageList` JSON NULL;

-- AlterTable
ALTER TABLE `regularpost` ADD COLUMN `title` VARCHAR(191) NOT NULL,
    MODIFY `imageList` JSON NULL;
