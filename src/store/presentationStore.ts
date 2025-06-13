// src/store/presentationStore.ts
import { create } from "zustand";
import {
  ContentType,
  ContentItem,
  Song,
  Media,
  Announcement,
  ScheduledItem,
  Slide,
  PresentationContentItem,
  PresentationSettings,
  PresentationMetadata,
  PresentationTemplate,
  SlideTransition,
} from "../types";
import { persist } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";
import { PROFESSIONAL_TEMPLATES } from "../data/professionalTemplates";

interface PresentationStore {
  // Legacy items for backward compatibility
  items: ContentItem[];
  searchQuery: string;
  searchResults: ContentItem[];
  expandedItems: Set<string>;
  activeTab: ContentType;
  scheduledItems: ScheduledItem[];
  slides: Slide[];
  currentSlide: number | null;
  searchError: string | null;

  // Enhanced presentation management
  presentations: PresentationContentItem[];
  currentPresentation: PresentationContentItem | null;
  templates: PresentationTemplate[];
  currentSlideIndex: number;
  isPlaying: boolean;
  isPaused: boolean;
  playbackSpeed: number;

  // New actions for PresentationsPage.tsx
  setPresentations: (presentations: PresentationContentItem[]) => void;
  addPresentation: (presentation: PresentationContentItem) => void;

  // Legacy Actions
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

  // Enhanced Presentation Actions
  createPresentation: (
    title: string,
    description?: string
  ) => PresentationContentItem;
  updatePresentation: (
    id: string,
    updates: Partial<PresentationContentItem>
  ) => void;
  deletePresentation: (id: string) => void;
  duplicatePresentation: (id: string) => PresentationContentItem;
  setCurrentPresentation: (
    presentation: PresentationContentItem | null
  ) => void;

  // Slide Management
  addSlideToPresentation: (
    presentationId: string,
    slide: Partial<Slide>
  ) => void;
  updateSlide: (
    presentationId: string,
    slideId: string,
    updates: Partial<Slide>
  ) => void;
  deleteSlide: (presentationId: string, slideId: string) => void;
  reorderSlides: (presentationId: string, slideIds: string[]) => void;
  duplicateSlide: (presentationId: string, slideId: string) => void;

  // Playback Controls
  startPresentation: (presentationId: string) => void;
  stopPresentation: () => void;
  pausePresentation: () => void;
  resumePresentation: () => void;
  nextSlide: (startTransition: (slide: Slide) => void) => void;
  previousSlide: (startTransition: (slide: Slide) => void) => void;
  goToSlide: (index: number) => void;
  setPlaybackSpeed: (speed: number) => void;

  // Template Management
  createTemplate: (
    presentation: PresentationContentItem,
    name: string,
    category: string
  ) => void;
  deleteTemplate: (id: string) => void;
  applyTemplate: (presentationId: string, templateId: string) => void;

  // Utility Functions
  getDefaultPresentationSettings: () => PresentationSettings;
  getDefaultSlideTransition: () => SlideTransition;
  calculatePresentationDuration: (presentationId: string) => number;
}

export const usePresentationStore = create<PresentationStore>()(
  persist(
    (set, get) => ({
      // Legacy state
      items: [],
      searchQuery: "",
      searchResults: [],
      expandedItems: new Set(),
      activeTab: "song",
      scheduledItems: [],
      slides: [],
      currentSlide: null,
      searchError: null,

      // Enhanced presentation state
      presentations: [],
      currentPresentation: null,
      templates: PROFESSIONAL_TEMPLATES,
      currentSlideIndex: 0,
      isPlaying: false,
      isPaused: false,
      playbackSpeed: 1.0,

      // Legacy actions
      setSearchQuery: (query) => set({ searchQuery: query }),

      search: () => {
        try {
          const results = get().items.filter(
            (item) =>
              item.title
                .toLowerCase()
                .includes(get().searchQuery.toLowerCase()) ||
              item.content
                .toLowerCase()
                .includes(get().searchQuery.toLowerCase())
          );
          set({ searchResults: results, searchError: null });
        } catch (error) {
          set({ searchError: "An error occurred during search." });
        }
      },

      toggleExpandedItem: (id) =>
        set((state) => {
          const newExpandedItems = new Set(state.expandedItems);
          if (newExpandedItems.has(id)) {
            newExpandedItems.delete(id);
          } else {
            newExpandedItems.add(id);
          }
          return { expandedItems: newExpandedItems };
        }),

      setActiveTab: (tab) => set({ activeTab: tab }),

      addItem: (item) =>
        set((state) => ({
          items: [...state.items, item],
        })),

      updateItem: (id, updatedItem) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, ...updatedItem } : item
          ),
        })),

      deleteItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),

      scheduleItem: (item) =>
        set((state) => ({
          scheduledItems: [...state.scheduledItems, item],
        })),

      unscheduleItem: (id) =>
        set((state) => ({
          scheduledItems: state.scheduledItems.filter((item) => item.id !== id),
        })),

      addSlide: (slide) =>
        set((state) => ({
          slides: [...state.slides, slide],
          currentSlide: slide.id,
        })),

      setCurrentSlide: (id) => set({ currentSlide: id }),

      // New actions for PresentationsPage.tsx
      setPresentations: (presentations) => set({ presentations }),
      addPresentation: (presentation) =>
        set((state) => ({
          presentations: [...state.presentations, presentation],
        })),

      // Enhanced presentation actions
      createPresentation: (title: string, description?: string) => {
        const now = new Date();
        const defaultSettings = get().getDefaultPresentationSettings();
        const newPresentation: PresentationContentItem = {
          id: uuidv4(),
          title,
          type: "presentation",
          content: description || "",
          createdAt: now,
          updatedAt: now,
          slides: [],
          description,
          author: "Current User", // TODO: Get from user context
          tags: [],
          category: "General",
          settings: defaultSettings,
          metadata: {
            version: "1.0.0",
            totalSlides: 0,
            estimatedDuration: 0,
            isPublic: false,
            isTemplate: false,
          },
        };

        set((state) => ({
          presentations: [...state.presentations, newPresentation],
        }));

        return newPresentation;
      },

      updatePresentation: (
        id: string,
        updates: Partial<PresentationContentItem>
      ) => {
        set((state) => ({
          presentations: state.presentations.map((p) =>
            p.id === id ? { ...p, ...updates, updatedAt: new Date() } : p
          ),
        }));
      },

      deletePresentation: (id: string) => {
        set((state) => ({
          presentations: state.presentations.filter((p) => p.id !== id),
          currentPresentation:
            state.currentPresentation?.id === id
              ? null
              : state.currentPresentation,
        }));
      },

      duplicatePresentation: (id: string) => {
        const { presentations } = get();
        const original = presentations.find((p) => p.id === id);
        if (!original) throw new Error("Presentation not found");

        const now = new Date();
        const duplicate: PresentationContentItem = {
          ...original,
          id: uuidv4(),
          title: `${original.title} (Copy)`,
          createdAt: now,
          updatedAt: now,
          slides: original.slides.map((slide) => ({
            ...slide,
            id: uuidv4(),
            createdAt: now,
            updatedAt: now,
          })),
        };

        set((state) => ({
          presentations: [...state.presentations, duplicate],
        }));

        return duplicate;
      },

      setCurrentPresentation: (
        presentation: PresentationContentItem | null
      ) => {
        set({ currentPresentation: presentation, currentSlideIndex: 0 });
      },

      // Slide management
      addSlideToPresentation: (
        presentationId: string,
        slide: Partial<Slide>
      ) => {
        const now = new Date();
        const { presentations } = get();
        const presentation = presentations.find((p) => p.id === presentationId);
        if (!presentation) return;

        const newSlide: Slide = {
          id: uuidv4(),
          title: slide.title || "New Slide",
          content: slide.content || "",
          type: slide.type || "presentation",
          order: presentation.slides.length,
          createdAt: now,
          updatedAt: now,
          transition: get().getDefaultSlideTransition(),
          backgroundColor: "#ffffff",
          textColor: "#000000",
          fontSize: 24,
          fontFamily: "Arial",
          textAlign: "center",
          ...slide,
        };

        set((state) => ({
          presentations: state.presentations.map((p) =>
            p.id === presentationId
              ? {
                  ...p,
                  slides: [...p.slides, newSlide],
                  updatedAt: now,
                  metadata: {
                    ...p.metadata,
                    totalSlides: p.slides.length + 1,
                  },
                }
              : p
          ),
        }));
      },

      updateSlide: (
        presentationId: string,
        slideId: string,
        updates: Partial<Slide>
      ) => {
        set((state) => ({
          presentations: state.presentations.map((p) =>
            p.id === presentationId
              ? {
                  ...p,
                  slides: p.slides.map((s) =>
                    s.id === slideId
                      ? { ...s, ...updates, updatedAt: new Date() }
                      : s
                  ),
                  updatedAt: new Date(),
                }
              : p
          ),
        }));
      },

      deleteSlide: (presentationId: string, slideId: string) => {
        set((state) => ({
          presentations: state.presentations.map((p) =>
            p.id === presentationId
              ? {
                  ...p,
                  slides: p.slides.filter((s) => s.id !== slideId),
                  updatedAt: new Date(),
                  metadata: {
                    ...p.metadata,
                    totalSlides: p.slides.length - 1,
                  },
                }
              : p
          ),
        }));
      },

      reorderSlides: (presentationId: string, slideIds: string[]) => {
        set((state) => ({
          presentations: state.presentations.map((p) =>
            p.id === presentationId
              ? {
                  ...p,
                  slides: slideIds
                    .map((id, index) => {
                      const slide = p.slides.find((s) => s.id === id);
                      return slide ? { ...slide, order: index } : slide;
                    })
                    .filter(Boolean) as Slide[],
                  updatedAt: new Date(),
                }
              : p
          ),
        }));
      },

      duplicateSlide: (presentationId: string, slideId: string) => {
        const { presentations } = get();
        const presentation = presentations.find((p) => p.id === presentationId);
        const slide = presentation?.slides.find((s) => s.id === slideId);
        if (!slide) return;

        const now = new Date();
        const duplicatedSlide: Slide = {
          ...slide,
          id: uuidv4(),
          title: `${slide.title} (Copy)`,
          order: slide.order + 1,
          createdAt: now,
          updatedAt: now,
        };

        set((state) => ({
          presentations: state.presentations.map((p) =>
            p.id === presentationId
              ? {
                  ...p,
                  slides: [
                    ...p.slides.slice(0, slide.order + 1),
                    duplicatedSlide,
                    ...p.slides
                      .slice(slide.order + 1)
                      .map((s) => ({ ...s, order: s.order + 1 })),
                  ],
                  updatedAt: now,
                }
              : p
          ),
        }));
      },

      // Playback controls
      startPresentation: (presentationId: string) => {
        const { presentations } = get();
        const presentation = presentations.find((p) => p.id === presentationId);
        if (presentation) {
          set({
            currentPresentation: presentation,
            currentSlideIndex: 0,
            isPlaying: true,
            isPaused: false,
          });
        }
      },

      stopPresentation: () => {
        set({
          isPlaying: false,
          isPaused: false,
          currentSlideIndex: 0,
        });
      },

      pausePresentation: () => {
        set({ isPaused: true });
      },

      resumePresentation: () => {
        set({ isPaused: false });
      },

      nextSlide: (startTransition) => {
        const { currentPresentation, currentSlideIndex } = get();
        if (
          currentPresentation &&
          currentSlideIndex < currentPresentation.slides.length - 1
        ) {
          const nextSlideData =
            currentPresentation.slides[currentSlideIndex + 1];
          startTransition(nextSlideData);
          set({ currentSlideIndex: currentSlideIndex + 1 });
        }
      },

      previousSlide: (startTransition) => {
        const { currentPresentation, currentSlideIndex } = get();
        if (currentSlideIndex > 0) {
          const previousSlideData =
            currentPresentation.slides[currentSlideIndex - 1];
          startTransition(previousSlideData);
          set({ currentSlideIndex: currentSlideIndex - 1 });
        }
      },

      goToSlide: (index: number) => {
        const { currentPresentation } = get();
        if (
          currentPresentation &&
          index >= 0 &&
          index < currentPresentation.slides.length
        ) {
          set({ currentSlideIndex: index });
        }
      },

      setPlaybackSpeed: (speed: number) => {
        set({ playbackSpeed: Math.max(0.1, Math.min(3.0, speed)) });
      },

      // Template management
      createTemplate: (
        presentation: PresentationContentItem,
        name: string,
        category: string
      ) => {
        const now = new Date();
        const template: PresentationTemplate = {
          id: uuidv4(),
          name,
          description: `Template based on ${presentation.title}`,
          category,
          thumbnail: presentation.thumbnail || "",
          slides: presentation.slides.map((slide) => ({
            title: slide.title,
            content: "Template content",
            type: slide.type,
            backgroundColor: slide.backgroundColor,
            textColor: slide.textColor,
            fontSize: slide.fontSize,
            fontFamily: slide.fontFamily,
            textAlign: slide.textAlign,
            transition: slide.transition,
          })),
          settings: { ...presentation.settings },
          tags: [...(presentation.tags || [])],
          isBuiltIn: false,
          createdAt: now,
          updatedAt: now,
        };

        set((state) => ({
          templates: [...state.templates, template],
        }));
      },

      deleteTemplate: (id: string) => {
        set((state) => ({
          templates: state.templates.filter((t) => t.id !== id),
        }));
      },

      applyTemplate: (presentationId: string, templateId: string) => {
        const { presentations, templates } = get();
        const template = templates.find((t) => t.id === templateId);
        const presentation = presentations.find((p) => p.id === presentationId);

        if (template && presentation) {
          const now = new Date();
          const updatedSlides = template.slides.map((templateSlide, index) => {
            const existingSlide = presentation.slides[index];
            return {
              id: existingSlide?.id || uuidv4(),
              title: existingSlide?.title || templateSlide.title || "New Slide",
              content: existingSlide?.content || templateSlide.content || "",
              type: templateSlide.type || "presentation",
              order: index,
              createdAt: existingSlide?.createdAt || now,
              updatedAt: now,
              ...templateSlide,
            } as Slide;
          });

          get().updatePresentation(presentationId, {
            slides: updatedSlides,
            settings: { ...presentation.settings, ...template.settings },
            template: templateId,
          });
        }
      },

      // Utility functions
      getDefaultPresentationSettings: (): PresentationSettings => ({
        autoAdvance: false,
        defaultSlideDuration: 5,
        loopPresentation: false,
        showSlideNumbers: true,
        showProgressBar: true,
        allowRemoteControl: true,
        backgroundColor: "#ffffff",
        defaultTransition: get().getDefaultSlideTransition(),
        aspectRatio: "16:9",
        resolution: {
          width: 1920,
          height: 1080,
        },
      }),

      getDefaultSlideTransition: (): SlideTransition => ({
        type: "fade",
        duration: 500,
        direction: "right",
        easing: "ease-in-out",
      }),

      calculatePresentationDuration: (presentationId: string): number => {
        const { presentations } = get();
        const presentation = presentations.find((p) => p.id === presentationId);
        if (!presentation) return 0;

        return presentation.slides.reduce((total, slide) => {
          return (
            total +
            (slide.duration || presentation.settings.defaultSlideDuration)
          );
        }, 0);
      },
    }),
    {
      name: "presentation-storage",
    }
  )
);
