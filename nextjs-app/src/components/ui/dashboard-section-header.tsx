import type React from "react";

interface DashboardSectionHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function DashboardSectionHeader({
  title,
  description,
  action,
  className = "",
}: DashboardSectionHeaderProps) {
  return (
    <div className={`flex items-center justify-between gap-4 ${className}`}>
      <div>
        <h2 className="text-lg font-bold text-text-primary tracking-tight">{title}</h2>
        {description && <p className="text-xs text-text-secondary mt-0.5">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
