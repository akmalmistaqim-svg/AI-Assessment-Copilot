"use client";

import { CheckCircle2, FileUp, Loader2, Send, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useAssignmentsQuery } from "@/hooks/useAssignmentsQuery";
import { useSubmitAssignmentMutation } from "@/hooks/useSubmissionsQuery";
import { useUIStore } from "@/store/useUIStore";
import type { AssignmentItem } from "@/types/assignment";
import { CreateSubmissionInputSchema } from "@/types/submission";

interface SubmitAssignmentModalProps {
  initialAssignmentId?: string | null;
  onClearInitialData?: () => void;
}

export function SubmitAssignmentModal({
  initialAssignmentId,
  onClearInitialData,
}: SubmitAssignmentModalProps) {
  const activeModal = useUIStore((s) => s.activeModal);
  const closeModal = useUIStore((s) => s.closeModal);

  const isOpen = activeModal === "submit-assignment";

  const { data: assignments, isLoading: isLoadingAssignments } = useAssignmentsQuery();
  const submitMutation = useSubmitAssignmentMutation();

  const [assignmentId, setAssignmentId] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{
    assignmentId?: string;
    fileUrl?: string;
    general?: string;
  }>({});
  const [isSuccessToast, setIsSuccessToast] = useState(false);

  // Available assignments that can be submitted (pending/not submitted)
  const pendingAssignments =
    assignments?.filter(
      (a: AssignmentItem) => a.status !== "submitted" || a.id === initialAssignmentId,
    ) ?? [];

  useEffect(() => {
    if (initialAssignmentId) {
      setAssignmentId(initialAssignmentId);
    } else if (pendingAssignments.length > 0 && !assignmentId) {
      setAssignmentId(pendingAssignments[0]?.id ?? "");
    }
  }, [initialAssignmentId, pendingAssignments, assignmentId]);

  const handleClose = useCallback(() => {
    closeModal();
    setFieldErrors({});
    if (onClearInitialData) onClearInitialData();
  }, [closeModal, onClearInitialData]);

  // Close modal on Escape key
  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        handleClose();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleClose]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFieldErrors({});

    const result = CreateSubmissionInputSchema.safeParse({
      assignmentId,
      fileUrl: fileUrl.trim(),
      notes: notes.trim(),
    });

    if (!result.success) {
      const errors: { assignmentId?: string; fileUrl?: string } = {};
      for (const issue of result.error.issues) {
        if (issue.path[0] === "assignmentId") {
          errors.assignmentId = issue.message;
        } else if (issue.path[0] === "fileUrl") {
          errors.fileUrl = issue.message;
        }
      }
      setFieldErrors(errors);
      return;
    }

    try {
      await submitMutation.mutateAsync(result.data);
      setIsSuccessToast(true);
      setTimeout(() => {
        setIsSuccessToast(false);
        setFileUrl("");
        setNotes("");
        handleClose();
      }, 1200);
    } catch (err) {
      setFieldErrors({
        general: err instanceof Error ? err.message : "Gagal mengumpulkan tugas",
      });
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Tutup modal"
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity border-none cursor-default"
        onClick={handleClose}
      />

      {/* Modal Card */}
      <div
        className="relative bg-white rounded-2xl border border-border-color shadow-2xl w-full max-w-lg overflow-hidden z-10 animate-[toastIn_0.2s_ease]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modalTitle"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border-color">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-light-green text-primary-green flex items-center justify-center">
              <FileUp size={20} />
            </div>
            <div>
              <h2 id="modalTitle" className="text-base font-bold text-text-primary">
                Kumpul Tugas Kuliah
              </h2>
              <p className="text-xs text-text-muted mt-0.5">
                Kirimkan tautan berkas pengerjaan tugas Anda
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-slate-100 transition cursor-pointer"
            aria-label="Tutup modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Success Feedback */}
        {isSuccessToast ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-light-green text-primary-green flex items-center justify-center mx-auto">
              <CheckCircle2 size={28} />
            </div>
            <h3 className="text-base font-bold text-text-primary">Tugas Berhasil Dikumpulkan!</h3>
            <p className="text-xs text-text-secondary">
              Status tugas telah diperbarui menjadi &ldquo;Terkumpul&rdquo;.
            </p>
          </div>
        ) : (
          /* Form Content */
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {fieldErrors.general && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs font-medium text-red-700">
                {fieldErrors.general}
              </div>
            )}

            {/* Select Assignment */}
            <div className="space-y-1.5">
              <label
                htmlFor="assignmentSelect"
                className="block text-xs font-semibold text-text-primary"
              >
                Pilih Tugas <span className="text-red-500">*</span>
              </label>
              {isLoadingAssignments ? (
                <div className="h-10 w-full bg-slate-100 rounded-lg animate-pulse" />
              ) : pendingAssignments.length === 0 ? (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800">
                  Seluruh tugas kuliah sudah terkumpul atau belum ada penugasan aktif.
                </div>
              ) : (
                <select
                  id="assignmentSelect"
                  value={assignmentId}
                  onChange={(e) => setAssignmentId(e.target.value)}
                  className={`w-full px-3.5 py-2 text-xs bg-slate-50 border rounded-lg focus:outline-none focus:border-primary-green focus:bg-white transition ${
                    fieldErrors.assignmentId ? "border-red-400 bg-red-50/50" : "border-border-color"
                  }`}
                >
                  <option value="" disabled>
                    -- Pilih Tugas yang Tersedia --
                  </option>
                  {pendingAssignments.map((asg: AssignmentItem) => (
                    <option key={asg.id} value={asg.id}>
                      {asg.title} ({asg.course}) — Tenggat: {asg.deadline}
                    </option>
                  ))}
                </select>
              )}
              {fieldErrors.assignmentId && (
                <p className="text-[11px] text-red-500 font-medium">{fieldErrors.assignmentId}</p>
              )}
            </div>

            {/* File URL / Link Submission */}
            <div className="space-y-1.5">
              <label
                htmlFor="fileUrlInput"
                className="block text-xs font-semibold text-text-primary"
              >
                Tautan Berkas Tugas / Repository <span className="text-red-500">*</span>
              </label>
              <input
                id="fileUrlInput"
                type="text"
                placeholder="https://github.com/username/project atau link Google Drive"
                value={fileUrl}
                onChange={(e) => setFileUrl(e.target.value)}
                className={`w-full px-3.5 py-2 text-xs bg-slate-50 border rounded-lg focus:outline-none focus:border-primary-green focus:bg-white transition ${
                  fieldErrors.fileUrl ? "border-red-400 bg-red-50/50" : "border-border-color"
                }`}
              />
              <p className="text-[11px] text-text-muted">
                Masukkan URL publik repositori GitHub, GitLab, atau Google Drive tugas Anda.
              </p>
              {fieldErrors.fileUrl && (
                <p className="text-[11px] text-red-500 font-medium">{fieldErrors.fileUrl}</p>
              )}
            </div>

            {/* Optional Notes */}
            <div className="space-y-1.5">
              <label htmlFor="notesInput" className="block text-xs font-semibold text-text-primary">
                Catatan / Keterangan (Opsional)
              </label>
              <textarea
                id="notesInput"
                rows={3}
                placeholder="Tambahkan informasi tambahan untuk dosen penilai jika ada..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-border-color rounded-lg focus:outline-none focus:border-primary-green focus:bg-white transition resize-none"
              />
            </div>

            {/* Action Buttons */}
            <div className="pt-3 border-t border-border-color flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={handleClose}
                disabled={submitMutation.isPending}
                className="px-4 py-2 text-xs font-semibold text-text-secondary hover:text-text-primary hover:bg-slate-100 rounded-lg transition cursor-pointer disabled:opacity-50"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={submitMutation.isPending || pendingAssignments.length === 0}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-primary-green hover:bg-dark-green rounded-lg transition shadow-xs active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitMutation.isPending ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    <span>Mengirim...</span>
                  </>
                ) : (
                  <>
                    <Send size={14} />
                    <span>Kumpul Sekarang</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
