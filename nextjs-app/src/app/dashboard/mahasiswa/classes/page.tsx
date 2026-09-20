import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { MahasiswaClassesSection } from "@/components/mahasiswa-classes-section";
import { PageHeader } from "@/components/ui/page-header";
import { getSession } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Kelas Saya - AI Assessment Copilot",
  description: "Daftar mata kuliah dan kelas yang sedang diikuti oleh mahasiswa.",
};

export default async function MahasiswaClassesPage() {
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
        title="Kelas Saya"
        subtitle="Mata kuliah aktif yang Anda ikuti pada semester ini."
      />
      <MahasiswaClassesSection />
    </div>
  );
}
