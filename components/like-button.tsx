"use client";

import { HandThumbUpIcon as SolidLikeIcon } from "@heroicons/react/24/solid";
import { HandThumbUpIcon as OutlineLikeIcon } from "@heroicons/react/24/outline";
import { toggleLike } from "@/app/posts/[id]/actions";
import { useOptimistic } from "react";

export default function LikeButton({
  isLiked,
  likeCount,
  postId,
}: {
  isLiked: boolean;
  likeCount: number;
  postId: number;
}) {
  const [optimisticState, addOptimistic] = useOptimistic(
    { isLiked, likeCount },
    (previousState, action) => ({
      isLiked: !previousState.isLiked,
      likeCount: previousState.isLiked
        ? previousState.likeCount - 1
        : previousState.likeCount + 1,
    })
  );
  const onClick = async () => {
    addOptimistic(undefined);
    await toggleLike(postId, optimisticState.isLiked);
  };
  return (
    <button
      onClick={onClick}
      className={`w-fit px-2 py-1 rounded-full border border-stone-800 hover:border-stone-700 transition-colors flex items-center gap-1`}
    >
      {optimisticState.isLiked ? (
        <SolidLikeIcon className="size-3.5 text-orange-500" />
      ) : (
        <OutlineLikeIcon className="size-3.5" />
      )}
      <span className="text-xs">{optimisticState.likeCount}</span>
    </button>
  );
}
