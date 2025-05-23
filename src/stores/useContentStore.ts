// stores/useContentStore.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  ContentItem,
  ScheduledItem,
  SelectableContentItem,
  PresentationContentItem,
  Slide,
  Song,
} from "../types";

interface ContentStore {
  items: ContentItem[];
  scheduledItems: ScheduledItem[];
  liveQueue: ContentItem[];
  selectedItem: SelectableContentItem | null;
  searchQuery: string;
  currentPresentationSlideIndex: number | null;

  loadItems: () => Promise<void>;
  addItem: (item: ContentItem) => void;
  updateItem: (id: string, item: Partial<ContentItem>) => void;
  deleteItem: (id: string) => void;
  setSearchQuery: (query: string) => void;
  setSelectedItem: (item: SelectableContentItem | null) => void;
  setCurrentPresentationSlideIndex: (index: number | null) => void;
  nextSlide: () => void;
  previousSlide: () => void;
  scheduleItem: (item: ScheduledItem) => void;
  unscheduleItem: (id: string) => void;
  updateScheduledItems: (items: ScheduledItem[]) => void;
  addToLiveQueue: (item: ContentItem) => void;
  removeFromLiveQueue: (itemId: string) => void;
  reorderItems: (items: ScheduledItem[]) => void;
  updateItemTiming: (
    id: string,
    timing: { duration: number; delay: number }
  ) => void;
}

export const useContentStore = create(
  persist<ContentStore>(
    (set, get) => ({
      items: [] as ContentItem[],
      scheduledItems: [] as ScheduledItem[],
      liveQueue: [] as ContentItem[],
      selectedItem: null,
      searchQuery: "",
      currentPresentationSlideIndex: null,

      loadItems: async function () {
        try {
          const loadedItems: ContentItem[] = []; // Load from your data source
          set({ items: loadedItems });
        } catch (error) {
          console.error("Failed to load items:", error);
        }
      },

      addItem: function (item) {
        set((state) => ({ items: [...state.items, item] }));
      },
      updateItem: function (id, updatedItem) {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, ...updatedItem } : item
          ),
        }));
      },
      deleteItem: function (id) {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },
      setSearchQuery: function (query) {
        set({ searchQuery: query });
      },
      setSelectedItem: function (item: SelectableContentItem | null) {
        if (item && (item.type === "presentation" || item.type === "song")) {
          const itemWithSlides = item as PresentationContentItem | Song;
          if (itemWithSlides.slides && itemWithSlides.slides.length > 0) {
            set({ selectedItem: item, currentPresentationSlideIndex: 0 });
          } else {
            set({ selectedItem: item, currentPresentationSlideIndex: null });
          }
        } else {
          set({ selectedItem: item, currentPresentationSlideIndex: null });
        }
      },
      setCurrentPresentationSlideIndex: function (index: number | null) {
        set({ currentPresentationSlideIndex: index });
      },
      nextSlide: function () {
        set((state) => {
          if (
            state.selectedItem &&
            (state.selectedItem.type === "song" ||
              state.selectedItem.type === "presentation")
          ) {
            const itemWithSlides = state.selectedItem as
              | Song
              | PresentationContentItem;
            if (
              itemWithSlides.slides &&
              itemWithSlides.slides.length > 0 &&
              state.currentPresentationSlideIndex !== null
            ) {
              const newIndex = Math.min(
                state.currentPresentationSlideIndex + 1,
                itemWithSlides.slides.length - 1
              );
              return { currentPresentationSlideIndex: newIndex };
            }
          }
          return {};
        });
      },
      previousSlide: function () {
        set((state) => {
          if (
            state.selectedItem &&
            (state.selectedItem.type === "song" ||
              state.selectedItem.type === "presentation")
          ) {
            const itemWithSlides = state.selectedItem as
              | Song
              | PresentationContentItem;
            if (
              itemWithSlides.slides &&
              itemWithSlides.slides.length > 0 &&
              state.currentPresentationSlideIndex !== null
            ) {
              const newIndex = Math.max(
                state.currentPresentationSlideIndex - 1,
                0
              );
              return { currentPresentationSlideIndex: newIndex };
            }
          }
          return {};
        });
      },
      scheduleItem: function (item) {
        set((state) => ({
          scheduledItems: [...state.scheduledItems, item],
        }));
      },
      unscheduleItem: function (id) {
        set((state) => ({
          scheduledItems: state.scheduledItems.filter((item) => item.id !== id),
        }));
      },
      updateScheduledItems: function (items) {
        set({ scheduledItems: items });
      },
      addToLiveQueue: function (item) {
        set((state) => ({
          liveQueue: [...state.liveQueue, item],
        }));
      },
      removeFromLiveQueue: function (itemId) {
        set((state) => ({
          liveQueue: state.liveQueue.filter((item) => item.id !== itemId),
        }));
      },
      reorderItems: function (items) {
        set({ scheduledItems: items });
      },
      updateItemTiming: function (id, timing) {
        set((state) => ({
          scheduledItems: state.scheduledItems.map((item) =>
            item.id === id ? { ...item, ...timing } : item
          ),
        }));
      },
    }),
    {
      name: "content-store-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state: ContentStore) => ({
        selectedItem: state.selectedItem,
        currentPresentationSlideIndex: state.currentPresentationSlideIndex,
        items: state.items,
        scheduledItems: state.scheduledItems,
        liveQueue: state.liveQueue,
        searchQuery: state.searchQuery,
      }),
    }
  )
);
