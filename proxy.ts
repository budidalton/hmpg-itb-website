import { type NextRequest, NextResponse } from "next/server";

import { adminSessionCookieName } from "@/lib/auth/session";

const protectedPrefixes = ["/dashboard"];
const publicDashboardRoutes = ["/dashboard/login", "/dashboard/reset-password"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const requiresAuth = protectedPrefixes.some((prefix) =>
    pathname.startsWith(prefix),
  );

  if (!requiresAuth || publicDashboardRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  const hasDemoSession = Boolean(
    request.cookies.get(adminSessionCookieName)?.value,
  );
  const hasSupabaseSession = request.cookies
    .getAll()
    .some((cookie) => cookie.name.startsWith("sb-"));

  if (hasDemoSession || hasSupabaseSession) {
    return NextResponse.next();
  }

  const loginUrl = new URL("/dashboard/login", request.url);
  loginUrl.searchParams.set("next", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
