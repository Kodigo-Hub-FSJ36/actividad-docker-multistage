"use client"; // Último recurso: atrapa errores del layout raíz, donde ningún error.tsx llega.

import "./globals.css";

type GlobalErrorProps = {
  error: Error & { digest?: string };
  retry: () => void;
};

// Reemplaza al layout raíz completo, por eso debe incluir <html> y <body>.
export default function GlobalError({ error, retry }: GlobalErrorProps) {
  console.error(error);

  return (
    <html lang="es">
      <body className="flex min-h-screen flex-col items-start justify-center gap-4 p-8">
        <h1 className="text-2xl font-semibold">Algo salió mal</h1>
        <p className="text-zinc-600">No pudimos cargar la tienda. Revisa tu conexión e intenta de nuevo.</p>
        <button
          type="button"
          onClick={() => retry()}
          className="rounded-md bg-zinc-900 px-4 py-2 text-white hover:bg-zinc-700"
        >
          Reintentar
        </button>
      </body>
    </html>
  );
}
