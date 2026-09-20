import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { HelpSection } from "@/components/help-section";
import { PageHeader } from "@/components/ui/page-header";
import { getSession } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Pusat Bantuan Dosen - AI Assessment Copilot",
  description: "Panduan dan pusat bantuan penggunaan platform untuk Dosen.",
};

export default async function DosenHelpPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  if (session.role !== "dosen") {
    redirect("/dashboard/mahasiswa");
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Pusat Bantuan & FAQ"
        subtitle="Panduan komprehensif penggunaan fitur evaluasi dan manajemen kelas."
      />
      <HelpSection userRole="dosen" />
    </div>
  );
}
