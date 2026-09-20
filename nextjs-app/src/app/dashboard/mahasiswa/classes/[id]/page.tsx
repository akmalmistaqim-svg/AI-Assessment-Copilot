import { ArrowLeft, FileText, GraduationCap, UserCheck } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { MahasiswaAssignmentCard } from "@/components/cards/mahasiswa-assignment-card";
import { EmptyState } from "@/components/ui/empty-state";
import { getAssignmentsStore } from "@/lib/assignmentStore";
import { getSession } from "@/lib/auth";
import { getClassByIdFromStore } from "@/lib/classStore";

interface MahasiswaClassDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: MahasiswaClassDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const cls = getClassByIdFromStore(id);

  if (!cls) {
    return {
      title: "Kelas Tidak Ditemukan | AI Assessment Copilot",
    };
  }

  return {
    title: `${cls.name} - Kelas Saya | AI Assessment Copilot`,
    description: `Detail mata kuliah ${cls.name} (${cls.semester}) dan daftar penugasan aktif.`,
  };
}

export default async function MahasiswaClassDetailPage({ params }: MahasiswaClassDetailPageProps) {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  if (session.role !== "mahasiswa") {
    redirect("/dashboard/dosen");
  }

  const { id } = await params;
  const cls = getClassByIdFromStore(id);

  if (!cls) {
    notFound();
  }

  // Filter assignments matching this class name
  const allAssignments = getAssignmentsStore();
  const classAssignments = allAssignments.filter(
    (a) =>
      a.course.toLowerCase() === cls.name.toLowerCase() ||
      a.course.toLowerCase().includes(cls.name.toLowerCase()) ||
      cls.name.toLowerCase().includes(a.course.toLowerCase()),
  );

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Back Link */}
      <Link
        href="/dashboard/mahasiswa/classes"
        className="inline-flex items-center gap-2 text-xs font-semibold text-text-secondary hover:text-primary-green transition no-underline"
      >
        <ArrowLeft size={16} />
        <span>Kembali ke Kelas Saya</span>
      </Link>

      {/* Class Header Banner */}
      <div className="bg-card-bg rounded-2xl border border-border-color p-6 md:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="space-y-2">
            <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-light-green text-dark-green border border-emerald-200">
              {cls.status === "active" ? "Kelas Aktif" : "Kelas Diarsipkan"}
            </span>
            <h1 className="text-2xl md:text-3xl font-bold text-text-primary tracking-tight">
              {cls.name}
            </h1>
            <p className="text-xs md:text-sm text-text-secondary font-medium">{cls.semester}</p>
          </div>

          <div className="w-12 h-12 rounded-2xl bg-light-green text-primary-green flex items-center justify-center font-bold shrink-0">
            <GraduationCap size={24} />
          </div>
        </div>

        {/* Info Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border border-border-color/60 text-xs">
          <div className="flex items-center gap-2.5 text-text-secondary">
            <UserCheck className="w-4 h-4 text-primary-green" />
            <div>
              <span className="text-text-muted block text-[11px]">Dosen Pengampu:</span>
              <span className="font-semibold text-text-primary">
                {cls.lecturerName ?? "Dr. Budi Santoso, M.Kom"}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2.5 text-text-secondary">
            <FileText className="w-4 h-4 text-primary-green" />
            <div>
              <span className="text-text-muted block text-[11px]">Jumlah Tugas:</span>
              <span className="font-semibold text-text-primary">
                {classAssignments.length} Tugas Terkait
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Related Assignments Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-text-primary">Daftar Tugas Kuliah</h2>
            <p className="text-xs text-text-secondary mt-0.5">
              Tugas yang wajib dikerjakan untuk mata kuliah {cls.name}
            </p>
          </div>
        </div>

        {classAssignments.length === 0 ? (
          <EmptyState
            title="Belum ada tugas"
            description={`Dosen belum memberikan penugasan aktif untuk mata kuliah ${cls.name}.`}
          />
        ) : (
          <div className="bg-card-bg rounded-xl border border-border-color divide-y divide-border-color shadow-sm">
            {classAssignments.map((assignment) => (
              <MahasiswaAssignmentCard key={assignment.id} assignment={assignment} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
