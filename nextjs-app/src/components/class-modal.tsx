"use client";

import { Edit2, Loader2, Plus, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useCreateClassMutation, useUpdateClassMutation } from "@/hooks/useClassesQuery";
import { useUIStore } from "@/store/useUIStore";
import { type ClassItem, CreateClassInputSchema } from "@/types/class";

interface ClassModalProps {
  initialData?: ClassItem | null;
  onClearInitialData?: () => void;
}

export function ClassModal({ initialData, onClearInitialData }: ClassModalProps) {
  const activeModal = useUIStore((s) => s.activeModal);
  const closeModal = useUIStore((s) => s.closeModal);

  const isOpen = activeModal === "create-class" || activeModal === "edit-class";
  const isEditing = activeModal === "edit-class" && !!initialData;

  const [name, setName] = useState("");
  const [semester, setSemester] = useState("");
  const [status, setStatus] = useState<"active" | "archived">("active");
  const [fieldErrors, setFieldErrors] = useState<{ name?: string; semester?: string }>({});

  const createMutation = useCreateClassMutation();
  const updateMutation = useUpdateClassMutation();

  const isPending = createMutation.isPending || updateMutation.isPending;

  // Pre-fill form when editing
  useEffect(() => {
    if (isEditing && initialData) {
      setName(initialData.name);
      setSemester(initialData.semester);
      setStatus(initialData.status);
    } else {
      setName("");
      setSemester("Semester Genap 2025/2026");
      setStatus("active");
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

    const formData = { name, semester, status };
    const validation = CreateClassInputSchema.safeParse(formData);

    if (!validation.success) {
      const formattedErrors: { name?: string; semester?: string } = {};
      validation.error.issues.forEach((err) => {
        if (err.path[0] === "name") formattedErrors.name = err.message;
        if (err.path[0] === "semester") formattedErrors.semester = err.message;
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
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Tutup modal"
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity border-none cursor-default"
        onClick={handleClose}
      />

      {/* Modal Card */}
      <div className="relative bg-white rounded-2xl border border-border-color shadow-2xl w-full max-w-md p-6 z-10 animate-[toastIn_0.2s_ease]">
        <div className="flex items-center justify-between pb-4 border-b border-border-color">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-light-green text-primary-green flex items-center justify-center font-bold">
              {isEditing ? <Edit2 size={18} /> : <Plus size={18} />}
            </div>
            <div>
              <h2 className="text-lg font-bold text-text-primary">
                {isEditing ? "Edit Kelas" : "Tambah Kelas Baru"}
              </h2>
              <p className="text-xs text-text-secondary">
                {isEditing ? "Perbarui informasi mata kuliah" : "Buat kelas baru untuk mahasiswa"}
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
          {/* Nama Kelas */}
          <div>
            <label
              htmlFor="class-name"
              className="block text-xs font-semibold text-text-primary mb-1.5"
            >
              Nama Mata Kuliah / Kelas <span className="text-red-500">*</span>
            </label>
            <input
              id="class-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Pemrograman Web"
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

          {/* Semester */}
          <div>
            <label
              htmlFor="class-semester"
              className="block text-xs font-semibold text-text-primary mb-1.5"
            >
              Semester <span className="text-red-500">*</span>
            </label>
            <input
              id="class-semester"
              type="text"
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              placeholder="Contoh: Semester Genap 2025/2026"
              className={`w-full px-3.5 py-2.5 text-sm rounded-xl border bg-slate-50 focus:bg-white focus:outline-none transition ${
                fieldErrors.semester
                  ? "border-red-400 focus:border-red-500"
                  : "border-border-color focus:border-primary-green"
              }`}
            />
            {fieldErrors.semester && (
              <p className="text-xs text-red-500 mt-1 font-medium">{fieldErrors.semester}</p>
            )}
          </div>

          {/* Status */}
          <div>
            <label
              htmlFor="class-status"
              className="block text-xs font-semibold text-text-primary mb-1.5"
            >
              Status Kelas
            </label>
            <select
              id="class-status"
              value={status}
              onChange={(e) => setStatus(e.target.value as "active" | "archived")}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-border-color bg-slate-50 focus:bg-white focus:border-primary-green focus:outline-none transition"
            >
              <option value="active">Aktif</option>
              <option value="archived">Arsip</option>
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
              <span>{isEditing ? "Simpan Perubahan" : "Buat Kelas"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
