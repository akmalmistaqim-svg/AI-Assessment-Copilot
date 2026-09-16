import { Avatar } from "@/components/ui/avatar";

interface UserProfileBadgeProps {
  name: string;
  role: string;
  className?: string;
}

export function UserProfileBadge({ name, role, className = "" }: UserProfileBadgeProps) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <Avatar name={name} size="sm" />
      <div className="flex flex-col text-left">
        <span className="text-xs font-semibold text-text-primary leading-tight">{name}</span>
        <span className="text-[10px] text-text-muted capitalize leading-tight">{role}</span>
      </div>
    </div>
  );
}
