"use server";

import { redirect } from "next/navigation";
import { apiFetch } from "@/lib/api/client";
import { isApiError } from "@/lib/api/errors";
import { safeRedirectPath } from "@/lib/auth/constants";
import { createSession, deleteSession, getSessionToken } from "@/lib/auth/session";
import type { AuthResponse } from "@/types/api";

// Lo que la Server Action le devuelve al formulario para mostrar errores.
export type AuthFormState = {
  message?: string;
  fieldErrors?: Record<string, string[]>;
  // Devolvemos lo escrito para no vaciar los inputs si hay error (React 19 resetea el form).
  values?: Record<string, string>;
};

function text(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

// Las contraseñas no se recortan: un espacio al inicio o al final es parte de ella.
function secret(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

// Convierte cualquier error de la API (o de red) en un estado que el formulario sabe mostrar.
function toFormState(error: unknown, values: Record<string, string>): AuthFormState {
  if (isApiError(error)) {
    return { message: error.message, fieldErrors: error.fieldErrors, values };
  }
  console.error(error);
  return { message: "No pudimos conectar con el servidor. Intenta de nuevo.", values };
}

export async function login(_prev: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const email = text(formData, "email");
  const password = secret(formData, "password");
  const next = safeRedirectPath(text(formData, "next"));

  try {
    const { token, expires_in } = await apiFetch<AuthResponse>("/auth/login", {
      method: "POST",
      body: { email, password },
    });
    await createSession(token, expires_in);
  } catch (error) {
    return toFormState(error, { email });
  }

  // redirect() lanza una excepción especial: va fuera del try/catch para que no la atrapemos.
  redirect(next);
}

export async function register(_prev: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const values = {
    name: text(formData, "name"),
    email: text(formData, "email"),
    phone: text(formData, "phone"),
  };
  const password = secret(formData, "password");
  const passwordConfirmation = secret(formData, "password_confirmation");

  if (password !== passwordConfirmation) {
    return { fieldErrors: { password_confirmation: ["Las contraseñas no coinciden."] }, values };
  }

  try {
    const { token, expires_in } = await apiFetch<AuthResponse>("/auth/register", {
      method: "POST",
      body: {
        ...values,
        phone: values.phone || undefined,
        password,
        password_confirmation: passwordConfirmation,
      },
    });
    await createSession(token, expires_in);
  } catch (error) {
    return toFormState(error, values);
  }

  redirect("/productos");
}

export async function logout() {
  const token = await getSessionToken();
  if (token) {
    // Invalida el JWT en la API. Si falla (token ya vencido), igual cerramos la sesión local.
    await apiFetch("/auth/logout", { method: "POST", token }).catch(() => undefined);
  }
  await deleteSession();
  redirect("/");
}
