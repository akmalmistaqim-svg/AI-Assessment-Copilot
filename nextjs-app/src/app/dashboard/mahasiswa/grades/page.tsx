import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { MahasiswaGradesSection } from "@/components/mahasiswa-grades-section";
import { PageHeader } from "@/components/ui/page-header";
import { getSession } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Nilai Saya - AI Assessment Copilot",
  description: "Daftar hasil penilaian dan nilai tugas mahasiswa yang telah difinalisasi.",
};

export default async function MahasiswaGradesPage() {
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
        title="Nilai Asesmen Saya"
        subtitle="Rekapitulasi nilai dan hasil evaluasi resmi yang telah difinalisasi oleh dosen pengampu"
      />

      <MahasiswaGradesSection />
    </div>
  );
}
