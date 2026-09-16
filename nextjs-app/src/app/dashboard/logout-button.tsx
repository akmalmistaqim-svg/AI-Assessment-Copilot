"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface LogoutButtonProps {
  className?: string;
  variant?: "sidebar" | "dropdown";
}

export function LogoutButton({ className, variant = "sidebar" }: LogoutButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogout() {
    setIsLoading(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } catch {
      setIsLoading(false);
    }
  }

  const baseClasses =
    variant === "dropdown"
      ? "w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg transition"
      : "w-full flex items-center justify-start gap-3 py-[9px] px-3 rounded-lg text-[13.5px] font-medium text-text-secondary hover:text-red-600 hover:bg-red-50 transition cursor-pointer disabled:opacity-60";

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={isLoading}
      className={className || baseClasses}
    >
      <LogOut size={16} />
      <span>{isLoading ? "Logging out..." : "Logout"}</span>
    </button>
  );
}
