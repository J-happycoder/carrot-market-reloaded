"use server";

import db from "@/lib/db";
import { getUser } from "@/lib/user";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import fs from "fs/promises";
import { z } from "zod";

async function saveFile(file: File, path: string) {
  const fileData = await file.arrayBuffer();
  await fs.appendFile(path, Buffer.from(fileData));
}

const editDataSchema = z.object({
  photoUrl: z.string(),
  title: z.string(),
  description: z.string(),
  price: z.coerce.number(),
});

export async function editProduct(_: any, formData: FormData) {
  const user = await getUser();
  if (!user) return;

  const id = formData.get("id");
  if (!id || isNaN(+id)) return;

  const photoFile = formData.get("photo");

  if (!(photoFile instanceof File)) return;

  const now = Date.now();

  await saveFile(photoFile, `./public/${now}`);

  const editData = {
    photoUrl: `/${now}`,
    title: formData.get("title"),
    description: formData.get("description"),
    price: formData.get("price"),
  };

  const validated = editDataSchema.safeParse(editData);

  if (!validated.success) return validated.error.flatten();

  const product = await db.product.update({
    where: {
      id: +id,
    },
    data: validated.data,
    select: {
      id: true,
    },
  });

  revalidateTag("products");

  redirect(`/products/${product.id}`);
}

export async function getProduct(id: number) {
  const product = await db.product.findUnique({
    where: {
      id,
    },
    select: {
      title: true,
      description: true,
      photoUrl: true,
      price: true,
    },
  });
  return product;
}
