import type { Metadata } from "next";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = { title: "Crear cuenta" };

export default function RegisterPage() {
  return (
    <section className="mx-auto flex w-full max-w-sm flex-col gap-6 py-8">
      <h1 className="text-3xl font-bold tracking-tight">Crear cuenta</h1>
      <RegisterForm />
    </section>
  );
}
