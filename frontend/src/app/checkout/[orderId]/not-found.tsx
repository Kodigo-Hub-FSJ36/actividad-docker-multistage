import Link from "next/link";

export default function OrderNotFound() {
  return (
    <section className="flex flex-col items-start gap-4 py-16">
      <h1 className="text-2xl font-semibold">Orden no encontrada</h1>
      <p className="text-zinc-600 dark:text-zinc-400">No existe o no pertenece a tu cuenta.</p>
      <Link href="/ordenes" className="underline">
        Ver mis órdenes
      </Link>
    </section>
  );
}
