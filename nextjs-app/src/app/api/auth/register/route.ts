import { NextResponse } from "next/server";
import { addUser, findUserByEmail } from "@/lib/auth";
import { RegisterRequestSchema } from "@/types/auth";

export async function POST(request: Request) {
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, message: "Format request tidak valid (JSON corrupt)." },
        { status: 400 },
      );
    }

    const validation = RegisterRequestSchema.safeParse(body);
    if (!validation.success) {
      const firstError = validation.error.issues[0]?.message ?? "Input tidak valid.";
      return NextResponse.json({ success: false, message: firstError }, { status: 400 });
    }

    const { name, email, password, role } = validation.data;

    // Check for duplicate email
    const existing = findUserByEmail(email);
    if (existing) {
      return NextResponse.json(
        { success: false, message: "Email sudah terdaftar." },
        { status: 409 },
      );
    }

    // Add user to in-memory store with bcrypt hashed password
    await addUser(name, email, password, role);

    return NextResponse.json({
      success: true,
      message: "Registrasi berhasil! Silakan login.",
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan server." },
      { status: 500 },
    );
  }
}
