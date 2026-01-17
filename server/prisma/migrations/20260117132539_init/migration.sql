-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `passwordHash` VARCHAR(191) NOT NULL,
    `xpTotal` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `User_username_key`(`username`),
    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Roadmap` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `userId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Node` (
    `id` VARCHAR(191) NOT NULL,
    `roadmapId` INTEGER NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `xpReward` INTEGER NOT NULL DEFAULT 100,
    `positionX` DOUBLE NOT NULL DEFAULT 0,
    `positionY` DOUBLE NOT NULL DEFAULT 0,
    `content` TEXT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Edge` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `roadmapId` INTEGER NOT NULL,
    `sourceNodeId` VARCHAR(191) NOT NULL,
    `targetNodeId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserProgress` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `nodeId` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'LOCKED',
    `completedAt` DATETIME(3) NULL,

    UNIQUE INDEX `UserProgress_userId_nodeId_key`(`userId`, `nodeId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Roadmap` ADD CONSTRAINT `Roadmap_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Node` ADD CONSTRAINT `Node_roadmapId_fkey` FOREIGN KEY (`roadmapId`) REFERENCES `Roadmap`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Edge` ADD CONSTRAINT `Edge_roadmapId_fkey` FOREIGN KEY (`roadmapId`) REFERENCES `Roadmap`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Edge` ADD CONSTRAINT `Edge_sourceNodeId_fkey` FOREIGN KEY (`sourceNodeId`) REFERENCES `Node`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Edge` ADD CONSTRAINT `Edge_targetNodeId_fkey` FOREIGN KEY (`targetNodeId`) REFERENCES `Node`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserProgress` ADD CONSTRAINT `UserProgress_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserProgress` ADD CONSTRAINT `UserProgress_nodeId_fkey` FOREIGN KEY (`nodeId`) REFERENCES `Node`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
