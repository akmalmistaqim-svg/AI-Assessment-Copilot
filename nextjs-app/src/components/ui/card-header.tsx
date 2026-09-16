import type React from "react";

interface CardHeaderProps {
  title: string;
  subtitle?: string;
  badge?: React.ReactNode;
  actions?: React.ReactNode;
}

export function CardHeader({ title, subtitle, badge, actions }: CardHeaderProps) {
  return (
    <div className="space-y-1">
      <div className="flex items-start justify-between gap-2">
        <div>
          {badge && <div className="mb-2">{badge}</div>}
          <h3 className="font-bold text-text-primary text-base group-hover:text-primary-green transition">
            {title}
          </h3>
          {subtitle && <p className="text-xs text-text-secondary mt-0.5">{subtitle}</p>}
        </div>
        {actions && <div className="flex items-center gap-1 shrink-0">{actions}</div>}
      </div>
    </div>
  );
}
