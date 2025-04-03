// components/hooks/useSidebar.ts
import { create } from "zustand";

interface SidebarState {
  activeTab:
    | "home"
    | "songs"
    | "announcements"
    | "bible"
    | "media"
    | "settings";
  setActiveTab: (
    tab: "home" | "songs" | "announcements" | "bible" | "media" | "settings"
  ) => void;
}

export const useSidebar = create<SidebarState>((set) => ({
  activeTab: "home",
  setActiveTab: (tab) => set({ activeTab: tab }),
}));
