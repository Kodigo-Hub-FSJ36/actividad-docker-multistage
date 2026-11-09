import Link from "next/link";

export default function Home() {
  return (
    <section className="flex flex-col items-start gap-4 py-16">
      <h1 className="text-4xl font-bold tracking-tight">Bienvenido a Kodigo Shop</h1>
      <p className="max-w-xl text-zinc-600 dark:text-zinc-400">
        Explora el catálogo, agrega productos al carrito y paga de forma segura con Stripe.
      </p>
      <Link
        href="/productos"
        className="rounded-md bg-zinc-900 px-4 py-2 text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900"
      >
        Ver catálogo
      </Link>
    </section>
  );
}
