"use client";

import Link from "next/link";
import { useActionState } from "react";
import { login, type AuthFormState } from "@/actions/auth";
import { FormField } from "./form-field";
import { FormMessage } from "./form-message";
import { SubmitButton } from "./submit-button";

const initialState: AuthFormState = {};

export function LoginForm({ next }: { next: string }) {
  // useActionState conecta el form con la Server Action y nos da su último resultado.
  const [state, formAction, pending] = useActionState(login, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <input type="hidden" name="next" value={next} />
      <FormMessage message={state.message} />
      <FormField
        name="email"
        label="Correo electrónico"
        type="email"
        autoComplete="email"
        required
        defaultValue={state.values?.email}
        errors={state.fieldErrors?.email}
      />
      <FormField
        name="password"
        label="Contraseña"
        type="password"
        autoComplete="current-password"
        required
        errors={state.fieldErrors?.password}
      />
      <SubmitButton pending={pending} pendingText="Ingresando...">
        Ingresar
      </SubmitButton>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        ¿No tienes cuenta?{" "}
        <Link href="/registro" className="underline">
          Regístrate
        </Link>
      </p>
    </form>
  );
}
