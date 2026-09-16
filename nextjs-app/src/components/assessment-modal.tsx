"use client";

import { Edit2, Loader2, Plus, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import {
  useCreateAssessmentMutation,
  useUpdateAssessmentMutation,
} from "@/hooks/useAssessmentsQuery";
import { useUIStore } from "@/store/useUIStore";
import { type AssessmentItem, CreateAssessmentInputSchema } from "@/types/assessment";

interface AssessmentModalProps {
  initialData?: AssessmentItem | null;
  onClearInitialData?: () => void;
}

export function AssessmentModal({ initialData, onClearInitialData }: AssessmentModalProps) {
  const activeModal = useUIStore((s) => s.activeModal);
  const closeModal = useUIStore((s) => s.closeModal);

  const isOpen = activeModal === "create-assessment" || activeModal === "edit-assessment";
  const isEditing = activeModal === "edit-assessment" && !!initialData;

  const [name, setName] = useState("");
  const [course, setCourse] = useState("");
  const [status, setStatus] = useState<"draft" | "in-review" | "finalized">("draft");
  const [gradedSubmissionsCount, setGradedSubmissionsCount] = useState<number>(0);

  const [fieldErrors, setFieldErrors] = useState<{
    name?: string;
    course?: string;
    gradedSubmissionsCount?: string;
  }>({});

  const createMutation = useCreateAssessmentMutation();
  const updateMutation = useUpdateAssessmentMutation();

  const isPending = createMutation.isPending || updateMutation.isPending;

  useEffect(() => {
    if (isEditing && initialData) {
      setName(initialData.name);
      setCourse(initialData.course);
      setStatus(initialData.status);
      setGradedSubmissionsCount(initialData.gradedSubmissionsCount);
    } else {
      setName("");
      setCourse("");
      setStatus("draft");
      setGradedSubmissionsCount(0);
    }
    setFieldErrors({});
  }, [isEditing, initialData]);

  const handleClose = useCallback(() => {
    closeModal();
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

  if (!isOpen) return null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFieldErrors({});

    const formData = {
      name,
      course,
      status,
      gradedSubmissionsCount,
    };

    const validation = CreateAssessmentInputSchema.safeParse(formData);

    if (!validation.success) {
      const formattedErrors: {
        name?: string;
        course?: string;
        gradedSubmissionsCount?: string;
      } = {};

      validation.error.issues.forEach((err) => {
        const field = err.path[0] as string;
        if (field === "name") formattedErrors.name = err.message;
        if (field === "course") formattedErrors.course = err.message;
        if (field === "gradedSubmissionsCount")
          formattedErrors.gradedSubmissionsCount = err.message;
      });

      setFieldErrors(formattedErrors);
      return;
    }

    if (isEditing && initialData) {
      updateMutation.mutate(
        { id: initialData.id, data: validation.data },
        {
          onSuccess: () => {
            handleClose();
          },
        },
      );
    } else {
      createMutation.mutate(validation.data, {
        onSuccess: () => {
          handleClose();
        },
      });
    }
  }

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Tutup modal"
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity border-none cursor-default"
        onClick={handleClose}
      />

      <div className="relative bg-white rounded-2xl border border-border-color shadow-2xl w-full max-w-md p-6 z-10 animate-[toastIn_0.2s_ease]">
        <div className="flex items-center justify-between pb-4 border-b border-border-color">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-light-green text-primary-green flex items-center justify-center font-bold">
              {isEditing ? <Edit2 size={18} /> : <Plus size={18} />}
            </div>
            <div>
              <h2 className="text-lg font-bold text-text-primary">
                {isEditing ? "Edit Assessment" : "Buat Assessment Baru"}
              </h2>
              <p className="text-xs text-text-secondary">
                {isEditing
                  ? "Perbarui status dan data penilaian"
                  : "Buat sesi penilaian & review tugas baru"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-slate-100 transition"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Nama Assessment */}
          <div>
            <label
              htmlFor="assessment-name"
              className="block text-xs font-semibold text-text-primary mb-1.5"
            >
              Nama Assessment <span className="text-red-500">*</span>
            </label>
            <input
              id="assessment-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Penilaian Tugas 1 HTML/CSS"
              className={`w-full px-3.5 py-2.5 text-sm rounded-xl border bg-slate-50 focus:bg-white focus:outline-none transition ${
                fieldErrors.name
                  ? "border-red-400 focus:border-red-500"
                  : "border-border-color focus:border-primary-green"
              }`}
            />
            {fieldErrors.name && (
              <p className="text-xs text-red-500 mt-1 font-medium">{fieldErrors.name}</p>
            )}
          </div>

          {/* Mata Kuliah */}
          <div>
            <label
              htmlFor="assessment-course"
              className="block text-xs font-semibold text-text-primary mb-1.5"
            >
              Mata Kuliah <span className="text-red-500">*</span>
            </label>
            <input
              id="assessment-course"
              type="text"
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              placeholder="Contoh: Pemrograman Web"
              className={`w-full px-3.5 py-2.5 text-sm rounded-xl border bg-slate-50 focus:bg-white focus:outline-none transition ${
                fieldErrors.course
                  ? "border-red-400 focus:border-red-500"
                  : "border-border-color focus:border-primary-green"
              }`}
            />
            {fieldErrors.course && (
              <p className="text-xs text-red-500 mt-1 font-medium">{fieldErrors.course}</p>
            )}
          </div>

          {/* Status & Submissions Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="assessment-status"
                className="block text-xs font-semibold text-text-primary mb-1.5"
              >
                Status Assessment
              </label>
              <select
                id="assessment-status"
                value={status}
                onChange={(e) => setStatus(e.target.value as "draft" | "in-review" | "finalized")}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-border-color bg-slate-50 focus:bg-white focus:border-primary-green focus:outline-none transition"
              >
                <option value="draft">Draft</option>
                <option value="in-review">In-Review</option>
                <option value="finalized">Finalized</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="assessment-graded"
                className="block text-xs font-semibold text-text-primary mb-1.5"
              >
                Submisi Dinilai
              </label>
              <input
                id="assessment-graded"
                type="number"
                min={0}
                value={gradedSubmissionsCount}
                onChange={(e) => setGradedSubmissionsCount(Number(e.target.value))}
                className={`w-full px-3.5 py-2.5 text-sm rounded-xl border bg-slate-50 focus:bg-white focus:outline-none transition ${
                  fieldErrors.gradedSubmissionsCount
                    ? "border-red-400 focus:border-red-500"
                    : "border-border-color focus:border-primary-green"
                }`}
              />
              {fieldErrors.gradedSubmissionsCount && (
                <p className="text-xs text-red-500 mt-1 font-medium">
                  {fieldErrors.gradedSubmissionsCount}
                </p>
              )}
            </div>
          </div>

          {/* Submit / Actions */}
          <div className="pt-3 flex items-center justify-end gap-3 border-t border-border-color">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-xs font-semibold text-text-secondary hover:bg-slate-100 rounded-lg transition"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex items-center justify-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-primary-green hover:bg-dark-green rounded-lg transition shadow-sm hover:shadow disabled:opacity-60"
            >
              {isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>{isEditing ? "Simpan Perubahan" : "Buat Assessment"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
