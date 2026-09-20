import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { MahasiswaFeedbackFullSection } from "@/components/mahasiswa-feedback-full-section";
import { PageHeader } from "@/components/ui/page-header";
import { getSession } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Umpan Balik & Evaluasi - AI Assessment Copilot",
  description: "Umpan balik dan catatan evaluasi AI serta dosen terhadap tugas mahasiswa.",
};

export default async function MahasiswaFeedbackPage() {
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
        title="Umpan Balik & Evaluasi AI"
        subtitle="Analisis terperinci, saran perbaikan dari AI Copilot, dan catatan evaluasi dari dosen pengampu"
      />

      <MahasiswaFeedbackFullSection />
    </div>
  );
}
