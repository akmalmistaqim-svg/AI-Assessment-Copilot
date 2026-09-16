import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { AssignmentsListSectionServer } from "@/components/assignments-list-section-server";
import { LatestFeedbackSection } from "@/components/latest-feedback-section";
import { MahasiswaStatsSection } from "@/components/mahasiswa-stats-section";
import { getSession } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Dashboard Mahasiswa - AI Assessment Copilot",
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
          <button
            type="button"
            className="px-4 py-2 text-xs font-semibold text-white bg-primary-green hover:bg-dark-green rounded-lg transition shadow-sm hover:shadow"
          >
            + Kumpul Tugas
          </button>
        </div>
      </div>

      {/* Summary Stats Cards with Suspense */}
      <Suspense fallback={<SectionSkeleton height="h-28" />}>
        <MahasiswaStatsSection />
      </Suspense>

      {/* Main Grid: Assignments & AI Feedback with Suspense */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Suspense fallback={<SectionSkeleton height="h-64" />}>
            <AssignmentsListSectionServer />
          </Suspense>
        </div>
        <div>
          <Suspense fallback={<SectionSkeleton height="h-64" />}>
            <LatestFeedbackSection />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
