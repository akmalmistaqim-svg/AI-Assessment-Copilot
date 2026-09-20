import { NextResponse } from "next/server";
import { requireAuthUser } from "@/lib/auth-guard";
import { activities } from "@/lib/data";

export async function GET(request: Request) {
  const { errorResponse } = await requireAuthUser(request);
  if (errorResponse) return errorResponse;

  return NextResponse.json(activities);
}
