import Link from "next/link";
import { formatDate, formatPrice } from "@/lib/format";
import type { Order } from "@/types/api";
import { OrderStatusBadge } from "./order-status-badge";

export function OrderCard({ order }: { order: Order }) {
  const items = order.items ?? [];
  const units = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <article className="flex flex-col gap-3 rounded-lg border border-zinc-200 p-5 dark:border-zinc-800">
      <header className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <h2 className="font-semibold">Orden #{order.id}</h2>
          <OrderStatusBadge status={order.status} />
        </div>
        <p className="text-lg font-semibold">{formatPrice(order.total)}</p>
      </header>

      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        {formatDate(order.created_at)}
        {units > 0 && ` · ${units} ${units === 1 ? "producto" : "productos"}`}
        {order.payment?.last4 && ` · Tarjeta •••• ${order.payment.last4}`}
      </p>

      {items.length > 0 && (
        // <details> es nativo de HTML: se expande sin JavaScript.
        <details className="text-sm">
          <summary className="cursor-pointer text-zinc-600 hover:underline dark:text-zinc-400">Ver detalle</summary>
          <ul className="mt-2 flex flex-col gap-1">
            {items.map((item) => (
              <li key={item.id} className="flex justify-between gap-4">
                <span>
                  {item.quantity} × {item.product?.name ?? `Producto #${item.product_id}`}
                </span>
                <span>{formatPrice(item.subtotal)}</span>
              </li>
            ))}
          </ul>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">Envío a: {order.shipping_address}</p>
        </details>
      )}

      {order.status === "pending" && (
        <Link href={`/checkout/${order.id}`} className="self-start text-sm font-medium underline">
          Completar pago
        </Link>
      )}
    </article>
  );
}
