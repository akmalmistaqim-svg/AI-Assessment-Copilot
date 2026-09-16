import { NextResponse } from "next/server";
import { z } from "zod";
import { requireDosenRole } from "@/lib/auth-guard";
import { deleteClassFromStore, updateClassInStore } from "@/lib/classStore";
import { ClassSchema, UpdateClassInputSchema } from "@/types/class";

// PUT /api/classes/[id]
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { errorResponse } = await requireDosenRole(request);
    if (errorResponse) return errorResponse;

    const { id } = await params;
    const body = await request.json();
    const validatedInput = UpdateClassInputSchema.parse(body);

    const updated = updateClassInStore(id, validatedInput);

    if (!updated) {
      return NextResponse.json({ error: "Class not found" }, { status: 404 });
    }

    const validatedResult = ClassSchema.parse(updated);
    return NextResponse.json(validatedResult);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation Error", details: error.issues },
        { status: 400 },
      );
    }
    return NextResponse.json({ error: "Failed to update class" }, { status: 500 });
  }
}

// DELETE /api/classes/[id]
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { errorResponse } = await requireDosenRole(request);
    if (errorResponse) return errorResponse;

    const { id } = await params;
    const success = deleteClassFromStore(id);

    if (!success) {
      return NextResponse.json({ error: "Class not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, id });
  } catch {
    return NextResponse.json({ error: "Failed to delete class" }, { status: 500 });
  }
}
