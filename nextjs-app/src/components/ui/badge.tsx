import type React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "success" | "warning" | "info" | "danger";
  className?: string;
}

export function Badge({ children, variant = "success", className = "" }: BadgeProps) {
  const variantStyles = {
    success: "bg-light-green text-dark-green border-emerald-200",
    warning: "bg-amber-50 text-amber-700 border-amber-200",
    info: "bg-blue-50 text-blue-700 border-blue-200",
    danger: "bg-status-danger-bg text-status-danger-text border-red-200",
  };

  return (
    <span
      className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
