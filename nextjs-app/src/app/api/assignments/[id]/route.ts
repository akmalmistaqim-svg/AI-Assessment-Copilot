import { NextResponse } from "next/server";
import { z } from "zod";
import {
  deleteAssignmentFromStore,
  getAssignmentByIdFromStore,
  updateAssignmentInStore,
} from "@/lib/assignmentStore";
import { requireAuthUser, requireDosenRole } from "@/lib/auth-guard";
import { AssignmentSchema, UpdateAssignmentInputSchema } from "@/types/assignment";

// GET /api/assignments/[id]
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { errorResponse } = await requireAuthUser(request);
    if (errorResponse) return errorResponse;

    const { id } = await params;
    const assignment = getAssignmentByIdFromStore(id);

    if (!assignment) {
      return NextResponse.json({ error: "Assignment not found" }, { status: 404 });
    }

    const validatedResult = AssignmentSchema.parse(assignment);
    return NextResponse.json(validatedResult);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation Error", details: error.issues },
        { status: 400 },
      );
    }
    return NextResponse.json({ error: "Failed to fetch assignment" }, { status: 500 });
  }
}

// PUT /api/assignments/[id]
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { errorResponse } = await requireDosenRole(request);
    if (errorResponse) return errorResponse;

    const { id } = await params;
    const body = await request.json();
    const validatedInput = UpdateAssignmentInputSchema.parse(body);

    const updated = updateAssignmentInStore(id, validatedInput);

    if (!updated) {
      return NextResponse.json({ error: "Assignment not found" }, { status: 404 });
    }

    const validatedResult = AssignmentSchema.parse(updated);
    return NextResponse.json(validatedResult);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation Error", details: error.issues },
        { status: 400 },
      );
    }
    return NextResponse.json({ error: "Failed to update assignment" }, { status: 500 });
  }
}

// DELETE /api/assignments/[id]
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { errorResponse } = await requireDosenRole(request);
    if (errorResponse) return errorResponse;

    const { id } = await params;
    const success = deleteAssignmentFromStore(id);

    if (!success) {
      return NextResponse.json({ error: "Assignment not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, id });
  } catch {
    return NextResponse.json({ error: "Failed to delete assignment" }, { status: 500 });
  }
}
