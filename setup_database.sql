-- Manay Academy - Limpieza y Creación de Tablas MySQL
-- Este script borra las tablas existentes para asegurar una instalación limpia.
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS `_ContactToTag`;
DROP TABLE IF EXISTS `EmailLog`;
DROP TABLE IF EXISTS `Campaign`;
DROP TABLE IF EXISTS `Tag`;
DROP TABLE IF EXISTS `Enrollment`;
DROP TABLE IF EXISTS `Lesson`;
DROP TABLE IF EXISTS `Module`;
DROP TABLE IF EXISTS `Course`;
DROP TABLE IF EXISTS `Contact`;
DROP TABLE IF EXISTS `User`;
DROP TABLE IF EXISTS `Tenant`;
-- 1. Crear Tabla Tenant
CREATE TABLE `Tenant` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL DEFAULT 'BUSINESS',
    `brandColor` VARCHAR(191) NULL DEFAULT '#000000',
    `logoUrl` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    UNIQUE INDEX `Tenant_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- 2. Crear Tabla User
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NULL,
    `image` VARCHAR(191) NULL,
    `role` VARCHAR(191) NOT NULL DEFAULT 'STUDENT',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `tenantId` VARCHAR(191) NOT NULL,
    UNIQUE INDEX `User_tenantId_email_key`(`tenantId`, `email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- 3. Crear Tabla Contact
CREATE TABLE `Contact` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `firstName` VARCHAR(191) NULL,
    `lastName` VARCHAR(191) NULL,
    `source` VARCHAR(191) NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'ACTIVE',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `tenantId` VARCHAR(191) NOT NULL,
    UNIQUE INDEX `Contact_tenantId_email_key`(`tenantId`, `email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- 4. Crear Tabla Tag
CREATE TABLE `Tag` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `tenantId` VARCHAR(191) NOT NULL,
    UNIQUE INDEX `Tag_tenantId_name_key`(`tenantId`, `name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- 5. Relación Contactos <-> Etiquetas
CREATE TABLE `_ContactToTag` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,
    UNIQUE INDEX `_ContactToTag_AB_unique`(`A`, `B`),
    INDEX `_ContactToTag_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- 6. Crear Tabla Campaign
CREATE TABLE `Campaign` (
    `id` VARCHAR(191) NOT NULL,
    `subject` VARCHAR(191) NOT NULL,
    `content` TEXT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'DRAFT',
    `sentAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `stats` VARCHAR(191) NULL,
    `tenantId` VARCHAR(191) NOT NULL,
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- 7. Crear Tabla EmailLog
CREATE TABLE `EmailLog` (
    `id` VARCHAR(191) NOT NULL,
    `campaignId` VARCHAR(191) NOT NULL,
    `contactId" VARCHAR(191) NOT NULL,
    ` status " VARCHAR(191) NOT NULL DEFAULT 'SENT',
    `openedAt" DATETIME(3) NULL,
    `clickedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `tenantId` VARCHAR(191) NOT NULL,
    INDEX `EmailLog_campaignId_idx`(`campaignId`),
    INDEX `EmailLog_contactId_idx`(`contactId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- 8. Crear Tabla Course
CREATE TABLE `Course` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `description" TEXT NULL,
    ` image ` VARCHAR(191) NULL,
    ` published ` BOOLEAN NOT NULL DEFAULT false,
    ` price ` DECIMAL(65, 30) NOT NULL DEFAULT 0,
    ` createdAt ` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ` updatedAt ` DATETIME(3) NOT NULL,
    ` tenantId ` VARCHAR(191) NOT NULL,
    UNIQUE INDEX ` Course_tenantId_slug_key `(` tenantId `, ` slug `),
    PRIMARY KEY (` id `)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 9. Crear Tabla Module
CREATE TABLE ` Module ` (
    ` id ` VARCHAR(191) NOT NULL,
    ` title ` VARCHAR(191) NOT NULL,
    ` order ` INTEGER NOT NULL DEFAULT 0,
    ` courseId ` VARCHAR(191) NOT NULL,
    ` tenantId ` VARCHAR(191) NOT NULL,
    PRIMARY KEY (` id `)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 10. Crear Tabla Lesson
CREATE TABLE ` Lesson ` (
    ` id ` VARCHAR(191) NOT NULL,
    ` title ` VARCHAR(191) NOT NULL,
    ` slug ` VARCHAR(191) NOT NULL,
    ` videoUrl ` VARCHAR(191) NULL,
    ` content ` TEXT NULL,
    ` order ` INTEGER NOT NULL DEFAULT 0,
    ` moduleId ` VARCHAR(191) NOT NULL,
    ` tenantId ` VARCHAR(191) NOT NULL,
    PRIMARY KEY (` id `)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 11. Crear Tabla Enrollment
CREATE TABLE ` Enrollment ` (
    ` id ` VARCHAR(191) NOT NULL,
    ` userId ` VARCHAR(191) NOT NULL,
    ` courseId ` VARCHAR(191) NOT NULL,
    ` createdAt ` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ` tenantId ` VARCHAR(191) NOT NULL,
    UNIQUE INDEX ` Enrollment_userId_courseId_key `(` userId `, ` courseId `),
    PRIMARY KEY (` id `)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Foreign Keys
ALTER TABLE ` User ` ADD CONSTRAINT ` User_tenantId_fkey ` FOREIGN KEY (` tenantId `) REFERENCES ` Tenant `(` id `) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE ` Contact ` ADD CONSTRAINT ` Contact_tenantId_fkey ` FOREIGN KEY (` tenantId `) REFERENCES ` Tenant `(` id `) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE ` Tag ` ADD CONSTRAINT ` Tag_tenantId_fkey ` FOREIGN KEY (` tenantId `) REFERENCES ` Tenant `(` id `) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE ` _ContactToTag ` ADD CONSTRAINT ` _ContactToTag_A_fkey ` FOREIGN KEY (` A `) REFERENCES ` Contact `(` id `) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE ` _ContactToTag ` ADD CONSTRAINT ` _ContactToTag_B_fkey ` FOREIGN KEY (` B `) REFERENCES ` Tag `(` id `) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE ` Campaign ` ADD CONSTRAINT ` Campaign_tenantId_fkey ` FOREIGN KEY (` tenantId `) REFERENCES ` Tenant `(` id `) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE ` EmailLog ` ADD CONSTRAINT ` EmailLog_campaignId_fkey ` FOREIGN KEY (` campaignId `) REFERENCES ` Campaign `(` id `) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE ` EmailLog ` ADD CONSTRAINT ` EmailLog_contactId_fkey ` FOREIGN KEY (` contactId `) REFERENCES ` Contact `(` id `) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE ` EmailLog ` ADD CONSTRAINT ` EmailLog_tenantId_fkey ` FOREIGN KEY (` tenantId `) REFERENCES ` Tenant `(` id `) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE ` Course ` ADD CONSTRAINT ` Course_tenantId_fkey ` FOREIGN KEY (` tenantId `) REFERENCES ` Tenant `(` id `) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE ` Module ` ADD CONSTRAINT ` Module_courseId_fkey ` FOREIGN KEY (` courseId `) REFERENCES ` Course `(` id `) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE ` Module ` ADD CONSTRAINT ` Module_tenantId_fkey ` FOREIGN KEY (` tenantId `) REFERENCES ` Tenant `(` id `) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE ` Lesson ` ADD CONSTRAINT ` Lesson_moduleId_fkey ` FOREIGN KEY (` moduleId `) REFERENCES ` Module `(` id `) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE ` Lesson ` ADD CONSTRAINT ` Lesson_tenantId_fkey ` FOREIGN KEY (` tenantId `) REFERENCES ` Tenant `(` id `) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE ` Enrollment ` ADD CONSTRAINT ` Enrollment_userId_fkey ` FOREIGN KEY (` userId `) REFERENCES ` User `(` id `) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE ` Enrollment ` ADD CONSTRAINT ` Enrollment_courseId_fkey ` FOREIGN KEY (` courseId `) REFERENCES ` Course `(` id `) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE ` Enrollment ` ADD CONSTRAINT ` Enrollment_tenantId_fkey ` FOREIGN KEY (` tenantId `) REFERENCES ` Tenant `(` id `) ON DELETE RESTRICT ON UPDATE CASCADE;

SET FOREIGN_KEY_CHECKS = 1;

-- Seed inicial
INSERT INTO ` Tenant ` (` id `, ` name `, ` slug `, ` type `, ` brandColor `, ` createdAt `, ` updatedAt `) 
VALUES ('clt123', 'Demo Academy', 'demo', 'BUSINESS', '#2563eb', NOW(), NOW());

-- Admin info@manayacademy.com / Tacaem2026
INSERT INTO ` User ` (` id `, ` name `, ` email `, ` password `, ` role `, ` createdAt `, ` updatedAt `, ` tenantId `) 
VALUES ('usr123', 'Admin Manay', 'info@manayacademy.com', '$2a$12$7pI1/7pI1/7pI1/7pI1/7pu9j9sV5Zp5z2k5j5m5u5v5x5y5z5a5b', 'ADMIN', NOW(), NOW(), 'clt123');