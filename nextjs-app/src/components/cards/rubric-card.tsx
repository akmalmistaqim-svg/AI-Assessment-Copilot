import { Award, ListChecks } from "lucide-react";
import type React from "react";
import { Badge } from "@/components/ui/badge";
import type { RubricItem } from "@/types/rubric";

interface RubricCardProps {
  rubric: RubricItem;
  actions?: React.ReactNode;
}

export function RubricCard({ rubric, actions }: RubricCardProps) {
  return (
    <div className="bg-card-bg rounded-xl border border-border-color p-5 hover:border-primary-green/40 hover:shadow-md transition group flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between">
          <Badge variant={rubric.status === "active" ? "success" : "warning"}>
            {rubric.status === "active" ? "Aktif" : rubric.status === "draft" ? "Draft" : "Arsip"}
          </Badge>

          {actions && <div className="flex items-center gap-1">{actions}</div>}
        </div>

        <h3 className="font-bold text-text-primary text-base group-hover:text-primary-green transition mt-3">
          {rubric.name}
        </h3>
        <p className="text-xs text-text-muted mt-0.5">{rubric.course}</p>
      </div>

      <div className="mt-5 pt-4 border-t border-border-color flex items-center justify-between text-xs text-text-secondary">
        <div className="flex items-center gap-1.5">
          <ListChecks className="w-4 h-4 text-text-muted" />
          <span>{rubric.criteriaCount} Kriteria</span>
        </div>
        <div className="flex items-center gap-1.5 font-semibold text-primary-green">
          <Award className="w-4 h-4 text-primary-green" />
          <span>Bobot {rubric.totalWeight}%</span>
        </div>
      </div>
    </div>
  );
}
