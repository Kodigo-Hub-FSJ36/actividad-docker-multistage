import "server-only";

import { env } from "@/lib/env";
import { ApiError, type LaravelErrorBody } from "./errors";

type ApiFetchOptions = Omit<RequestInit, "body"> & {
  // Token Bearer de Sanctum/Passport; solo para endpoints protegidos
  token?: string;
  // Cualquier objeto serializable; se envía como JSON
  body?: unknown;
};

/**
 * Único punto de salida hacia la API de Laravel.
 * Solo puede usarse en el servidor (Server Components, Server Actions, Route Handlers).
 */
export async function apiFetch<T>(path: string, options: ApiFetchOptions = {}): Promise<T> {
  const { token, body, headers, ...init } = options;

  const response = await fetch(`${env.API_BASE_URL}${path}`, {
    ...init,
    headers: {
      Accept: "application/json",
      ...(body !== undefined && { "Content-Type": "application/json" }),
      ...(token && { Authorization: `Bearer ${token}` }),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  // 204 No Content: no hay JSON que leer
  if (response.status === 204) {
    return undefined as T;
  }

  const data: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    throw new ApiError(response.status, data as LaravelErrorBody | null);
  }

  return data as T;
}
