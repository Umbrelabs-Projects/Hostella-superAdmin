import { NextRequest, NextResponse } from "next/server";

// Public routes can be added here if needed.
// const publicPaths = ["/", "/(auth)"];
const protectedPaths = ["/dashboard", "/super-admin"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("auth-token")?.value;

  const isProtected = protectedPaths.some((path) => pathname.startsWith(path));

  // If trying to access a protected route without token, redirect to login
  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // If user has token and is on login page, allow them through
  // (they might be rehydrating; let client handle redirect)
  if (token && pathname === "/") {
    return NextResponse.next();
  }

  return NextResponse.next();
}

// Run on all routes except Next internals and API routes.
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
