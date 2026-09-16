import { NextResponse } from "next/server";
import { z } from "zod";
import { addAssignmentToStore, getAssignmentsStore } from "@/lib/assignmentStore";
import { requireDosenRole } from "@/lib/auth-guard";
import {
  type AssignmentItem,
  AssignmentSchema,
  CreateAssignmentInputSchema,
} from "@/types/assignment";

// GET /api/assignments
export async function GET() {
  try {
    const rawAssignments = getAssignmentsStore();
    const validatedAssignments = z.array(AssignmentSchema).parse(rawAssignments);
    return NextResponse.json(validatedAssignments);
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

// POST /api/assignments
export async function POST(request: Request) {
  try {
    const { errorResponse } = await requireDosenRole(request);
    if (errorResponse) return errorResponse;

    const body = await request.json();
    const validatedInput = CreateAssignmentInputSchema.parse(body);

    const newAssignment: AssignmentItem = {
      id: `asg-${Date.now()}`,
      title: validatedInput.title,
      course: validatedInput.course,
      deadline: validatedInput.deadline,
      description: validatedInput.description,
      status: validatedInput.status,
    };

    const validatedAssignment = AssignmentSchema.parse(newAssignment);
    addAssignmentToStore(validatedAssignment);

    return NextResponse.json(validatedAssignment, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation Error", details: error.issues },
        { status: 400 },
      );
    }
    return NextResponse.json({ error: "Failed to create assignment" }, { status: 500 });
  }
}
