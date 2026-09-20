"use client";

import { FileUp } from "lucide-react";
import { useUIStore } from "@/store/useUIStore";

interface SubmitAssignmentButtonProps {
  className?: string;
  label?: string;
}

export function SubmitAssignmentButton({
  className = "px-4 py-2 text-xs font-semibold text-white bg-primary-green hover:bg-dark-green rounded-lg transition shadow-sm hover:shadow inline-flex items-center gap-1.5 cursor-pointer active:scale-95",
  label = "+ Kumpul Tugas",
}: SubmitAssignmentButtonProps) {
  const openModal = useUIStore((s) => s.openModal);

  return (
    <button type="button" onClick={() => openModal("submit-assignment")} className={className}>
      <FileUp size={14} />
      <span>{label}</span>
    </button>
  );
}
