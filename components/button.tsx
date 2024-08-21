"use client";

import { useFormStatus } from "react-dom";

interface ButtonProps {
  text: string;
}

export default function Button({ text }: ButtonProps) {
  const { pending } = useFormStatus();
  return (
    <button
      disabled={pending}
      className="button text-sm py-2.5 font-medium bg-orange-500 hover:bg-orange-400 disabled:bg-stone-500 disabled:text-stone-100 disabled:cursor-wait focus:outline-none active:translate-x-px active:translate-y-px active:bg-orange-500"
    >
      {pending ? "잠시 기다려주세요..." : text}
    </button>
  );
}
