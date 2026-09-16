"use client";

import { ChevronDown, LogOut, Sliders, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { useUIStore } from "@/store/useUIStore";

interface ProfileDropdownProps {
  name: string;
  email: string;
  role: string;
  initials: string;
}

export function ProfileDropdown({ name, email, role, initials }: ProfileDropdownProps) {
  const isOpen = useUIStore((s) => s.isProfileDropdownOpen);
  const toggleDropdown = useUIStore((s) => s.toggleProfileDropdown);
  const setDropdownOpen = useUIStore((s) => s.setProfileDropdownOpen);

  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setDropdownOpen]);

  async function handleLogout() {
    setDropdownOpen(false);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={toggleDropdown}
        className="flex items-center gap-2.5 p-1 pr-1.5 rounded-full hover:bg-slate-50 border border-transparent hover:border-border-color transition cursor-pointer"
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-label="User profile menu"
      >
        <div className="w-[34px] h-[34px] rounded-full bg-light-green text-dark-green font-semibold text-[13px] flex items-center justify-center border-[1.5px] border-primary-green shrink-0">
          {initials}
        </div>
        <div className="hidden sm:flex flex-col text-left">
          <span className="text-[13px] font-semibold text-text-primary leading-tight">{name}</span>
          <span className="text-[11px] text-text-muted capitalize">{role}</span>
        </div>
        <ChevronDown size={14} className="text-text-muted ml-0.5" />
      </button>

      {isOpen && (
        <div className="absolute top-[calc(100%+8px)] right-0 w-[220px] bg-white rounded-xl shadow-lg border border-border-color py-2 z-[1000] animate-[toastIn_0.2s_ease]">
          {/* User Header */}
          <div className="px-4 py-2.5 border-b border-border-light mb-1">
            <div className="text-[13.5px] font-semibold text-text-primary">{name}</div>
            <div className="text-[11.5px] text-text-secondary break-all">{email}</div>
          </div>

          <button
            type="button"
            onClick={() => setDropdownOpen(false)}
            className="flex items-center gap-2.5 w-full px-4 py-2.5 text-[13px] text-text-secondary hover:bg-slate-50 hover:text-text-primary transition cursor-pointer"
          >
            <User size={16} /> <span>Profile</span>
          </button>
          <button
            type="button"
            onClick={() => setDropdownOpen(false)}
            className="flex items-center gap-2.5 w-full px-4 py-2.5 text-[13px] text-text-secondary hover:bg-slate-50 hover:text-text-primary transition cursor-pointer"
          >
            <Sliders size={16} /> <span>Settings</span>
          </button>

          <div className="h-px bg-border-light my-1" />

          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-2.5 w-full px-4 py-2.5 text-[13px] text-status-danger-text hover:bg-status-danger-bg transition cursor-pointer"
          >
            <LogOut size={16} /> <span>Logout</span>
          </button>
        </div>
      )}
    </div>
  );
}
