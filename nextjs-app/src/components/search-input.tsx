"use client";

import { Search } from "lucide-react";
import { useUIStore } from "@/store/useUIStore";

interface SearchInputProps {
  placeholder?: string;
}

export function SearchInput({ placeholder = "Search..." }: SearchInputProps) {
  const searchQuery = useUIStore((s) => s.searchQuery);
  const setSearchQuery = useUIStore((s) => s.setSearchQuery);

  return (
    <div className="relative flex items-center w-full max-w-[420px]">
      <Search size={16} className="absolute left-3 text-text-muted pointer-events-none" />
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder={placeholder}
        aria-label="Search"
        className="w-full pl-9 pr-3.5 py-2 text-sm bg-slate-50 border border-border-color rounded-full focus:outline-none focus:border-primary-green focus:bg-white transition"
      />
    </div>
  );
}
