import "server-only";

import { cookies } from "next/headers";
import { SESSION_COOKIE } from "./constants";

// Guarda el JWT en una cookie que JavaScript del navegador no puede leer (httpOnly).
export async function createSession(token: string, expiresInSeconds: number) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true, // document.cookie no la ve: protege contra robo por XSS
    secure: process.env.NODE_ENV === "production", // solo HTTPS en producción
    sameSite: "lax", // no se envía en peticiones de otros sitios (CSRF)
    path: "/",
    maxAge: expiresInSeconds, // expira junto con el token
  });
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function getSessionToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_COOKIE)?.value ?? null;
}
