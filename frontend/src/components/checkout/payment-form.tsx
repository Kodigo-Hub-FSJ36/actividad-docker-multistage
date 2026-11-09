"use client";

import { PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useState, type FormEvent } from "react";
import { FormMessage } from "@/components/auth/form-message";
import { SubmitButton } from "@/components/auth/submit-button";

export function PaymentForm({ orderId }: { orderId: number }) {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState<string>();
  const [processing, setProcessing] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!stripe || !elements) return; // Stripe.js todavía está cargando

    setProcessing(true);
    setMessage(undefined);

    // Stripe valida la tarjeta, hace 3D Secure si hace falta y luego REDIRIGE a return_url.
    // Si vuelve aquí (no redirigió), es porque hubo un error: tarjeta rechazada, datos incompletos, etc.
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout/${orderId}/confirmacion`,
      },
    });

    setMessage(error.message ?? "No se pudo procesar el pago.");
    setProcessing(false);
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-md flex-col gap-4">
      <PaymentElement />
      <FormMessage message={message} />
      <SubmitButton pending={processing || !stripe} pendingText={stripe ? "Procesando..." : "Cargando Stripe..."}>
        Pagar ahora
      </SubmitButton>
      <p className="text-xs text-zinc-500">
        Modo prueba: usa la tarjeta 4242 4242 4242 4242, cualquier fecha futura y cualquier CVC.
      </p>
    </form>
  );
}
