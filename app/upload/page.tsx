"use client";

import Button from "@/components/button";
import Input from "@/components/input";
import Image from "next/image";
import { useState } from "react";
import { uploadProduct } from "./action";
import { useFormState } from "react-dom";

export default function UploadProduct() {
  const [uploadState, uploadAction] = useFormState(uploadProduct, null);

  const [previewUrl, setPreviewUrl] = useState("");
  const onImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { files },
    } = event;
    if (!files) return;

    const file = files[0];
    if (!file) return;

    setPreviewUrl(URL.createObjectURL(file));
  };
  return (
    <div className="max-w-xl mx-auto flex flex-col px-5">
      <span className="text-2xl font-semibold mt-16">중고 물품 팔기</span>
      <form action={uploadAction} className="flex flex-col gap-4 mt-8">
        <label
          htmlFor="photo"
          className="bg-stone-700 aspect-video flex items-center justify-center flex-col hover:bg-stone-600 active:translate-y-px active:translate-x-px active:bg-stone-700 transition-colors cursor-pointer rounded-md relative overflow-hidden"
        >
          {previewUrl && (
            <Image src={previewUrl} fill className="object-cover" alt="image" />
          )}
        </label>
        <input
          name="photo"
          type="file"
          accept="image/*"
          id="photo"
          className="hidden"
          onChange={onImageChange}
        />
        <div className="border rounded-md border-stone-600 divide-y divide-stone-600 overflow-hidden">
          <Input
            name="title"
            type="text"
            placeholder="물품 이름"
            className="p-2.5"
          />
          <textarea
            name="description"
            placeholder="물품에 대해 알려주세요!"
            className="w-full bg-transparent border-0 resize-none focus:outline-none p-2 text-sm placeholder:text-stone-500  min-h-60"
          ></textarea>
          <div className="flex items-center">
            <Input
              name="price"
              type="number"
              className="p-2.5 pr-0"
              placeholder="가격"
            />
            <span className="px-2.5 text-sm text-stone-400 py-2">원</span>
          </div>
        </div>
        <Button text="완료" />
      </form>
    </div>
  );
}
