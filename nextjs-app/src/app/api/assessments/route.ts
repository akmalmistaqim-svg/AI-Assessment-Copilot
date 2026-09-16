import { NextResponse } from "next/server";
import { z } from "zod";
import { addAssessmentToStore, getAssessmentsStore } from "@/lib/assessmentStore";
import {
  type AssessmentItem,
  AssessmentSchema,
  CreateAssessmentInputSchema,
} from "@/types/assessment";

// GET /api/assessments
export async function GET() {
  try {
    const rawAssessments = getAssessmentsStore();
    const validatedAssessments = z.array(AssessmentSchema).parse(rawAssessments);
    return NextResponse.json(validatedAssessments);
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

// POST /api/assessments
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedInput = CreateAssessmentInputSchema.parse(body);

    const newAssessment: AssessmentItem = {
      id: `asm-${Date.now()}`,
      name: validatedInput.name,
      course: validatedInput.course,
      status: validatedInput.status,
      gradedSubmissionsCount: validatedInput.gradedSubmissionsCount,
    };

    const validatedAssessment = AssessmentSchema.parse(newAssessment);
    addAssessmentToStore(validatedAssessment);

    return NextResponse.json(validatedAssessment, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation Error", details: error.issues },
        { status: 400 },
      );
    }
    return NextResponse.json({ error: "Failed to create assessment" }, { status: 500 });
  }
}
