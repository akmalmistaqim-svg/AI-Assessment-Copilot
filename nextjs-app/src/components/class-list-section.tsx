"use client";

import { AlertCircle, Edit2, Loader2, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { ClassCard } from "@/components/cards/class-card";
import { ClassModal } from "@/components/class-modal";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { useClassesQuery, useDeleteClassMutation } from "@/hooks/useClassesQuery";
import { useUIStore } from "@/store/useUIStore";
import type { ClassItem } from "@/types/class";

export function ClassListSection() {
  const openModal = useUIStore((s) => s.openModal);
  const searchQuery = useUIStore((s) => s.searchQuery);
  const { data: classes, isLoading, isError, error, refetch } = useClassesQuery();
  const deleteMutation = useDeleteClassMutation();

  const [selectedClass, setSelectedClass] = useState<ClassItem | null>(null);

  const filteredClasses = classes?.filter((cls: ClassItem) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return cls.name.toLowerCase().includes(query) || cls.semester.toLowerCase().includes(query);
  });

  function handleCreate() {
    setSelectedClass(null);
    openModal("create-class");
  }

  function handleEdit(cls: ClassItem) {
    setSelectedClass(cls);
    openModal("edit-class");
  }

  function handleDelete(id: string, name: string) {
    if (confirm(`Apakah Anda yakin ingin menghapus kelas "${name}"?`)) {
      deleteMutation.mutate(id);
    }
  }

  return (
    <>
      <div className="space-y-4">
        {/* Section Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-text-primary">Daftar Kelas</h2>
            <p className="text-xs text-text-secondary mt-0.5">
              Daftar mata kuliah yang diampu (TanStack Query + API Route)
            </p>
          </div>
          <Button onClick={handleCreate}>
            <Plus className="w-3.5 h-3.5" />
            Tambah Kelas
          </Button>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="bg-card-bg rounded-xl border border-border-color p-8 text-center space-y-3">
            <Loader2 className="w-6 h-6 text-primary-green animate-spin mx-auto" />
            <p className="text-xs text-text-secondary">Memuat data kelas dari API...</p>
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-5 text-center space-y-2">
            <AlertCircle className="w-6 h-6 text-red-500 mx-auto" />
            <p className="text-xs font-medium text-red-700">
              {error instanceof Error ? error.message : "Gagal memuat data kelas"}
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
        {!isLoading && !isError && classes && classes.length === 0 && (
          <EmptyState
            title="Belum ada kelas"
            description="Klik tombol &quot;Tambah Kelas&quot; di atas untuk membuat kelas pertama Anda."
          />
        )}

        {/* Search No Results State */}
        {!isLoading &&
          !isError &&
          classes &&
          classes.length > 0 &&
          filteredClasses &&
          filteredClasses.length === 0 && (
            <EmptyState
              title="Tidak ada hasil"
              description={`Tidak ditemukan kelas dengan kata kunci "${searchQuery}".`}
            />
          )}

        {/* Classes Grid */}
        {!isLoading && !isError && filteredClasses && filteredClasses.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredClasses.map((cls: ClassItem) => (
              <ClassCard
                key={cls.id}
                cls={cls}
                actions={
                  <>
                    <button
                      type="button"
                      onClick={() => handleEdit(cls)}
                      className="p-1.5 rounded-lg text-text-muted hover:text-primary-green hover:bg-light-green transition cursor-pointer"
                      title="Edit Kelas"
                    >
                      <Edit2 size={15} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(cls.id, cls.name)}
                      disabled={deleteMutation.isPending}
                      className="p-1.5 rounded-lg text-text-muted hover:text-red-600 hover:bg-red-50 transition cursor-pointer disabled:opacity-50"
                      title="Hapus Kelas"
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
      <ClassModal initialData={selectedClass} onClearInitialData={() => setSelectedClass(null)} />
    </>
  );
}
