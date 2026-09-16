import { CheckCircle2, Clock, FileText, GraduationCap } from "lucide-react";
import { StatCard } from "@/components/ui/stat-card";
import { fetchDosenStats } from "@/lib/data";

export async function DosenStatsSection() {
  const stats = await fetchDosenStats();

  const statCards = [
    {
      title: "Total Kelas",
      value: stats.totalClasses,
      icon: GraduationCap,
      desc: "Kelas aktif semester ini",
      color: "text-primary-green bg-light-green",
    },
    {
      title: "Total Tugas",
      value: stats.totalAssignments,
      icon: FileText,
      desc: "Tugas telah dibuat",
      color: "text-blue-600 bg-blue-50",
    },
    {
      title: "Menunggu Review",
      value: stats.pendingReviews,
      icon: Clock,
      desc: "Submisi perlu dinilai",
      color: "text-amber-600 bg-amber-50",
    },
    {
      title: "Selesai Dinilai",
      value: stats.completedAssessments,
      icon: CheckCircle2,
      desc: "Penilaian AI & Dosen",
      color: "text-emerald-600 bg-emerald-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {statCards.map((card) => (
        <StatCard key={card.title} {...card} />
      ))}
    </div>
  );
}
