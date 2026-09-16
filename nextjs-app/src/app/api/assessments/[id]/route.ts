import { NextResponse } from "next/server";
import { z } from "zod";
import { deleteAssessmentFromStore, updateAssessmentInStore } from "@/lib/assessmentStore";
import { AssessmentSchema, UpdateAssessmentInputSchema } from "@/types/assessment";

// PUT /api/assessments/[id]
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validatedInput = UpdateAssessmentInputSchema.parse(body);

    const updated = updateAssessmentInStore(id, validatedInput);

    if (!updated) {
      return NextResponse.json({ error: "Assessment not found" }, { status: 404 });
    }

    const validatedResult = AssessmentSchema.parse(updated);
    return NextResponse.json(validatedResult);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation Error", details: error.issues },
        { status: 400 },
      );
    }
    return NextResponse.json({ error: "Failed to update assessment" }, { status: 500 });
  }
}

// DELETE /api/assessments/[id]
export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const success = deleteAssessmentFromStore(id);

    if (!success) {
      return NextResponse.json({ error: "Assessment not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, id });
  } catch {
    return NextResponse.json({ error: "Failed to delete assessment" }, { status: 500 });
  }
}
