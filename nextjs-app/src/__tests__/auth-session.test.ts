import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  type SessionPayload,
  signSessionPayload,
  toUserId,
  verifySessionToken,
} from "@/types/auth";

describe("HMAC-SHA256 Session Token & UserId Branded Type", () => {
  const originalSecret = process.env.SESSION_SECRET;
  const TEST_SECRET = "super-secure-test-session-secret-key-32-chars-long";

  beforeEach(() => {
    process.env.SESSION_SECRET = TEST_SECRET;
  });

  afterEach(() => {
    process.env.SESSION_SECRET = originalSecret;
  });

  it("toUserId returns a branded UserId with correct value", () => {
    const userIdNum = toUserId(42);
    expect(userIdNum).toBe(42);

    const userIdAnother = toUserId(999);
    expect(userIdAnother).toBe(999);
  });

  it("signSessionPayload generates a valid two-part token (header.signature)", async () => {
    const payload: SessionPayload = {
      id: toUserId(1),
      name: "Dosen Test",
      email: "dosen@example.com",
      role: "dosen",
    };

    const token = await signSessionPayload(payload);
    expect(typeof token).toBe("string");
    const parts = token.split(".");
    expect(parts.length).toBe(2);
    expect(parts[0]?.length).toBeGreaterThan(0);
    expect(parts[1]?.length).toBeGreaterThan(0);
  });

  it("verifySessionToken successfully verifies and reconstructs payload", async () => {
    const payload: SessionPayload = {
      id: toUserId(2),
      name: "Mahasiswa Test",
      email: "mahasiswa@example.com",
      role: "mahasiswa",
    };

    const token = await signSessionPayload(payload);
    const verified = await verifySessionToken(token);

    expect(verified).not.toBeNull();
    expect(verified?.id).toBe(2);
    expect(verified?.name).toBe("Mahasiswa Test");
    expect(verified?.email).toBe("mahasiswa@example.com");
    expect(verified?.role).toBe("mahasiswa");
  });

  it("verifySessionToken rejects tampered token payload", async () => {
    const payload: SessionPayload = {
      id: toUserId(2),
      name: "Mahasiswa Test",
      email: "mahasiswa@example.com",
      role: "mahasiswa",
    };

    const token = await signSessionPayload(payload);
    const parts = token.split(".");

    // Alter payload base64 part
    const tamperedPart0 = Buffer.from(JSON.stringify({ ...payload, role: "dosen" })).toString(
      "base64url",
    );
    const tamperedToken = `${tamperedPart0}.${parts[1]}`;

    const result = await verifySessionToken(tamperedToken);
    expect(result).toBeNull();
  });

  it("verifySessionToken rejects invalid token formats", async () => {
    expect(await verifySessionToken("not-a-token")).toBeNull();
    expect(await verifySessionToken("onlyonepart")).toBeNull();
    expect(await verifySessionToken("part1.part2.part3")).toBeNull();
    expect(await verifySessionToken("")).toBeNull();
  });

  it("signSessionPayload throws error when SESSION_SECRET is not configured", async () => {
    delete process.env.SESSION_SECRET;

    const payload: SessionPayload = {
      id: toUserId(1),
      name: "Test",
      email: "test@example.com",
      role: "dosen",
    };

    await expect(signSessionPayload(payload)).rejects.toThrow(/SESSION_SECRET is not defined/);
  });
});
