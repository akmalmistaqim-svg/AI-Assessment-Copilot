"use client";

import { AlertCircle, Edit2, Loader2, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { AssignmentModal } from "@/components/assignment-modal";
import { AssignmentCard } from "@/components/cards/assignment-card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { useAssignmentsQuery, useDeleteAssignmentMutation } from "@/hooks/useAssignmentsQuery";
import { useUIStore } from "@/store/useUIStore";
import type { AssignmentItem } from "@/types/assignment";

export function AssignmentListSection() {
  const openModal = useUIStore((s) => s.openModal);
  const { data: assignments, isLoading, isError, error, refetch } = useAssignmentsQuery();
  const deleteMutation = useDeleteAssignmentMutation();

  const [selectedAssignment, setSelectedAssignment] = useState<AssignmentItem | null>(null);

  function handleCreate() {
    setSelectedAssignment(null);
    openModal("create-assignment");
  }

  function handleEdit(asg: AssignmentItem) {
    setSelectedAssignment(asg);
    openModal("edit-assignment");
  }

  function handleDelete(id: string, title: string) {
    if (confirm(`Apakah Anda yakin ingin menghapus tugas "${title}"?`)) {
      deleteMutation.mutate(id);
    }
  }

  const getStatusBadge = (status: AssignmentItem["status"]) => {
    switch (status) {
      case "submitted":
        return <Badge variant="info">Terkumpul</Badge>;
      case "graded":
        return <Badge variant="success">Dinilai</Badge>;
      default:
        return <Badge variant="warning">Pending</Badge>;
    }
  };

  return (
    <>
      <div className="space-y-4">
        {/* Section Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-text-primary">Daftar Penugasan</h2>
            <p className="text-xs text-text-secondary mt-0.5">
              Tugas mahasiswa dari berbagai mata kuliah (TanStack Query + API Route)
            </p>
          </div>
          <button
            type="button"
            onClick={handleCreate}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-primary-green hover:bg-dark-green rounded-lg transition shadow-sm hover:shadow active:scale-95 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Buat Tugas
          </button>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="bg-card-bg rounded-xl border border-border-color p-8 text-center space-y-3">
            <Loader2 className="w-6 h-6 text-primary-green animate-spin mx-auto" />
            <p className="text-xs text-text-secondary">Memuat data tugas dari API...</p>
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-5 text-center space-y-2">
            <AlertCircle className="w-6 h-6 text-red-500 mx-auto" />
            <p className="text-xs font-medium text-red-700">
              {error instanceof Error ? error.message : "Gagal memuat data tugas"}
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
        {!isLoading && !isError && assignments && assignments.length === 0 && (
          <EmptyState
            title="Belum ada tugas"
            description="Klik tombol &quot;Buat Tugas&quot; di atas untuk membuat penugasan pertama Anda."
          />
        )}

        {/* Assignments Grid */}
        {!isLoading && !isError && assignments && assignments.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {assignments.map((asg: AssignmentItem) => (
              <AssignmentCard
                key={asg.id}
                assignment={asg}
                statusBadge={getStatusBadge(asg.status)}
                actions={
                  <>
                    <button
                      type="button"
                      onClick={() => handleEdit(asg)}
                      className="p-1.5 rounded-lg text-text-muted hover:text-primary-green hover:bg-light-green transition cursor-pointer"
                      title="Edit Tugas"
                    >
                      <Edit2 size={15} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(asg.id, asg.title)}
                      disabled={deleteMutation.isPending}
                      className="p-1.5 rounded-lg text-text-muted hover:text-red-600 hover:bg-red-50 transition cursor-pointer disabled:opacity-50"
                      title="Hapus Tugas"
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
      <AssignmentModal
        initialData={selectedAssignment}
        onClearInitialData={() => setSelectedAssignment(null)}
      />
    </>
  );
}
