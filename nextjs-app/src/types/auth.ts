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
// Session Types & Decoder
// ============================================================

export interface SessionPayload {
  id: UserId;
  name: string;
  email: string;
  role: "dosen" | "mahasiswa";
}

/**
 * Encodes session payload to a Base64 string.
 */
export function encodeSessionPayload(payload: SessionPayload): string {
  const json = JSON.stringify(payload);
  if (typeof Buffer !== "undefined") {
    return Buffer.from(json).toString("base64");
  }
  return btoa(json);
}

/**
 * Decodes session cookie value (Base64 or JSON string).
 * Safe for use in middleware, route handlers, and server components.
 */
export function decodeSessionPayload(cookieValue: string): SessionPayload | null {
  if (!cookieValue) return null;

  try {
    let json = cookieValue;

    // If it is not a raw JSON object string, decode from base64
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
  } catch (err) {
    console.error("[Auth] Failed to decode session payload:", err);
    return null;
  }
}
