import type React from "react";

interface BadgeGroupProps {
  children: React.ReactNode;
  className?: string;
}

export function BadgeGroup({ children, className = "" }: BadgeGroupProps) {
  return <div className={`flex flex-wrap items-center gap-1.5 ${className}`}>{children}</div>;
}
