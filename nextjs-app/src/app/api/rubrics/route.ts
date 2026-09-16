import { NextResponse } from "next/server";
import { z } from "zod";
import { addRubricToStore, getRubricsStore } from "@/lib/rubricStore";
import { CreateRubricInputSchema, type RubricItem, RubricSchema } from "@/types/rubric";

// GET /api/rubrics
export async function GET() {
  try {
    const rawRubrics = getRubricsStore();
    const validatedRubrics = z.array(RubricSchema).parse(rawRubrics);
    return NextResponse.json(validatedRubrics);
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

// POST /api/rubrics
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedInput = CreateRubricInputSchema.parse(body);

    const newRubric: RubricItem = {
      id: `rub-${Date.now()}`,
      name: validatedInput.name,
      course: validatedInput.course,
      criteriaCount: validatedInput.criteriaCount,
      totalWeight: validatedInput.totalWeight,
      status: validatedInput.status,
    };

    const validatedRubric = RubricSchema.parse(newRubric);
    addRubricToStore(validatedRubric);

    return NextResponse.json(validatedRubric, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation Error", details: error.issues },
        { status: 400 },
      );
    }
    return NextResponse.json({ error: "Failed to create rubric" }, { status: 500 });
  }
}
