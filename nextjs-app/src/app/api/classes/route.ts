import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAuthUser, requireDosenRole } from "@/lib/auth-guard";
import { addClassToStore, getClassesStore } from "@/lib/classStore";
import { type ClassItem, ClassSchema, CreateClassInputSchema } from "@/types/class";

// GET /api/classes
export async function GET(request: Request) {
  try {
    const rawClasses = getClassesStore();
    const url = new URL(request.url);
    const enrolledOnly = url.searchParams.get("enrolledOnly") === "true";

    let result = rawClasses;

    // Check session to filter classes if student is requesting
    const { user } = await requireAuthUser(request);
    if (user && (user.role === "mahasiswa" || enrolledOnly)) {
      result = rawClasses.filter((c) => c.enrolledStudentIds?.includes(user.id));
    }

    // Validate server data using Zod
    const validatedClasses = z.array(ClassSchema).parse(result);
    return NextResponse.json(validatedClasses);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation Error", details: error.issues },
        { status: 400 },
      );
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// POST /api/classes
export async function POST(request: Request) {
  try {
    const { errorResponse } = await requireDosenRole(request);
    if (errorResponse) return errorResponse;

    const body = await request.json();
    const validatedInput = CreateClassInputSchema.parse(body);

    const newClass: ClassItem = {
      id: `cls-${Date.now()}`,
      name: validatedInput.name,
      studentsCount: 1, // Demo student auto-enrolled
      assignmentsCount: 0,
      semester: validatedInput.semester,
      status: validatedInput.status,
      lecturerName: validatedInput.lecturerName ?? "Dr. Budi Santoso, M.Kom",
      enrolledStudentIds: validatedInput.enrolledStudentIds ?? [2], // Auto-enroll demo student Andi Pratama (id: 2)
    };

    // Validate created entity before returning
    const validatedClass = ClassSchema.parse(newClass);
    addClassToStore(validatedClass);

    return NextResponse.json(validatedClass, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation Error", details: error.issues },
        { status: 400 },
      );
    }
    return NextResponse.json({ error: "Failed to create class" }, { status: 500 });
  }
}
