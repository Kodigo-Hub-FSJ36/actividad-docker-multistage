import { NextResponse, type NextRequest } from "next/server";
import { PROTECTED_PATHS, SESSION_COOKIE } from "@/lib/auth/constants";

// Revisión optimista: solo mira si existe la cookie, sin llamar a la API.
// La validación real del token ocurre en el servidor (getCurrentUser / requireUser).
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const hasSession = request.cookies.has(SESSION_COOKIE);

  const isProtected = PROTECTED_PATHS.some((path) => pathname.startsWith(path));
  if (isProtected && !hasSession) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname + search);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/ordenes/:path*", "/checkout/:path*"],
};
