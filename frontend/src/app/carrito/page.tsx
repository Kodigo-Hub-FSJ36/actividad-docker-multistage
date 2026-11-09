import type { Metadata } from "next";
import { CartView } from "@/components/cart/cart-view";

export const metadata: Metadata = { title: "Carrito" };

// El carrito vive en el navegador, así que esta página no espera a la API.
export default function CartPage() {
  return (
    <section className="flex flex-col gap-8">
      <h1 className="text-3xl font-bold tracking-tight">Carrito</h1>
      <CartView />
    </section>
  );
}
