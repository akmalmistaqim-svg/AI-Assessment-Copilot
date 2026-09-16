import { FileCheck2, FileText } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { ActivityFeedSection } from "@/components/activity-feed-section";
import { ClassListSection } from "@/components/class-list-section";
import { DosenStatsSection } from "@/components/dosen-stats-section";
import { PageHeader } from "@/components/ui/page-header";
import { getSession } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Dashboard Dosen - AI Assessment Copilot",
};

function SectionSkeleton({ height = "h-32" }: { height?: string }) {
  return (
    <div
      className={`bg-card-bg rounded-xl border border-border-color p-5 ${height} animate-pulse flex items-center justify-center`}
    >
      <div className="h-4 w-32 bg-border-color/50 rounded"></div>
    </div>
  );
}

export default async function DosenDashboardPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  if (session.role !== "dosen") {
    redirect("/dashboard/mahasiswa");
  }

  return (
    <div className="space-y-8">
      {/* Page Header Server Component with Quick Action Links */}
      <PageHeader
        title="Dashboard Dosen"
        subtitle={`Selamat datang kembali, ${session.name}! 👋`}
        action={
          <div className="flex items-center gap-2.5">
            <Link
              href="/dashboard/dosen/rubrics"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-primary-green bg-light-green hover:bg-emerald-100 rounded-lg transition no-underline shadow-xs"
            >
              <FileCheck2 className="w-3.5 h-3.5" />
              Kelola Rubrik
            </Link>
            <Link
              href="/dashboard/dosen/assignments"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-primary-green hover:bg-dark-green rounded-lg transition no-underline shadow-sm hover:shadow"
            >
              <FileText className="w-3.5 h-3.5" />+ Buat Tugas
            </Link>
          </div>
        }
      />

      {/* Summary Stats Cards Server Component */}
      <Suspense fallback={<SectionSkeleton height="h-28" />}>
        <DosenStatsSection />
      </Suspense>

      {/* Main Grid: Interactive ClassListSection & Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <ClassListSection />
        </div>
        <div>
          <Suspense fallback={<SectionSkeleton height="h-64" />}>
            <ActivityFeedSection />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
