"use server";

import db from "@/lib/db";
import { getUser } from "@/lib/user";
import fs from "fs/promises";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const uploadDataSchema = z.object({
  title: z.string(),
  description: z.string(),
  price: z.coerce.number(),
  photoUrl: z.string(),
});

async function saveFile(file: File, path: string) {
  const fileData = await file.arrayBuffer();
  await fs.appendFile(path, Buffer.from(fileData));
}

export async function uploadProduct(_: any, formData: FormData) {
  const user = await getUser();
  if (!user) return;

  const photoFile = formData.get("photo");
  if (!photoFile || !(photoFile instanceof File))
    return {
      photoError: "사진을 선택해주세요.",
    };

  const now = Date.now();

  await saveFile(photoFile, `./public/${now}`);

  const uploadData = {
    photoUrl: `/${now}`,
    title: formData.get("title"),
    description: formData.get("description"),
    price: formData.get("price"),
  };

  const validated = uploadDataSchema.safeParse(uploadData);

  if (!validated.success) return validated.error.flatten();

  const product = await db.product.create({
    data: {
      ...validated.data,
      owner: {
        connect: {
          id: user!.id,
        },
      },
    },
    select: {
      id: true,
    },
  });

  revalidateTag("products");

  redirect(`/products/${product.id}`);
}
