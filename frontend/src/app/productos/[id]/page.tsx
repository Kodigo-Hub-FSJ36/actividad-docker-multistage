import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { AddToCart } from "@/components/cart/add-to-cart";
import { ProductImage } from "@/components/products/product-image";
import { getProduct } from "@/lib/api/products";
import { formatPrice } from "@/lib/format";

// "/productos/abc" no es un id válido: lo tratamos como producto inexistente.
function parseId(raw: string): number | null {
  const id = Number(raw);
  return Number.isInteger(id) && id > 0 ? id : null;
}

// Metadata SEO por producto: título, descripción e imagen para redes sociales.
export async function generateMetadata({ params }: PageProps<"/productos/[id]">): Promise<Metadata> {
  const { id } = await params;
  const productId = parseId(id);
  const product = productId ? await getProduct(productId) : null;

  if (!product) {
    return { title: "Producto no encontrado" };
  }

  const description = product.description?.slice(0, 160) ?? `Compra ${product.name} en Kodigo Shop.`;

  return {
    title: product.name,
    description,
    openGraph: {
      title: product.name,
      description,
      images: product.image_url ? [{ url: product.image_url }] : undefined,
    },
  };
}

export default function ProductPage({ params }: PageProps<"/productos/[id]">) {
  return (
    <section className="flex flex-col gap-6">
      <Link href="/productos" className="text-sm text-zinc-600 hover:underline dark:text-zinc-400">
        ← Volver al catálogo
      </Link>
      <Suspense fallback={<ProductDetailsSkeleton />}>
        <ProductDetails params={params} />
      </Suspense>
    </section>
  );
}

async function ProductDetails({ params }: Pick<PageProps<"/productos/[id]">, "params">) {
  const { id } = await params;
  const productId = parseId(id);
  const product = productId ? await getProduct(productId) : null;

  if (!product) {
    notFound();
  }

  return (
    <article className="grid gap-8 md:grid-cols-2">
      <ProductImage
        src={product.image_url}
        alt={product.name}
        sizes="(min-width: 768px) 50vw, 100vw"
        eager
      />
      <div className="flex flex-col gap-4">
        <p className="text-xs uppercase tracking-wide text-zinc-500">SKU {product.sku}</p>
        <h1 className="text-3xl font-bold tracking-tight">{product.name}</h1>
        <p className="text-2xl">{formatPrice(product.price)}</p>
        <p className={product.stock > 0 ? "text-green-700 dark:text-green-400" : "text-red-600"}>
          {product.stock > 0 ? `${product.stock} disponibles` : "Agotado"}
        </p>
        {product.description && (
          <p className="leading-7 text-zinc-700 dark:text-zinc-300">{product.description}</p>
        )}
        {/* Solo pasamos al Client Component los datos que el carrito necesita */}
        <AddToCart
          product={{
            productId: product.id,
            name: product.name,
            price: Number(product.price),
            imageUrl: product.image_url,
            stock: product.stock,
          }}
        />
      </div>
    </article>
  );
}

function ProductDetailsSkeleton() {
  return (
    <div className="grid animate-pulse gap-8 md:grid-cols-2" aria-hidden>
      <div className="aspect-square rounded-lg bg-zinc-200 dark:bg-zinc-800" />
      <div className="flex flex-col gap-4">
        <div className="h-4 w-24 rounded bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-9 w-3/4 rounded bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-7 w-32 rounded bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-24 w-full rounded bg-zinc-200 dark:bg-zinc-800" />
      </div>
    </div>
  );
}
