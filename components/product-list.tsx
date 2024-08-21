"use client";

import { InitialProducts } from "@/app/(tab)/products/page";
import { useEffect, useRef, useState } from "react";
import Product from "./product";
import { getCachedMoreProducts } from "@/app/(tab)/products/actions";
import {
  deleteProduct,
  getCachedMoreMyProducts,
} from "@/app/profile/products/actions";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface ProductListProps {
  initialProducts: InitialProducts;
}

export function ProductList({ initialProducts }: ProductListProps) {
  const [products, setProducts] = useState(initialProducts);
  const triggerRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(1);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    if (finished || !triggerRef.current) return;

    const observer = new IntersectionObserver(
      async (
        entries: IntersectionObserverEntry[],
        observer: IntersectionObserver
      ) => {
        if (entries[0].isIntersecting && triggerRef.current) {
          observer.unobserve(triggerRef.current);
          const newProducts = await getCachedMoreProducts(page + 1);
          if (newProducts.length === 0) return setFinished(true);
          setProducts((prev) => [...prev, ...newProducts]);
          setPage((prev) => prev + 1);
        }
      }
    );
    observer.observe(triggerRef.current);
    return () => {
      observer.disconnect();
    };
  }, [page, finished]);
  return (
    <div className="flex flex-col gap-px">
      <div className="flex flex-col divide-y divide-stone-800">
        {products.map((product) => (
          <Product key={product.id} {...product} />
        ))}
      </div>
      {!finished && (
        <div
          ref={triggerRef}
          className={
            "mx-auto size-6 border-[3px] border-stone-400 border-b-transparent rounded-full animate-spin"
          }
        ></div>
      )}
    </div>
  );
}

export function MyProductList({
  initialProducts,
  userId,
}: ProductListProps & { userId: number }) {
  const router = useRouter();

  const [products, setProducts] = useState(initialProducts);
  const triggerRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(1);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    if (finished || !triggerRef.current) return;

    const observer = new IntersectionObserver(
      async (
        entries: IntersectionObserverEntry[],
        observer: IntersectionObserver
      ) => {
        if (entries[0].isIntersecting && triggerRef.current) {
          observer.unobserve(triggerRef.current);
          const newProducts = await getCachedMoreMyProducts(page + 1, userId);
          if (newProducts.length === 0) return setFinished(true);
          setProducts((prev) => [...prev, ...newProducts]);
          setPage((prev) => prev + 1);
        }
      }
    );
    observer.observe(triggerRef.current);
    return () => {
      observer.disconnect();
    };
  }, [page, finished, userId]);
  return (
    <div className="flex flex-col gap-px">
      <div className="flex flex-col divide-y divide-stone-800">
        {products.map((product) => (
          <div key={product.id} className="relative">
            <Product key={product.id} {...product} />
            <div className="flex items-center absolute right-0 bottom-0 gap-3 text-xs font-medium p-1">
              <Link href={`/products/${product.id}/edit`}>수정</Link>
              <button
                onClick={async () => {
                  await deleteProduct(product.id);
                }}
                className="bg-red-600 hover:bg-transparent transition border border-red-600 hover:text-red-600 px-3 py-1 rounded-sm"
              >
                삭제
              </button>
            </div>
          </div>
        ))}
      </div>
      {!finished && (
        <div
          ref={triggerRef}
          className={
            "mx-auto size-6 border-[3px] border-stone-400 border-b-transparent rounded-full animate-spin"
          }
        ></div>
      )}
    </div>
  );
}
