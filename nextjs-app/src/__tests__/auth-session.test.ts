import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { signSessionPayload, toUserId, verifySessionToken } from "@/types/auth";
import { createMockSessionPayload, TEST_SESSION_SECRET } from "./helpers";

describe("HMAC-SHA256 Session Token & UserId Branded Type", () => {
  const originalSecret = process.env.SESSION_SECRET;

  beforeEach(() => {
    process.env.SESSION_SECRET = TEST_SESSION_SECRET;
  });

  afterEach(() => {
    process.env.SESSION_SECRET = originalSecret;
  });

  it("toUserId returns a branded UserId with correct value", () => {
    expect(toUserId(42)).toBe(42);
    expect(toUserId(999)).toBe(999);
  });

  it("signSessionPayload generates a valid two-part token (header.signature)", async () => {
    const payload = createMockSessionPayload("dosen");
    const token = await signSessionPayload(payload);
    expect(typeof token).toBe("string");
    const parts = token.split(".");
    expect(parts.length).toBe(2);
    expect(parts[0]?.length).toBeGreaterThan(0);
    expect(parts[1]?.length).toBeGreaterThan(0);
  });

  it("verifySessionToken successfully verifies and reconstructs payload", async () => {
    const payload = createMockSessionPayload("mahasiswa");
    const token = await signSessionPayload(payload);
    const verified = await verifySessionToken(token);

    expect(verified).not.toBeNull();
    expect(verified?.id).toBe(2);
    expect(verified?.name).toBe("Mahasiswa Test");
    expect(verified?.email).toBe("mahasiswa@example.com");
    expect(verified?.role).toBe("mahasiswa");
  });

  it("verifySessionToken rejects tampered token payload", async () => {
    const payload = createMockSessionPayload("mahasiswa");
    const token = await signSessionPayload(payload);
    const parts = token.split(".");

    const tamperedPart0 = Buffer.from(JSON.stringify({ ...payload, role: "dosen" })).toString(
      "base64url",
    );
    const tamperedToken = `${tamperedPart0}.${parts[1]}`;

    const result = await verifySessionToken(tamperedToken);
    expect(result).toBeNull();
  });

  it("verifySessionToken rejects invalid token formats", async () => {
    const invalidTokens = ["not-a-token", "onlyonepart", "part1.part2.part3", ""];
    for (const invalid of invalidTokens) {
      expect(await verifySessionToken(invalid)).toBeNull();
    }
  });

  it("signSessionPayload throws error when SESSION_SECRET is not configured", async () => {
    delete process.env.SESSION_SECRET;
    const payload = createMockSessionPayload("dosen");
    await expect(signSessionPayload(payload)).rejects.toThrow(/SESSION_SECRET is not defined/);
  });
});
