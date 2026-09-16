import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AssignmentListSection } from "@/components/assignment-list-section";
import { PageHeader } from "@/components/ui/page-header";
import { getSession } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Daftar Tugas - AI Assessment Copilot",
  description: "Kelola penugasan mahasiswa dari seluruh mata kuliah.",
};

export default async function AssignmentsPage() {
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
        title="Daftar Tugas"
        subtitle="Buat dan kelola penugasan mahasiswa untuk setiap mata kuliah"
      />

      {/* Assignment List Section */}
      <AssignmentListSection />
    </div>
  );
}
