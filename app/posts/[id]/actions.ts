"use server";

import db from "@/lib/db";
import { getSession } from "@/lib/session";
import { revalidateTag } from "next/cache";

export async function toggleLike(postId: number, isLiked: boolean) {
  const session = await getSession();
  ("use server");
  if (isLiked) {
    await db.like.delete({
      where: {
        id: {
          postId,
          userId: session.id,
        },
      },
    });
  } else {
    await db.like.create({
      data: {
        postId,
        userId: session.id,
      },
    });
  }
  revalidateTag(`like-status-${postId}`);
}

export async function writeComment(
  id: { postId: number; userId: number },
  text: string
) {
  await db.comment.create({
    data: {
      ...id,
      text,
    },
  });
  revalidateTag(`comments-${id.postId}`);
}
