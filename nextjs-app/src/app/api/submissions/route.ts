import { NextResponse } from "next/server";
import { z } from "zod";
import { getAssignmentByIdFromStore, updateAssignmentInStore } from "@/lib/assignmentStore";
import { requireAuthUser, requireMahasiswaRole } from "@/lib/auth-guard";
import { addActivity } from "@/lib/data";
import {
  addSubmissionToStore,
  getSubmissionsByStudentEmail,
  getSubmissionsStore,
} from "@/lib/submissionStore";
import {
  CreateSubmissionInputSchema,
  type SubmissionItem,
  SubmissionItemSchema,
} from "@/types/submission";

// GET /api/submissions
export async function GET(request: Request) {
  try {
    const { user, errorResponse } = await requireAuthUser(request);
    if (errorResponse) return errorResponse;

    let submissions: SubmissionItem[] = [];

    if (user?.role === "mahasiswa") {
      submissions = getSubmissionsByStudentEmail(user.email);
    } else {
      submissions = getSubmissionsStore();
    }

    const validated = z.array(SubmissionItemSchema).parse(submissions);
    return NextResponse.json(validated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation Error", details: error.issues },
        { status: 400 },
      );
    }
    return NextResponse.json({ error: "Failed to fetch submissions" }, { status: 500 });
  }
}

// POST /api/submissions
export async function POST(request: Request) {
  try {
    const { user, errorResponse } = await requireMahasiswaRole(request);
    if (errorResponse) return errorResponse;

    const body = await request.json();
    const validatedInput = CreateSubmissionInputSchema.parse(body);

    const assignment = getAssignmentByIdFromStore(validatedInput.assignmentId);
    if (!assignment) {
      return NextResponse.json({ error: "Assignment not found" }, { status: 404 });
    }

    // Update assignment status to 'submitted' in store
    const updatedAssignment = updateAssignmentInStore(assignment.id, {
      status: "submitted",
    });

    const now = new Date();
    const formattedDate = `${now.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })}, ${now.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}`;

    const newSubmission: SubmissionItem = {
      id: `sub-${Date.now()}`,
      assignmentId: assignment.id,
      assignmentTitle: assignment.title,
      course: assignment.course,
      studentId: user?.id ?? 0,
      studentName: user?.name ?? "Mahasiswa",
      studentEmail: user?.email ?? "",
      fileUrl: validatedInput.fileUrl,
      notes: validatedInput.notes ?? "",
      submittedAt: formattedDate,
    };

    const validatedSubmission = SubmissionItemSchema.parse(newSubmission);
    addSubmissionToStore(validatedSubmission);

    addActivity({
      id: `act-${Date.now()}`,
      type: "submission",
      actor: user?.name ?? "Mahasiswa",
      action: `mengumpulkan tugas "${assignment.title}"`,
      context: assignment.course,
      timeAgo: "Baru saja",
      icon: "upload",
      color: "emerald",
    });

    return NextResponse.json(
      {
        success: true,
        submission: validatedSubmission,
        updatedAssignment,
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation Error", details: error.issues },
        { status: 400 },
      );
    }
    return NextResponse.json({ error: "Failed to submit assignment" }, { status: 500 });
  }
}
