import Link from "next/link";

export default function ProductNotFound() {
  return (
    <section className="flex flex-col items-start gap-4 py-16">
      <h1 className="text-2xl font-semibold">Producto no encontrado</h1>
      <p className="text-zinc-600 dark:text-zinc-400">Puede que se haya retirado del catálogo.</p>
      <Link href="/productos" className="underline">
        Volver al catálogo
      </Link>
    </section>
  );
}
