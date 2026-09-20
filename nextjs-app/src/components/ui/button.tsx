import { cva, type VariantProps } from "class-variance-authority";
import type React from "react";

export const buttonVariants = cva(
  "inline-flex items-center justify-center font-semibold transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus-ring",
  {
    variants: {
      variant: {
        default:
          "bg-primary-green text-white hover:bg-dark-green shadow-sm hover:shadow active:scale-95",
        secondary: "bg-gray-100 text-text-primary hover:bg-gray-200 border border-border-color",
        destructive: "bg-red-600 text-white hover:bg-red-700 shadow-sm active:scale-95",
        outline: "bg-white border border-border-color text-text-primary hover:bg-main-bg shadow-xs",
        ghost: "bg-transparent hover:bg-main-bg text-text-secondary hover:text-text-primary",
      },
      size: {
        sm: "px-2.5 py-1.5 text-xs rounded-lg gap-1.5",
        md: "px-3.5 py-2 text-xs rounded-lg gap-1.5",
        lg: "px-4 py-2.5 text-sm rounded-xl gap-2",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  children?: React.ReactNode;
}

export function Button({
  children,
  variant,
  size,
  className = "",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button type={type} className={`${buttonVariants({ variant, size })} ${className}`} {...props}>
      {children}
    </button>
  );
}
