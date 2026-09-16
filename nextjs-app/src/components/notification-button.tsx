import { Bell } from "lucide-react";

export function NotificationButton() {
  return (
    <button
      type="button"
      className="w-[38px] h-[38px] rounded-full bg-transparent border border-border-color text-text-secondary flex items-center justify-center cursor-pointer relative transition hover:bg-slate-50 hover:text-text-primary"
      aria-label="View notifications"
    >
      <Bell size={18} />
      <span className="absolute top-2 right-2 w-[7px] h-[7px] rounded-full bg-primary-green border-[1.5px] border-white" />
    </button>
  );
}
