import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { PaymentConfirmation } from "@/components/checkout/payment-confirmation";

export const metadata: Metadata = { title: "Confirmación de pago" };

// Stripe redirige aquí con ?payment_intent=pi_...&redirect_status=succeeded|failed
export default function ConfirmationPage(props: PageProps<"/checkout/[orderId]/confirmacion">) {
  return (
    <section>
      <Suspense fallback={<p className="py-16 text-zinc-600">Confirmando tu pago...</p>}>
        <Confirmation {...props} />
      </Suspense>
    </section>
  );
}

async function Confirmation({ params, searchParams }: PageProps<"/checkout/[orderId]/confirmacion">) {
  const { orderId } = await params;
  const { payment_intent: paymentIntent, redirect_status: redirectStatus } = await searchParams;
  const id = Number(orderId);

  // Stripe ya nos dice que falló (por ejemplo, el banco rechazó la autenticación 3D Secure).
  if (redirectStatus === "failed" || typeof paymentIntent !== "string" || !Number.isInteger(id)) {
    return (
      <div className="flex flex-col items-start gap-4 py-16">
        <h1 className="text-2xl font-semibold text-red-600">El pago no se completó</h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Tu banco rechazó el pago o se canceló la autenticación. No se hizo ningún cargo.
        </p>
        <Link href={`/checkout/${orderId}`} className="underline">
          Intentar de nuevo
        </Link>
      </div>
    );
  }

  return <PaymentConfirmation orderId={id} paymentIntentId={paymentIntent} />;
}
