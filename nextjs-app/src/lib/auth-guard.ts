import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { SESSION_COOKIE } from "@/lib/auth";
import { decodeSessionPayload, type SessionPayload } from "@/types/auth";

/**
 * Extracts and validates the session payload from the HTTP Request cookie header,
 * or falls back to Next.js server cookies() store.
 */
export async function getSessionFromRequest(request?: Request): Promise<SessionPayload | null> {
  // 1. Try reading from the request headers if request is provided
  if (request) {
    const cookieHeader = request.headers.get("cookie");
    if (cookieHeader) {
      const match = cookieHeader
        .split(";")
        .map((c) => c.trim())
        .find((c) => c.startsWith(`${SESSION_COOKIE}=`));

      if (match) {
        const rawValue = match.substring(SESSION_COOKIE.length + 1);
        const decoded = decodeSessionPayload(decodeURIComponent(rawValue));
        if (decoded) return decoded;
      }
    }
  }

  // 2. Fallback to Next.js cookies() API
  try {
    const cookieStore = await cookies();
    const cookie = cookieStore.get(SESSION_COOKIE);
    if (cookie?.value) {
      return decodeSessionPayload(cookie.value);
    }
  } catch {
    // cookies() can only be called in Server Components or Route Handlers
  }

  return null;
}

/**
 * Enforces authentication and authorization for Dosen-only API mutations.
 * Returns { user, errorResponse: null } on success.
 * If unauthenticated -> returns 401 Unauthorized NextResponse.
 * If authenticated but not a dosen -> returns 403 Forbidden NextResponse.
 */
export async function requireDosenRole(request?: Request): Promise<{
  user: SessionPayload | null;
  errorResponse: NextResponse | null;
}> {
  const user = await getSessionFromRequest(request);

  if (!user) {
    return {
      user: null,
      errorResponse: NextResponse.json(
        { success: false, error: "Unauthorized", message: "Silakan login terlebih dahulu." },
        { status: 401 },
      ),
    };
  }

  if (user.role !== "dosen") {
    return {
      user: null,
      errorResponse: NextResponse.json(
        {
          success: false,
          error: "Forbidden",
          message: "Akses ditolak. Operasi ini hanya diizinkan untuk dosen.",
        },
        { status: 403 },
      ),
    };
  }

  return { user, errorResponse: null };
}

/**
 * Enforces authentication and authorization for Mahasiswa-only API mutations.
 * Returns { user, errorResponse: null } on success.
 * If unauthenticated -> returns 401 Unauthorized NextResponse.
 * If authenticated but not a mahasiswa -> returns 403 Forbidden NextResponse.
 */
export async function requireMahasiswaRole(request?: Request): Promise<{
  user: SessionPayload | null;
  errorResponse: NextResponse | null;
}> {
  const user = await getSessionFromRequest(request);

  if (!user) {
    return {
      user: null,
      errorResponse: NextResponse.json(
        { success: false, error: "Unauthorized", message: "Silakan login terlebih dahulu." },
        { status: 401 },
      ),
    };
  }

  if (user.role !== "mahasiswa") {
    return {
      user: null,
      errorResponse: NextResponse.json(
        {
          success: false,
          error: "Forbidden",
          message: "Akses ditolak. Operasi ini hanya diizinkan untuk mahasiswa.",
        },
        { status: 403 },
      ),
    };
  }

  return { user, errorResponse: null };
}

/**
 * Enforces authentication for any logged-in user (dosen or mahasiswa).
 */
export async function requireAuthUser(request?: Request): Promise<{
  user: SessionPayload | null;
  errorResponse: NextResponse | null;
}> {
  const user = await getSessionFromRequest(request);

  if (!user) {
    return {
      user: null,
      errorResponse: NextResponse.json(
        { success: false, error: "Unauthorized", message: "Silakan login terlebih dahulu." },
        { status: 401 },
      ),
    };
  }

  return { user, errorResponse: null };
}
