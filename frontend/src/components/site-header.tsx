import Link from "next/link";
import { Suspense } from "react";
import { CartLink } from "./cart/cart-link";
import { UserMenu } from "./user-menu";

const links = [
  { href: "/productos", label: "Catálogo" },
  { href: "/ordenes", label: "Mis órdenes" },
];

export function SiteHeader() {
  return (
    <header className="border-b border-zinc-200 dark:border-zinc-800">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-lg font-semibold">
          Kodigo Shop
        </Link>
        <ul className="flex items-center gap-4 text-sm">
          {links.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="hover:underline">
                {link.label}
              </Link>
            </li>
          ))}
          <li>
            <CartLink />
          </li>
          <li>
            {/* El resto del header es estático; solo esta parte espera la sesión */}
            <Suspense fallback={<span className="inline-block h-4 w-16" />}>
              <UserMenu />
            </Suspense>
          </li>
        </ul>
      </nav>
    </header>
  );
}
