import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { HelpSection } from "@/components/help-section";
import { PageHeader } from "@/components/ui/page-header";
import { getSession } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Pusat Bantuan Mahasiswa - AI Assessment Copilot",
  description: "Panduan dan pertanyaan umum pengumpulan tugas dan ulasan penilaian.",
};

export default async function MahasiswaHelpPage() {
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
        title="Pusat Bantuan & FAQ"
        subtitle="Panduan pengumpulan tugas, pengecekan nilai, dan ulasan AI Copilot."
      />
      <HelpSection userRole="mahasiswa" />
    </div>
  );
}
