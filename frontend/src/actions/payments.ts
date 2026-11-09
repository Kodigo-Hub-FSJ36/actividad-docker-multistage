"use server";

import { revalidatePath } from "next/cache";
import { apiFetch } from "@/lib/api/client";
import { isApiError } from "@/lib/api/errors";
import { requireToken } from "@/lib/auth/user";
import type { Decimal, Order, Payment } from "@/types/api";

// ---------- 1. Iniciar el pago: POST /payments/create-intent/{order} ----------

type CreateIntentResponse = {
  message: string;
  client_secret: string;
  payment_intent_id: string;
  amount: Decimal;
  currency: string;
};

export type StartPaymentState =
  | { status: "idle" }
  | { status: "ready"; clientSecret: string }
  | { status: "error"; message: string };

export async function startPayment(orderId: number): Promise<StartPaymentState> {
  const token = await requireToken();
  try {
    const intent = await apiFetch<CreateIntentResponse>(`/payments/create-intent/${orderId}`, {
      method: "POST",
      token,
    });
    // El client_secret solo permite confirmar ESTE pago desde el navegador. La clave secreta
    // de Stripe (sk_...) se queda en Laravel y nunca pasa por Next.js.
    return { status: "ready", clientSecret: intent.client_secret };
  } catch (error) {
    if (isApiError(error)) {
      // 422: la orden ya fue pagada o no puede pagarse. 500: Stripe falló en la API.
      return { status: "error", message: error.message };
    }
    console.error(error);
    return { status: "error", message: "No pudimos conectar con el servidor. Intenta de nuevo." };
  }
}

// ---------- 2. Confirmar el pago: POST /payments/confirm ----------

type ConfirmResponse = {
  message: string;
  status: string;
  payment: Payment;
  order: Order;
};

export type ConfirmPaymentState =
  | { status: "pending" }
  | { status: "success"; order: Order; last4: string | null }
  | { status: "error"; message: string };

export async function confirmPayment(orderId: number, paymentIntentId: string): Promise<ConfirmPaymentState> {
  const token = await requireToken();

  let result: ConfirmResponse;
  try {
    result = await apiFetch<ConfirmResponse>("/payments/confirm", {
      method: "POST",
      token,
      body: { payment_intent_id: paymentIntentId },
    });
  } catch (error) {
    if (isApiError(error)) {
      return { status: "error", message: error.message };
    }
    console.error(error);
    return { status: "error", message: "No pudimos confirmar el pago con el servidor. Intenta de nuevo." };
  }

  // La orden cambió de estado (pending → paid): el historial y su página deben mostrarlo.
  revalidatePath("/ordenes");
  revalidatePath(`/checkout/${orderId}`);

  if (result.status !== "succeeded") {
    return { status: "error", message: `El pago no se completó (estado: ${result.status}).` };
  }
  return { status: "success", order: result.order, last4: result.payment.last4 };
}
