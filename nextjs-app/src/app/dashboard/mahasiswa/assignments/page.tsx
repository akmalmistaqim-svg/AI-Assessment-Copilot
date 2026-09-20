import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { MahasiswaAssignmentListFull } from "@/components/mahasiswa-assignment-list-full";
import { SubmitAssignmentButton } from "@/components/submit-assignment-button";
import { SubmitAssignmentModal } from "@/components/submit-assignment-modal";
import { PageHeader } from "@/components/ui/page-header";
import { getSession } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Tugas Saya - AI Assessment Copilot",
  description: "Daftar penugasan mahasiswa untuk seluruh mata kuliah.",
};

export default async function MahasiswaAssignmentsPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  if (session.role !== "mahasiswa") {
    redirect("/dashboard/dosen");
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Daftar Tugas Saya"
        subtitle="Pantau tenggat waktu, progres pengerjaan, dan status penilaian tugas kuliah Anda"
        action={<SubmitAssignmentButton />}
      />

      <MahasiswaAssignmentListFull />

      <SubmitAssignmentModal />
    </div>
  );
}
