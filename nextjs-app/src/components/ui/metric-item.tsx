import type React from "react";

interface MetricItemProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: string;
  className?: string;
}

export function MetricItem({ label, value, icon, trend, className = "" }: MetricItemProps) {
  return (
    <div className={`space-y-1 ${className}`}>
      <div className="flex items-center gap-1.5 text-xs text-text-muted">
        {icon}
        <span>{label}</span>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-xl font-bold text-text-primary tracking-tight">{value}</span>
        {trend && <span className="text-[11px] font-semibold text-primary-green">{trend}</span>}
      </div>
    </div>
  );
}
