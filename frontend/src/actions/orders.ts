"use server";

import { revalidatePath, updateTag } from "next/cache";
import { apiFetch } from "@/lib/api/client";
import { isApiError } from "@/lib/api/errors";
import { PRODUCTS_TAG } from "@/lib/api/products";
import { requireToken } from "@/lib/auth/user";
import { unwrap } from "@/lib/api/unwrap";
import type { MaybeWrapped, Order } from "@/types/api";

type OrderLine = { product_id: number; quantity: number };

export type CheckoutState =
  | { status: "idle" }
  | {
      status: "error";
      message: string;
      fieldErrors?: Record<string, string[]>;
      values: { shipping_address: string; notes: string };
    }
  | { status: "success"; orderId: number };

function isOrderLine(value: unknown): value is OrderLine {
  if (typeof value !== "object" || value === null) return false;
  const line = value as Record<string, unknown>;
  return (
    Number.isInteger(line.product_id) &&
    Number.isInteger(line.quantity) &&
    (line.product_id as number) > 0 &&
    (line.quantity as number) > 0
  );
}

// El navegador solo manda ids y cantidades. Nunca precios: el total lo calcula la API.
function parseItems(raw: FormDataEntryValue | null): OrderLine[] | null {
  if (typeof raw !== "string") return null;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0 || !parsed.every(isOrderLine)) return null;
    return parsed.map(({ product_id, quantity }) => ({ product_id, quantity }));
  } catch {
    return null;
  }
}

export async function createOrder(_prev: CheckoutState, formData: FormData): Promise<CheckoutState> {
  // La Server Action se protege sola: no confiamos en que el proxy ya lo hizo.
  const token = await requireToken();

  const values = {
    shipping_address: String(formData.get("shipping_address") ?? "").trim(),
    notes: String(formData.get("notes") ?? "").trim(),
  };
  const items = parseItems(formData.get("items"));

  if (!items) {
    return { status: "error", message: "Tu carrito está vacío o no es válido.", values };
  }

  let order: Order;
  try {
    const response = await apiFetch<MaybeWrapped<Order>>("/orders", {
      method: "POST",
      token,
      body: { items, shipping_address: values.shipping_address, notes: values.notes || undefined },
    });
    order = unwrap(response);
  } catch (error) {
    if (isApiError(error)) {
      // 422: validación o stock insuficiente. Laravel explica el motivo en message.
      return { status: "error", message: error.message, fieldErrors: error.fieldErrors, values };
    }
    console.error(error);
    return { status: "error", message: "No pudimos conectar con el servidor. Intenta de nuevo.", values };
  }

  // La orden bajó el stock: borramos la caché del catálogo para que nadie vea números viejos.
  updateTag(PRODUCTS_TAG);
  // Y el historial de órdenes ya tiene una nueva.
  revalidatePath("/ordenes");

  return { status: "success", orderId: order.id };
}
