import { ArrowLeft, BookOpen, Calendar, Clock, FileText } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { getAssignmentByIdFromStore } from "@/lib/assignmentStore";
import { getSession } from "@/lib/auth";

interface AssignmentDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: AssignmentDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const assignment = getAssignmentByIdFromStore(id);

  if (!assignment) {
    return {
      title: "Tugas Tidak Ditemukan | AI Assessment Copilot",
    };
  }

  return {
    title: `${assignment.title} | Tugas Mahasiswa`,
    description: `Detail penugasan ${assignment.title} mata kuliah ${assignment.course}.`,
  };
}

export default async function MahasiswaAssignmentDetailPage({ params }: AssignmentDetailPageProps) {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  if (session.role !== "mahasiswa") {
    redirect("/dashboard/dosen");
  }

  const { id } = await params;
  const assignment = getAssignmentByIdFromStore(id);

  if (!assignment) {
    notFound();
  }

  const getStatusBadge = (status: typeof assignment.status) => {
    switch (status) {
      case "submitted":
        return <Badge variant="info">Terkumpul</Badge>;
      case "graded":
        return <Badge variant="success">Dinilai</Badge>;
      default:
        return <Badge variant="warning">Belum Dikumpul</Badge>;
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Back Link */}
      <Link
        href="/dashboard/mahasiswa/assignments"
        className="inline-flex items-center gap-2 text-xs font-semibold text-text-secondary hover:text-primary-green transition no-underline"
      >
        <ArrowLeft size={16} />
        <span>Kembali ke Daftar Tugas</span>
      </Link>

      {/* Main Detail Card */}
      <div className="bg-card-bg rounded-2xl border border-border-color p-6 md:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="space-y-2">
            <div>{getStatusBadge(assignment.status)}</div>
            <h1 className="text-2xl font-bold text-text-primary tracking-tight">
              {assignment.title}
            </h1>
            <div className="flex items-center gap-2 text-sm text-text-secondary">
              <BookOpen className="w-4 h-4 text-primary-green" />
              <span>{assignment.course}</span>
            </div>
          </div>

          <div className="w-12 h-12 rounded-2xl bg-light-green text-primary-green flex items-center justify-center font-bold shrink-0">
            <FileText size={24} />
          </div>
        </div>

        {/* Metadata info strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border border-border-color/60 text-xs">
          <div className="flex items-center gap-2.5 text-text-secondary">
            <Calendar className="w-4 h-4 text-amber-600" />
            <div>
              <span className="text-text-muted block text-[11px]">Tenggat Waktu:</span>
              <span className="font-semibold text-text-primary">{assignment.deadline}</span>
            </div>
          </div>
          <div className="flex items-center gap-2.5 text-text-secondary">
            <Clock className="w-4 h-4 text-primary-green" />
            <div>
              <span className="text-text-muted block text-[11px]">Status Pengerjaan:</span>
              <span className="font-semibold text-text-primary capitalize">
                {assignment.status}
              </span>
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div className="space-y-2">
          <h2 className="text-sm font-bold text-text-primary uppercase tracking-wider text-text-muted">
            Deskripsi & Instruksi Tugas
          </h2>
          <div className="p-5 rounded-xl bg-white border border-border-color leading-relaxed text-sm text-text-primary">
            {assignment.description}
          </div>
        </div>
      </div>
    </div>
  );
}
