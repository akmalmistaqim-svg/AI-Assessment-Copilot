import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ActivityCard } from "@/components/cards/activity-card";
import { PageHeader } from "@/components/ui/page-header";
import { getSession } from "@/lib/auth";
import { type ActivityItem, fetchActivities } from "@/lib/data";

export const metadata: Metadata = {
  title: "Log Aktivitas - AI Assessment Copilot",
  description: "Riwayat seluruh aktivitas dan asesmen terkini sistem AI Assessment Copilot.",
};

export default async function ActivitiesPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  if (session.role !== "dosen") {
    redirect("/dashboard/mahasiswa");
  }

  const activities = await fetchActivities();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Back Link */}
      <Link
        href="/dashboard/dosen"
        className="inline-flex items-center gap-2 text-xs font-semibold text-text-secondary hover:text-primary-green transition no-underline"
      >
        <ArrowLeft size={16} />
        <span>Kembali ke Dashboard Dosen</span>
      </Link>

      <PageHeader
        title="Log Aktivitas Sistem"
        subtitle="Riwayat komprehensif penyerahan tugas, review otomatis AI, dan umpan balik pengajar"
      />

      <div className="bg-card-bg rounded-2xl border border-border-color p-6 shadow-sm divide-y divide-border-color">
        {activities.map((act: ActivityItem) => (
          <ActivityCard key={act.id} activity={act} />
        ))}
      </div>
    </div>
  );
}
