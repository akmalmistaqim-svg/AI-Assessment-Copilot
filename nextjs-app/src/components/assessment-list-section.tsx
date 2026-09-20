"use client";

import { AlertCircle, Edit2, Loader2, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { AssessmentModal } from "@/components/assessment-modal";
import { AssessmentCard } from "@/components/cards/assessment-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { useAssessmentsQuery, useDeleteAssessmentMutation } from "@/hooks/useAssessmentsQuery";
import { useUIStore } from "@/store/useUIStore";
import { type AssessmentItem, getAssessmentStatusConfig } from "@/types/assessment";

export function AssessmentListSection() {
  const openModal = useUIStore((s) => s.openModal);
  const searchQuery = useUIStore((s) => s.searchQuery);
  const { data: assessments, isLoading, isError, error, refetch } = useAssessmentsQuery();
  const deleteMutation = useDeleteAssessmentMutation();

  const [selectedAssessment, setSelectedAssessment] = useState<AssessmentItem | null>(null);

  const filteredAssessments = assessments?.filter((asm: AssessmentItem) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return asm.name.toLowerCase().includes(query) || asm.course.toLowerCase().includes(query);
  });

  function handleCreate() {
    setSelectedAssessment(null);
    openModal("create-assessment");
  }

  function handleEdit(asm: AssessmentItem) {
    setSelectedAssessment(asm);
    openModal("edit-assessment");
  }

  function handleDelete(id: string, name: string) {
    if (confirm(`Apakah Anda yakin ingin menghapus assessment "${name}"?`)) {
      deleteMutation.mutate(id);
    }
  }

  const getStatusBadge = (status: AssessmentItem["status"]) => {
    const config = getAssessmentStatusConfig(status);
    switch (config.status) {
      case "finalized":
        return <Badge variant="success">{config.statusLabel}</Badge>;
      case "in-review":
        return <Badge variant="info">{config.statusLabel}</Badge>;
      case "draft":
        return <Badge variant="warning">{config.statusLabel}</Badge>;
    }
  };

  return (
    <>
      <div className="space-y-4">
        {/* Section Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-text-primary">Daftar Sesi Assessment</h2>
            <p className="text-xs text-text-secondary mt-0.5">
              Penilaian & review hasil submisi tugas mahasiswa (TanStack Query + API Route)
            </p>
          </div>
          <Button onClick={handleCreate}>
            <Plus className="w-3.5 h-3.5" />
            Buat Assessment
          </Button>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="bg-card-bg rounded-xl border border-border-color p-8 text-center space-y-3">
            <Loader2 className="w-6 h-6 text-primary-green animate-spin mx-auto" />
            <p className="text-xs text-text-secondary">Memuat data assessment dari API...</p>
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-5 text-center space-y-2">
            <AlertCircle className="w-6 h-6 text-red-500 mx-auto" />
            <p className="text-xs font-medium text-red-700">
              {error instanceof Error ? error.message : "Gagal memuat data assessment"}
            </p>
            <button
              type="button"
              onClick={() => refetch()}
              className="text-xs font-semibold text-red-700 underline hover:text-red-800"
            >
              Coba lagi
            </button>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !isError && assessments && assessments.length === 0 && (
          <EmptyState
            title="Belum ada assessment"
            description="Klik tombol &quot;Buat Assessment&quot; di atas untuk memulai sesi penilaian."
          />
        )}

        {/* Search No Results State */}
        {!isLoading &&
          !isError &&
          assessments &&
          assessments.length > 0 &&
          filteredAssessments &&
          filteredAssessments.length === 0 && (
            <EmptyState
              title="Tidak ada hasil"
              description={`Tidak ditemukan assessment dengan kata kunci "${searchQuery}".`}
            />
          )}

        {/* Assessments Grid */}
        {!isLoading && !isError && filteredAssessments && filteredAssessments.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredAssessments.map((asm: AssessmentItem) => (
              <AssessmentCard
                key={asm.id}
                assessment={asm}
                statusBadge={getStatusBadge(asm.status)}
                actions={
                  <>
                    <button
                      type="button"
                      onClick={() => handleEdit(asm)}
                      className="p-1.5 rounded-lg text-text-muted hover:text-primary-green hover:bg-light-green transition cursor-pointer"
                      title="Edit Assessment"
                    >
                      <Edit2 size={15} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(asm.id, asm.name)}
                      disabled={deleteMutation.isPending}
                      className="p-1.5 rounded-lg text-text-muted hover:text-red-600 hover:bg-red-50 transition cursor-pointer disabled:opacity-50"
                      title="Hapus Assessment"
                    >
                      <Trash2 size={15} />
                    </button>
                  </>
                }
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal Component */}
      <AssessmentModal
        initialData={selectedAssessment}
        onClearInitialData={() => setSelectedAssessment(null)}
      />
    </>
  );
}
