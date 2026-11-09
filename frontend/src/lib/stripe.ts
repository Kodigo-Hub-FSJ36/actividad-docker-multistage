import { loadStripe } from "@stripe/stripe-js";

// La clave publicable (pk_test_...) sí puede llegar al navegador: por eso lleva NEXT_PUBLIC_.
const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

// Se crea una sola vez a nivel de módulo: loadStripe descarga Stripe.js y no debe repetirse en cada render.
export const stripePromise = publishableKey ? loadStripe(publishableKey) : null;
