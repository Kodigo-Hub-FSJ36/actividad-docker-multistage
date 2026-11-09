import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { OrderCard } from "@/components/orders/order-card";
import { OrdersSkeleton } from "@/components/orders/orders-skeleton";
import { getOrders } from "@/lib/api/orders";

export const metadata: Metadata = { title: "Mis órdenes" };

// El título se envía al instante; la lista (la parte "pesada") llega por streaming.
export default function OrdersPage() {
  return (
    <section className="flex flex-col gap-8">
      <header className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">Mis órdenes</h1>
        <p className="text-zinc-600 dark:text-zinc-400">Tu historial de compras.</p>
      </header>
      <Suspense fallback={<OrdersSkeleton />}>
        <OrdersList />
      </Suspense>
    </section>
  );
}

async function OrdersList() {
  // getOrders() valida la sesión (requireToken) y consulta la API en cada petición.
  const orders = await getOrders();

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-start gap-4">
        <p className="text-zinc-600 dark:text-zinc-400">Todavía no has hecho ninguna compra.</p>
        <Link href="/productos" className="underline">
          Ir al catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {orders.map((order) => (
        <OrderCard key={order.id} order={order} />
      ))}
    </div>
  );
}
