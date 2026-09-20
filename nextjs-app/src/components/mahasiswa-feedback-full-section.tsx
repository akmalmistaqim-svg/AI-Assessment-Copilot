"use client";

import {
  AlertCircle,
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  FileCheck2,
  Loader2,
  Sparkles,
  UserCheck,
} from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { useGradesQuery } from "@/hooks/useGradesQuery";
import { useUIStore } from "@/store/useUIStore";
import type { GradeItem } from "@/types/grade";

export function MahasiswaFeedbackFullSection() {
  const searchQuery = useUIStore((s) => s.searchQuery);
  const { data: grades, isLoading, isError, error, refetch } = useGradesQuery();

  const filteredGrades = grades?.filter((g: GradeItem) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      g.assessmentName.toLowerCase().includes(query) ||
      g.course.toLowerCase().includes(query) ||
      g.comment.toLowerCase().includes(query) ||
      (g.aiReview?.toLowerCase().includes(query) ?? false) ||
      g.assessorName.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-6">
      {/* Loading State */}
      {isLoading && (
        <div className="bg-card-bg rounded-xl border border-border-color p-12 text-center space-y-3">
          <Loader2 className="w-7 h-7 text-primary-green animate-spin mx-auto" />
          <p className="text-sm text-text-secondary">
            Memuat seluruh catatan dan ulasan feedback...
          </p>
        </div>
      )}

      {/* Error State */}
      {isError && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center space-y-2">
          <AlertCircle className="w-7 h-7 text-red-500 mx-auto" />
          <p className="text-sm font-medium text-red-700">
            {error instanceof Error ? error.message : "Gagal memuat feedback tugas"}
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
          title="Belum ada feedback"
          description="Saat ini belum ada umpan balik atau ulasan penilaian dari dosen."
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
            description={`Tidak ditemukan feedback dengan kata kunci "${searchQuery}".`}
          />
        )}

      {/* Feedback List */}
      {!isLoading && !isError && filteredGrades && filteredGrades.length > 0 && (
        <div className="space-y-6">
          {filteredGrades.map((item: GradeItem) => (
            <div
              key={item.id}
              className="bg-card-bg rounded-2xl border border-border-color p-6 md:p-8 shadow-xs hover:shadow-md transition space-y-5"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 text-xs font-medium text-text-muted mb-1">
                    <BookOpen size={14} className="text-primary-green" />
                    <span>{item.course}</span>
                    {item.rubricName && (
                      <>
                        <span>•</span>
                        <span className="inline-flex items-center gap-1 text-primary-green">
                          <FileCheck2 size={13} />
                          {item.rubricName}
                        </span>
                      </>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-text-primary tracking-tight">
                    {item.assessmentName}
                  </h3>
                </div>

                <div className="flex items-baseline gap-1 self-start sm:self-auto bg-light-green/70 px-4 py-2 rounded-xl border border-emerald-200/80">
                  <Award size={18} className="text-primary-green mr-1" />
                  <span className="text-2xl font-black text-primary-green">{item.score}</span>
                  <span className="text-xs text-dark-green font-medium">/{item.maxScore}</span>
                </div>
              </div>

              {/* AI Copilot Review Box */}
              {item.aiReview && (
                <div className="bg-light-green/40 border border-emerald-200/70 rounded-xl p-4 md:p-5 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-dark-green">
                    <Sparkles className="w-4 h-4 text-primary-green" />
                    <span>Ulasan AI Copilot:</span>
                  </div>
                  <p className="text-xs md:text-sm text-dark-green/90 leading-relaxed italic">
                    &ldquo;{item.aiReview}&rdquo;
                  </p>
                </div>
              )}

              {/* Lecturer Comment Box */}
              <div className="bg-slate-50 border border-border-color/80 rounded-xl p-4 md:p-5 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-text-primary">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  <span>Catatan & Evaluasi Pengajar:</span>
                </div>
                <p className="text-xs md:text-sm text-text-secondary leading-relaxed">
                  {item.comment}
                </p>
              </div>

              {/* Footer Meta */}
              <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-text-muted border-t border-border-color/60">
                <div className="flex items-center gap-1.5">
                  <UserCheck size={14} className="text-primary-green" />
                  <span>
                    Penilai: <strong>{item.assessorName}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar size={14} />
                  <span>Difinalisasi pada: {item.gradedDate}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
