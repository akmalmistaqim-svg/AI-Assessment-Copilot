import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { decodeSessionPayload } from "@/types/auth";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get("session")?.value;

  const session = sessionCookie ? decodeSessionPayload(sessionCookie) : null;

  const isDashboardPath = pathname.startsWith("/dashboard");
  const isAuthPath = pathname === "/login" || pathname === "/register";

  // 1. Unauthenticated user trying to access /dashboard/* -> Redirect to /login
  if (isDashboardPath && !session) {
    console.warn(
      `[Middleware] BLOCKED: Unauthenticated access to "${pathname}". Redirecting to /login`,
    );
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // 2. Authenticated user trying to access /login or /register -> Redirect to role dashboard
  if (isAuthPath && session) {
    const targetDashboard = session.role === "dosen" ? "/dashboard/dosen" : "/dashboard/mahasiswa";
    console.log(
      `[Middleware] Authenticated user (${session.email}) visiting "${pathname}". Redirecting to "${targetDashboard}"`,
    );
    const dashboardUrl = new URL(targetDashboard, request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  // 3. Role-based protection on dashboard routes
  if (isDashboardPath && session) {
    // If accessing root /dashboard, redirect to the role's primary dashboard
    if (pathname === "/dashboard" || pathname === "/dashboard/") {
      const targetDashboard =
        session.role === "dosen" ? "/dashboard/dosen" : "/dashboard/mahasiswa";
      return NextResponse.redirect(new URL(targetDashboard, request.url));
    }

    // Mahasiswa trying to access /dashboard/dosen/*
    if (session.role === "mahasiswa" && pathname.startsWith("/dashboard/dosen")) {
      console.warn(
        `[Middleware] BLOCKED: Mahasiswa (${session.email}) attempted to access "${pathname}". Redirecting to /dashboard/mahasiswa`,
      );
      return NextResponse.redirect(new URL("/dashboard/mahasiswa", request.url));
    }

    // Dosen trying to access /dashboard/mahasiswa/*
    if (session.role === "dosen" && pathname.startsWith("/dashboard/mahasiswa")) {
      console.warn(
        `[Middleware] BLOCKED: Dosen (${session.email}) attempted to access "${pathname}". Redirecting to /dashboard/dosen`,
      );
      return NextResponse.redirect(new URL("/dashboard/dosen", request.url));
    }

    console.log(`[Middleware] ALLOWED: User (${session.email}, ${session.role}) -> "${pathname}"`);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/dashboard", "/login", "/register"],
};
