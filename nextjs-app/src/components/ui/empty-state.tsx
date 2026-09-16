import { FolderOpen } from "lucide-react";
import type React from "react";

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export function EmptyState({ title, description, icon, action }: EmptyStateProps) {
  return (
    <div className="bg-card-bg rounded-xl border border-dashed border-border-color p-8 text-center space-y-3">
      {icon || <FolderOpen className="w-10 h-10 text-text-muted mx-auto" />}
      <div>
        <p className="text-sm font-semibold text-text-primary">{title}</p>
        <p className="text-xs text-text-secondary mt-1 max-w-sm mx-auto">{description}</p>
      </div>
      {action && <div className="pt-2">{action}</div>}
    </div>
  );
}
