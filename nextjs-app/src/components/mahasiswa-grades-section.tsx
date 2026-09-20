"use client";

import {
  AlertCircle,
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  Loader2,
  MessageSquare,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { useGradesQuery } from "@/hooks/useGradesQuery";
import { useUIStore } from "@/store/useUIStore";
import type { GradeItem } from "@/types/grade";

export function MahasiswaGradesSection() {
  const searchQuery = useUIStore((s) => s.searchQuery);
  const { data: grades, isLoading, isError, error, refetch } = useGradesQuery();

  const filteredGrades = grades?.filter((g: GradeItem) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      g.assessmentName.toLowerCase().includes(query) ||
      g.course.toLowerCase().includes(query) ||
      g.assessorName.toLowerCase().includes(query)
    );
  });

  const avgScore =
    grades && grades.length > 0
      ? (grades.reduce((acc, curr) => acc + curr.score, 0) / grades.length).toFixed(1)
      : "0";

  return (
    <div className="space-y-6">
      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card-bg rounded-xl border border-border-color p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-text-muted">Total Penilaian Final</span>
            <p className="text-2xl font-bold text-text-primary mt-1">{grades?.length ?? 0}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-light-green text-primary-green flex items-center justify-center">
            <CheckCircle2 size={20} />
          </div>
        </div>

        <div className="bg-card-bg rounded-xl border border-border-color p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-text-muted">Rata-rata Nilai</span>
            <p className="text-2xl font-bold text-primary-green mt-1">{avgScore}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-light-green text-primary-green flex items-center justify-center">
            <Award size={20} />
          </div>
        </div>

        <div className="bg-card-bg rounded-xl border border-border-color p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-text-muted">Feedback AI & Dosen</span>
            <p className="text-2xl font-bold text-blue-600 mt-1">{grades?.length ?? 0}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Sparkles size={20} />
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="bg-card-bg rounded-xl border border-border-color p-12 text-center space-y-3">
          <Loader2 className="w-7 h-7 text-primary-green animate-spin mx-auto" />
          <p className="text-sm text-text-secondary">Memuat rekap nilai mahasiswa...</p>
        </div>
      )}

      {/* Error State */}
      {isError && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center space-y-2">
          <AlertCircle className="w-7 h-7 text-red-500 mx-auto" />
          <p className="text-sm font-medium text-red-700">
            {error instanceof Error ? error.message : "Gagal memuat rekap nilai"}
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
      {!isLoading && !isError && grades && grades.length === 0 && (
        <EmptyState
          title="Belum ada nilai final"
          description="Saat ini belum ada hasil asesmen yang telah difinalisasi oleh dosen pengampu."
        />
      )}

      {/* Empty Search State */}
      {!isLoading &&
        !isError &&
        grades &&
        grades.length > 0 &&
        filteredGrades &&
        filteredGrades.length === 0 && (
          <EmptyState
            title="Tidak ada hasil"
            description={`Tidak ditemukan data nilai dengan kata kunci "${searchQuery}".`}
          />
        )}

      {/* Grades Grid */}
      {!isLoading && !isError && filteredGrades && filteredGrades.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredGrades.map((g: GradeItem) => (
            <div
              key={g.id}
              className="bg-card-bg rounded-2xl border border-border-color p-6 shadow-xs hover:shadow-md hover:border-primary-green/40 transition flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2 text-xs font-medium text-text-muted">
                    <BookOpen size={14} className="text-primary-green" />
                    <span>{g.course}</span>
                  </div>
                  <Badge variant="success">Finalized</Badge>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-text-primary tracking-tight">
                    {g.assessmentName}
                  </h3>
                  <p className="text-xs text-text-secondary mt-1">
                    Penguji:{" "}
                    <span className="font-semibold text-text-primary">{g.assessorName}</span>
                  </p>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-border-color flex items-center justify-between">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-primary-green">{g.score}</span>
                  <span className="text-xs text-text-muted">/{g.maxScore}</span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 text-xs text-text-muted">
                    <Calendar size={14} />
                    <span>{g.gradedDate}</span>
                  </div>
                  <Link
                    href="/dashboard/mahasiswa/feedback"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-primary-green bg-light-green px-2.5 py-1.5 rounded-lg hover:bg-emerald-100 transition no-underline"
                  >
                    <MessageSquare size={13} />
                    <span>Feedback</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
