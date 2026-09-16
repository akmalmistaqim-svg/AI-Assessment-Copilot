import { Calendar, FileText } from "lucide-react";
import type React from "react";
import type { AssignmentItem } from "@/types/assignment";

interface AssignmentCardProps {
  assignment: AssignmentItem;
  statusBadge?: React.ReactNode;
  actions?: React.ReactNode;
}

export function AssignmentCard({ assignment, statusBadge, actions }: AssignmentCardProps) {
  return (
    <div className="bg-card-bg rounded-xl border border-border-color p-5 hover:border-primary-green/40 hover:shadow-md transition group flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between">
          {statusBadge}

          {actions && <div className="flex items-center gap-1">{actions}</div>}
        </div>

        <h3 className="font-bold text-text-primary text-base group-hover:text-primary-green transition mt-3">
          {assignment.title}
        </h3>
        <p className="text-xs text-text-secondary mt-0.5">{assignment.course}</p>
        <p className="text-xs text-text-muted mt-2 line-clamp-2 leading-relaxed">
          {assignment.description}
        </p>
      </div>

      <div className="mt-4 pt-3.5 border-t border-border-color flex items-center justify-between text-xs text-text-muted">
        <div className="flex items-center gap-1.5 font-medium text-amber-700">
          <Calendar className="w-3.5 h-3.5 text-amber-600" />
          <span>Tenggat: {assignment.deadline}</span>
        </div>
        <div className="flex items-center gap-1 text-primary-green font-medium">
          <FileText className="w-3.5 h-3.5" />
          <span>Tugas Kelas</span>
        </div>
      </div>
    </div>
  );
}
