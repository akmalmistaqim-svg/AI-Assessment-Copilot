import { FileText, Users } from "lucide-react";
import type React from "react";
import { Badge } from "@/components/ui/badge";
import type { ClassItem } from "@/types/class";

interface ClassCardProps {
  cls: ClassItem;
  actions?: React.ReactNode;
}

export function ClassCard({ cls, actions }: ClassCardProps) {
  return (
    <div className="bg-card-bg rounded-xl border border-border-color p-5 hover:border-primary-green/40 hover:shadow-md transition group relative">
      <div className="flex items-start justify-between">
        <div>
          <Badge variant={cls.status === "active" ? "success" : "secondary"} className="mb-2">
            {cls.status === "active" ? "Aktif" : "Arsip"}
          </Badge>
          <h3 className="font-bold text-text-primary text-base group-hover:text-primary-green transition">
            {cls.name}
          </h3>
          <p className="text-xs text-text-muted mt-0.5">{cls.semester}</p>
        </div>

        {actions && <div className="flex items-center gap-1">{actions}</div>}
      </div>

      <div className="mt-4 pt-4 border-t border-border-color flex items-center justify-between text-xs text-text-secondary">
        <div className="flex items-center gap-1.5">
          <Users className="w-4 h-4 text-text-muted" />
          <span>{cls.studentsCount} Mahasiswa</span>
        </div>
        <div className="flex items-center gap-1.5">
          <FileText className="w-4 h-4 text-text-muted" />
          <span>{cls.assignmentsCount} Tugas</span>
        </div>
      </div>
    </div>
  );
}
