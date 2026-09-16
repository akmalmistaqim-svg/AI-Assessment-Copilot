import { CheckCircle2, ClipboardCheck } from "lucide-react";
import type React from "react";
import type { AssessmentItem } from "@/types/assessment";

interface AssessmentCardProps {
  assessment: AssessmentItem;
  statusBadge?: React.ReactNode;
  actions?: React.ReactNode;
}

export function AssessmentCard({ assessment, statusBadge, actions }: AssessmentCardProps) {
  return (
    <div className="bg-card-bg rounded-xl border border-border-color p-5 hover:border-primary-green/40 hover:shadow-md transition group flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between">
          {statusBadge}

          {actions && <div className="flex items-center gap-1">{actions}</div>}
        </div>

        <h3 className="font-bold text-text-primary text-base group-hover:text-primary-green transition mt-3">
          {assessment.name}
        </h3>
        <p className="text-xs text-text-secondary mt-0.5">{assessment.course}</p>
      </div>

      <div className="mt-5 pt-4 border-t border-border-color flex items-center justify-between text-xs text-text-secondary">
        <div className="flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{assessment.gradedSubmissionsCount} Submisi Dinilai</span>
        </div>
        <div className="flex items-center gap-1 text-primary-green font-medium">
          <ClipboardCheck className="w-4 h-4" />
          <span>Assessment</span>
        </div>
      </div>
    </div>
  );
}
