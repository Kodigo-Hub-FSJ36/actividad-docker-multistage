<?php

namespace App\Services;

use App\Contracts\PaymentServiceInterface;
use App\Models\Order;
use App\Models\Payment;
use Stripe\PaymentIntent;
use Stripe\Stripe;
use Stripe\Exception\ApiErrorException;

class StripeService implements PaymentServiceInterface
{
    public function __construct()
    {
        Stripe::setApiKey(config('stripe.secret'));
    }

    public function createPayment(Order $order): array
    {
        try {
            $paymentIntent = PaymentIntent::create([
                'amount' => $this->convertToCents($order->total),
                'currency' => config('stripe.currency', 'usd'),
                'metadata' => [
                    'order_id' => $order->id,
                    'user_id' => $order->user_id,
                ],
                'automatic_payment_methods' => [
                    'enabled' => true,
                ],
            ]);

            return [
                'payment_id' => $paymentIntent->id,
                'client_secret' => $paymentIntent->client_secret,
                'amount' => $order->total,
                'currency' => config('stripe.currency', 'usd'),
                'status' => $paymentIntent->status,
            ];
        } catch (ApiErrorException $e) {
            throw new \Exception('Error al crear el pago: ' . $e->getMessage());
        }
    }

    public function getPaymentStatus(string $paymentId): array
    {
        try {
            // expand: pedimos el cargo completo en la misma llamada (si no, latest_charge sería solo un id "ch_...")
            $paymentIntent = PaymentIntent::retrieve([
                'id' => $paymentId,
                'expand' => ['latest_charge'],
            ]);

            $charge = $paymentIntent->latest_charge; // \Stripe\Charge o null si aún no hay cargo

            return [
                'payment_id' => $paymentIntent->id,
                'status' => $paymentIntent->status,
                'payment_method' => $charge?->payment_method_details?->type
                    ?? $paymentIntent->payment_method_types[0]
                    ?? null,
                'last4' => $charge?->payment_method_details?->card?->last4,
                'raw_data' => [
                    'payment_method_types' => $paymentIntent->payment_method_types,
                    'latest_charge' => $charge?->toArray(),
                ],
            ];
        } catch (ApiErrorException $e) {
            throw new \Exception('Error al consultar el pago: ' . $e->getMessage());
        }
    }

    public function canProcessPayment(Order $order, ?Payment $existingPayment = null): bool
    {
        if ($order->status !== 'pending') {
            return false;
        }

        if ($existingPayment && $existingPayment->status === 'succeeded') {
            return false;
        }

        return true;
    }

    public function extractPaymentDetails(array $paymentData): array
    {
        return [
            'status' => $this->mapStripeStatus($paymentData['status']),
            'payment_method' => $paymentData['payment_method'],
            'last4' => $paymentData['last4'],
            'stripe_status' => $paymentData['status'],
        ];
    }

    private function mapStripeStatus(string $stripeStatus): string
    {
        return match($stripeStatus) {
            'succeeded' => 'succeeded',
            'requires_payment_method', 'requires_confirmation', 'requires_action' => 'pending',
            'canceled' => 'failed',
            default => 'pending',
        };
    }

    private function convertToCents(float $amount): int
    {
        return (int) round($amount * 100);
    }
}
