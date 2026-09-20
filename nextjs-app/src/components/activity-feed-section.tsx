import Link from "next/link";
import { ActivityCard } from "@/components/cards/activity-card";
import { type ActivityItem, fetchActivities } from "@/lib/data";

export async function ActivityFeedSection() {
  const activities = await fetchActivities();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-text-primary">Aktivitas Terbaru</h2>
        <Link
          href="/dashboard/dosen/activities"
          className="text-xs text-primary-green font-medium hover:underline no-underline"
        >
          Lihat Semua
        </Link>
      </div>

      <div className="bg-card-bg rounded-xl border border-border-color p-4 divide-y divide-border-color">
        {activities.map((act: ActivityItem) => (
          <ActivityCard key={act.id} activity={act} />
        ))}
      </div>
    </div>
  );
}
