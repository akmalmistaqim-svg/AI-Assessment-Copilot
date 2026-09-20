import { z } from "zod";

// ============================================================
// Schemas
// ============================================================

export const LoginRequestSchema = z.object({
  email: z.string().trim().min(1, "Email wajib diisi.").email("Format email tidak valid."),
  password: z.string().min(1, "Password wajib diisi."),
});

export type LoginRequest = z.infer<typeof LoginRequestSchema>;

export const LoginResponseSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
  user: z
    .object({
      id: z.number(),
      name: z.string(),
      email: z.string(),
      role: z.enum(["dosen", "mahasiswa"]),
    })
    .optional(),
  redirectTo: z.string().optional(),
});

export type LoginResponse = z.infer<typeof LoginResponseSchema>;

export const RegisterRequestSchema = z.object({
  name: z.string().trim().min(2, "Nama minimal 2 karakter."),
  email: z.string().trim().min(1, "Email wajib diisi.").email("Format email tidak valid."),
  password: z.string().min(8, "Password minimal 8 karakter."),
  role: z.enum(["dosen", "mahasiswa"]),
});

export type RegisterRequest = z.infer<typeof RegisterRequestSchema>;

// ============================================================
// Branded Types
// ============================================================

declare const __brand: unique symbol;
export type Brand<K, T> = K & { readonly [__brand]: T };

export type UserId = Brand<number, "UserId">;

export function toUserId(id: number): UserId {
  return id as UserId;
}

// ============================================================
// Session Types & Web Crypto HMAC-SHA256 Signature
// ============================================================

export interface SessionPayload {
  id: UserId;
  name: string;
  email: string;
  role: "dosen" | "mahasiswa";
}

function getSessionSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error(
      "CRITICAL: Environment variable SESSION_SECRET is not defined. Please configure SESSION_SECRET.",
    );
  }
  return secret;
}

async function getCryptoKey(secret: string): Promise<CryptoKey> {
  const enc = new TextEncoder();
  return await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

function base64UrlEncode(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    const byte = bytes[i];
    if (byte !== undefined) {
      binary += String.fromCharCode(byte);
    }
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlDecode(str: string): Uint8Array {
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4 !== 0) {
    base64 += "=";
  }
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

/**
 * Signs session payload to an HMAC-SHA256 signed token.
 */
export async function signSessionPayload(payload: SessionPayload): Promise<string> {
  const secret = getSessionSecret();
  const key = await getCryptoKey(secret);
  const enc = new TextEncoder();
  const payloadJson = JSON.stringify(payload);
  const payloadB64 = base64UrlEncode(enc.encode(payloadJson));

  const signatureBuffer = await crypto.subtle.sign("HMAC", key, enc.encode(payloadB64));
  const signatureB64 = base64UrlEncode(new Uint8Array(signatureBuffer));

  return `${payloadB64}.${signatureB64}`;
}

/**
 * Verifies an HMAC-SHA256 signed session token.
 * Compatible with Edge runtime and Node.js Web Crypto API.
 */
export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  if (!token || typeof token !== "string") return null;
  const parts = token.split(".");
  if (parts.length !== 2) return null;

  const [payloadB64, signatureB64] = parts;
  if (!payloadB64 || !signatureB64) return null;

  try {
    const secret = getSessionSecret();
    const key = await getCryptoKey(secret);
    const enc = new TextEncoder();

    const signatureBytes = base64UrlDecode(signatureB64);
    const isValid = await crypto.subtle.verify(
      "HMAC",
      key,
      signatureBytes as BufferSource,
      enc.encode(payloadB64),
    );

    if (!isValid) {
      console.warn("[Auth] Invalid HMAC session token signature");
      return null;
    }

    const payloadBytes = base64UrlDecode(payloadB64);
    const dec = new TextDecoder();
    const payloadJson = dec.decode(payloadBytes);
    const parsed = JSON.parse(payloadJson) as Record<string, unknown>;

    if (
      typeof parsed === "object" &&
      parsed !== null &&
      "id" in parsed &&
      "role" in parsed &&
      (parsed.role === "dosen" || parsed.role === "mahasiswa")
    ) {
      return {
        id: toUserId(Number(parsed.id)),
        name: String(parsed.name ?? ""),
        email: String(parsed.email ?? ""),
        role: parsed.role,
      };
    }
    return null;
  } catch (err) {
    if (err instanceof Error && err.message.includes("SESSION_SECRET")) {
      throw err;
    }
    console.error("[Auth] Failed to verify session token:", err);
    return null;
  }
}

/**
 * Backward compatibility helper for legacy scripts.
 */
export function encodeSessionPayload(payload: SessionPayload): string {
  const json = JSON.stringify(payload);
  if (typeof Buffer !== "undefined") {
    return Buffer.from(json).toString("base64");
  }
  return btoa(json);
}

/**
 * Backward compatibility helper for legacy scripts.
 */
export function decodeSessionPayload(cookieValue: string): SessionPayload | null {
  if (!cookieValue) return null;

  try {
    let json = cookieValue;
    if (!cookieValue.trim().startsWith("{")) {
      if (typeof Buffer !== "undefined") {
        json = Buffer.from(cookieValue, "base64").toString("utf-8");
      } else if (typeof atob === "function") {
        json = atob(cookieValue);
      }
    }

    const parsed: unknown = JSON.parse(json);
    if (typeof parsed === "object" && parsed !== null && "id" in parsed && "role" in parsed) {
      const obj = parsed as Record<string, unknown>;
      if (obj.role === "dosen" || obj.role === "mahasiswa") {
        return {
          id: toUserId(Number(obj.id)),
          name: String(obj.name ?? ""),
          email: String(obj.email ?? ""),
          role: obj.role as "dosen" | "mahasiswa",
        };
      }
    }
    return null;
  } catch {
    return null;
  }
}
