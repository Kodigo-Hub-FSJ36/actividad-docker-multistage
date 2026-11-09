import "server-only";

import { redirect } from "next/navigation";
import { cache } from "react";
import { apiFetch } from "@/lib/api/client";
import { isApiError } from "@/lib/api/errors";
import { unwrap } from "@/lib/api/unwrap";
import type { MaybeWrapped, User } from "@/types/api";
import { getSessionToken } from "./session";

// Data Access Layer: el único lugar que decide quién es el usuario actual.
// cache() de React evita llamar a /auth/me varias veces en el mismo render
// (header, página, etc.), pero no guarda nada entre peticiones.
export const getCurrentUser = cache(async (): Promise<User | null> => {
  const token = await getSessionToken();
  if (!token) return null;

  try {
    return unwrap(await apiFetch<MaybeWrapped<User>>("/auth/me", { token }));
  } catch (error) {
    // Token vencido o inválido: lo tratamos como "no hay sesión".
    if (isApiError(error) && error.status === 401) return null;
    throw error;
  }
});

// Para páginas protegidas: devuelve el usuario o manda al login.
export async function requireUser(currentPath: string): Promise<User> {
  const user = await getCurrentUser();
  if (!user) {
    redirect(`/login?next=${encodeURIComponent(currentPath)}`);
  }
  return user;
}

// Para Server Actions que llaman endpoints protegidos.
export async function requireToken(): Promise<string> {
  const token = await getSessionToken();
  if (!token) {
    redirect("/login");
  }
  return token;
}
