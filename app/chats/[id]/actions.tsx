"use server";

import db from "@/lib/db";
import { revalidateTag } from "next/cache";

export async function createChatMessage({
  text,
  chatRoomId,
  userId,
  otherUserId,
  isOtherUserOnline,
}: {
  text: string;
  chatRoomId: string;
  userId: number;
  otherUserId: number;
  isOtherUserOnline: boolean;
}) {
  await db.message.create({
    data: {
      text,
      userId,
      chatRoomId,
      read: isOtherUserOnline,
    },
  });

  revalidateTag(`chatRooms-${userId}`);
  revalidateTag(`chatRooms-${otherUserId}`);
}
