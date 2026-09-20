"use client";

import { AlertCircle, Filter, Loader2 } from "lucide-react";
import { useState } from "react";
import { MahasiswaAssignmentCard } from "@/components/cards/mahasiswa-assignment-card";
import { EmptyState } from "@/components/ui/empty-state";
import { useAssignmentsQuery } from "@/hooks/useAssignmentsQuery";
import { useUIStore } from "@/store/useUIStore";
import type { AssignmentItem } from "@/types/assignment";

type FilterStatus = "all" | "pending" | "submitted" | "graded";

export function MahasiswaAssignmentListFull() {
  const searchQuery = useUIStore((s) => s.searchQuery);
  const { data: assignments, isLoading, isError, error, refetch } = useAssignmentsQuery();
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("all");

  const filteredAssignments = assignments?.filter((asg: AssignmentItem) => {
    // Status filter
    if (statusFilter !== "all" && asg.status !== statusFilter) {
      return false;
    }
    // Search query filter
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      asg.title.toLowerCase().includes(query) ||
      asg.course.toLowerCase().includes(query) ||
      asg.description.toLowerCase().includes(query)
    );
  });

  const filterButtons: { id: FilterStatus; label: string }[] = [
    { id: "all", label: "Semua" },
    { id: "pending", label: "Belum Dikumpul" },
    { id: "submitted", label: "Terkumpul" },
    { id: "graded", label: "Dinilai" },
  ];

  return (
    <div className="space-y-6">
      {/* Filter Tabs & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card-bg p-4 rounded-xl border border-border-color shadow-xs">
        <div className="flex items-center gap-2 text-xs font-semibold text-text-secondary">
          <Filter size={15} className="text-primary-green" />
          <span>Status Tugas:</span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {filterButtons.map((btn) => (
            <button
              key={btn.id}
              type="button"
              onClick={() => setStatusFilter(btn.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                statusFilter === btn.id
                  ? "bg-primary-green text-white shadow-xs font-semibold"
                  : "bg-slate-50 text-text-secondary hover:bg-slate-100 hover:text-text-primary border border-border-color/60"
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="bg-card-bg rounded-xl border border-border-color p-12 text-center space-y-3">
          <Loader2 className="w-7 h-7 text-primary-green animate-spin mx-auto" />
          <p className="text-sm text-text-secondary">Memuat seluruh daftar tugas...</p>
        </div>
      )}

      {/* Error State */}
      {isError && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center space-y-2">
          <AlertCircle className="w-7 h-7 text-red-500 mx-auto" />
          <p className="text-sm font-medium text-red-700">
            {error instanceof Error ? error.message : "Gagal memuat daftar tugas"}
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

      {/* Empty State (No assignments at all) */}
      {!isLoading && !isError && assignments && assignments.length === 0 && (
        <EmptyState
          title="Belum ada tugas"
          description="Saat ini belum ada tugas aktif yang diberikan oleh dosen pengampu."
        />
      )}

      {/* Empty Filter or Search Results */}
      {!isLoading &&
        !isError &&
        assignments &&
        assignments.length > 0 &&
        filteredAssignments &&
        filteredAssignments.length === 0 && (
          <EmptyState
            title="Tidak ada hasil"
            description={
              searchQuery.trim()
                ? `Tidak ditemukan tugas yang cocok dengan kata kunci "${searchQuery}".`
                : `Tidak ada tugas dengan status "${filterButtons.find((b) => b.id === statusFilter)?.label}".`
            }
          />
        )}

      {/* Assignments List */}
      {!isLoading && !isError && filteredAssignments && filteredAssignments.length > 0 && (
        <div className="bg-card-bg rounded-xl border border-border-color divide-y divide-border-color shadow-sm">
          {filteredAssignments.map((asg: AssignmentItem) => (
            <MahasiswaAssignmentCard key={asg.id} assignment={asg} />
          ))}
        </div>
      )}
    </div>
  );
}
