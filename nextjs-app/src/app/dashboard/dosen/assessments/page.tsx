import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AssessmentListSection } from "@/components/assessment-list-section";
import { PageHeader } from "@/components/ui/page-header";
import { getSession } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Sesi Assessment - AI Assessment Copilot",
  description: "Kelola penilaian dan review hasil submisi tugas mahasiswa.",
};

export default async function AssessmentsPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  if (session.role !== "dosen") {
    redirect("/dashboard/mahasiswa");
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <PageHeader
        title="Sesi Assessment"
        subtitle="Kelola proses penilaian dan review otomatis AI terhadap tugas mahasiswa"
      />

      {/* Assessment List Section */}
      <AssessmentListSection />
    </div>
  );
}
