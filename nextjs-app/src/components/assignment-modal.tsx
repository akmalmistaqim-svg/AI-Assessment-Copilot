"use client";

import { Edit2, Loader2, Plus, X } from "lucide-react";
import { useEffect, useState } from "react";
import {
  useCreateAssignmentMutation,
  useUpdateAssignmentMutation,
} from "@/hooks/useAssignmentsQuery";
import { useUIStore } from "@/store/useUIStore";
import { type AssignmentItem, CreateAssignmentInputSchema } from "@/types/assignment";

interface AssignmentModalProps {
  initialData?: AssignmentItem | null;
  onClearInitialData?: () => void;
}

export function AssignmentModal({ initialData, onClearInitialData }: AssignmentModalProps) {
  const activeModal = useUIStore((s) => s.activeModal);
  const closeModal = useUIStore((s) => s.closeModal);

  const isOpen = activeModal === "create-assignment" || activeModal === "edit-assignment";
  const isEditing = activeModal === "edit-assignment" && !!initialData;

  const [title, setTitle] = useState("");
  const [course, setCourse] = useState("");
  const [deadline, setDeadline] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<"pending" | "submitted" | "graded">("pending");

  const [fieldErrors, setFieldErrors] = useState<{
    title?: string;
    course?: string;
    deadline?: string;
    description?: string;
  }>({});

  const createMutation = useCreateAssignmentMutation();
  const updateMutation = useUpdateAssignmentMutation();

  const isPending = createMutation.isPending || updateMutation.isPending;

  useEffect(() => {
    if (isEditing && initialData) {
      setTitle(initialData.title);
      setCourse(initialData.course);
      setDeadline(initialData.deadline);
      setDescription(initialData.description);
      setStatus(initialData.status);
    } else {
      setTitle("");
      setCourse("");
      setDeadline("");
      setDescription("");
      setStatus("pending");
    }
    setFieldErrors({});
  }, [isEditing, initialData]);

  if (!isOpen) return null;

  function handleClose() {
    closeModal();
    if (onClearInitialData) onClearInitialData();
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFieldErrors({});

    const formData = {
      title,
      course,
      deadline,
      description,
      status,
    };

    const validation = CreateAssignmentInputSchema.safeParse(formData);

    if (!validation.success) {
      const formattedErrors: {
        title?: string;
        course?: string;
        deadline?: string;
        description?: string;
      } = {};

      validation.error.issues.forEach((err) => {
        const field = err.path[0] as string;
        if (field === "title") formattedErrors.title = err.message;
        if (field === "course") formattedErrors.course = err.message;
        if (field === "deadline") formattedErrors.deadline = err.message;
        if (field === "description") formattedErrors.description = err.message;
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
                {isEditing ? "Edit Tugas" : "Buat Tugas Baru"}
              </h2>
              <p className="text-xs text-text-secondary">
                {isEditing
                  ? "Perbarui informasi tugas"
                  : "Tambahkan penugasan baru untuk mahasiswa"}
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
          {/* Judul Tugas */}
          <div>
            <label
              htmlFor="assignment-title"
              className="block text-xs font-semibold text-text-primary mb-1.5"
            >
              Judul Tugas <span className="text-red-500">*</span>
            </label>
            <input
              id="assignment-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Laporan Analisis Sistem"
              className={`w-full px-3.5 py-2.5 text-sm rounded-xl border bg-slate-50 focus:bg-white focus:outline-none transition ${
                fieldErrors.title
                  ? "border-red-400 focus:border-red-500"
                  : "border-border-color focus:border-primary-green"
              }`}
            />
            {fieldErrors.title && (
              <p className="text-xs text-red-500 mt-1 font-medium">{fieldErrors.title}</p>
            )}
          </div>

          {/* Mata Kuliah */}
          <div>
            <label
              htmlFor="assignment-course"
              className="block text-xs font-semibold text-text-primary mb-1.5"
            >
              Mata Kuliah <span className="text-red-500">*</span>
            </label>
            <input
              id="assignment-course"
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

          {/* Deadline */}
          <div>
            <label
              htmlFor="assignment-deadline"
              className="block text-xs font-semibold text-text-primary mb-1.5"
            >
              Deadline / Tanggal Pengumpulan <span className="text-red-500">*</span>
            </label>
            <input
              id="assignment-deadline"
              type="text"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              placeholder="Contoh: 25 Sep 2026"
              className={`w-full px-3.5 py-2.5 text-sm rounded-xl border bg-slate-50 focus:bg-white focus:outline-none transition ${
                fieldErrors.deadline
                  ? "border-red-400 focus:border-red-500"
                  : "border-border-color focus:border-primary-green"
              }`}
            />
            {fieldErrors.deadline && (
              <p className="text-xs text-red-500 mt-1 font-medium">{fieldErrors.deadline}</p>
            )}
          </div>

          {/* Deskripsi Singkat */}
          <div>
            <label
              htmlFor="assignment-desc"
              className="block text-xs font-semibold text-text-primary mb-1.5"
            >
              Deskripsi Singkat <span className="text-red-500">*</span>
            </label>
            <textarea
              id="assignment-desc"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Jelaskan instruksi singkat mengenai tugas ini..."
              className={`w-full px-3.5 py-2.5 text-sm rounded-xl border bg-slate-50 focus:bg-white focus:outline-none transition ${
                fieldErrors.description
                  ? "border-red-400 focus:border-red-500"
                  : "border-border-color focus:border-primary-green"
              }`}
            />
            {fieldErrors.description && (
              <p className="text-xs text-red-500 mt-1 font-medium">{fieldErrors.description}</p>
            )}
          </div>

          {/* Status */}
          <div>
            <label
              htmlFor="assignment-status"
              className="block text-xs font-semibold text-text-primary mb-1.5"
            >
              Status Tugas
            </label>
            <select
              id="assignment-status"
              value={status}
              onChange={(e) => setStatus(e.target.value as "pending" | "submitted" | "graded")}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-border-color bg-slate-50 focus:bg-white focus:border-primary-green focus:outline-none transition"
            >
              <option value="pending">Belum Dikumpul (Pending)</option>
              <option value="submitted">Sudah Dikumpul (Submitted)</option>
              <option value="graded">Sudah Dinilai (Graded)</option>
            </select>
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
              <span>{isEditing ? "Simpan Perubahan" : "Buat Tugas"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
