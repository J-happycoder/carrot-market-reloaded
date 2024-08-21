import { GithubIcon } from "@/components/github";
import db from "@/lib/db";
import { getSession } from "@/lib/session";
import { formatDate, formatPrice } from "@/lib/utils";
import { ChatBubbleOvalLeftIcon } from "@heroicons/react/24/solid";
import { unstable_cache } from "next/cache";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

async function getProduct(id: number) {
  const product = await db.product.findUnique({
    where: {
      id,
    },
    include: {
      owner: {
        select: {
          username: true,
          avatarUrl: true,
          authType: true,
        },
      },
    },
  });
  return product;
}

function getCachedProduct(id: number) {
  return unstable_cache(getProduct, [], { tags: [`product-${id}`] })(id);
}

export default async function ProductDetail({
  params: { id },
}: {
  params: { id: string };
}) {
  if (isNaN(+id)) notFound();
  const product = await getCachedProduct(+id);
  if (!product) notFound();

  const session = await getSession();
  const isOwner = session.id ? product.ownerId === session.id : false;

  const startChat = async () => {
    "use server";
    const existingChatRoom = await db.chatRoom.findFirst({
      where: {
        users: {
          every: {
            id: {
              in: [product.ownerId, session.id],
            },
          },
        },
      },
    });
    if (existingChatRoom) return redirect(`/chats/${existingChatRoom.id}`);
    const chatRoom = await db.chatRoom.create({
      data: {
        users: {
          connect: [{ id: product.ownerId }, { id: session.id }],
        },
      },
      select: {
        id: true,
      },
    });
    redirect(`/chats/${chatRoom.id}`);
  };

  return (
    <div className="flex flex-col max-w-xl mx-auto">
      <div className="relative bg-stone-500 w-full aspect-video max-w-xl overflow-hidden">
        <Image
          src={product.photoUrl}
          alt={product.title}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-5 flex items-center gap-3">
        <div className="relative size-11 rounded-full bg-stone-500 overflow-hidden">
          {product.owner.avatarUrl && (
            <Image
              src={product.owner.avatarUrl}
              alt={product.ownerId + ""}
              fill
              className="object-cover"
            />
          )}
        </div>
        {product.owner.authType === "PASSWORD" && (
          <span className=" text-xs rounded-sm">{product.owner.username}</span>
        )}
        {product.owner.authType === "GITHUB" && (
          <div className="flex flex-col items-start gap-0.5">
            {/* <GithubIcon className="size-4 " /> */}
            <span className="text-xs">{product.owner.username}</span>

            <span className="text-xs text-stone-400 bg-stone-800 rounded-sm px-1 py-px">
              Github
            </span>
          </div>
        )}
      </div>
      <div className="h-px bg-stone-800 w-full" />
      <div className="flex flex-col px-5 py-14">
        <div className="flex justify-between items-start">
          <span className="text-xl text-white">{product.title}</span>
          <span className="text-xs text-stone-500">
            {formatDate(product.createdAt)}
          </span>
        </div>
        <div className="space-x-1 mt-3">
          <span className="text-2xl font-extrabold text-white">
            {formatPrice(product.price)}
          </span>
          <span className="text-xs text-stone-200">원</span>
        </div>
        <span className="text-sm text-stone-300 break-words mt-10">
          {product.description}
        </span>
      </div>
      {!isOwner && (
        <form action={startChat}>
          <button className="fixed bottom-0 right-0 w-screen border-t border-stone-800 z-10 border-opacity-50 text-sm font-medium text-orange-500 text-center py-4 bg-stone-900 transition hover:bg-stone-800">
            채팅하기
          </button>
        </form>
      )}
    </div>
  );
}
