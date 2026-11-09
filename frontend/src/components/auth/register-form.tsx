"use client";

import Link from "next/link";
import { useActionState } from "react";
import { register, type AuthFormState } from "@/actions/auth";
import { FormField } from "./form-field";
import { FormMessage } from "./form-message";
import { SubmitButton } from "./submit-button";

const initialState: AuthFormState = {};

export function RegisterForm() {
  const [state, formAction, pending] = useActionState(register, initialState);
  const errors = state.fieldErrors;

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <FormMessage message={state.message} />
      <FormField
        name="name"
        label="Nombre completo"
        autoComplete="name"
        required
        defaultValue={state.values?.name}
        errors={errors?.name}
      />
      <FormField
        name="email"
        label="Correo electrónico"
        type="email"
        autoComplete="email"
        required
        defaultValue={state.values?.email}
        errors={errors?.email}
      />
      <FormField
        name="phone"
        label="Teléfono (opcional)"
        type="tel"
        autoComplete="tel"
        defaultValue={state.values?.phone}
        errors={errors?.phone}
      />
      <FormField
        name="password"
        label="Contraseña"
        type="password"
        autoComplete="new-password"
        required
        errors={errors?.password}
      />
      <FormField
        name="password_confirmation"
        label="Confirmar contraseña"
        type="password"
        autoComplete="new-password"
        required
        errors={errors?.password_confirmation}
      />
      <SubmitButton pending={pending} pendingText="Creando cuenta...">
        Crear cuenta
      </SubmitButton>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        ¿Ya tienes cuenta?{" "}
        <Link href="/login" className="underline">
          Ingresa
        </Link>
      </p>
    </form>
  );
}
