/*
  Warnings:

  - Made the column `username` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL,
    "hashedPassword" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "githubId" INTEGER,
    "avatarUrl" TEXT,
    "authType" TEXT NOT NULL DEFAULT 'PASSWORD',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_User" ("authType", "avatarUrl", "createdAt", "email", "githubId", "hashedPassword", "id", "phone", "updatedAt", "username") SELECT "authType", "avatarUrl", "createdAt", "email", "githubId", "hashedPassword", "id", "phone", "updatedAt", "username" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");
CREATE UNIQUE INDEX "User_githubId_key" ON "User"("githubId");
CREATE UNIQUE INDEX "User_username_authType_key" ON "User"("username", "authType");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
