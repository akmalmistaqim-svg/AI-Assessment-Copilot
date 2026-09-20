import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import {
  type SessionPayload,
  signSessionPayload,
  toUserId,
  verifySessionToken,
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
// In-Memory User Store (with bcrypt hashed passwords)
// ============================================================

// Hash of "password123" with bcrypt salt rounds 10
const DEMO_PASSWORD_HASH = "$2b$10$Gc4JSVHQmoZfSQuY1YZ7MevgB5yCwyGbRO2gilVjID2ahhj4uQnjC";

const users: User[] = [
  {
    id: 1,
    name: "Dr. Budi Santoso, M.Kom",
    email: "dosen@example.com",
    password: DEMO_PASSWORD_HASH,
    role: "dosen",
  },
  {
    id: 2,
    name: "Andi Pratama",
    email: "mahasiswa@example.com",
    password: DEMO_PASSWORD_HASH,
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
 * Authenticate user by email + password using bcrypt.compare.
 * Returns user if match, otherwise undefined.
 */
export async function authenticateUser(email: string, password: string): Promise<User | undefined> {
  const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!user) return undefined;

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return undefined;

  return user;
}

/**
 * Add a new user with bcrypt-hashed password.
 * Returns the newly created user.
 */
export async function addUser(
  name: string,
  email: string,
  password: string,
  role: "dosen" | "mahasiswa",
): Promise<User> {
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser: User = {
    id: nextId++,
    name,
    email,
    password: hashedPassword,
    role,
  };
  users.push(newUser);
  return newUser;
}

// ============================================================
// Cookie Session Helpers (HMAC-SHA256 Signed)
// ============================================================

export const SESSION_COOKIE = "session";

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
 * Set session cookie on the response (via Next.js cookies() API) using HMAC-SHA256 signed token.
 */
export async function createSession(user: User): Promise<void> {
  const payload = buildSessionPayload(user);
  const signedToken = await signSessionPayload(payload);

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, signedToken, {
    httpOnly: true,
    secure: isSecureCookie,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

/**
 * Read and verify HMAC session token from the cookie. Returns null if not present or invalid.
 */
export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(SESSION_COOKIE);
  if (!cookie?.value) return null;
  return await verifySessionToken(cookie.value);
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
