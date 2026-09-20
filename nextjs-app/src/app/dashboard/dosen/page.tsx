import { FileCheck2 } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { ActivityFeedSection } from "@/components/activity-feed-section";
import { AssignmentModal } from "@/components/assignment-modal";
import { ClassListSection } from "@/components/class-list-section";
import { CreateAssignmentShortcutButton } from "@/components/create-assignment-shortcut-button";
import { DosenStatsSection } from "@/components/dosen-stats-section";
import { PageHeader } from "@/components/ui/page-header";
import { getSession } from "@/lib/auth";

export async function generateMetadata(): Promise<Metadata> {
  const session = await getSession();
  const userName = session?.name ? ` | ${session.name}` : "";
  return {
    title: `Dashboard Dosen${userName} - AI Assessment Copilot`,
    description: "Portal penilaian terstandar AI Assessment Copilot untuk Dosen.",
  };
}

function StatsGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="bg-card-bg rounded-xl border border-border-color shadow-sm p-5 animate-pulse"
        >
          <div className="flex items-center justify-between">
            <div className="h-4 w-24 bg-border-color/50 rounded"></div>
            <div className="w-10 h-10 rounded-xl bg-border-color/40"></div>
          </div>
          <div className="h-9 w-16 bg-border-color/60 rounded-md mt-3"></div>
          <div className="h-3 w-32 bg-border-color/40 rounded mt-1.5"></div>
        </div>
      ))}
    </div>
  );
}

function ActivitySkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-6 w-32 bg-border-color/60 rounded"></div>
      <div className="bg-card-bg rounded-xl border border-border-color p-5 space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex gap-3 items-start">
            <div className="w-8 h-8 rounded-full bg-border-color/50 shrink-0"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 w-full bg-border-color/50 rounded"></div>
              <div className="h-3 w-20 bg-border-color/40 rounded"></div>
            </div>
          </div>
        ))}
      </div>
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
              <FileCheck2 className="w-3.5 h-3.5 text-primary-green shrink-0" />
              <span>Kelola Rubrik</span>
            </Link>
            <CreateAssignmentShortcutButton />
          </div>
        }
      />

      {/* Summary Stats Cards Server Component */}
      <Suspense fallback={<StatsGridSkeleton />}>
        <DosenStatsSection />
      </Suspense>

      {/* Main Grid: Interactive ClassListSection & Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <ClassListSection />
        </div>
        <div>
          <Suspense fallback={<ActivitySkeleton />}>
            <ActivityFeedSection />
          </Suspense>
        </div>
      </div>

      {/* Create Assignment Modal Shortcut */}
      <AssignmentModal />
    </div>
  );
}
