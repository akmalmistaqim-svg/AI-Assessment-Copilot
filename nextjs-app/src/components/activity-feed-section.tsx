import { ActivityCard } from "@/components/cards/activity-card";
import { type ActivityItem, fetchActivities } from "@/lib/data";

export async function ActivityFeedSection() {
  const activities = await fetchActivities();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-text-primary">Aktivitas Terbaru</h2>
        <span className="text-xs text-primary-green font-medium cursor-pointer hover:underline">
          Lihat Semua
        </span>
      </div>

      <div className="bg-card-bg rounded-xl border border-border-color p-4 divide-y divide-border-color">
        {activities.map((act: ActivityItem) => (
          <ActivityCard key={act.id} activity={act} />
        ))}
      </div>
    </div>
  );
}
