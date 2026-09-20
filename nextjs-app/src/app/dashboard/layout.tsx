import { CheckCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LogoutButton } from "@/app/dashboard/logout-button";
import { NotificationButton } from "@/components/notification-button";
import { ProfileDropdown } from "@/components/profile-dropdown";
import { SearchInput } from "@/components/search-input";
import { SidebarNavList } from "@/components/sidebar-nav-list";
import { SidebarDrawer, SidebarToggleButton } from "@/components/sidebar-toggle";
import { getSession } from "@/lib/auth";

// Navigation config per role
const dosenNavSections = [
  {
    title: "MAIN",
    items: [{ label: "Dashboard", href: "/dashboard/dosen", icon: "LayoutDashboard" }],
  },
  {
    title: "ASSESSMENT",
    items: [
      { label: "Classes", href: "/dashboard/dosen/classes", icon: "GraduationCap" },
      { label: "Rubrics", href: "/dashboard/dosen/rubrics", icon: "FileCheck2" },
      { label: "Assignments", href: "/dashboard/dosen/assignments", icon: "FileText" },
      { label: "Assessments", href: "/dashboard/dosen/assessments", icon: "ClipboardCheck" },
    ],
  },
  {
    title: "GENERAL",
    items: [
      { label: "Settings", href: "/dashboard/dosen/settings", icon: "Settings" },
      { label: "Help", href: "/dashboard/dosen/help", icon: "HelpCircle" },
    ],
  },
];

const mahasiswaNavSections = [
  {
    title: "MAIN",
    items: [{ label: "Dashboard", href: "/dashboard/mahasiswa", icon: "LayoutDashboard" }],
  },
  {
    title: "LEARNING",
    items: [
      { label: "Kelas Saya", href: "/dashboard/mahasiswa/classes", icon: "GraduationCap" },
      { label: "My Assignments", href: "/dashboard/mahasiswa/assignments", icon: "FileText" },
      { label: "My Grades", href: "/dashboard/mahasiswa/grades", icon: "Award" },
      { label: "Feedback", href: "/dashboard/mahasiswa/feedback", icon: "MessageSquare" },
    ],
  },
  {
    title: "GENERAL",
    items: [
      { label: "Settings", href: "/dashboard/mahasiswa/settings", icon: "Settings" },
      { label: "Help", href: "/dashboard/mahasiswa/help", icon: "HelpCircle" },
    ],
  },
];

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const isDosen = session.role === "dosen";
  const portalLabel = isDosen ? "Dosen Portal" : "Student Portal";
  const navSections = isDosen ? dosenNavSections : mahasiswaNavSections;
  const searchPlaceholder = isDosen
    ? "Search classes, assignments, or students..."
    : "Search classes, assignments, grades, or feedback...";

  // User initials
  const nameParts = session.name.split(" ");
  const initials =
    nameParts.length >= 2
      ? `${nameParts[0]?.charAt(0) ?? ""}${nameParts[1]?.charAt(0) ?? ""}`.toUpperCase()
      : (nameParts[0]?.substring(0, 2) ?? "").toUpperCase();

  return (
    <div className="flex min-h-screen bg-main-bg relative">
      {/* Sidebar Drawer */}
      <SidebarDrawer>
        {/* Sidebar Header */}
        <div className="p-5 md:py-6 md:px-5 border-b border-border-color">
          <Link
            href={`/dashboard/${session.role}`}
            className="flex items-center gap-3 no-underline"
          >
            <Image
              src="/dexa-logo.png"
              alt="DeXa Assessment Logo"
              width={40}
              height={40}
              className="rounded-xl object-contain shadow-xs shrink-0"
              priority
            />
            <div className="flex flex-col">
              <span className="text-base font-bold text-text-primary tracking-tight leading-tight">
                DeXa Assessment
              </span>
              <span className="text-[11px] text-text-secondary font-normal mt-0.5">
                {portalLabel}
              </span>
            </div>
          </Link>
        </div>

        {/* Dynamic Navigation List Component */}
        <SidebarNavList sections={navSections} />

        {/* Sidebar Footer: Logout Button */}
        <div className="p-3 border-t border-border-color bg-sidebar-bg shrink-0">
          <LogoutButton variant="sidebar" />
        </div>
      </SidebarDrawer>

      {/* Main Content Wrapper */}
      <div className="flex-1 ml-0 md:ml-[260px] flex flex-col min-w-0 transition-[margin]">
        {/* Topbar */}
        <header className="h-[68px] bg-topbar-bg border-b border-border-color flex items-center justify-between px-4 md:px-8 sticky top-0 z-[90]">
          <div className="flex items-center gap-3 flex-1">
            <SidebarToggleButton />
            <SearchInput placeholder={searchPlaceholder} />
          </div>

          <div className="flex items-center gap-4">
            <NotificationButton role={session.role} />
            <ProfileDropdown
              name={session.name}
              email={session.email}
              role={session.role}
              initials={initials}
            />
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-5 md:p-8 max-w-[1360px] w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}
