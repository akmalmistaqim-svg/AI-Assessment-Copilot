import { cva, type VariantProps } from "class-variance-authority";
import type React from "react";

export const badgeVariants = cva(
  "inline-flex items-center justify-center font-semibold rounded-full border transition-colors",
  {
    variants: {
      variant: {
        default: "bg-light-green text-dark-green border-emerald-200",
        success: "bg-light-green text-dark-green border-emerald-200",
        secondary: "bg-gray-100 text-gray-700 border-gray-200",
        info: "bg-blue-50 text-blue-700 border-blue-200",
        warning: "bg-amber-50 text-amber-700 border-amber-200",
        destructive: "bg-status-danger-bg text-status-danger-text border-red-200",
        danger: "bg-status-danger-bg text-status-danger-text border-red-200",
        outline: "bg-transparent text-text-primary border-border-color",
      },
      size: {
        sm: "px-2 py-0.5 text-[10px]",
        md: "px-2.5 py-0.5 text-[11px]",
        lg: "px-3 py-1 text-xs",
      },
    },
    defaultVariants: {
      variant: "success",
      size: "md",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  children: React.ReactNode;
}

export function Badge({ children, variant, size, className = "", ...props }: BadgeProps) {
  return (
    <span className={`${badgeVariants({ variant, size })} ${className}`} {...props}>
      {children}
    </span>
  );
}
