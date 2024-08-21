"use server";

import db from "@/lib/db";
import { revalidateTag, unstable_cache } from "next/cache";

async function getMoreMyProducts(page: number, userId: number) {
  console.log("Getting more my products");
  await new Promise((resolve) => setTimeout(resolve, 500));
  const products = await db.product.findMany({
    where: {
      ownerId: userId,
    },
    skip: (page - 1) * 5,
    take: 5,
    orderBy: {
      createdAt: "desc",
    },
  });
  return products;
}

export const getCachedMoreMyProducts = unstable_cache(getMoreMyProducts, [], {
  tags: ["products"],
});

export async function deleteProduct(id: number) {
  try {
    await db.product.delete({
      where: {
        id,
      },
    });
    revalidateTag("products");
  } catch (error) {}
}
