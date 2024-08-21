"use client";

import Button from "@/components/button";
import Input from "@/components/input";
import Image from "next/image";
import { useEffect, useState } from "react";
import { editProduct, getProduct } from "./actions";
import { notFound } from "next/navigation";
import { useFormState } from "react-dom";

export default function UploadProduct({
  params: { id },
}: {
  params: {
    id: string;
  };
}) {
  const [editState, editAction] = useFormState(editProduct, null);

  const [defaultValues, setDefaultValues] = useState({
    title: "",
    description: "",
    price: 0,
  });

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

  const setInitialValues = async () => {
    if (isNaN(+id)) notFound();
    const product = await getProduct(+id);
    if (!product) notFound();

    setPreviewUrl(product.photoUrl);
    setDefaultValues({
      title: product.title,
      description: product.description,
      price: product.price,
    });
  };

  useEffect(() => {
    setInitialValues();
  }, []);
  return (
    <div className="max-w-xl mx-auto flex flex-col px-5">
      <span className="text-2xl font-semibold mt-16">수정하기</span>
      <form action={editAction} className="flex flex-col gap-4 mt-8">
        <input name="id" value={id} readOnly className="hidden" />
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
        {editState?.fieldErrors.photoUrl && (
          <span>{editState?.fieldErrors.photoUrl[0]}</span>
        )}
        <div className="border rounded-md border-stone-600 divide-y divide-stone-600 overflow-hidden">
          <Input
            name="title"
            type="text"
            placeholder="물품 이름"
            className="p-2.5"
            defaultValue={defaultValues.title}
          />
          <textarea
            defaultValue={defaultValues.description}
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
              defaultValue={defaultValues.price}
            />
            <span className="px-2.5 text-sm text-stone-400 py-2">원</span>
          </div>
        </div>
        <Button text="완료" />
      </form>
    </div>
  );
}
