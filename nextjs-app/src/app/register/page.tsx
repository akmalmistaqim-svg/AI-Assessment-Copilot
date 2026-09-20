import type { Metadata } from "next";
import { BrandLogo } from "@/components/brand-logo";
import { RegisterForm } from "@/components/register-form";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Register | DeXa Assessment",
    description: "Daftar akun baru DeXa Assessment (Dosen / Mahasiswa).",
  };
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center py-8 px-4 bg-main-bg">
      <div className="w-full max-w-[440px]">
        {/* Auth Card */}
        <main className="bg-card-bg rounded-2xl border border-border-color shadow-sm p-8 md:p-9">
          {/* Brand Header inside Card */}
          <header className="text-center mb-6">
            <BrandLogo />
          </header>

          <h1 className="text-[22px] font-bold text-text-primary tracking-tight mb-1.5">
            Create your account
          </h1>
          <p className="text-sm text-text-secondary mb-6">
            Daftar sekarang untuk memulai penilaian terstandar.
          </p>

          {/* Interactive Register Form Client Component */}
          <RegisterForm />

          {/* Link to Login */}
          <div className="text-center mt-5 text-[13px] text-text-secondary">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-primary-green font-semibold hover:text-dark-green transition"
            >
              Login
            </a>
          </div>
        </main>
      </div>
    </div>
  );
}
