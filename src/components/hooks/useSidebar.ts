// components/hooks/useSidebar.ts
import { create } from "zustand";

interface SidebarState {
  activeTab:
    | "home"
    | "songs"
    | "announcements"
    | "presentations"
    | "bible"
    | "media"
    | "settings"
    | "schedule-live";
  setActiveTab: (
    tab:
      | "home"
      | "songs"
      | "announcements"
      | "presentations"
      | "bible"
      | "media"
      | "settings"
      | "schedule-live"
  ) => void;
}

export const useSidebar = create<SidebarState>((set) => ({
  activeTab: "home",
  setActiveTab: (tab) => set({ activeTab: tab }),
}));
