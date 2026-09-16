import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  desc: string;
  color: string;
}

export function StatCard({ title, value, icon: Icon, desc, color }: StatCardProps) {
  return (
    <div className="bg-card-bg rounded-xl border border-border-color shadow-sm p-5 transition hover:shadow-md hover:border-primary-green/30">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-text-secondary">{title}</span>
        <div className={`p-2.5 rounded-xl ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <p className="text-3xl font-bold text-text-primary mt-3 tracking-tight">{value}</p>
      <p className="text-xs text-text-muted mt-1.5">{desc}</p>
    </div>
  );
}
