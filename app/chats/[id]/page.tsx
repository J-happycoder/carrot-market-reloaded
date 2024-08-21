import ChatList from "@/components/chat-list";
import db from "@/lib/db";
import { getSession } from "@/lib/session";
import { getUser } from "@/lib/user";
import { revalidateTag } from "next/cache";
import { notFound, redirect } from "next/navigation";

async function getChatRoom(id: string) {
  const room = await db.chatRoom.findUnique({
    where: {
      id,
    },
    include: {
      users: true,
      messages: {
        include: {
          user: true,
        },
      },
    },
  });
  return room;
}

async function readMessages({
  chatRoomId,
  currentUserId,
  otherUserId,
}: {
  chatRoomId: string;
  currentUserId: number;
  otherUserId: number;
}) {
  await db.message.updateMany({
    where: {
      chatRoomId,
      userId: {
        not: currentUserId,
      },
    },
    data: {
      read: true,
    },
  });

  revalidateTag(`chatRooms-${currentUserId}`);
  revalidateTag(`chatRooms-${otherUserId}`);
}

export default async function Chat({
  params: { id },
}: {
  params: { id: string };
}) {
  const chatRoom = await getChatRoom(id);
  if (!chatRoom) return notFound();
  const currentUser = await getUser();
  if (!currentUser) return redirect("/");

  const otherUser = chatRoom.users.find((user) => user.id !== currentUser.id);
  if (!otherUser) return redirect("/products");

  await readMessages({
    chatRoomId: id,
    currentUserId: currentUser.id,
    otherUserId: otherUser.id,
  });

  return (
    <ChatList
      initialMessages={chatRoom.messages}
      currentUser={currentUser}
      otherUser={otherUser!}
      chatRoomId={chatRoom.id}
    />
  );
}
