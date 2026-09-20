import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { SettingsForm } from "@/components/settings-form";
import { PageHeader } from "@/components/ui/page-header";
import { getSession } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Pengaturan Akun Mahasiswa - AI Assessment Copilot",
  description: "Pengaturan profil dan preferensi notifikasi untuk Mahasiswa.",
};

export default async function MahasiswaSettingsPage() {
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
        title="Pengaturan Akun"
        subtitle="Kelola profil mahasiswa dan preferensi notifikasi tugas Anda."
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
