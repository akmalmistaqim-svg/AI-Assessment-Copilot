import type React from "react";

interface IconBoxProps {
  icon: React.ReactNode;
  variant?: "green" | "blue" | "amber" | "purple" | "slate";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function IconBox({ icon, variant = "green", size = "md", className = "" }: IconBoxProps) {
  const variantStyles = {
    green: "bg-light-green text-primary-green border-emerald-200",
    blue: "bg-blue-50 text-blue-600 border-blue-200",
    amber: "bg-amber-50 text-amber-600 border-amber-200",
    purple: "bg-purple-50 text-purple-600 border-purple-200",
    slate: "bg-slate-100 text-slate-600 border-slate-200",
  };

  const sizeStyles = {
    sm: "w-7 h-7 p-1.5 rounded-lg",
    md: "w-9 h-9 p-2 rounded-xl",
    lg: "w-11 h-11 p-2.5 rounded-2xl",
  };

  return (
    <div
      className={`inline-flex items-center justify-center border shrink-0 ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {icon}
    </div>
  );
}
