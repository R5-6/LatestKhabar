import { NextResponse, type NextRequest } from "next/server";

/**
 * Middleware to protect /admin routes.
 *
 * Since Firebase Auth is client-side (no server-side session cookies by default),
 * this middleware uses a lightweight cookie-based token approach:
 *
 * 1. After successful Firebase login on the client, we set a cookie `__session`
 *    with the Firebase ID token.
 * 2. The middleware checks for the presence and basic validity of this cookie.
 * 3. For full token verification (signature check), use Firebase Admin SDK in
 *    an API route. This middleware provides a fast first-pass guard.
 *
 * The /admin/login page is always accessible to prevent redirect loops.
 */

const ADMIN_SESSION_COOKIE = "__session";

function isAdminRoute(pathname: string): boolean {
  return pathname.startsWith("/admin");
}

function isLoginPage(pathname: string): boolean {
  return pathname === "/admin/login";
}

function isStaticAsset(pathname: string): boolean {
  return (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".") // files like .ico, .png, .webp
  );
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip non-admin routes and static assets
  if (!isAdminRoute(pathname) || isStaticAsset(pathname)) {
    return NextResponse.next();
  }

  // Always allow access to the login page (prevents redirect loops)
  if (isLoginPage(pathname)) {
    const sessionToken = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
    // If user already has a session, redirect them to dashboard
    if (sessionToken) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.next();
  }

  // For all other /admin/* routes, require a valid session cookie
  const sessionToken = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;

  if (!sessionToken) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Basic JWT structure validation (3 dot-separated parts)
  const parts = sessionToken.split(".");
  if (parts.length !== 3) {
    const response = NextResponse.redirect(new URL("/admin/login", request.url));
    response.cookies.delete(ADMIN_SESSION_COOKIE);
    return response;
  }

  // Check token expiration from payload (base64 decoded)
  try {
    const payload = JSON.parse(atob(parts[1]));
    const exp = payload.exp;
    if (exp && Date.now() >= exp * 1000) {
      const response = NextResponse.redirect(new URL("/admin/login", request.url));
      response.cookies.delete(ADMIN_SESSION_COOKIE);
      return response;
    }
  } catch {
    // If token is malformed, redirect to login
    const response = NextResponse.redirect(new URL("/admin/login", request.url));
    response.cookies.delete(ADMIN_SESSION_COOKIE);
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
