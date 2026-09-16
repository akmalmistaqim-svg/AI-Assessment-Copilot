import { NextResponse } from "next/server";
import { addUser, findUserByEmail } from "@/lib/auth";

interface RegisterRequestBody {
  name?: string;
  email?: string;
  password?: string;
  role?: string;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as RegisterRequestBody;
    const { name, email, password, role } = body;

    // Validate required fields
    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { success: false, message: "Semua field wajib diisi." },
        { status: 400 },
      );
    }

    // Validate role
    if (role !== "dosen" && role !== "mahasiswa") {
      return NextResponse.json(
        { success: false, message: "Role harus 'dosen' atau 'mahasiswa'." },
        { status: 400 },
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: "Format email tidak valid." },
        { status: 400 },
      );
    }

    // Validate password length
    if (password.length < 8) {
      return NextResponse.json(
        { success: false, message: "Password minimal 8 karakter." },
        { status: 400 },
      );
    }

    // Check for duplicate email
    const existing = findUserByEmail(email);
    if (existing) {
      return NextResponse.json(
        { success: false, message: "Email sudah terdaftar." },
        { status: 409 },
      );
    }

    // Add user to in-memory store (no auto-login)
    addUser(name, email, password, role);

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
