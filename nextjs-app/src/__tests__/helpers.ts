import { type SessionPayload, toUserId } from "@/types/auth";

export const TEST_SESSION_SECRET = "super-secure-test-session-secret-key-32-chars-long";

export function createMockSessionPayload(role: "dosen" | "mahasiswa" = "dosen"): SessionPayload {
  return {
    id: toUserId(role === "dosen" ? 1 : 2),
    name: role === "dosen" ? "Dosen Test" : "Mahasiswa Test",
    email: `${role}@example.com`,
    role,
  };
}
