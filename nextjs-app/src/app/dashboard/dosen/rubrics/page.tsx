import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { RubricListSection } from "@/components/rubric-list-section";
import { PageHeader } from "@/components/ui/page-header";
import { getSession } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Rubrik Penilaian - AI Assessment Copilot",
  description: "Kelola standar kriteria dan bobot penilaian tugas.",
};

export default async function RubricsPage() {
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
        title="Rubrik Penilaian"
        subtitle="Buat dan kelola standar kriteria penilaian terstruktur"
      />

      {/* Rubric List Section */}
      <RubricListSection />
    </div>
  );
}
