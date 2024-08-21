import db from "@/lib/db";
import { getSession } from "@/lib/session";
import { formatDate, formatPrice } from "@/lib/utils";
import Image from "next/image";
import { notFound } from "next/navigation";
import CloseButton from "./close-button";

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

export default async function Page({
  params: { id },
}: {
  params: { id: string };
}) {
  if (isNaN(+id)) notFound();
  const product = await getProduct(+id);
  if (!product) notFound();

  const session = await getSession();
  const isOwner = session.id ? product.ownerId === session.id : false;
  return (
    <div className="fixed top-0 left-0 w-screen h-screen backdrop-blur-xl backdrop-brightness-75 z-50 flex items-center justify-center p-20">
      <div className="max-w-xl w-full flex flex-col relative bg-stone-800 bg-opacity-40 shadow-2xl">
        <div className="relative w-full aspect-square sm:aspect-video">
          <Image
            src={product.photoUrl}
            alt={product.title}
            fill
            className="object-cover"
          />
        </div>
        <div className="px-8 py-20 flex flex-col">
          <div className="flex justify-between mb-1">
            <span className="text-4xl font-bold">{product.title}</span>
            <span className="space-x-0.5 flex-none">
              <span className="font-bold">{formatPrice(product.price)}</span>
              <span className="text-xs">원</span>
            </span>
          </div>
          <span className="text-xs text-stone-400 mb-5">
            {formatDate(product.createdAt)}
          </span>
          <span className="text-sm text-stone-200 break-words">
            {product.description}
          </span>
        </div>
        <div className="absolute w-full flex justify-center -bottom-7 left-0">
          <CloseButton />
        </div>
      </div>
    </div>
  );
}
