import { ArrowRight, FileText, GraduationCap, UserCheck } from "lucide-react";
import Link from "next/link";
import type { ClassItem } from "@/types/class";

interface MahasiswaClassCardProps {
  cls: ClassItem;
}

export function MahasiswaClassCard({ cls }: MahasiswaClassCardProps) {
  return (
    <Link
      href={`/dashboard/mahasiswa/classes/${cls.id}`}
      className="group bg-card-bg rounded-2xl border border-border-color p-6 hover:border-primary-green/50 hover:shadow-md transition-all duration-200 flex flex-col justify-between no-underline block"
    >
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-light-green text-dark-green border border-emerald-200/60">
            {cls.status === "active" ? "Aktif" : "Arsip"}
          </span>
          <div className="w-9 h-9 rounded-xl bg-slate-50 text-text-muted group-hover:bg-light-green group-hover:text-primary-green transition flex items-center justify-center">
            <GraduationCap size={18} />
          </div>
        </div>

        <div>
          <h3 className="font-bold text-text-primary text-base md:text-lg group-hover:text-primary-green transition line-clamp-1">
            {cls.name}
          </h3>
          <p className="text-xs text-text-muted mt-0.5 font-medium">{cls.semester}</p>
        </div>

        {/* Dosen Pengampu */}
        <div className="flex items-center gap-2 text-xs text-text-secondary pt-1">
          <UserCheck size={14} className="text-primary-green shrink-0" />
          <span className="truncate">
            Dosen: <strong>{cls.lecturerName ?? "Dr. Budi Santoso, M.Kom"}</strong>
          </span>
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-border-color flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 text-text-secondary font-medium">
          <FileText size={14} className="text-primary-green" />
          <span>{cls.assignmentsCount} Tugas</span>
        </div>

        <div className="inline-flex items-center gap-1 text-xs font-semibold text-primary-green group-hover:translate-x-0.5 transition-transform">
          <span>Buka Kelas</span>
          <ArrowRight size={13} />
        </div>
      </div>
    </Link>
  );
}
