import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { PaymentSection } from "@/components/checkout/payment-section";
import { getOrder } from "@/lib/api/orders";
import { formatPrice } from "@/lib/format";

export const metadata: Metadata = { title: "Tu orden" };

export default function OrderCheckoutPage({ params }: PageProps<"/checkout/[orderId]">) {
  return (
    <section className="flex flex-col gap-6">
      <Suspense fallback={<div className="h-64 animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-800" />}>
        <OrderSummary params={params} />
      </Suspense>
    </section>
  );
}

async function OrderSummary({ params }: Pick<PageProps<"/checkout/[orderId]">, "params">) {
  const { orderId } = await params;
  const id = Number(orderId);
  const order = Number.isInteger(id) && id > 0 ? await getOrder(id) : null;

  if (!order) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">Orden #{order.id}</h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Estado: <span className="font-medium">{order.status}</span> · Envío a {order.shipping_address}
        </p>
      </header>

      <ul className="flex flex-col divide-y divide-zinc-200 rounded-lg border border-zinc-200 dark:divide-zinc-800 dark:border-zinc-800">
        {order.items?.map((item) => (
          <li key={item.id} className="flex justify-between gap-4 p-4">
            <span>
              {item.quantity} × {item.product?.name ?? `Producto #${item.product_id}`}
            </span>
            <span>{formatPrice(item.subtotal)}</span>
          </li>
        ))}
        <li className="flex justify-between p-4 text-lg font-semibold">
          <span>Total</span>
          <span>{formatPrice(order.total)}</span>
        </li>
      </ul>

      {order.status === "pending" ? (
        <PaymentSection orderId={order.id} />
      ) : (
        <p className="text-zinc-600 dark:text-zinc-400">
          Esta orden ya no admite pagos (estado: {order.status}).
        </p>
      )}
    </div>
  );
}
