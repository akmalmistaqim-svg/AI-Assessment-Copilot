import { ArrowRight, Calendar } from "lucide-react";
import Link from "next/link";
import type { AssignmentItem } from "@/types/assignment";

interface MahasiswaAssignmentCardProps {
  assignment: AssignmentItem;
}

export function MahasiswaAssignmentCard({ assignment }: MahasiswaAssignmentCardProps) {
  const getStatusBadge = (status: AssignmentItem["status"]) => {
    switch (status) {
      case "submitted":
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            Terkumpul
          </span>
        );
      case "graded":
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-light-green text-dark-green border border-emerald-200">
            Dinilai
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            Belum Dikumpul
          </span>
        );
    }
  };

  return (
    <div className="p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 hover:bg-black/[0.01] transition">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-text-primary text-base">{assignment.title}</h3>
        </div>
        <p className="text-xs text-text-secondary">{assignment.course}</p>
        <div className="flex items-center gap-1.5 text-xs text-text-muted pt-1">
          <Calendar className="w-3.5 h-3.5" />
          <span>Tenggat: {assignment.deadline}</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {getStatusBadge(assignment.status)}
        <Link
          href={`/dashboard/mahasiswa/assignments/${assignment.id}`}
          className="p-2 rounded-lg hover:bg-slate-100 text-text-secondary hover:text-primary-green transition flex items-center justify-center no-underline"
          title="Lihat Detail Tugas"
          aria-label={`Detail tugas ${assignment.title}`}
        >
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
