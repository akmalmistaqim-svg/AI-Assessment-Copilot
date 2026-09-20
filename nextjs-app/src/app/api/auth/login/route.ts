import { NextResponse } from "next/server";
import { authenticateUser, createSession } from "@/lib/auth";
import { LoginRequestSchema, LoginResponseSchema } from "@/types/auth";

export async function POST(request: Request) {
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch (parseError) {
      console.error("[Login API] Failed to parse request JSON:", parseError);
      return NextResponse.json(
        { success: false, message: "Format request tidak valid (JSON corrupt)." },
        { status: 400 },
      );
    }

    const validation = LoginRequestSchema.safeParse(body);
    if (!validation.success) {
      const firstError = validation.error.issues[0]?.message ?? "Input tidak valid.";
      console.error("[Login API] Validation failed:", validation.error.flatten().fieldErrors);
      return NextResponse.json({ success: false, message: firstError }, { status: 400 });
    }

    const { email, password } = validation.data;
    console.log(`[Login API] Processing login attempt for: "${email}"`);

    const user = await authenticateUser(email, password);

    if (!user) {
      console.warn(`[Login API] Authentication failed for email: "${email}" (Invalid credentials)`);
      return NextResponse.json(
        { success: false, message: "Email atau password salah." },
        { status: 401 },
      );
    }

    // Set httpOnly cookie session
    console.log(
      `[Login API] Authentication success for user ID ${user.id} (${user.role}). Creating session...`,
    );
    await createSession(user);
    console.log(`[Login API] Session cookie set successfully for user ID ${user.id}`);

    const redirectTo = user.role === "dosen" ? "/dashboard/dosen" : "/dashboard/mahasiswa";

    const responsePayload = {
      success: true,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      redirectTo,
    };

    // Validate response payload with Zod
    const validatedResponse = LoginResponseSchema.safeParse(responsePayload);
    if (!validatedResponse.success) {
      console.error("[Login API] Response schema validation failed:", validatedResponse.error);
    }

    console.log(`[Login API] Returning 200 OK with redirectTo: "${redirectTo}"`);
  } catch (error) {
    console.error("[Login API] Unexpected server error during login:", error);
    const message =
      error instanceof Error && error.message.includes("SESSION_SECRET")
        ? "Konfigurasi server belum lengkap: SESSION_SECRET belum diatur di Environment Variables Vercel."
        : "Terjadi kesalahan server.";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
