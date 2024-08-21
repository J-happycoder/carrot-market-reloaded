import { MyProductList } from "@/components/product-list";
import { PlusIcon } from "@heroicons/react/16/solid";
import { getUser } from "@/lib/user";
import Link from "next/link";
import { redirect } from "next/navigation";
import db from "@/lib/db";
import { revalidateTag, unstable_cache } from "next/cache";

async function getInitialMyProducts(id: number) {
  console.log("Getting my products...");
  const myProducts = await db.product.findMany({
    where: {
      ownerId: id,
    },
    take: 5,
    orderBy: {
      createdAt: "desc",
    },
  });
  return myProducts;
}

const getCachedInitialMyProducts = unstable_cache(getInitialMyProducts, [], {
  tags: ["products"],
});

export default async function Page() {
  const user = await getUser();
  if (!user) redirect("/");
  const initialMyProducts = await getCachedInitialMyProducts(user.id);
  return (
    <div className="max-w-xl w-full mx-auto pb-24 flex flex-col">
      <MyProductList userId={user.id} initialProducts={initialMyProducts} />
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
