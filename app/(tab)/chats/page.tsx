import { GithubBadge } from "@/components/github";
import db from "@/lib/db";
import { getSession } from "@/lib/session";
import { Message, User } from "@prisma/client";
import { unstable_cache } from "next/cache";
import Image from "next/image";
import Link from "next/link";

async function getChatRooms(currentUserId: number) {
  const chatRooms = await db.chatRoom.findMany({
    where: {
      users: {
        some: {
          id: currentUserId,
        },
      },
    },
    select: {
      users: true,
      id: true,
      messages: {
        orderBy: {
          createdAt: "desc",
        },
        take: 1,
      },
      _count: {
        select: {
          messages: {
            where: {
              userId: {
                not: currentUserId,
              },
              read: false,
            },
          },
        },
      },
    },
  });
  return chatRooms;
}

function getCachedChatRooms(currentUserId: number) {
  return unstable_cache(getChatRooms, [], {
    tags: [`chatRooms-${currentUserId}`],
  })(currentUserId);
}

export default async function Chat() {
  const session = await getSession();
  const chatRooms = await getCachedChatRooms(session.id);

  return (
    <div className="max-w-xl w-full mx-auto flex flex-col">
      {chatRooms.map((chatRoom) => (
        <ChatRoom
          key={chatRoom.id}
          chatRoom={chatRoom}
          currentUserId={session.id}
        />
      ))}
    </div>
  );
}

interface ChatRoomProps {
  chatRoom: {
    id: string;
    users: User[];
    messages: Message[];
    _count: {
      messages: number;
    };
  };
  currentUserId: number;
}

async function ChatRoom({ chatRoom, currentUserId }: ChatRoomProps) {
  const otherUser = chatRoom.users.find((user) => user.id !== currentUserId);
  return (
    <Link
      href={`/chats/${chatRoom.id}`}
      className="flex items-center justify-between p-4 gap-2 border-b border-transparent hover:border-b-stone-800 transition"
    >
      <div className="relative rounded-full overflow-hidden bg-stone-500 size-11 shrink-0">
        {otherUser?.avatarUrl && (
          <Image
            src={otherUser?.avatarUrl!}
            alt="avatar"
            fill
            className="object-cover"
          />
        )}
      </div>
      <div className="flex flex-col w-full">
        {otherUser?.authType === "PASSWORD" && (
          <span className=" text-xs rounded-sm">{otherUser?.username}</span>
        )}
        {otherUser?.authType === "GITHUB" && (
          <div className="flex items-center gap-0.5">
            {/* <GithubIcon className="size-4 " /> */}
            <GithubBadge />
            <span className="text-xs">{otherUser?.username}</span>
          </div>
        )}
        <span className="text-sm text-stone-400">
          {chatRoom.messages[0].text}
        </span>
      </div>
      {chatRoom._count.messages > 0 && (
        <span className="text-xs font-medium px-2 py-1 rounded-full bg-orange-500">
          {chatRoom._count.messages}
        </span>
      )}
    </Link>
  );
}
