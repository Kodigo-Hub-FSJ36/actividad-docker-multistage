import { ProductGridSkeleton } from "@/components/products/product-grid-skeleton";

// Se muestra al navegar hacia /productos mientras el segmento se renderiza.
export default function Loading() {
  return (
    <section className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <div className="h-9 w-48 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-5 w-64 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
      </div>
      <ProductGridSkeleton />
    </section>
  );
}
