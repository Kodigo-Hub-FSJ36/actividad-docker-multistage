import Link from "next/link";
import { unstable_rethrow } from "next/navigation";
import { logout } from "@/actions/auth";
import { getCurrentUser } from "@/lib/auth/user";
import type { User } from "@/types/api";

// Lee la cookie de sesión: por eso SiteHeader lo envuelve en <Suspense>.
export async function UserMenu() {
  // El header vive en el layout raíz, que ningún error.tsx cubre. Si la API está caída,
  // un error aquí tumbaría TODA la página. Por eso lo atrapamos y mostramos un aviso pequeño:
  // así el error.tsx de cada ruta puede encargarse del contenido principal.
  // undefined = no sabemos (la API falló); null = no hay sesión.
  let user: User | null | undefined;
  try {
    user = await getCurrentUser();
  } catch (error) {
    // Next usa errores internos (prerender, redirect...) que NO debemos tragarnos:
    // unstable_rethrow los vuelve a lanzar y deja pasar solo los errores reales.
    unstable_rethrow(error);
    console.error("No se pudo consultar la sesión:", error);
  }

  if (user === undefined) {
    return <span className="text-zinc-500">Sin conexión</span>;
  }

  if (!user) {
    return (
      <Link href="/login" className="hover:underline">
        Ingresar
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <span className="text-zinc-600 dark:text-zinc-400">Hola, {user.name.split(" ")[0]}</span>
      <form action={logout}>
        <button type="submit" className="hover:underline">
          Salir
        </button>
      </form>
    </div>
  );
}
