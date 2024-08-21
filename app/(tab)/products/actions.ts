"use server";

import db from "@/lib/db";
import { unstable_cache } from "next/cache";

async function getMoreProducts(page: number) {
  console.log("Getting more products...");
  await new Promise((resolve) => setTimeout(resolve, 500));
  const products = await db.product.findMany({
    select: {
      id: true,
      title: true,
      price: true,
      photoUrl: true,
      createdAt: true,
      description: true,
    },
    skip: (page - 1) * 5,
    take: 5,
    orderBy: {
      createdAt: "desc",
    },
  });
  return products;
}

export const getCachedMoreProducts = unstable_cache(getMoreProducts, [], {
  tags: ["products"],
});
