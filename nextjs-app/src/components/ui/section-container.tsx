import type React from "react";

interface SectionContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function SectionContainer({ children, className = "" }: SectionContainerProps) {
  return <section className={`space-y-4 ${className}`}>{children}</section>;
}
