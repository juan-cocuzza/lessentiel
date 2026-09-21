import { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE = "lessentiel_admin_session";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAdminLogin = pathname === "/admin/login";
  const hasSession = request.cookies.get(SESSION_COOKIE)?.value === "true";

  if (!isAdminLogin && !hasSession) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAdminLogin && hasSession) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
