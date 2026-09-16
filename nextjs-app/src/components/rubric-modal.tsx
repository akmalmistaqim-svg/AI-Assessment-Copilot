"use client";

import { Edit2, Loader2, Plus, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useCreateRubricMutation, useUpdateRubricMutation } from "@/hooks/useRubricsQuery";
import { useUIStore } from "@/store/useUIStore";
import { CreateRubricInputSchema, type RubricItem } from "@/types/rubric";

interface RubricModalProps {
  initialData?: RubricItem | null;
  onClearInitialData?: () => void;
}

export function RubricModal({ initialData, onClearInitialData }: RubricModalProps) {
  const activeModal = useUIStore((s) => s.activeModal);
  const closeModal = useUIStore((s) => s.closeModal);

  const isOpen = activeModal === "create-rubric" || activeModal === "edit-rubric";
  const isEditing = activeModal === "edit-rubric" && !!initialData;

  const [name, setName] = useState("");
  const [course, setCourse] = useState("");
  const [criteriaCount, setCriteriaCount] = useState<number>(4);
  const [totalWeight, setTotalWeight] = useState<number>(100);
  const [status, setStatus] = useState<"active" | "draft" | "archived">("active");

  const [fieldErrors, setFieldErrors] = useState<{
    name?: string;
    course?: string;
    criteriaCount?: string;
    totalWeight?: string;
  }>({});

  const createMutation = useCreateRubricMutation();
  const updateMutation = useUpdateRubricMutation();

  const isPending = createMutation.isPending || updateMutation.isPending;

  useEffect(() => {
    if (isEditing && initialData) {
      setName(initialData.name);
      setCourse(initialData.course);
      setCriteriaCount(initialData.criteriaCount);
      setTotalWeight(initialData.totalWeight);
      setStatus(initialData.status);
    } else {
      setName("");
      setCourse("");
      setCriteriaCount(4);
      setTotalWeight(100);
      setStatus("active");
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
      name,
      course,
      criteriaCount,
      totalWeight,
      status,
    };

    const validation = CreateRubricInputSchema.safeParse(formData);

    if (!validation.success) {
      const formattedErrors: {
        name?: string;
        course?: string;
        criteriaCount?: string;
        totalWeight?: string;
      } = {};

      validation.error.issues.forEach((err) => {
        if (err.path[0] === "name") formattedErrors.name = err.message;
        if (err.path[0] === "course") formattedErrors.course = err.message;
        if (err.path[0] === "criteriaCount") formattedErrors.criteriaCount = err.message;
        if (err.path[0] === "totalWeight") formattedErrors.totalWeight = err.message;
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
                {isEditing ? "Edit Rubrik Penilaian" : "Tambah Rubrik Baru"}
              </h2>
              <p className="text-xs text-text-secondary">
                {isEditing
                  ? "Perbarui kriteria & bobot penilaian"
                  : "Buat standar rubrik penilaian baru"}
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
          {/* Nama Rubrik */}
          <div>
            <label
              htmlFor="rubric-name"
              className="block text-xs font-semibold text-text-primary mb-1.5"
            >
              Nama Rubrik <span className="text-red-500">*</span>
            </label>
            <input
              id="rubric-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Rubrik Laporan Akhir Web"
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
              htmlFor="rubric-course"
              className="block text-xs font-semibold text-text-primary mb-1.5"
            >
              Mata Kuliah <span className="text-red-500">*</span>
            </label>
            <input
              id="rubric-course"
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

          {/* Jumlah Kriteria & Bobot Total Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="rubric-criteria"
                className="block text-xs font-semibold text-text-primary mb-1.5"
              >
                Jumlah Kriteria <span className="text-red-500">*</span>
              </label>
              <input
                id="rubric-criteria"
                type="number"
                min={1}
                value={criteriaCount}
                onChange={(e) => setCriteriaCount(Number(e.target.value))}
                className={`w-full px-3.5 py-2.5 text-sm rounded-xl border bg-slate-50 focus:bg-white focus:outline-none transition ${
                  fieldErrors.criteriaCount
                    ? "border-red-400 focus:border-red-500"
                    : "border-border-color focus:border-primary-green"
                }`}
              />
              {fieldErrors.criteriaCount && (
                <p className="text-xs text-red-500 mt-1 font-medium">{fieldErrors.criteriaCount}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="rubric-weight"
                className="block text-xs font-semibold text-text-primary mb-1.5"
              >
                Bobot Total (%) <span className="text-red-500">*</span>
              </label>
              <input
                id="rubric-weight"
                type="number"
                min={1}
                max={100}
                value={totalWeight}
                onChange={(e) => setTotalWeight(Number(e.target.value))}
                className={`w-full px-3.5 py-2.5 text-sm rounded-xl border bg-slate-50 focus:bg-white focus:outline-none transition ${
                  fieldErrors.totalWeight
                    ? "border-red-400 focus:border-red-500"
                    : "border-border-color focus:border-primary-green"
                }`}
              />
              {fieldErrors.totalWeight && (
                <p className="text-xs text-red-500 mt-1 font-medium">{fieldErrors.totalWeight}</p>
              )}
            </div>
          </div>

          {/* Status */}
          <div>
            <label
              htmlFor="rubric-status"
              className="block text-xs font-semibold text-text-primary mb-1.5"
            >
              Status Rubrik
            </label>
            <select
              id="rubric-status"
              value={status}
              onChange={(e) => setStatus(e.target.value as "active" | "draft" | "archived")}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-border-color bg-slate-50 focus:bg-white focus:border-primary-green focus:outline-none transition"
            >
              <option value="active">Aktif</option>
              <option value="draft">Draft</option>
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
              <span>{isEditing ? "Simpan Perubahan" : "Buat Rubrik"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
