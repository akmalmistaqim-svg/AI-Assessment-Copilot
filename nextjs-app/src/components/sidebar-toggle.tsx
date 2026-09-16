"use client";

import { Menu, X } from "lucide-react";
import { useUIStore } from "@/store/useUIStore";

/**
 * Button to toggle the mobile drawer sidebar.
 * Uses atomic Zustand selector to prevent re-renders.
 */
export function SidebarToggleButton() {
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);

  return (
    <button
      type="button"
      onClick={toggleSidebar}
      className="md:hidden flex items-center justify-center p-1.5 rounded-lg text-text-secondary hover:bg-slate-100 hover:text-text-primary transition cursor-pointer"
      aria-label="Open Sidebar Menu"
    >
      <Menu size={22} />
    </button>
  );
}

/**
 * Sidebar Drawer wrapper component.
 * Subscribes to `isSidebarOpen` and `setSidebarOpen` from Zustand UI store.
 */
export function SidebarDrawer({ children }: { children: React.ReactNode }) {
  const isSidebarOpen = useUIStore((s) => s.isSidebarOpen);
  const setSidebarOpen = useUIStore((s) => s.setSidebarOpen);

  return (
    <>
      {/* Mobile backdrop */}
      {isSidebarOpen && (
        <button
          type="button"
          aria-label="Close Sidebar Backdrop"
          className="md:hidden fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[99] border-none cursor-default"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`w-[260px] bg-sidebar-bg border-r border-border-color flex flex-col fixed top-0 bottom-0 left-0 z-[100] transition-transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Mobile close button */}
        <button
          type="button"
          onClick={() => setSidebarOpen(false)}
          className="md:hidden absolute top-4 right-4 p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-slate-100 transition cursor-pointer z-10"
          aria-label="Close Sidebar"
        >
          <X size={18} />
        </button>

        {children}
      </aside>
    </>
  );
}
