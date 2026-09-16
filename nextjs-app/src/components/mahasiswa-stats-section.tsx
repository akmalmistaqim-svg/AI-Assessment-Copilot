import { AlertCircle, Award, CheckCircle2, Clock } from "lucide-react";
import { fetchMahasiswaStats } from "@/lib/data";

export async function MahasiswaStatsSection() {
  const stats = await fetchMahasiswaStats();

  const statCards = [
    {
      title: "Tugas Aktif",
      value: stats.activeAssignments,
      icon: Clock,
      desc: "Perlu dikerjakan",
      color: "text-amber-600 bg-amber-50",
    },
    {
      title: "Sudah Dikumpul",
      value: stats.submitted,
      icon: CheckCircle2,
      desc: "Total tugas dikirim",
      color: "text-blue-600 bg-blue-50",
    },
    {
      title: "Menunggu Nilai",
      value: stats.pendingGrades,
      icon: AlertCircle,
      desc: "Dalam proses AI/Dosen",
      color: "text-purple-600 bg-purple-50",
    },
    {
      title: "Rata-Rata Nilai",
      value: `${stats.avgScore}`,
      icon: Award,
      desc: "Skor kumulatif",
      color: "text-primary-green bg-light-green",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {statCards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className="bg-card-bg rounded-xl border border-border-color shadow-sm p-5 transition hover:shadow-md hover:border-primary-green/30"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-text-secondary">{card.title}</span>
              <div className={`p-2.5 rounded-xl ${card.color}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-bold text-text-primary mt-3 tracking-tight">{card.value}</p>
            <p className="text-xs text-text-muted mt-1.5">{card.desc}</p>
          </div>
        );
      })}
    </div>
  );
}
