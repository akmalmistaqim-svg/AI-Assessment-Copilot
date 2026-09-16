import { NextResponse } from "next/server";
import { z } from "zod";
import { requireDosenRole } from "@/lib/auth-guard";
import { deleteRubricFromStore, updateRubricInStore } from "@/lib/rubricStore";
import { RubricSchema, UpdateRubricInputSchema } from "@/types/rubric";

// PUT /api/rubrics/[id]
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { errorResponse } = await requireDosenRole(request);
    if (errorResponse) return errorResponse;

    const { id } = await params;
    const body = await request.json();
    const validatedInput = UpdateRubricInputSchema.parse(body);

    const updated = updateRubricInStore(id, validatedInput);

    if (!updated) {
      return NextResponse.json({ error: "Rubric not found" }, { status: 404 });
    }

    const validatedResult = RubricSchema.parse(updated);
    return NextResponse.json(validatedResult);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation Error", details: error.issues },
        { status: 400 },
      );
    }
    return NextResponse.json({ error: "Failed to update rubric" }, { status: 500 });
  }
}

// DELETE /api/rubrics/[id]
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { errorResponse } = await requireDosenRole(request);
    if (errorResponse) return errorResponse;

    const { id } = await params;
    const success = deleteRubricFromStore(id);

    if (!success) {
      return NextResponse.json({ error: "Rubric not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, id });
  } catch {
    return NextResponse.json({ error: "Failed to delete rubric" }, { status: 500 });
  }
}
