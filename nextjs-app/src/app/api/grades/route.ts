import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAuthUser } from "@/lib/auth-guard";
import { getGradesByStudentEmail, getGradesStore } from "@/lib/gradeStore";
import { GradeItemSchema } from "@/types/grade";

// GET /api/grades
export async function GET(request: Request) {
  try {
    const { user, errorResponse } = await requireAuthUser(request);
    if (errorResponse) return errorResponse;

    let grades = [];

    if (user?.role === "mahasiswa") {
      // Mahasiswa only gets their own finalized grades
      grades = getGradesByStudentEmail(user.email, true);
    } else {
      // Dosen can see all grades
      grades = getGradesStore();
    }

    const validated = z.array(GradeItemSchema).parse(grades);
    return NextResponse.json(validated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation Error", details: error.issues },
        { status: 400 },
      );
    }
    return NextResponse.json({ error: "Failed to fetch grades" }, { status: 500 });
  }
}
