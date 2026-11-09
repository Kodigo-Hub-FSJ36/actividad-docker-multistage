"use client";

import { createContext, use, useMemo, useSyncExternalStore, type ReactNode } from "react";
import { cartStore } from "@/lib/cart/store";
import type { CartItem, CartProductInput } from "@/lib/cart/types";

type CartContextValue = {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  add: (product: CartProductInput, quantity?: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  remove: (productId: number) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  // Se suscribe al store: cada cambio (en esta pestaña u otra) vuelve a renderizar.
  const items = useSyncExternalStore(cartStore.subscribe, cartStore.getSnapshot, cartStore.getServerSnapshot);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
      totalPrice: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
      add: cartStore.add,
      updateQuantity: cartStore.updateQuantity,
      remove: cartStore.remove,
      clear: cartStore.clear,
    }),
    [items],
  );

  return <CartContext value={value}>{children}</CartContext>;
}

export function useCart(): CartContextValue {
  const context = use(CartContext);
  if (!context) {
    throw new Error("useCart debe usarse dentro de <CartProvider>");
  }
  return context;
}
