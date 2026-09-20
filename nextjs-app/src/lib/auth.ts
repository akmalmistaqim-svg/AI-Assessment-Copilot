import { cookies } from "next/headers";
import {
  decodeSessionPayload,
  encodeSessionPayload,
  type SessionPayload,
  toUserId,
} from "@/types/auth";

// ============================================================
// Types
// ============================================================

export type { SessionPayload };

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: "dosen" | "mahasiswa";
}

// ============================================================
// In-Memory User Store (replaced by DB in production)
// ============================================================

const users: User[] = [
  {
    id: 1,
    name: "Dr. Budi Santoso, M.Kom",
    email: "dosen@example.com",
    password: "password123",
    role: "dosen",
  },
  {
    id: 2,
    name: "Andi Pratama",
    email: "mahasiswa@example.com",
    password: "password123",
    role: "mahasiswa",
  },
];

let nextId = 3;

/**
 * Find a user by email (case-insensitive).
 */
export function findUserByEmail(email: string): User | undefined {
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase());
}

/**
 * Authenticate user by email + password.
 * Returns user if match, otherwise undefined.
 */
export function authenticateUser(email: string, password: string): User | undefined {
  return users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password,
  );
}

/**
 * Add a new user to the in-memory store.
 * Returns the newly created user.
 */
export function addUser(
  name: string,
  email: string,
  password: string,
  role: "dosen" | "mahasiswa",
): User {
  const newUser: User = {
    id: nextId++,
    name,
    email,
    password,
    role,
  };
  users.push(newUser);
  return newUser;
}

// ============================================================
// Cookie Session Helpers
// ============================================================

export const SESSION_COOKIE = "session";

// Secure cookie should only be enabled in production environments that are served over HTTPS.
// Never use secure: true in development or http://localhost.
const isSecureCookie =
  process.env.NODE_ENV === "production" && process.env.COOKIE_INSECURE !== "true";

/**
 * Build a session payload (strips password).
 */
export function buildSessionPayload(user: User): SessionPayload {
  return {
    id: toUserId(user.id),
    name: user.name,
    email: user.email,
    role: user.role,
  };
}

/**
 * Set session cookie on the response (via Next.js cookies() API).
 * Must be called from a Route Handler or Server Action.
 */
export async function createSession(user: User): Promise<void> {
  const payload = buildSessionPayload(user);
  const encoded = encodeSessionPayload(payload);

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, encoded, {
    httpOnly: true,
    secure: isSecureCookie,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

/**
 * Read session from the cookie. Returns null if not present or invalid.
 */
export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(SESSION_COOKIE);
  if (!cookie?.value) return null;
  return decodeSessionPayload(cookie.value);
}

/**
 * Clear the session cookie (logout).
 */
export async function clearSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, "", {
    httpOnly: true,
    secure: isSecureCookie,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}
