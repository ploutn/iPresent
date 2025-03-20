// components/hooks/useSidebar.ts
import { create } from 'zustand';

interface SidebarState {
  activeTab: 'songs' | 'announcements' | 'bible' | 'media' | 'settings';
  setActiveTab: (tab: 'songs' | 'announcements' | 'bible' | 'media' | 'settings') => void;
}

export const useSidebar = create<SidebarState>((set) => ({
  activeTab: 'songs',
  setActiveTab: (tab) => set({ activeTab: tab }),
}));