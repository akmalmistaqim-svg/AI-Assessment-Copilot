import type { Metadata } from "next";
import { BrandLogo } from "@/components/brand-logo";
import { LoginForm } from "@/components/login-form";

export const metadata: Metadata = {
  title: "Login",
  description: "Masuk ke akun AI Assessment Copilot Anda.",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center py-8 px-4 bg-main-bg">
      <div className="w-full max-w-[440px]">
        {/* Brand Header */}
        <header className="text-center mb-7">
          <BrandLogo />
        </header>

        {/* Auth Card */}
        <main className="bg-card-bg rounded-2xl border border-border-color shadow-sm p-8 md:p-9">
          <h1 className="text-[22px] font-bold text-text-primary tracking-tight mb-1.5">
            Welcome Back
          </h1>
          <p className="text-sm text-text-secondary mb-6">Sign in to continue to your account.</p>

          {/* Interactive Login Form Client Component */}
          <LoginForm />

          {/* Link to Register */}
          <div className="text-center mt-5 text-[13px] text-text-secondary">
            Don&apos;t have an account?{" "}
            <a
              href="/register"
              className="text-primary-green font-semibold hover:text-dark-green transition"
            >
              Register
            </a>
          </div>
        </main>
      </div>
    </div>
  );
}
