"use client";

import { AlertCircle, Edit2, Loader2, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { RubricCard } from "@/components/cards/rubric-card";
import { RubricModal } from "@/components/rubric-modal";
import { EmptyState } from "@/components/ui/empty-state";
import { useDeleteRubricMutation, useRubricsQuery } from "@/hooks/useRubricsQuery";
import { useUIStore } from "@/store/useUIStore";
import type { RubricItem } from "@/types/rubric";

export function RubricListSection() {
  const openModal = useUIStore((s) => s.openModal);
  const { data: rubrics, isLoading, isError, error, refetch } = useRubricsQuery();
  const deleteMutation = useDeleteRubricMutation();

  const [selectedRubric, setSelectedRubric] = useState<RubricItem | null>(null);

  function handleCreate() {
    setSelectedRubric(null);
    openModal("create-rubric");
  }

  function handleEdit(rubric: RubricItem) {
    setSelectedRubric(rubric);
    openModal("edit-rubric");
  }

  function handleDelete(id: string, name: string) {
    if (confirm(`Apakah Anda yakin ingin menghapus rubrik "${name}"?`)) {
      deleteMutation.mutate(id);
    }
  }

  return (
    <>
      <div className="space-y-4">
        {/* Section Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-text-primary">Daftar Rubrik Penilaian</h2>
            <p className="text-xs text-text-secondary mt-0.5">
              Standar dan kriteria penilaian terstruktur (TanStack Query + API Route)
            </p>
          </div>
          <button
            type="button"
            onClick={handleCreate}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-primary-green hover:bg-dark-green rounded-lg transition shadow-sm hover:shadow active:scale-95 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Tambah Rubrik
          </button>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="bg-card-bg rounded-xl border border-border-color p-8 text-center space-y-3">
            <Loader2 className="w-6 h-6 text-primary-green animate-spin mx-auto" />
            <p className="text-xs text-text-secondary">Memuat data rubrik dari API...</p>
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-5 text-center space-y-2">
            <AlertCircle className="w-6 h-6 text-red-500 mx-auto" />
            <p className="text-xs font-medium text-red-700">
              {error instanceof Error ? error.message : "Gagal memuat data rubrik"}
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
        {!isLoading && !isError && rubrics && rubrics.length === 0 && (
          <EmptyState
            title="Belum ada rubrik"
            description="Klik tombol &quot;Tambah Rubrik&quot; di atas untuk membuat standar penilaian baru."
          />
        )}

        {/* Rubrics Grid */}
        {!isLoading && !isError && rubrics && rubrics.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {rubrics.map((rubric: RubricItem) => (
              <RubricCard
                key={rubric.id}
                rubric={rubric}
                actions={
                  <>
                    <button
                      type="button"
                      onClick={() => handleEdit(rubric)}
                      className="p-1.5 rounded-lg text-text-muted hover:text-primary-green hover:bg-light-green transition cursor-pointer"
                      title="Edit Rubrik"
                    >
                      <Edit2 size={15} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(rubric.id, rubric.name)}
                      disabled={deleteMutation.isPending}
                      className="p-1.5 rounded-lg text-text-muted hover:text-red-600 hover:bg-red-50 transition cursor-pointer disabled:opacity-50"
                      title="Hapus Rubrik"
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
      <RubricModal
        initialData={selectedRubric}
        onClearInitialData={() => setSelectedRubric(null)}
      />
    </>
  );
}
