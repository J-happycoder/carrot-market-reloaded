"use client";

import { writeComment } from "@/app/posts/[id]/actions";
import Input from "./input";
import { useOptimistic, useRef } from "react";
import { getUser } from "@/lib/user";
import { revalidateTag } from "next/cache";
import { User } from "@prisma/client";
import Image from "next/image";
import { GithubBadge } from "./github";

interface Comment {
  text: string;
  createdAt: Date;
  user: {
    username: string | null;
    authType: string;
    avatarUrl: string | null;
  };
}

interface CommentListProps {
  postId: number;
  comments: Comment[];
  user: User;
}

export default function CommentList({
  postId,
  comments,
  user,
}: CommentListProps) {
  const [optimisticComments, addOptimisticComment] = useOptimistic(
    comments,
    (previousComments, payload: Comment) => {
      return [payload, ...previousComments];
    }
  );
  const formRef = useRef<HTMLFormElement | null>(null);

  const commentAction = async (formData: FormData) => {
    const text = formData.get("text") + "";
    if (!text || text === "") return;

    formRef.current?.reset();

    addOptimisticComment({
      text,
      createdAt: new Date(),
      user: {
        username: user.username,
        avatarUrl: user.avatarUrl,
        authType: user.authType,
      },
    });

    await writeComment(
      {
        userId: user.id,
        postId,
      },
      text
    );
  };
  return (
    <div>
      <form
        ref={formRef}
        action={commentAction}
        className="fixed bottom-0 right-0 w-screen z-10 bg-stone-900 border-t border-stone-800 py-3 px-5"
      >
        <div className="max-w-xl mx-auto w-full relative flex items-center">
          <Input
            name="text"
            placeholder="댓글"
            className="border border-stone-800 px-3 py-2 rounded-md"
          />
          <button className="absolute right-1.5 px-3 py-1 rounded-lg bg-orange-500 text-xs">
            {">"}
          </button>
        </div>
      </form>

      <div className="flex flex-col gap-5">
        {optimisticComments.map((comment, index) => (
          <div key={index} className="flex gap-2">
            <div className="relative overflow-hidden size-11 rounded-full bg-stone-500">
              {comment.user.avatarUrl && (
                <Image
                  src={comment.user.avatarUrl}
                  alt="avatar"
                  fill
                  className="object-cover"
                />
              )}
            </div>
            <div className="flex flex-col gap-2">
              {comment.user.authType === "GITHUB" && (
                <div className="flex items-center gap-1">
                  <GithubBadge />
                  <span className="text-xs text-stone-200">
                    {comment.user.username}
                  </span>
                </div>
              )}
              {comment.user.authType === "PASSWORD" && (
                <span className="text-xs text-stone-200">
                  {comment.user.username}
                </span>
              )}
              <span className="text-sm">{comment.text}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
