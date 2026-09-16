import { NextResponse } from "next/server";
import { z } from "zod";
import { addClassToStore, getClassesStore } from "@/lib/classStore";
import { type ClassItem, ClassSchema, CreateClassInputSchema } from "@/types/class";

// GET /api/classes
export async function GET() {
  try {
    const rawClasses = getClassesStore();
    // Validate server data using Zod
    const validatedClasses = z.array(ClassSchema).parse(rawClasses);
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
    const body = await request.json();
    const validatedInput = CreateClassInputSchema.parse(body);

    const newClass: ClassItem = {
      id: `cls-${Date.now()}`,
      name: validatedInput.name,
      studentsCount: 0,
      assignmentsCount: 0,
      semester: validatedInput.semester,
      status: validatedInput.status,
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
