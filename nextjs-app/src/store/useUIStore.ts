import { create } from "zustand";

export interface UIState {
  // State
  isSidebarOpen: boolean;
  isProfileDropdownOpen: boolean;
  activeModal: string | null;
  searchQuery: string;

  // Actions
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleProfileDropdown: () => void;
  setProfileDropdownOpen: (open: boolean) => void;
  openModal: (name: string) => void;
  closeModal: () => void;
  setSearchQuery: (query: string) => void;
}

export const useUIStore = create<UIState>((set) => ({
  // Initial state
  isSidebarOpen: false,
  isProfileDropdownOpen: false,
  activeModal: null,
  searchQuery: "",

  // Actions
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setSidebarOpen: (open: boolean) => set({ isSidebarOpen: open }),

  toggleProfileDropdown: () =>
    set((state) => ({ isProfileDropdownOpen: !state.isProfileDropdownOpen })),
  setProfileDropdownOpen: (open: boolean) => set({ isProfileDropdownOpen: open }),

  openModal: (name: string) => set({ activeModal: name }),
  closeModal: () => set({ activeModal: null }),

  setSearchQuery: (query: string) => set({ searchQuery: query }),
}));
