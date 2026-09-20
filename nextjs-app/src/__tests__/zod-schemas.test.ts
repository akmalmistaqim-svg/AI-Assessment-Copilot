import { describe, expect, it } from "vitest";
import { getAssessmentStatusConfig } from "@/types/assessment";
import { AssignmentSchema, CreateAssignmentInputSchema } from "@/types/assignment";
import { LoginRequestSchema, RegisterRequestSchema } from "@/types/auth";
import { CreateRubricInputSchema, RubricSchema } from "@/types/rubric";

describe("Zod Validation Schemas", () => {
  describe("LoginRequestSchema", () => {
    it("validates correct login credentials", () => {
      const valid = { email: "user@example.com", password: "password123" };
      const parsed = LoginRequestSchema.safeParse(valid);
      expect(parsed.success).toBe(true);
    });

    it("rejects invalid email formats", () => {
      const invalid = { email: "not-an-email", password: "password123" };
      const parsed = LoginRequestSchema.safeParse(invalid);
      expect(parsed.success).toBe(false);
    });

    it("rejects missing password", () => {
      const invalid = { email: "user@example.com" };
      const parsed = LoginRequestSchema.safeParse(invalid);
      expect(parsed.success).toBe(false);
    });
  });

  describe("RegisterRequestSchema", () => {
    it("validates valid registration data with role", () => {
      const valid = {
        name: "Andi Saputra",
        email: "andi@univ.ac.id",
        password: "secretpassword",
        role: "mahasiswa" as const,
      };
      const parsed = RegisterRequestSchema.safeParse(valid);
      expect(parsed.success).toBe(true);
    });

    it("rejects password shorter than 6 characters", () => {
      const invalid = {
        name: "Andi",
        email: "andi@univ.ac.id",
        password: "123",
        role: "mahasiswa" as const,
      };
      const parsed = RegisterRequestSchema.safeParse(invalid);
      expect(parsed.success).toBe(false);
    });

    it("rejects invalid role selection", () => {
      const invalid = {
        name: "Andi",
        email: "andi@univ.ac.id",
        password: "password123",
        role: "superadmin",
      };
      const parsed = RegisterRequestSchema.safeParse(invalid);
      expect(parsed.success).toBe(false);
    });
  });

  describe("RubricSchema & CreateRubricInputSchema", () => {
    it("validates complete rubric item", () => {
      const rubric = {
        id: "rubric-1",
        name: "Analisis Desain UI",
        course: "Interaksi Manusia & Komputer",
        criteriaCount: 4,
        totalWeight: 100,
        status: "active" as const,
      };
      const parsed = RubricSchema.safeParse(rubric);
      expect(parsed.success).toBe(true);
    });

    it("coerces string numbers and defaults status to active in CreateRubricInputSchema", () => {
      const input = {
        name: "Struktur Algoritma",
        course: "Pemrograman Web",
        criteriaCount: "5",
        totalWeight: "100",
      };
      const parsed = CreateRubricInputSchema.safeParse(input);
      expect(parsed.success).toBe(true);
      if (parsed.success) {
        expect(parsed.data.criteriaCount).toBe(5);
        expect(parsed.data.totalWeight).toBe(100);
        expect(parsed.data.status).toBe("active");
      }
    });

    it("rejects total weight exceeding 100%", () => {
      const invalid = {
        name: "Invalid Weight",
        course: "Testing",
        criteriaCount: 2,
        totalWeight: 150,
      };
      const parsed = CreateRubricInputSchema.safeParse(invalid);
      expect(parsed.success).toBe(false);
    });
  });

  describe("AssignmentSchema & CreateAssignmentInputSchema", () => {
    it("validates assignment item schema", () => {
      const item = {
        id: "asg-1",
        title: "Tugas 1 - Redesign Web",
        course: "UI/UX",
        deadline: "25 Sep 2026",
        description: "Buat analisis heuristik lengkap.",
        status: "pending" as const,
      };
      const parsed = AssignmentSchema.safeParse(item);
      expect(parsed.success).toBe(true);
    });

    it("defaults status to pending in CreateAssignmentInputSchema", () => {
      const input = {
        title: "Tugas 2",
        course: "Machine Learning",
        deadline: "30 Sep 2026",
        description: "Implementasikan logistic regression.",
      };
      const parsed = CreateAssignmentInputSchema.safeParse(input);
      expect(parsed.success).toBe(true);
      if (parsed.success) {
        expect(parsed.data.status).toBe("pending");
      }
    });
  });

  describe("Assessment Discriminated Union Helper", () => {
    it("returns correct config for draft state", () => {
      const config = getAssessmentStatusConfig("draft");
      expect(config.status).toBe("draft");
      expect(config.statusLabel).toBe("Draft");
      expect(config.canEdit).toBe(true);
      expect(config.canFinalize).toBe(false);
    });

    it("returns correct config for in-review state", () => {
      const config = getAssessmentStatusConfig("in-review");
      expect(config.status).toBe("in-review");
      expect(config.statusLabel).toBe("In-Review");
      expect(config.canEdit).toBe(true);
      expect(config.canFinalize).toBe(true);
    });

    it("returns correct config for finalized state", () => {
      const config = getAssessmentStatusConfig("finalized");
      expect(config.status).toBe("finalized");
      expect(config.statusLabel).toBe("Finalized");
      expect(config.canEdit).toBe(false);
      expect(config.canFinalize).toBe(false);
    });
  });
});
