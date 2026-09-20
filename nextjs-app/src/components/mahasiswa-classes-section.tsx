"use client";

import { AlertCircle, BookOpen, GraduationCap, Loader2 } from "lucide-react";
import { MahasiswaClassCard } from "@/components/cards/mahasiswa-class-card";
import { EmptyState } from "@/components/ui/empty-state";
import { useClassesQuery } from "@/hooks/useClassesQuery";
import { useUIStore } from "@/store/useUIStore";
import type { ClassItem } from "@/types/class";

export function MahasiswaClassesSection() {
  const searchQuery = useUIStore((s) => s.searchQuery);
  const { data: classes, isLoading, isError, error, refetch } = useClassesQuery();

  const filteredClasses = classes?.filter((cls: ClassItem) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      cls.name.toLowerCase().includes(query) ||
      cls.semester.toLowerCase().includes(query) ||
      (cls.lecturerName?.toLowerCase().includes(query) ?? false)
    );
  });

  const totalAssignments =
    classes?.reduce((acc, curr) => acc + (curr.assignmentsCount ?? 0), 0) ?? 0;

  return (
    <div className="space-y-6">
      {/* Overview Stat Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-card-bg rounded-xl border border-border-color p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-text-muted">Total Kelas Terdaftar</span>
            <p className="text-2xl font-bold text-text-primary mt-1">{classes?.length ?? 0}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-light-green text-primary-green flex items-center justify-center">
            <GraduationCap size={20} />
          </div>
        </div>

        <div className="bg-card-bg rounded-xl border border-border-color p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-text-muted">Total Penugasan Kelas</span>
            <p className="text-2xl font-bold text-primary-green mt-1">{totalAssignments}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-light-green text-primary-green flex items-center justify-center">
            <BookOpen size={20} />
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="bg-card-bg rounded-xl border border-border-color p-12 text-center space-y-3">
          <Loader2 className="w-7 h-7 text-primary-green animate-spin mx-auto" />
          <p className="text-sm text-text-secondary">Memuat daftar kelas terdaftar...</p>
        </div>
      )}

      {/* Error State */}
      {isError && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center space-y-2">
          <AlertCircle className="w-7 h-7 text-red-500 mx-auto" />
          <p className="text-sm font-medium text-red-700">
            {error instanceof Error ? error.message : "Gagal memuat daftar kelas"}
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="text-xs font-semibold text-red-700 underline hover:text-red-800 cursor-pointer"
          >
            Coba lagi
          </button>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !isError && classes && classes.length === 0 && (
        <EmptyState
          title="Belum ada kelas terdaftar"
          description="Anda belum terdaftar dalam kelas perkuliahan manapun saat ini."
        />
      )}

      {/* Empty Search State */}
      {!isLoading &&
        !isError &&
        classes &&
        classes.length > 0 &&
        filteredClasses &&
        filteredClasses.length === 0 && (
          <EmptyState
            title="Tidak ada hasil"
            description={`Tidak ditemukan kelas yang cocok dengan kata kunci "${searchQuery}".`}
          />
        )}

      {/* Classes Grid */}
      {!isLoading && !isError && filteredClasses && filteredClasses.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredClasses.map((cls: ClassItem) => (
            <MahasiswaClassCard key={cls.id} cls={cls} />
          ))}
        </div>
      )}
    </div>
  );
}
