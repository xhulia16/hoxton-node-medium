/*
  Warnings:

  - Made the column `img` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "fullName" TEXT NOT NULL,
    "followers" INTEGER NOT NULL,
    "img" TEXT NOT NULL
);
INSERT INTO "new_User" ("followers", "fullName", "id", "img") SELECT "followers", "fullName", "id", "img" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
