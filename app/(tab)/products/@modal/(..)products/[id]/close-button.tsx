"use client";

import { useRouter } from "next/navigation";

export default function CloseButton() {
  const router = useRouter();

  const close = () => router.back();
  return (
    <button
      onClick={close}
      className="w-24 h-14 bg-stone-700 bg-opacity-50 backdrop-blur-2xl text-sm font-medium shadow-2xl rounded-full overflow-hidden hover:w-36 transition-all"
    >
      닫기
    </button>
  );
}
