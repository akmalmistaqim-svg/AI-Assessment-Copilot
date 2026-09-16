import { Check, FilePlus, FileText, MessageSquare, Upload } from "lucide-react";
import type { ActivityItem } from "@/lib/data";

interface ActivityCardProps {
  activity: ActivityItem;
}

export function ActivityCard({ activity }: ActivityCardProps) {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "upload":
        return Upload;
      case "file-plus":
        return FilePlus;
      case "check":
        return Check;
      case "message-square":
        return MessageSquare;
      default:
        return FileText;
    }
  };

  const Icon = getIcon(activity.icon);

  return (
    <div className="py-3.5 first:pt-0 last:pb-0 flex items-start gap-3">
      <div className="w-8 h-8 rounded-full bg-light-green text-primary-green flex items-center justify-center shrink-0 mt-0.5">
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0 text-xs">
        <p className="text-text-primary font-medium leading-relaxed">
          <span className="font-semibold">{activity.actor}</span> {activity.action}{" "}
          <span className="text-primary-green font-medium">{activity.context}</span>
        </p>
        <p className="text-[11px] text-text-muted mt-1">{activity.timeAgo}</p>
      </div>
    </div>
  );
}
