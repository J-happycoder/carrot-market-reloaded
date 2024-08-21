/*
  Warnings:

  - You are about to drop the column `unreadMessageCount` on the `ChatRoom` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ChatRoom" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_ChatRoom" ("createdAt", "id", "updatedAt") SELECT "createdAt", "id", "updatedAt" FROM "ChatRoom";
DROP TABLE "ChatRoom";
ALTER TABLE "new_ChatRoom" RENAME TO "ChatRoom";
CREATE TABLE "new_Message" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "text" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "chatRoomId" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "Message_chatRoomId_fkey" FOREIGN KEY ("chatRoomId") REFERENCES "ChatRoom" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Message_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Message" ("chatRoomId", "createdAt", "id", "text", "updatedAt", "userId") SELECT "chatRoomId", "createdAt", "id", "text", "updatedAt", "userId" FROM "Message";
DROP TABLE "Message";
ALTER TABLE "new_Message" RENAME TO "Message";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
