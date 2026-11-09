"use client";

import { Elements } from "@stripe/react-stripe-js";
import { useActionState } from "react";
import { startPayment, type StartPaymentState } from "@/actions/payments";
import { FormMessage } from "@/components/auth/form-message";
import { SubmitButton } from "@/components/auth/submit-button";
import { stripePromise } from "@/lib/stripe";
import { PaymentForm } from "./payment-form";

const initialState: StartPaymentState = { status: "idle" };

export function PaymentSection({ orderId }: { orderId: number }) {
  // La Server Action recibe el id de la orden ya "atado" con bind: el navegador no puede cambiarlo.
  const [state, formAction, pending] = useActionState(startPayment.bind(null, orderId), initialState);

  if (!stripePromise) {
    return <FormMessage message="Falta NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY en .env.local." />;
  }

  // Paso 2: ya tenemos el client_secret, mostramos el formulario de tarjeta de Stripe.
  if (state.status === "ready") {
    return (
      <Elements stripe={stripePromise} options={{ clientSecret: state.clientSecret, locale: "es" }}>
        <PaymentForm orderId={orderId} />
      </Elements>
    );
  }

  // Paso 1: pedirle a la API que cree el PaymentIntent.
  return (
    <form action={formAction} className="flex flex-col items-start gap-3">
      <FormMessage message={state.status === "error" ? state.message : undefined} />
      <SubmitButton pending={pending} pendingText="Preparando pago...">
        Pagar con tarjeta
      </SubmitButton>
    </form>
  );
}
