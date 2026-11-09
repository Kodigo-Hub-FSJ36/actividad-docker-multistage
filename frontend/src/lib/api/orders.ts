import "server-only";

import { requireToken } from "@/lib/auth/user";
import type { MaybeWrapped, Order } from "@/types/api";
import { apiFetch } from "./client";
import { isApiError } from "./errors";
import { unwrap } from "./unwrap";

// Las órdenes son datos de cada usuario: no usamos "use cache" (se pedirían con el token
// como parte de la llave de caché). Se consultan en cada petición.

// Historial del usuario, de la más reciente a la más antigua.
export async function getOrders(): Promise<Order[]> {
  const token = await requireToken();
  const orders = unwrap(await apiFetch<MaybeWrapped<Order[]>>("/orders", { token }));
  return [...orders].sort((a, b) => b.created_at.localeCompare(a.created_at));
}

export async function getOrder(id: number): Promise<Order | null> {
  const token = await requireToken();
  try {
    return unwrap(await apiFetch<MaybeWrapped<Order>>(`/orders/${id}`, { token }));
  } catch (error) {
    // 404: no existe. 403: existe pero es de otro usuario. Para el usuario es lo mismo.
    if (isApiError(error) && (error.status === 404 || error.status === 403)) {
      return null;
    }
    throw error;
  }
}
