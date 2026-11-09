"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import { createOrder, type CheckoutState } from "@/actions/orders";
import { FormMessage } from "@/components/auth/form-message";
import { SubmitButton } from "@/components/auth/submit-button";
import { useCart } from "@/components/cart/cart-provider";
import { formatPrice } from "@/lib/format";

const initialState: CheckoutState = { status: "idle" };

export function CheckoutForm() {
  const { items, totalPrice, clear } = useCart();
  const router = useRouter();
  const [state, formAction, pending] = useActionState(createOrder, initialState);

  // Cuando la API confirma la orden: vaciamos el carrito y vamos a la página de la orden.
  // Es un efecto (y no código en la acción) porque el carrito vive en el navegador.
  useEffect(() => {
    if (state.status === "success") {
      clear();
      router.replace(`/checkout/${state.orderId}`);
    }
  }, [state, clear, router]);

  if (items.length === 0 && state.status !== "success") {
    return (
      <div className="flex flex-col items-start gap-4">
        <p className="text-zinc-600 dark:text-zinc-400">No hay productos en tu carrito.</p>
        <Link href="/productos" className="underline">
          Ir al catálogo
        </Link>
      </div>
    );
  }

  const errors = state.status === "error" ? state.fieldErrors : undefined;
  const values = state.status === "error" ? state.values : undefined;
  // Solo mandamos ids y cantidades: el precio y el total los calcula la API.
  const orderItems = JSON.stringify(items.map((item) => ({ product_id: item.productId, quantity: item.quantity })));

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
      <form action={formAction} className="flex flex-col gap-4">
        <input type="hidden" name="items" value={orderItems} />
        <FormMessage message={state.status === "error" ? state.message : undefined} />

        <div className="flex flex-col gap-1">
          <label htmlFor="shipping_address" className="text-sm font-medium">
            Dirección de envío
          </label>
          <textarea
            id="shipping_address"
            name="shipping_address"
            required
            rows={3}
            defaultValue={values?.shipping_address}
            aria-invalid={Boolean(errors?.shipping_address)}
            className="rounded-md border border-zinc-300 bg-transparent px-3 py-2 aria-invalid:border-red-500 dark:border-zinc-700"
          />
          {errors?.shipping_address && <p className="text-sm text-red-600">{errors.shipping_address[0]}</p>}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="notes" className="text-sm font-medium">
            Notas (opcional)
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={2}
            defaultValue={values?.notes}
            className="rounded-md border border-zinc-300 bg-transparent px-3 py-2 dark:border-zinc-700"
          />
        </div>

        <SubmitButton pending={pending || state.status === "success"} pendingText="Creando orden...">
          Confirmar orden
        </SubmitButton>
      </form>

      <aside className="flex h-fit flex-col gap-3 rounded-lg border border-zinc-200 p-6 dark:border-zinc-800">
        <h2 className="text-lg font-semibold">Tu pedido</h2>
        <ul className="flex flex-col gap-2 text-sm">
          {items.map((item) => (
            <li key={item.productId} className="flex justify-between gap-4">
              <span>
                {item.quantity} × {item.name}
              </span>
              <span>{formatPrice(item.price * item.quantity)}</span>
            </li>
          ))}
        </ul>
        <div className="flex justify-between border-t border-zinc-200 pt-3 text-lg font-semibold dark:border-zinc-800">
          <span>Total</span>
          <span>{formatPrice(totalPrice)}</span>
        </div>
        <Link href="/carrito" className="text-sm text-zinc-600 hover:underline dark:text-zinc-400">
          Editar carrito
        </Link>
      </aside>
    </div>
  );
}
