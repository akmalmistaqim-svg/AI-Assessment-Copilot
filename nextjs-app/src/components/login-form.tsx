"use client";

import { AlertCircle, ArrowRight, CheckCircle, Eye, EyeOff } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { type FormEvent, Suspense, useRef, useState } from "react";

import { LoginResponseSchema } from "@/types/auth";

export function LoginForm() {
  return (
    <Suspense fallback={<div className="h-48 animate-pulse bg-slate-100 rounded-lg" />}>
      <LoginFormContent />
    </Suspense>
  );
}

function LoginFormContent() {
  const searchParams = useSearchParams();
  const justRegistered = searchParams.get("registered") === "1";

  const passwordInputRef = useRef<HTMLInputElement>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Error state
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState<"error" | "success">("error");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const showRegistrationSuccess = justRegistered && !alertMessage;

  function clearErrors() {
    setAlertMessage("");
    setEmailError("");
    setPasswordError("");
  }

  function isValidEmail(value: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    clearErrors();

    let hasError = false;

    if (!email.trim()) {
      setEmailError("Email wajib diisi.");
      hasError = true;
    } else if (!isValidEmail(email.trim())) {
      setEmailError("Format email tidak valid.");
      hasError = true;
    }

    if (!password) {
      setPasswordError("Password wajib diisi.");
      hasError = true;
    }

    if (hasError) return;

    setIsLoading(true);

    try {
      console.log("[LoginForm] Submitting credentials to /api/auth/login...");
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      let rawData: unknown;
      try {
        rawData = await res.json();
      } catch (jsonErr) {
        console.error("[LoginForm] Failed to parse JSON response from /api/auth/login:", jsonErr);
        setAlertType("error");
        setAlertMessage("Respon server tidak valid.");
        setIsLoading(false);
        return;
      }

      const parsed = LoginResponseSchema.safeParse(rawData);
      if (!parsed.success) {
        console.error("[LoginForm] Response validation error:", parsed.error);
        setAlertType("error");
        setAlertMessage("Format respon server tidak sesuai.");
        setIsLoading(false);
        return;
      }

      const data = parsed.data;

      if (!data.success || !res.ok) {
        console.warn(
          `[LoginForm] Login rejected (HTTP ${res.status}):`,
          data.message ?? "Email atau password salah.",
        );
        setAlertType("error");
        setAlertMessage(data.message ?? "Email atau password salah.");
        setIsLoading(false);
        return;
      }

      const targetUrl = data.redirectTo ?? "/dashboard/dosen";
      console.log("[LoginForm] Login SUCCESS. Performing redirect to:", targetUrl);

      // Gunakan window.location.assign untuk memastikan real document navigation
      // yang mengirimkan session cookie yang baru di-set secara sempurna ke middleware & server components,
      // menghindari client-side router race condition dengan router.refresh().
      window.location.assign(targetUrl);
    } catch (err) {
      console.error("[LoginForm] Network or unexpected error during login:", err);
      setAlertType("error");
      setAlertMessage("Terjadi kesalahan jaringan. Silakan coba lagi.");
      setIsLoading(false);
    }
  }

  return (
    <>
      {showRegistrationSuccess && (
        <div className="flex items-center gap-2.5 p-3 rounded-lg text-[13px] mb-5 bg-light-green text-dark-green border border-emerald-200">
          <CheckCircle size={18} className="shrink-0" />
          <span>Registrasi berhasil! Silakan masuk dengan akun baru Anda.</span>
        </div>
      )}

      {alertMessage && (
        <div
          className={`flex items-center gap-2.5 p-3 rounded-lg text-[13px] mb-5 ${
            alertType === "error"
              ? "bg-status-danger-bg text-status-danger-text border border-red-200"
              : "bg-light-green text-dark-green border border-emerald-200"
          }`}
          role="alert"
        >
          {alertType === "error" ? (
            <AlertCircle size={18} className="shrink-0" />
          ) : (
            <CheckCircle size={18} className="shrink-0" />
          )}
          <span>{alertMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        {/* Email */}
        <div className="mb-4.5">
          <label htmlFor="email" className="block text-[13px] font-medium text-text-primary mb-1.5">
            Email <span className="text-status-danger-text">*</span>
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              clearErrors();
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                passwordInputRef.current?.focus();
              }
            }}
            className={`w-full py-2.5 px-3.5 text-sm text-text-primary bg-white border rounded-lg transition focus:border-primary-green focus:ring-2 focus:ring-primary-green/20 focus:outline-none placeholder:text-text-muted ${
              emailError ? "border-status-danger-text" : "border-border-color"
            }`}
            placeholder="nama@kampus.ac.id"
            autoComplete="email"
          />
          {emailError && (
            <div className="text-xs text-status-danger-text mt-1" role="alert">
              {emailError}
            </div>
          )}
        </div>

        {/* Password */}
        <div className="mb-4.5">
          <label
            htmlFor="password"
            className="block text-[13px] font-medium text-text-primary mb-1.5"
          >
            Password <span className="text-status-danger-text">*</span>
          </label>
          <div className="relative flex items-center">
            <input
              ref={passwordInputRef}
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                clearErrors();
              }}
              className={`w-full py-2.5 px-3.5 pr-11 text-sm text-text-primary bg-white border rounded-lg transition focus:border-primary-green focus:ring-2 focus:ring-primary-green/20 focus:outline-none placeholder:text-text-muted ${
                passwordError ? "border-status-danger-text" : "border-border-color"
              }`}
              placeholder="Masukkan password Anda"
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              tabIndex={-1}
              className="absolute right-3 z-10 p-1 text-text-muted hover:text-text-primary transition cursor-pointer"
              aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
            >
              {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
            </button>
          </div>
          {passwordError && (
            <div className="text-xs text-status-danger-text mt-1" role="alert">
              {passwordError}
            </div>
          )}
        </div>

        {/* Submit */}
        <div className="mt-6">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-medium text-sm bg-primary-green text-white hover:bg-green-hover shadow-xs transition cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <span>{isLoading ? "Signing in..." : "Sign In"}</span>
            {!isLoading && <ArrowRight size={16} />}
          </button>
        </div>
      </form>
    </>
  );
}
