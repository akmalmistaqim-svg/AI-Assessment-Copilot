import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ClassListSection } from "@/components/class-list-section";
import { PageHeader } from "@/components/ui/page-header";
import { getSession } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Kelola Kelas - AI Assessment Copilot",
  description: "Daftar mata kuliah dan kelas yang diampu.",
};

export default async function ClassesPage() {
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
        title="Kelola Kelas"
        subtitle="Daftar mata kuliah dan kelas yang Anda ampu semester ini"
      />

      {/* Class List Section */}
      <ClassListSection />
    </div>
  );
}
