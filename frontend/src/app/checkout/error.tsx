"use client";

import Link from "next/link";
import { useEffect } from "react";

type ErrorProps = {
  error: Error & { digest?: string };
  retry: () => void;
};

export default function CheckoutError({ error, retry }: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="flex flex-col items-start gap-4 py-16">
      <h1 className="text-2xl font-semibold">Hubo un problema con tu compra</h1>
      <p className="text-zinc-600 dark:text-zinc-400">
        No pudimos cargar esta parte del checkout. Tu carrito sigue guardado.
      </p>
      <div className="flex gap-4">
        <button
          type="button"
          onClick={() => retry()}
          className="rounded-md bg-zinc-900 px-4 py-2 text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900"
        >
          Reintentar
        </button>
        <Link href="/carrito" className="px-4 py-2 underline">
          Volver al carrito
        </Link>
      </div>
    </section>
  );
}
