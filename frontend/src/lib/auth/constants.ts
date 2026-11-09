// Compartido entre proxy.ts y el resto del servidor (sin "server-only" porque proxy.ts también lo importa).
export const SESSION_COOKIE = "session_token";

export const PROTECTED_PATHS = ["/ordenes", "/checkout"];

export const DEFAULT_REDIRECT = "/productos";

// Solo aceptamos rutas internas: evita que ?next=https://sitio-malicioso.com redirija fuera de la app.
export function safeRedirectPath(next: string | null | undefined): string {
  if (next && next.startsWith("/") && !next.startsWith("//")) {
    return next;
  }
  return DEFAULT_REDIRECT;
}
