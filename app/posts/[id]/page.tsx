import CommentList from "@/components/comment-list";
import LikeButton from "@/components/like-button";
import db from "@/lib/db";
import { getSession } from "@/lib/session";
import { getUser } from "@/lib/user";

import { unstable_cache } from "next/cache";
import Image from "next/image";
import { notFound } from "next/navigation";

async function increaseViews(postId: number) {
  const { views } = await db.post.update({
    where: {
      id: postId,
    },
    data: {
      views: {
        increment: 1,
      },
    },
    select: {
      views: true,
    },
  });
  return views;
}

async function getPost(id: number) {
  const post = await db.post.findUnique({
    where: {
      id,
    },
    include: {
      user: {
        select: {
          username: true,
          avatarUrl: true,
          authType: true,
        },
      },
    },
  });
  return post;
}

async function getCachedPost(id: number) {
  return unstable_cache(getPost, [], {
    tags: [`post-${id}`],
    revalidate: 60,
  })(id);
}

async function getLikeStatus(userId: number, postId: number) {
  await new Promise((resolve) => setTimeout(resolve, 500));
  console.log("getting like status");
  const isLiked = Boolean(
    await db.like.findUnique({
      where: {
        id: {
          postId,
          userId,
        },
      },
    })
  );

  const likeCount = await db.like.count({
    where: {
      postId,
    },
  });
  return { isLiked, likeCount };
}

function getCachedLikeStatus(userId: number, postId: number) {
  return unstable_cache(getLikeStatus, [], {
    tags: [`like-status-${postId}`],
  })(userId, postId);
}

async function getComments(postId: number) {
  const comments = await db.comment.findMany({
    where: {
      postId,
    },
    select: {
      text: true,
      createdAt: true,
      user: {
        select: {
          username: true,
          avatarUrl: true,
          authType: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return comments;
}

function getCachedComments(postId: number) {
  return unstable_cache(getComments, [], { tags: [`comments-${postId}`] })(
    postId
  );
}

export default async function Page({
  params: { id },
}: {
  params: { id: string };
}) {
  if (isNaN(+id)) return notFound();

  const user = await getUser();
  if (!user) notFound();

  const post = await getCachedPost(+id);
  if (!post) return notFound();

  const views = await increaseViews(+id);
  const comments = await getCachedComments(+id);
  const { isLiked, likeCount } = await getCachedLikeStatus(user.id, +id);

  return (
    <div className="max-w-xl w-full mx-auto">
      <div className="fixed top-0 max-w-xl w-full bg-stone-900 z-10 border-b border-stone-800">
        <div className="flex items-center gap-3 p-5">
          <div className="bg-stone-500 rounded-full size-11 overflow-hidden relative">
            {post.user.avatarUrl && (
              <Image
                src={post.user.avatarUrl}
                alt="avatar"
                fill
                className="object-cover"
              />
            )}
          </div>
          {post.user.authType === "PASSWORD" && (
            <span className=" text-xs rounded-sm">{post.user.username}</span>
          )}
          {post.user.authType === "GITHUB" && (
            <div className="flex flex-col items-start gap-0.5">
              {/* <GithubIcon className="size-4 " /> */}
              <span className="text-xs">{post.user.username}</span>

              <span className="text-xs text-stone-400 bg-stone-800 rounded-sm px-1 py-px">
                Github
              </span>
            </div>
          )}
        </div>
        <div className="h-px w-full bg-stone-800" />
        <div className="px-5 pt-12 pb-8 flex flex-col gap-5">
          <span className="text-lg font-medium">{post.title}</span>
          <span className="text-sm text-stone-200">{post.description}</span>
          <span className="text-xs text-stone-500">조회 {views}</span>
          <LikeButton isLiked={isLiked} likeCount={likeCount} postId={+id} />
        </div>
      </div>

      <div className="px-5 pt-96 pb-20">
        <CommentList user={user} postId={+id} comments={comments} />
      </div>
    </div>
  );
}
