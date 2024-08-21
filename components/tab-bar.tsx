"use client";

import {
  BuildingOffice2Icon as NeighborIconSolid,
  ChatBubbleOvalLeftIcon as ChatIconSolid,
  HomeIcon as HomeIconSolid,
  UserCircleIcon as UserIconSolid,
  VideoCameraIcon as LiveIconSolid,
} from "@heroicons/react/24/solid";
import {
  BuildingOffice2Icon as NeighborIconOutline,
  ChatBubbleOvalLeftIcon as ChatIconOutline,
  HomeIcon as HomeIconOutline,
  UserCircleIcon as UserIconOutline,
  VideoCameraIcon as LiveIconOutline,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { redirect, usePathname } from "next/navigation";

const tabPathnames = {
  "/products": true,
  "/chats": true,
  "/neighbor-life": true,
  "/live-shopping": true,
  "/profile": true,
};

export default function TabBar() {
  const pathname = usePathname();
  return (
    <div className="fixed bottom-0 w-screen py-4 z-10 bg-stone-900 border-t border-t-stone-700">
      <div className="max-w-xl flex mx-auto w-full justify-between items-center">
        <Link
          href="/products"
          className="flex flex-col items-center justify-center w-full text-stone-200 hover:text-stone-50 gap-1"
        >
          {pathname === "/products" ? (
            <HomeIconSolid className="size-5" />
          ) : (
            <HomeIconOutline className="size-5" />
          )}
          <span className="text-xs ">홈</span>
        </Link>
        <Link
          href="/chats"
          className="flex flex-col items-center justify-center w-full text-stone-200 hover:text-stone-50 gap-1"
        >
          {pathname === "/chats" ? (
            <ChatIconSolid className="size-5" />
          ) : (
            <ChatIconOutline className="size-5" />
          )}
          <span className="text-xs ">채팅</span>
        </Link>
        <Link
          href="/neighbor-life"
          className="flex flex-col items-center justify-center w-full text-stone-200 hover:text-stone-50 gap-1"
        >
          {pathname === "/neighbor-life" ? (
            <NeighborIconSolid className="size-5" />
          ) : (
            <NeighborIconOutline className="size-5" />
          )}
          <span className="text-xs ">동네생활</span>
        </Link>
        <Link
          href="/live-shopping"
          className="flex flex-col items-center justify-center w-full text-stone-200 hover:text-stone-50 gap-1"
        >
          {pathname === "/live-shopping" ? (
            <LiveIconSolid className="size-5" />
          ) : (
            <LiveIconOutline className="size-5" />
          )}
          <span className="text-xs ">라이브 쇼핑</span>
        </Link>
        <Link
          href="/profile"
          className="flex flex-col items-center justify-center w-full text-stone-200 hover:text-stone-50 gap-1"
        >
          {pathname === "/profile" ? (
            <UserIconSolid className="size-5" />
          ) : (
            <UserIconOutline className="size-5" />
          )}
          <span className="text-xs ">나의 당근</span>
        </Link>
      </div>
    </div>
  );
}
