import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyAdminToken, SESSION_COOKIE_NAME } from "@/lib/admin/auth-token";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /admin routes
  if (pathname.startsWith("/admin")) {
    const isLoginPage = pathname === "/admin/login";
    const sessionToken = request.cookies.get(SESSION_COOKIE_NAME)?.value;
    const session = await verifyAdminToken(sessionToken);

    if (isLoginPage) {
      if (session) {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
      return NextResponse.next();
    }

    if (!session) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
