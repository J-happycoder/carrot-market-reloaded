import { ProductList } from "@/components/product-list";
import db from "@/lib/db";
import { PlusIcon } from "@heroicons/react/16/solid";
import { Prisma } from "@prisma/client";
import Link from "next/link";
import { revalidateTag, unstable_cache } from "next/cache";

async function getInitialProducts() {
  console.log("Getting initial products...");
  const products = await db.product.findMany({
    select: {
      id: true,
      title: true,
      price: true,
      photoUrl: true,
      createdAt: true,
      description: true,
    },
    take: 5,
    orderBy: {
      createdAt: "desc",
    },
  });
  return products;
}

const getCachedInitialProducts = unstable_cache(getInitialProducts, [], {
  tags: ["products"],
});

export type InitialProducts = Prisma.PromiseReturnType<
  typeof getInitialProducts
>;

export default async function Products() {
  const initialProducts = await getCachedInitialProducts();
  return (
    <div className="max-w-xl w-full mx-auto pb-24 flex flex-col">
      <ProductList initialProducts={initialProducts} />
      <div className="fixed bottom-0 right-0 w-screen">
        <div className="max-w-xl w-full bg-stone-500 mx-auto relative">
          <Link
            href="/upload"
            className="absolute bottom-24 right-5 rounded-full bg-orange-400 hover:bg-orange-500 shadow-lg transition hover:scale-105 size-10 flex justify-center items-center"
          >
            <PlusIcon className="size-6" />
          </Link>
        </div>
      </div>
    </div>
  );
}
