// src/store/presentationStore.ts
import { create } from 'zustand';
import {
  ContentType,
  ContentItem,
  Song,
  Media,
  Announcement,
  ScheduledItem,
  Slide
} from '../types';
import { persist } from 'zustand/middleware';

interface PresentationStore {
  items: ContentItem[];
  searchQuery: string;
  searchResults: ContentItem[];
  expandedItems: Set<string>;
  activeTab: ContentType;
  scheduledItems: ScheduledItem[];
  slides: Slide[];
  currentSlide: number | null;
  searchError: string | null;

  // Actions
  setSearchQuery: (query: string) => void;
  search: () => void;
  toggleExpandedItem: (id: string) => void;
  setActiveTab: (tab: ContentType) => void;
  addItem: (item: ContentItem) => void;
  updateItem: (id: string, item: Partial<ContentItem>) => void;
  deleteItem: (id: string) => void;
  scheduleItem: (item: ScheduledItem) => void;
  unscheduleItem: (id: string) => void;
  addSlide: (slide: Slide) => void;
  setCurrentSlide: (id: number | null) => void;
}

export const usePresentationStore = create<PresentationStore>()(
  persist(
    (set, get) => ({
      items: [],
      searchQuery: '',
      searchResults: [],
      expandedItems: new Set(),
      activeTab: 'song',
      scheduledItems: [],
      slides: [],
      currentSlide: null,
      searchError: null,

      setSearchQuery: (query) => set({ searchQuery: query }),

      search: () => {
        try {
          const results = get().items.filter(item => 
            item.title.toLowerCase().includes(get().searchQuery.toLowerCase()) ||
            item.content.toLowerCase().includes(get().searchQuery.toLowerCase())
          );
          set({ searchResults: results, searchError: null });
        } catch (error) {
          set({ searchError: 'An error occurred during search.' });
        }
      },

      toggleExpandedItem: (id) => set((state) => {
        const newExpandedItems = new Set(state.expandedItems);
        if (newExpandedItems.has(id)) {
          newExpandedItems.delete(id);
        } else {
          newExpandedItems.add(id);
        }
        return { expandedItems: newExpandedItems };
      }),

      setActiveTab: (tab) => set({ activeTab: tab }),

      addItem: (item) => set((state) => ({ 
        items: [...state.items, item] 
      })),

      updateItem: (id, updatedItem) => set((state) => ({
        items: state.items.map(item => 
          item.id === id ? { ...item, ...updatedItem } : item
        )
      })),

      deleteItem: (id) => set((state) => ({
        items: state.items.filter(item => item.id !== id)
      })),

      scheduleItem: (item) => set((state) => ({
        scheduledItems: [...state.scheduledItems, item]
      })),

      unscheduleItem: (id) => set((state) => ({
        scheduledItems: state.scheduledItems.filter(item => item.id !== id)
      })),

      addSlide: (slide) => set((state) => ({
        slides: [...state.slides, slide],
        currentSlide: slide.id
      })),

      setCurrentSlide: (id) => set({ currentSlide: id })
    }),
    {
      name: 'presentation-storage'
    }
  )
);