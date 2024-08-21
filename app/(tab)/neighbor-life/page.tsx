import db from "@/lib/db";
import { formatDate } from "@/lib/utils";
import { Prisma } from "@prisma/client";
import Link from "next/link";

async function getPosts() {
  const posts = await db.post.findMany({
    select: {
      id: true,
      title: true,
      description: true,
      createdAt: true,
      views: true,
      _count: {
        select: {
          likes: true,
          comments: true,
        },
      },
    },
  });
  return posts;
}

export default async function NeighborLife() {
  const posts = await getPosts();
  return (
    <div className="max-w-xl w-full mx-auto divide-y divide-stone-800">
      {[...posts, ...posts, ...posts].map((post) => (
        <div key={post.id} className="flex flex-col p-5 relative">
          <Link href={`/posts/${post.id}`} className="w-fit">
            <span className="text-sm">{post.title}</span>
          </Link>
          <span className="text-xs text-stone-400">{post.description}</span>
          <span className="text-xs text-stone-500">
            {formatDate(post.createdAt)}
          </span>
          <div className="flex justify-end text-xs text-stone-500 absolute bottom-5 right-5 gap-2">
            <span>조회 {post.views}</span>
            <span>댓글 {post._count.comments}</span>
            <span>좋아요 {post._count.likes}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
