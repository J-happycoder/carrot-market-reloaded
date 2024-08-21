"use client";

import { Message, User } from "@prisma/client";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { GithubBadge } from "./github";
import Input from "./input";
import { createClient, RealtimeChannel } from "@supabase/supabase-js";
import { createChatMessage } from "@/app/chats/[id]/actions";

interface ChatListProps {
  initialMessages: (Message & { user: User })[];
  currentUser: User;
  chatRoomId: string;
  otherUser: User;
}

const SUPABASE_URL = "https://jlncpwgdjiyzxqokfkuv.supabase.co",
  SUPABASE_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpsbmNwd2dkaml5enhxb2tma3V2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjM5NzkyMjksImV4cCI6MjAzOTU1NTIyOX0.un9fiK8INO_u5ot0QteUvx_kZT0IT8KNAeNS_IFwT_I";

export default function ChatList({
  initialMessages,
  currentUser,
  chatRoomId,
  otherUser,
}: ChatListProps) {
  const [messages, setMessages] = useState(initialMessages);
  const [text, setText] = useState("");
  const channelRef = useRef<RealtimeChannel>();
  const [isOtherUserOnline, setIsOtherUserOnline] = useState<boolean>(false);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (text === "") return;

    setMessages((previousMessages: any) => [
      ...previousMessages,
      {
        id: Date.now(),
        text,
        user: currentUser,
        createdAt: new Date(),
      },
    ]);

    channelRef.current?.send({
      type: "broadcast",
      event: "message",
      payload: {
        id: Date.now(),
        text,
        user: currentUser,
      },
    });
    setText("");

    await createChatMessage({
      text,
      chatRoomId,
      userId: currentUser.id,
      otherUserId: otherUser.id,
      isOtherUserOnline,
    });
  };

  useEffect(() => {
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
    channelRef.current = supabase.channel(chatRoomId);

    channelRef.current
      .on("broadcast", { event: "message" }, ({ payload }) => {
        console.log(payload);
        setMessages((previousMessages) => [
          ...previousMessages,
          { ...payload, createdAt: new Date() },
        ]);
      })
      .on("presence", { event: "join" }, ({ key, newPresences }) => {
        if (newPresences[0].userId !== currentUser.id)
          setIsOtherUserOnline(true);
      })
      .on("presence", { event: "leave" }, ({ key, leftPresences }) => {
        if (leftPresences[0].userId !== currentUser.id)
          setIsOtherUserOnline(false);
      })
      .subscribe();

    channelRef.current.track({
      userId: currentUser.id,
    });

    return () => {
      channelRef.current?.unsubscribe();
      channelRef.current?.untrack();
    };
  }, []);
  return (
    <div className="max-w-xl mx-auto w-full flex flex-col gap-3 p-5 pb-20">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex gap-2 items-start ${
            message.user.id === currentUser.id && "justify-end"
          }`}
        >
          {message.user.id !== currentUser.id && (
            <div className="bg-stone-500 rounded-full overflow-hidden size-11 relative">
              {message.user.avatarUrl && (
                <Image
                  src={message.user.avatarUrl}
                  alt="avatar"
                  fill
                  className="object-cover"
                />
              )}
            </div>
          )}

          <div className="flex flex-col gap-1">
            {message.user.id !== currentUser.id && (
              <>
                {message.user.authType === "GITHUB" && (
                  <div className="flex items-center gap-1">
                    <GithubBadge />
                    <span className="text-xs text-stone-200">
                      {message.user.username}
                    </span>
                  </div>
                )}
                {message.user.authType === "PASSWORD" && (
                  <span className="text-xs text-stone-200">
                    {message.user.username}
                  </span>
                )}
              </>
            )}
            <div className="flex items-end gap-1.5">
              {message.user.id === currentUser.id && (
                <span className="text-xs text-stone-500">
                  {message.createdAt.toLocaleTimeString("ko-KR").slice(0, -3)}
                </span>
              )}
              <p className="text-sm bg-orange-500 text-wrap max-w-xs px-2.5 py-1.5 rounded-xl">
                {message.text}
              </p>
              {message.user.id !== currentUser.id && (
                <span className="text-xs text-stone-500">
                  {message.createdAt.toLocaleTimeString("ko-KR").slice(0, -3)}
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
      <form
        onSubmit={onSubmit}
        className="fixed bottom-0 right-0 w-screen py-2 border-t border-stone-800 bg-stone-900"
      >
        <div className="max-w-xl mx-auto w-full px-5">
          <Input
            name="message"
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="메시지를 입력하세요..."
            className="px-3 py-2 border border-stone-800 rounded-full focus:border-stone-600 focus:bg-stone-800"
          />
        </div>
      </form>
    </div>
  );
}
