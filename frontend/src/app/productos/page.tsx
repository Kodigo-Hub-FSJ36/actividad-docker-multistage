import type { Metadata } from "next";
import { Suspense } from "react";
import { Pagination } from "@/components/products/pagination";
import { ProductCard } from "@/components/products/product-card";
import { ProductGridSkeleton } from "@/components/products/product-grid-skeleton";
import { getProducts } from "@/lib/api/products";
import { paginate, parsePage } from "@/lib/pagination";

const PER_PAGE = 8;

export const metadata: Metadata = {
  title: "Catálogo",
  description: "Explora todos los productos disponibles en Kodigo Shop.",
};

// La página no es async: el encabezado se envía al instante (static shell)
// y solo la lista espera los datos dentro de <Suspense>.
export default function ProductsPage({ searchParams }: PageProps<"/productos">) {
  return (
    <section className="flex flex-col gap-8">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Catálogo</h1>
        <p className="text-zinc-600 dark:text-zinc-400">Elige tus productos favoritos.</p>
      </header>
      <Suspense fallback={<ProductGridSkeleton count={PER_PAGE} />}>
        <ProductList searchParams={searchParams} />
      </Suspense>
    </section>
  );
}

async function ProductList({ searchParams }: Pick<PageProps<"/productos">, "searchParams">) {
  const { page } = await searchParams;
  const products = await getProducts();

  if (products.length === 0) {
    return <p className="text-zinc-600 dark:text-zinc-400">Todavía no hay productos disponibles.</p>;
  }

  const current = paginate(products, parsePage(page), PER_PAGE);

  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
        {current.items.map((product, index) => (
          <ProductCard key={product.id} product={product} eager={index < 4} />
        ))}
      </div>
      <Pagination page={current.page} totalPages={current.totalPages} basePath="/productos" />
    </div>
  );
}
