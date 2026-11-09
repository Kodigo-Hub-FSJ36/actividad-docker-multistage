"use client"; // Los error boundaries siempre son Client Components

import { useEffect } from "react";

type ErrorProps = {
  error: Error & { digest?: string };
  retry: () => void;
};

export default function ProductsError({ error, retry }: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="flex flex-col items-start gap-4 py-16">
      <h1 className="text-2xl font-semibold">No pudimos cargar el catálogo</h1>
      <p className="text-zinc-600 dark:text-zinc-400">
        Puede que la API no esté disponible en este momento. Intenta de nuevo.
      </p>
      <button
        type="button"
        onClick={() => retry()}
        className="rounded-md bg-zinc-900 px-4 py-2 text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900"
      >
        Reintentar
      </button>
    </section>
  );
}
