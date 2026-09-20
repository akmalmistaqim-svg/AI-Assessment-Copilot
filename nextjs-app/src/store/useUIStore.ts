import { create } from "zustand";
import { devtools } from "zustand/middleware";

export type AssessmentFilter = "ALL" | "finalized" | "in-review" | "draft";

export interface UIState {
  // State
  isSidebarOpen: boolean;
  isProfileDropdownOpen: boolean;
  activeModal: string | null;
  searchQuery: string;
  selectedFilter: AssessmentFilter;

  // Actions
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleProfileDropdown: () => void;
  setProfileDropdownOpen: (open: boolean) => void;
  openModal: (name: string) => void;
  closeModal: () => void;
  setSearchQuery: (query: string) => void;
  setFilter: (filter: AssessmentFilter) => void;
}

export const useUIStore = create<UIState>()(
  devtools(
    (set) => ({
      // Initial state
      isSidebarOpen: false,
      isProfileDropdownOpen: false,
      activeModal: null,
      searchQuery: "",
      selectedFilter: "ALL",

      // Actions
      toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
      setSidebarOpen: (open: boolean) => set({ isSidebarOpen: open }),

      toggleProfileDropdown: () =>
        set((state) => ({ isProfileDropdownOpen: !state.isProfileDropdownOpen })),
      setProfileDropdownOpen: (open: boolean) => set({ isProfileDropdownOpen: open }),

      openModal: (name: string) => set({ activeModal: name }),
      closeModal: () => set({ activeModal: null }),

      setSearchQuery: (query: string) => set({ searchQuery: query }),
      setFilter: (filter: AssessmentFilter) => set({ selectedFilter: filter }),
    }),
    { name: "UIStore" },
  ),
);
