// stores/useContentStore.ts
import { create } from 'zustand';
import { ContentItem, ScheduledItem } from '../types';

interface ContentStore {
  items: ContentItem[];
  scheduledItems: ScheduledItem[];
  liveQueue: ContentItem[];
  selectedItem: ContentItem | null;
  searchQuery: string;
  
  loadItems: () => Promise<void>;
  addItem: (item: ContentItem) => void;
  updateItem: (id: string, item: Partial<ContentItem>) => void;
  deleteItem: (id: string) => void;
  setSearchQuery: (query: string) => void;
  setSelectedItem: (item: ContentItem | null) => void;
  scheduleItem: (item: ScheduledItem) => void;
  unscheduleItem: (id: string) => void;
  updateScheduledItems: (items: ScheduledItem[]) => void;
  addToLiveQueue: (item: ContentItem) => void;
  removeFromLiveQueue: (itemId: string) => void;
}

export const useContentStore = create<ContentStore>((set) => ({
  items: [] as ContentItem[],
  scheduledItems: [] as ScheduledItem[],
  liveQueue: [] as ContentItem[],
  selectedItem: null,
  searchQuery: '',

  loadItems: async () => {
    try {
      const loadedItems: ContentItem[] = []; // Load from your data source
      set({ items: loadedItems });
    } catch (error) {
      console.error('Failed to load items:', error);
    }
  },

  addItem: (item) => set((state) => ({ items: [...state.items, item] })),
  updateItem: (id, updatedItem) => set((state) => ({
    items: state.items.map(item => item.id === id ? { ...item, ...updatedItem } : item)
  })),
  deleteItem: (id) => set((state) => ({
    items: state.items.filter(item => item.id !== id)
  })),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedItem: (item) => set({ selectedItem: item }),
  scheduleItem: (item) => set((state) => ({
    scheduledItems: [...state.scheduledItems, item]
  })),
  unscheduleItem: (id) => set((state) => ({
    scheduledItems: state.scheduledItems.filter(item => item.id !== id)
  })),
  updateScheduledItems: (items) => set({ scheduledItems: items }),
  addToLiveQueue: (item) => set((state) => ({
    liveQueue: [...state.liveQueue, item]
  })),
  removeFromLiveQueue: (itemId) => set((state) => ({
    liveQueue: state.liveQueue.filter(item => item.id !== itemId)
  })),
}));