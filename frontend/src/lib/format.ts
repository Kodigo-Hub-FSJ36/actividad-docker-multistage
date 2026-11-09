import type { Decimal } from "@/types/api";

const currency = new Intl.NumberFormat("es-SV", { style: "currency", currency: "USD" });

export function formatPrice(value: Decimal): string {
  return currency.format(Number(value));
}

const dateFormat = new Intl.DateTimeFormat("es-SV", { dateStyle: "medium", timeStyle: "short" });

export function formatDate(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : dateFormat.format(date);
}
