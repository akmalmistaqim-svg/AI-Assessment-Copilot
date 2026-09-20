"use client";

import {
  Award,
  ClipboardCheck,
  FileCheck2,
  FileText,
  GraduationCap,
  HelpCircle,
  LayoutDashboard,
  type LucideIcon,
  MessageSquare,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const iconMap: Record<string, LucideIcon> = {
  LayoutDashboard,
  GraduationCap,
  FileCheck2,
  FileText,
  ClipboardCheck,
  Award,
  MessageSquare,
  Settings,
  HelpCircle,
};

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon | string;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

interface SidebarNavListProps {
  sections: NavSection[];
}

export function SidebarNavList({ sections }: SidebarNavListProps) {
  const pathname = usePathname();

  function isItemActive(href: string): boolean {
    if (href === "#") return false;
    if (href === "/dashboard/dosen" || href === "/dashboard/mahasiswa") {
      return pathname === href;
    }
    return pathname.startsWith(href);
  }

  return (
    <div className="flex-1 overflow-y-auto py-5 px-3.5">
      {sections.map((section) => (
        <div key={section.title} className="mb-6">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-text-muted px-3 pb-2">
            {section.title}
          </div>
          <ul className="list-none flex flex-col gap-[3px]">
            {section.items.map((item) => {
              const Icon =
                typeof item.icon === "string" ? (iconMap[item.icon] ?? HelpCircle) : item.icon;
              const active = isItemActive(item.href);

              return (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 py-[9px] px-3 rounded-lg text-[13.5px] transition no-underline ${
                      active
                        ? "bg-light-green text-dark-green font-semibold"
                        : "text-text-secondary font-medium hover:bg-slate-50 hover:text-text-primary"
                    }`}
                  >
                    <Icon size={18} className={`shrink-0 ${active ? "text-primary-green" : ""}`} />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}
