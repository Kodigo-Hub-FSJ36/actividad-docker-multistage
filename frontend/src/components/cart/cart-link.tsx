"use client";

import Link from "next/link";
import { useCart } from "./cart-provider";

export function CartLink() {
  const { totalItems } = useCart();

  return (
    <Link href="/carrito" className="hover:underline">
      Carrito
      {totalItems > 0 && (
        <span className="ml-1 rounded-full bg-zinc-900 px-2 py-0.5 text-xs text-white dark:bg-zinc-100 dark:text-zinc-900">
          {totalItems}
        </span>
      )}
    </Link>
  );
}
