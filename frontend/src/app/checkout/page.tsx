import type { Metadata } from "next";
import { Suspense } from "react";
import { CheckoutForm } from "@/components/checkout/checkout-form";
import { requireUser } from "@/lib/auth/user";

export const metadata: Metadata = { title: "Checkout" };

export default function CheckoutPage() {
  return (
    <section className="flex flex-col gap-8">
      <header className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">Checkout</h1>
        <Suspense fallback={<p className="h-5" />}>
          <BuyerInfo />
        </Suspense>
      </header>
      <CheckoutForm />
    </section>
  );
}

// Valida la sesión en el servidor (el proxy solo revisó que existiera la cookie).
async function BuyerInfo() {
  const user = await requireUser("/checkout");
  return <p className="text-zinc-600 dark:text-zinc-400">Comprando como {user.email}</p>;
}
