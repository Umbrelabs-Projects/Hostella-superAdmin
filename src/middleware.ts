import { NextRequest, NextResponse } from "next/server";

// Public routes can be added here if needed.
// const publicPaths = ["/", "/(auth)"];
const protectedPaths = ["/dashboard", "/chat"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("auth-token")?.value;

  const isProtected = protectedPaths.some((path) =>
    pathname.startsWith(path),
  );

  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (token && pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

// Run on all routes except Next internals and API routes.
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

