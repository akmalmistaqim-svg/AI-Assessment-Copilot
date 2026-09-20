import { describe, expect, it } from "vitest";
import { addUser, authenticateUser, buildSessionPayload, findUserByEmail } from "@/lib/auth";

describe("Auth Library Helpers (Password Hashing & User Management)", () => {
  it("findUserByEmail locates existing user case-insensitively", () => {
    const user1 = findUserByEmail("DOSEN@example.com");
    expect(user1).toBeDefined();
    expect(user1?.email).toBe("dosen@example.com");

    const user2 = findUserByEmail("Mahasiswa@Example.Com");
    expect(user2).toBeDefined();
    expect(user2?.email).toBe("mahasiswa@example.com");
  });

  it("findUserByEmail returns undefined for non-existent email", () => {
    const user = findUserByEmail("unknown@example.com");
    expect(user).toBeUndefined();
  });

  it("authenticateUser succeeds for existing demo users with default password", async () => {
    const user = await authenticateUser("dosen@example.com", "password123");
    expect(user).toBeDefined();
    expect(user?.role).toBe("dosen");
  });

  it("authenticateUser fails when password is incorrect", async () => {
    const user = await authenticateUser("dosen@example.com", "wrongpassword");
    expect(user).toBeUndefined();
  });

  it("authenticateUser fails when user does not exist", async () => {
    const user = await authenticateUser("ghost@example.com", "password123");
    expect(user).toBeUndefined();
  });

  it("addUser creates user with bcrypt hash and can subsequently authenticate", async () => {
    const uniqueEmail = `test_${Date.now()}@example.com`;
    const created = await addUser("Test New User", uniqueEmail, "mypassword123", "mahasiswa");

    expect(created.id).toBeDefined();
    expect(created.email).toBe(uniqueEmail);
    expect(created.password).not.toBe("mypassword123");
    expect(created.password.startsWith("$2")).toBe(true);

    const authenticated = await authenticateUser(uniqueEmail, "mypassword123");
    expect(authenticated).toBeDefined();
    expect(authenticated?.id).toBe(created.id);
  });

  it("buildSessionPayload extracts safe fields and brands id to UserId", () => {
    const user = {
      id: 99,
      name: "Prof. John",
      email: "john@example.com",
      password: "hashed_secret_string",
      role: "dosen" as const,
    };

    const payload = buildSessionPayload(user);
    expect(payload.id).toBe(99);
    expect(payload.name).toBe("Prof. John");
    expect(payload.email).toBe("john@example.com");
    expect(payload.role).toBe("dosen");
    expect((payload as unknown as Record<string, unknown>).password).toBeUndefined();
  });
});
