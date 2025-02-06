/*
  Warnings:

  - Added the required column `need` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
UPDATE "Project" SET "need" = 'Frontend designer' WHERE "need" IS NULL;
