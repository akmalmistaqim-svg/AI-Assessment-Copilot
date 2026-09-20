import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { AssignmentsListSectionServer } from "@/components/assignments-list-section-server";
import { LatestFeedbackSection } from "@/components/latest-feedback-section";
import { MahasiswaStatsSection } from "@/components/mahasiswa-stats-section";
import { SubmitAssignmentButton } from "@/components/submit-assignment-button";
import { SubmitAssignmentModal } from "@/components/submit-assignment-modal";
import { getSession } from "@/lib/auth";

export async function generateMetadata(): Promise<Metadata> {
  const session = await getSession();
  const userName = session?.name ? ` | ${session.name}` : "";
  return {
    title: `Dashboard Mahasiswa${userName} - AI Assessment Copilot`,
    description: "Portal aktivitas belajar dan umpan balik tugas mahasiswa.",
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
            <div className="h-4 w-28 bg-border-color/50 rounded"></div>
            <div className="w-10 h-10 rounded-xl bg-border-color/40"></div>
          </div>
          <div className="h-9 w-16 bg-border-color/60 rounded-md mt-3"></div>
          <div className="h-3 w-32 bg-border-color/40 rounded mt-1.5"></div>
        </div>
      ))}
    </div>
  );
}

function AssignmentsListSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-6 w-36 bg-border-color/60 rounded"></div>
        <div className="h-4 w-20 bg-border-color/40 rounded"></div>
      </div>
      <div className="bg-card-bg rounded-xl border border-border-color divide-y divide-border-color">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-5 flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-5 w-48 bg-border-color/60 rounded"></div>
              <div className="h-3 w-32 bg-border-color/40 rounded"></div>
            </div>
            <div className="h-6 w-20 bg-border-color/50 rounded-full"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FeedbackSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-6 w-36 bg-border-color/60 rounded"></div>
      <div className="bg-card-bg rounded-xl border border-border-color p-5 space-y-4">
        <div className="h-5 w-40 bg-border-color/60 rounded"></div>
        <div className="h-8 w-20 bg-border-color/50 rounded"></div>
        <div className="space-y-2 pt-2">
          <div className="h-3 w-full bg-border-color/40 rounded"></div>
          <div className="h-3 w-4/5 bg-border-color/40 rounded"></div>
        </div>
      </div>
    </div>
  );
}

export default async function MahasiswaDashboardPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  if (session.role !== "mahasiswa") {
    redirect("/dashboard/dosen");
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">
            Dashboard Mahasiswa
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Selamat datang kembali,{" "}
            <span className="font-semibold text-primary-green">{session.name}</span>! 🚀
          </p>
        </div>
        <div className="flex items-center gap-3">
          <SubmitAssignmentButton />
        </div>
      </div>

      {/* Summary Stats Cards with Suspense */}
      <Suspense fallback={<StatsGridSkeleton />}>
        <MahasiswaStatsSection />
      </Suspense>

      {/* Main Grid: Assignments & AI Feedback with Suspense */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Suspense fallback={<AssignmentsListSkeleton />}>
            <AssignmentsListSectionServer />
          </Suspense>
        </div>
        <div>
          <Suspense fallback={<FeedbackSkeleton />}>
            <LatestFeedbackSection />
          </Suspense>
        </div>
      </div>

      {/* Submit Assignment Modal */}
      <SubmitAssignmentModal />
    </div>
  );
}
