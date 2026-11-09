"use client";

import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/format";
import { useCart } from "./cart-provider";

export function CartView() {
  const { items, totalItems, totalPrice, updateQuantity, remove, clear } = useCart();

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-start gap-4">
        <p className="text-zinc-600 dark:text-zinc-400">Tu carrito está vacío.</p>
        <Link href="/productos" className="underline">
          Ir al catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
      <ul className="flex flex-col divide-y divide-zinc-200 dark:divide-zinc-800">
        {items.map((item) => (
          <li key={item.productId} className="flex gap-4 py-4">
            <div className="relative size-20 shrink-0 overflow-hidden rounded-md bg-zinc-100 dark:bg-zinc-900">
              {item.imageUrl && <Image src={item.imageUrl} alt={item.name} fill sizes="80px" className="object-cover" />}
            </div>
            <div className="flex flex-1 flex-col gap-2">
              <Link href={`/productos/${item.productId}`} className="font-medium hover:underline">
                {item.name}
              </Link>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">{formatPrice(item.price)} c/u</p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label={`Quitar una unidad de ${item.name}`}
                  onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                  className="size-8 rounded-md border border-zinc-300 disabled:opacity-40 dark:border-zinc-700"
                >
                  −
                </button>
                <span aria-live="polite" className="w-8 text-center">
                  {item.quantity}
                </span>
                <button
                  type="button"
                  aria-label={`Agregar una unidad de ${item.name}`}
                  onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                  disabled={item.quantity >= item.stock}
                  className="size-8 rounded-md border border-zinc-300 disabled:opacity-40 dark:border-zinc-700"
                >
                  +
                </button>
                <button
                  type="button"
                  onClick={() => remove(item.productId)}
                  className="ml-4 text-sm text-red-600 hover:underline"
                >
                  Eliminar
                </button>
              </div>
            </div>
            <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
          </li>
        ))}
      </ul>

      <aside className="flex h-fit flex-col gap-4 rounded-lg border border-zinc-200 p-6 dark:border-zinc-800">
        <h2 className="text-lg font-semibold">Resumen</h2>
        <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
          <span>Productos</span>
          <span>{totalItems}</span>
        </div>
        <div className="flex justify-between text-lg font-semibold">
          <span>Total</span>
          <span>{formatPrice(totalPrice)}</span>
        </div>
        <Link
          href="/checkout"
          className="rounded-md bg-zinc-900 px-4 py-2 text-center text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900"
        >
          Continuar al pago
        </Link>
        <button type="button" onClick={clear} className="text-sm text-zinc-600 hover:underline dark:text-zinc-400">
          Vaciar carrito
        </button>
      </aside>
    </div>
  );
}
