"use client";

import {
  AlertCircle,
  BookOpen,
  CheckCircle,
  Eye,
  EyeOff,
  GraduationCap,
  UserPlus,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { type FormEvent, useRef, useState } from "react";

export function RegisterForm() {
  const router = useRouter();

  const emailInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const confirmPasswordInputRef = useRef<HTMLInputElement>(null);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"dosen" | "mahasiswa">("dosen");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Error state
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState<"error" | "success">("error");
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  function clearErrors() {
    setAlertMessage("");
    setNameError("");
    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");
  }

  function isValidEmail(value: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    clearErrors();

    let hasError = false;

    if (!fullName.trim()) {
      setNameError("Nama lengkap wajib diisi.");
      hasError = true;
    }

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
    } else if (password.length < 8) {
      setPasswordError("Password minimal 8 karakter.");
      hasError = true;
    }

    if (!confirmPassword) {
      setConfirmPasswordError("Konfirmasi password wajib diisi.");
      hasError = true;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError("Konfirmasi password tidak cocok.");
      hasError = true;
    }

    if (hasError) return;

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fullName.trim(),
          email: email.trim(),
          password,
          role,
        }),
      });

      const data = (await res.json()) as {
        success: boolean;
        message?: string;
      };

      if (!data.success) {
        setAlertType("error");
        setAlertMessage(data.message ?? "Terjadi kesalahan.");

        if (res.status === 409) {
          setEmailError("Email ini sudah terdaftar.");
        }

        setIsLoading(false);
        return;
      }

      setAlertType("success");
      setAlertMessage("Akun berhasil dibuat! Mengalihkan ke halaman login...");

      setTimeout(() => {
        router.push("/login?registered=1");
      }, 1500);
    } catch {
      setAlertType("error");
      setAlertMessage("Terjadi kesalahan. Silakan coba lagi.");
      setIsLoading(false);
    }
  }

  const inputBaseClass =
    "w-full py-2.5 px-3.5 text-sm text-text-primary bg-white border rounded-lg transition focus:border-primary-green focus:ring-2 focus:ring-primary-green/20 focus:outline-none placeholder:text-text-muted";

  return (
    <>
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
        {/* Full Name */}
        <div className="mb-4">
          <label
            htmlFor="fullName"
            className="block text-[13px] font-medium text-text-primary mb-1.5"
          >
            Nama Lengkap <span className="text-status-danger-text">*</span>
          </label>
          <input
            type="text"
            id="fullName"
            value={fullName}
            onChange={(e) => {
              setFullName(e.target.value);
              clearErrors();
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                emailInputRef.current?.focus();
              }
            }}
            className={`${inputBaseClass} ${
              nameError ? "border-status-danger-text" : "border-border-color"
            }`}
            placeholder="Contoh: Budi Santoso"
            autoComplete="name"
          />
          {nameError && (
            <div className="text-xs text-status-danger-text mt-1" role="alert">
              {nameError}
            </div>
          )}
        </div>

        {/* Email */}
        <div className="mb-4">
          <label htmlFor="email" className="block text-[13px] font-medium text-text-primary mb-1.5">
            Email <span className="text-status-danger-text">*</span>
          </label>
          <input
            ref={emailInputRef}
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
            className={`${inputBaseClass} ${
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

        {/* Role Selection */}
        <div className="mb-3.5">
          <span className="block text-[13px] font-medium text-text-primary mb-1.5">
            Pilih Role <span className="text-status-danger-text">*</span>
          </span>
          <div className="grid grid-cols-2 gap-2.5 mt-1" role="radiogroup" aria-label="Pilih Role">
            {/* Dosen */}
            <label className="relative cursor-pointer">
              <input
                type="radio"
                name="role"
                value="dosen"
                checked={role === "dosen"}
                onChange={() => setRole("dosen")}
                className="sr-only"
              />
              <div
                className={`flex flex-col items-center justify-center gap-1 p-2.5 min-h-[52px] border-[1.5px] rounded-lg bg-white text-center transition ${
                  role === "dosen"
                    ? "border-primary-green bg-light-green"
                    : "border-border-color hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-md flex items-center justify-center transition ${
                    role === "dosen"
                      ? "bg-primary-green text-white"
                      : "bg-slate-100 text-text-secondary"
                  }`}
                >
                  <GraduationCap size={14} />
                </div>
                <span
                  className={`text-[12.5px] font-semibold ${
                    role === "dosen" ? "text-dark-green" : "text-text-primary"
                  }`}
                >
                  Dosen
                </span>
              </div>
            </label>

            {/* Mahasiswa */}
            <label className="relative cursor-pointer">
              <input
                type="radio"
                name="role"
                value="mahasiswa"
                checked={role === "mahasiswa"}
                onChange={() => setRole("mahasiswa")}
                className="sr-only"
              />
              <div
                className={`flex flex-col items-center justify-center gap-1 p-2.5 min-h-[52px] border-[1.5px] rounded-lg bg-white text-center transition ${
                  role === "mahasiswa"
                    ? "border-primary-green bg-light-green"
                    : "border-border-color hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-md flex items-center justify-center transition ${
                    role === "mahasiswa"
                      ? "bg-primary-green text-white"
                      : "bg-slate-100 text-text-secondary"
                  }`}
                >
                  <BookOpen size={14} />
                </div>
                <span
                  className={`text-[12.5px] font-semibold ${
                    role === "mahasiswa" ? "text-dark-green" : "text-text-primary"
                  }`}
                >
                  Mahasiswa
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* Password */}
        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-[13px] font-medium text-text-primary mb-1.5"
          >
            Password (Min. 8 Karakter) <span className="text-status-danger-text">*</span>
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
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  confirmPasswordInputRef.current?.focus();
                }
              }}
              className={`${inputBaseClass} pr-11 ${
                passwordError ? "border-status-danger-text" : "border-border-color"
              }`}
              placeholder="Minimal 8 karakter"
              autoComplete="new-password"
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

        {/* Confirm Password */}
        <div className="mb-4">
          <label
            htmlFor="confirmPassword"
            className="block text-[13px] font-medium text-text-primary mb-1.5"
          >
            Konfirmasi Password <span className="text-status-danger-text">*</span>
          </label>
          <div className="relative flex items-center">
            <input
              ref={confirmPasswordInputRef}
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                clearErrors();
              }}
              className={`${inputBaseClass} pr-11 ${
                confirmPasswordError ? "border-status-danger-text" : "border-border-color"
              }`}
              placeholder="Ulangi password Anda"
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              tabIndex={-1}
              className="absolute right-3 z-10 p-1 text-text-muted hover:text-text-primary transition cursor-pointer"
              aria-label={
                showConfirmPassword
                  ? "Sembunyikan konfirmasi password"
                  : "Tampilkan konfirmasi password"
              }
            >
              {showConfirmPassword ? <Eye size={18} /> : <EyeOff size={18} />}
            </button>
          </div>
          {confirmPasswordError && (
            <div className="text-xs text-status-danger-text mt-1" role="alert">
              {confirmPasswordError}
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
            <span>{isLoading ? "Mendaftarkan..." : "Create Account"}</span>
            {!isLoading && <UserPlus size={16} />}
          </button>
        </div>
      </form>
    </>
  );
}
