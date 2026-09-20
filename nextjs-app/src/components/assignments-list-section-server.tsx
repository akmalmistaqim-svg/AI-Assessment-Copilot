"use client";

import { AlertCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { MahasiswaAssignmentCard } from "@/components/cards/mahasiswa-assignment-card";
import { EmptyState } from "@/components/ui/empty-state";
import { useAssignmentsQuery } from "@/hooks/useAssignmentsQuery";
import { useUIStore } from "@/store/useUIStore";
import type { AssignmentItem } from "@/types/assignment";

export function AssignmentsListSectionServer() {
  const searchQuery = useUIStore((s) => s.searchQuery);
  const { data: assignments, isLoading, isError, error, refetch } = useAssignmentsQuery();

  const filteredAssignments = assignments?.filter((asg: AssignmentItem) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      asg.title.toLowerCase().includes(query) ||
      asg.course.toLowerCase().includes(query) ||
      asg.description.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-text-primary">Tugas Saya</h2>
          <p className="text-xs text-text-secondary mt-0.5">
            Daftar tugas dari seluruh mata kuliah
          </p>
        </div>
        <Link
          href="/dashboard/mahasiswa/assignments"
          className="text-xs text-primary-green font-medium hover:underline no-underline"
        >
          Lihat Semua
        </Link>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="bg-card-bg rounded-xl border border-border-color p-8 text-center space-y-3">
          <Loader2 className="w-6 h-6 text-primary-green animate-spin mx-auto" />
          <p className="text-xs text-text-secondary">Memuat data tugas...</p>
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
            className="text-xs font-semibold text-red-700 underline hover:text-red-800 cursor-pointer"
          >
            Coba lagi
          </button>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !isError && assignments && assignments.length === 0 && (
        <EmptyState
          title="Belum ada tugas"
          description="Saat ini belum ada tugas yang tersedia dari dosen."
        />
      )}

      {/* Search No Results */}
      {!isLoading &&
        !isError &&
        assignments &&
        assignments.length > 0 &&
        filteredAssignments &&
        filteredAssignments.length === 0 && (
          <EmptyState
            title="Tidak ada hasil"
            description={`Tidak ditemukan tugas dengan kata kunci "${searchQuery}".`}
          />
        )}

      {/* List */}
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
