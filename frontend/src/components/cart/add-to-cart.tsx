"use client";

import { useState } from "react";
import type { CartProductInput } from "@/lib/cart/types";
import { useCart } from "./cart-provider";

export function AddToCart({ product }: { product: CartProductInput }) {
  const { items, add } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const inCart = items.find((item) => item.productId === product.productId)?.quantity ?? 0;
  const available = product.stock - inCart;

  if (product.stock === 0) {
    return <p className="text-red-600">Este producto está agotado.</p>;
  }

  function handleAdd() {
    add(product, quantity);
    setQuantity(1);
    setAdded(true);
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <label htmlFor="quantity" className="text-sm">
          Cantidad
        </label>
        <input
          id="quantity"
          type="number"
          min={1}
          max={Math.max(available, 1)}
          value={quantity}
          onChange={(event) => setQuantity(Math.max(1, Math.min(Number(event.target.value) || 1, available)))}
          className="w-20 rounded-md border border-zinc-300 bg-transparent px-3 py-2 dark:border-zinc-700"
        />
        <button
          type="button"
          onClick={handleAdd}
          disabled={available <= 0}
          className="rounded-md bg-zinc-900 px-4 py-2 text-white hover:bg-zinc-700 disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900"
        >
          Agregar al carrito
        </button>
      </div>
      <p aria-live="polite" className="text-sm text-zinc-600 dark:text-zinc-400">
        {available <= 0
          ? "Ya tienes en el carrito todas las unidades disponibles."
          : added
            ? `Agregado. Tienes ${inCart} en el carrito.`
            : null}
      </p>
    </div>
  );
}
