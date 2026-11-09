import type { MaybeWrapped } from "@/types/api";

// Type guard: le dice a TypeScript que la respuesta viene envuelta en { data }.
function isWrapped<T>(payload: MaybeWrapped<T>): payload is { data: T } {
  return typeof payload === "object" && payload !== null && !Array.isArray(payload) && "data" in payload;
}

// Devuelve el recurso sin importar si la API lo mandó directo o dentro de { data }.
export function unwrap<T>(payload: MaybeWrapped<T>): T {
  return isWrapped(payload) ? payload.data : payload;
}
