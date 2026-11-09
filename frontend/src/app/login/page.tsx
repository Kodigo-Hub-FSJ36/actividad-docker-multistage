import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "@/components/auth/login-form";
import { safeRedirectPath } from "@/lib/auth/constants";

export const metadata: Metadata = { title: "Ingresar" };

export default function LoginPage({ searchParams }: PageProps<"/login">) {
  return (
    <section className="mx-auto flex w-full max-w-sm flex-col gap-6 py-8">
      <h1 className="text-3xl font-bold tracking-tight">Ingresar</h1>
      {/* ?next= es dato de la petición: se lee dentro de Suspense */}
      <Suspense fallback={<FormSkeleton />}>
        <LoginFormWithNext searchParams={searchParams} />
      </Suspense>
    </section>
  );
}

async function LoginFormWithNext({ searchParams }: Pick<PageProps<"/login">, "searchParams">) {
  const { next } = await searchParams;
  return <LoginForm next={safeRedirectPath(typeof next === "string" ? next : null)} />;
}

function FormSkeleton() {
  return (
    <div className="flex animate-pulse flex-col gap-4" aria-hidden>
      <div className="h-16 rounded bg-zinc-200 dark:bg-zinc-800" />
      <div className="h-16 rounded bg-zinc-200 dark:bg-zinc-800" />
      <div className="h-10 rounded bg-zinc-200 dark:bg-zinc-800" />
    </div>
  );
}
