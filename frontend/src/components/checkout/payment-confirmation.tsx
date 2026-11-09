"use client";

import Link from "next/link";
import { startTransition, useActionState, useEffect, useRef } from "react";
import { confirmPayment, type ConfirmPaymentState } from "@/actions/payments";
import { formatPrice } from "@/lib/format";

type Props = {
  orderId: number;
  paymentIntentId: string;
};

export function PaymentConfirmation({ orderId, paymentIntentId }: Props) {
  const [state, dispatch] = useActionState<ConfirmPaymentState>(
    () => confirmPayment(orderId, paymentIntentId),
    { status: "pending" },
  );

  // Confirmamos una sola vez al llegar desde Stripe. El ref evita la doble llamada
  // que hace React en desarrollo (Strict Mode ejecuta los efectos dos veces).
  const started = useRef(false);
  useEffect(() => {
    if (started.current) return;
    started.current = true;
    startTransition(() => dispatch());
  }, [dispatch]);

  if (state.status === "pending") {
    return (
      <div role="status" className="flex flex-col gap-2 py-16">
        <h1 className="text-2xl font-semibold">Confirmando tu pago...</h1>
        <p className="text-zinc-600 dark:text-zinc-400">No cierres esta página.</p>
      </div>
    );
  }

  if (state.status === "error") {
    return (
      <div className="flex flex-col items-start gap-4 py-16">
        <h1 className="text-2xl font-semibold text-red-600">El pago no se completó</h1>
        <p className="text-zinc-600 dark:text-zinc-400">{state.message}</p>
        <p className="text-zinc-600 dark:text-zinc-400">Tu orden #{orderId} sigue pendiente y no se hizo ningún cargo.</p>
        <Link
          href={`/checkout/${orderId}`}
          className="rounded-md bg-zinc-900 px-4 py-2 text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900"
        >
          Intentar de nuevo
        </Link>
      </div>
    );
  }

  const { order, last4 } = state;
  return (
    <div className="flex flex-col items-start gap-4 py-16">
      <p className="text-4xl" aria-hidden>
        ✓
      </p>
      <h1 className="text-3xl font-bold tracking-tight">¡Gracias por tu compra!</h1>
      <p className="text-zinc-600 dark:text-zinc-400">
        Recibimos el pago de tu orden #{order.id} por {formatPrice(order.total)}
        {last4 ? ` con la tarjeta terminada en ${last4}` : ""}.
      </p>
      <p className="text-zinc-600 dark:text-zinc-400">La enviaremos a: {order.shipping_address}</p>
      <div className="flex gap-4">
        <Link
          href="/ordenes"
          className="rounded-md bg-zinc-900 px-4 py-2 text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900"
        >
          Ver mis órdenes
        </Link>
        <Link href="/productos" className="px-4 py-2 underline">
          Seguir comprando
        </Link>
      </div>
    </div>
  );
}
