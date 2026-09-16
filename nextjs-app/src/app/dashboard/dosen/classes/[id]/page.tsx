import { ArrowLeft, FileText, GraduationCap, Users } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getClassesStore } from "@/lib/classStore";

interface ClassDetailPageProps {
  params: Promise<{ id: string }>;
}

// Dynamic metadata generation based on class ID
export async function generateMetadata({ params }: ClassDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const classes = getClassesStore();
  const foundClass = classes.find((c) => c.id === id);

  if (!foundClass) {
    return {
      title: "Kelas Tidak Ditemukan | AI Assessment Copilot",
    };
  }

  return {
    title: `${foundClass.name} | Dashboard Dosen`,
    description: `Detail mata kuliah ${foundClass.name} (${foundClass.semester}) dengan ${foundClass.studentsCount} mahasiswa.`,
  };
}

export default async function ClassDetailPage({ params }: ClassDetailPageProps) {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  if (session.role !== "dosen") {
    redirect("/dashboard/mahasiswa");
  }

  const { id } = await params;
  const classes = getClassesStore();
  const foundClass = classes.find((c) => c.id === id);

  if (!foundClass) {
    notFound();
  }

  return (
    <div className="space-y-6">
      {/* Back Link */}
      <Link
        href="/dashboard/dosen"
        className="inline-flex items-center gap-2 text-xs font-semibold text-text-secondary hover:text-primary-green transition no-underline"
      >
        <ArrowLeft size={16} />
        <span>Kembali ke Dashboard Dosen</span>
      </Link>

      {/* Header Card */}
      <div className="bg-card-bg rounded-2xl border border-border-color p-6 md:p-8 shadow-sm space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-light-green text-dark-green mb-1">
              {foundClass.status === "active" ? "Aktif" : "Arsip"}
            </span>
            <h1 className="text-2xl font-bold text-text-primary tracking-tight">
              {foundClass.name}
            </h1>
            <p className="text-sm text-text-secondary">{foundClass.semester}</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-light-green text-primary-green flex items-center justify-center font-bold">
            <GraduationCap size={24} />
          </div>
        </div>

        <div className="pt-4 border-t border-border-color grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs text-text-secondary">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-primary-green" />
            <span>
              <strong>{foundClass.studentsCount}</strong> Mahasiswa Terdaftar
            </span>
          </div>
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-primary-green" />
            <span>
              <strong>{foundClass.assignmentsCount}</strong> Tugas Diberikan
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
