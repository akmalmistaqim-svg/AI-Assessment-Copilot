import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { SettingsForm } from "@/components/settings-form";
import { PageHeader } from "@/components/ui/page-header";
import { getSession } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Pengaturan Akun Dosen - AI Assessment Copilot",
  description: "Pengaturan profil dan preferensi notifikasi untuk Dosen.",
};

export default async function DosenSettingsPage() {
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
        title="Pengaturan Akun"
        subtitle="Kelola profil pengajar dan preferensi notifikasi platform."
      />
      <SettingsForm
        initialUser={{
          id: session.id,
          name: session.name,
          email: session.email,
          role: session.role,
        }}
      />
    </div>
  );
}
