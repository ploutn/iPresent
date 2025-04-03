import { create } from "zustand";

interface SidebarStore {
  activeTab: string | null;
  setActiveTab: (tab: string) => void;
}

export const useSidebar = create<SidebarStore>((set) => ({
  activeTab: null,
  setActiveTab: (tab) => set({ activeTab: tab }),
}));
