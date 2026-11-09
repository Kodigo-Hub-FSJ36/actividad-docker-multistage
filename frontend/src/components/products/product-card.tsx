import Link from "next/link";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/types/api";
import { ProductImage } from "./product-image";

type ProductCardProps = {
  product: Product;
  eager?: boolean;
};

export function ProductCard({ product, eager }: ProductCardProps) {
  return (
    <Link href={`/productos/${product.id}`} className="group flex flex-col gap-3">
      <ProductImage
        src={product.image_url}
        alt={product.name}
        sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
        eager={eager}
      />
      <div className="flex flex-col gap-1">
        <h2 className="font-medium group-hover:underline">{product.name}</h2>
        <p className="text-zinc-600 dark:text-zinc-400">{formatPrice(product.price)}</p>
        {product.stock === 0 && <p className="text-sm text-red-600">Agotado</p>}
      </div>
    </Link>
  );
}
