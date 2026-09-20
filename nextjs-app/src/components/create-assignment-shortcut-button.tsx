"use client";

import { Plus } from "lucide-react";
import { useUIStore } from "@/store/useUIStore";

export function CreateAssignmentShortcutButton() {
  const openModal = useUIStore((s) => s.openModal);

  return (
    <button
      type="button"
      onClick={() => openModal("create-assignment")}
      className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-primary-green hover:bg-dark-green rounded-lg transition shadow-sm hover:shadow active:scale-95 cursor-pointer"
      aria-label="Buat Tugas Baru"
    >
      <Plus size={14} className="text-white shrink-0" strokeWidth={2.5} />
      <span className="text-white font-semibold">Buat Tugas</span>
    </button>
  );
}
