import { formatDate, formatPrice } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

interface ProductProps {
  id: number;
  title: string;
  price: number;
  photoUrl: string;
  createdAt: Date;
  description: string;
}

export default function Product({
  id,
  title,
  price,
  photoUrl,
  createdAt,
  description,
}: ProductProps) {
  return (
    <div className="flex">
      <Link
        href={`/products/${id}`}
        className="flex-none shrink-0 relative size-56 aspect-square overflow-hidden bg-stone-600"
      >
        <Image
          src={photoUrl}
          alt={title}
          fill
          className="object-cover flex-none"
        />
      </Link>
      <div className="flex flex-col w-full px-3 py-1.5 gap-8">
        <div className="flex flex-col gap-1">
          <Link href={`/products/${id}`} className="w-fit">
            <span className="text-white text-sm font-medium">{title}</span>
          </Link>
          {description && (
            <span className="text-stone-400 text-xs break-words max-w-56">
              {description}
            </span>
          )}
        </div>

        <span className="space-x-0.5 text-white">
          <span className="text-base font-semibold">{formatPrice(price)}</span>
          <span className="text-xs">원</span>
        </span>
      </div>
    </div>
  );
}
