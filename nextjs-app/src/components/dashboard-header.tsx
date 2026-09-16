import type React from "react";

interface DashboardHeaderProps {
  children: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

export function DashboardHeader({ children, actions, className = "" }: DashboardHeaderProps) {
  return (
    <header
      className={`h-16 border-b border-border-color bg-card-bg/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30 transition-all duration-300 ${className}`}
    >
      <div className="flex items-center gap-4">{children}</div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </header>
  );
}
