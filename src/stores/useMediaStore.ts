import { create } from "zustand";
import { persist } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";

// Enhanced Media Types
export interface MediaItem {
  id: string;
  filename: string;
  originalName: string;
  title: string;
  description?: string;
  type: "image" | "video" | "audio";
  mimeType: string;
  size: number;
  duration?: number; // for video/audio in seconds
  dimensions?: { width: number; height: number }; // for images/videos
  url: string; // local file path or URL
  thumbnailUrl?: string;
  metadata: MediaMetadata;
  categoryId?: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface MediaMetadata {
  fileSize: number;
  resolution?: string;
  bitrate?: number;
  codec?: string;
  colorSpace?: string;
  exifData?: Record<string, any>;
}

export interface MediaCategory {
  id: string;
  name: string;
  description?: string;
  color?: string;
  parentId?: string;
  createdAt: Date;
}

export interface UploadProgress {
  id: string;
  filename: string;
  progress: number; // 0-100
  status: "uploading" | "processing" | "completed" | "error";
  error?: string;
}

export interface MediaFilter {
  type?: "image" | "video" | "audio";
  categoryId?: string;
  tags?: string[];
  dateRange?: { start: Date; end: Date };
  sizeRange?: { min: number; max: number };
}

interface MediaStore {
  // State
  mediaItems: MediaItem[];
  categories: MediaCategory[];
  uploadProgress: UploadProgress[];
  selectedItems: string[];
  viewMode: "grid" | "list";
  sortBy: "name" | "date" | "size" | "type";
  sortOrder: "asc" | "desc";
  filterBy: MediaFilter;
  searchQuery: string;

  // Actions
  uploadMedia: (files: FileList) => Promise<void>;
  deleteMedia: (ids: string[]) => Promise<void>;
  updateMediaMetadata: (id: string, metadata: Partial<MediaMetadata>) => void;
  updateMediaItem: (id: string, updates: Partial<MediaItem>) => void;
  createCategory: (category: Omit<MediaCategory, "id" | "createdAt">) => void;
  updateCategory: (id: string, updates: Partial<MediaCategory>) => void;
  deleteCategory: (id: string) => void;
  moveToCategory: (mediaIds: string[], categoryId: string) => void;
  generateThumbnail: (mediaId: string) => Promise<string>;
  searchMedia: (query: string) => void;
  setFilter: (filter: Partial<MediaFilter>) => void;
  clearFilter: () => void;
  getMediaByCategory: (categoryId: string) => MediaItem[];
  getFilteredMedia: () => MediaItem[];
  setViewMode: (mode: "grid" | "list") => void;
  setSortBy: (
    sortBy: "name" | "date" | "size" | "type",
    order?: "asc" | "desc"
  ) => void;
  setSelectedItems: (ids: string[]) => void;
  toggleSelectedItem: (id: string) => void;
  clearSelection: () => void;
  addUploadProgress: (progress: UploadProgress) => void;
  updateUploadProgress: (id: string, updates: Partial<UploadProgress>) => void;
  removeUploadProgress: (id: string) => void;
}

// File validation constants
export const SUPPORTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
];
export const SUPPORTED_VIDEO_TYPES = [
  "video/mp4",
  "video/webm",
  "video/ogg",
  "video/avi",
  "video/mov",
];
export const SUPPORTED_AUDIO_TYPES = [
  "audio/mp3",
  "audio/wav",
  "audio/ogg",
  "audio/aac",
  "audio/flac",
];
export const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
export const MAX_IMAGE_SIZE = 20 * 1024 * 1024; // 20MB
export const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB
export const MAX_AUDIO_SIZE = 50 * 1024 * 1024; // 50MB

// Utility functions
const validateFile = (file: File): { valid: boolean; error?: string } => {
  const allSupportedTypes = [
    ...SUPPORTED_IMAGE_TYPES,
    ...SUPPORTED_VIDEO_TYPES,
    ...SUPPORTED_AUDIO_TYPES,
  ];

  if (!allSupportedTypes.includes(file.type)) {
    return { valid: false, error: `Unsupported file type: ${file.type}` };
  }

  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File too large: ${(file.size / 1024 / 1024).toFixed(1)}MB (max: ${
        MAX_FILE_SIZE / 1024 / 1024
      }MB)`,
    };
  }

  // Type-specific size validation
  if (SUPPORTED_IMAGE_TYPES.includes(file.type) && file.size > MAX_IMAGE_SIZE) {
    return {
      valid: false,
      error: `Image too large: ${(file.size / 1024 / 1024).toFixed(
        1
      )}MB (max: ${MAX_IMAGE_SIZE / 1024 / 1024}MB)`,
    };
  }

  if (SUPPORTED_VIDEO_TYPES.includes(file.type) && file.size > MAX_VIDEO_SIZE) {
    return {
      valid: false,
      error: `Video too large: ${(file.size / 1024 / 1024).toFixed(
        1
      )}MB (max: ${MAX_VIDEO_SIZE / 1024 / 1024}MB)`,
    };
  }

  if (SUPPORTED_AUDIO_TYPES.includes(file.type) && file.size > MAX_AUDIO_SIZE) {
    return {
      valid: false,
      error: `Audio too large: ${(file.size / 1024 / 1024).toFixed(
        1
      )}MB (max: ${MAX_AUDIO_SIZE / 1024 / 1024}MB)`,
    };
  }

  return { valid: true };
};

const getMediaType = (mimeType: string): "image" | "video" | "audio" => {
  if (SUPPORTED_IMAGE_TYPES.includes(mimeType)) return "image";
  if (SUPPORTED_VIDEO_TYPES.includes(mimeType)) return "video";
  if (SUPPORTED_AUDIO_TYPES.includes(mimeType)) return "audio";
  throw new Error(`Unsupported media type: ${mimeType}`);
};

const generateSafeFilename = (originalName: string): string => {
  const extension = originalName.split(".").pop() || "";
  const uuid = uuidv4();
  return `${uuid}.${extension}`;
};

const extractMetadata = async (file: File): Promise<MediaMetadata> => {
  const metadata: MediaMetadata = {
    fileSize: file.size,
  };

  // For images, try to get dimensions
  if (SUPPORTED_IMAGE_TYPES.includes(file.type)) {
    try {
      const dimensions = await getImageDimensions(file);
      metadata.resolution = `${dimensions.width}x${dimensions.height}`;
    } catch (error) {
      console.warn("Failed to extract image dimensions:", error);
    }
  }

  return metadata;
};

const getImageDimensions = (
  file: File
): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
      URL.revokeObjectURL(img.src);
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
};

const generateThumbnailFromFile = async (file: File): Promise<string> => {
  if (SUPPORTED_IMAGE_TYPES.includes(file.type)) {
    // For images, create a smaller version
    return createImageThumbnail(file);
  } else if (SUPPORTED_VIDEO_TYPES.includes(file.type)) {
    // For videos, extract first frame
    return createVideoThumbnail(file);
  }

  // For audio or unsupported types, return a default thumbnail
  return "";
};

const createImageThumbnail = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      const maxSize = 200;
      const ratio = Math.min(maxSize / img.width, maxSize / img.height);
      canvas.width = img.width * ratio;
      canvas.height = img.height * ratio;

      ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL("image/jpeg", 0.8));
      URL.revokeObjectURL(img.src);
    };

    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
};

const createVideoThumbnail = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    video.onloadedmetadata = () => {
      video.currentTime = 1; // Seek to 1 second
    };

    video.onseeked = () => {
      const maxSize = 200;
      const ratio = Math.min(
        maxSize / video.videoWidth,
        maxSize / video.videoHeight
      );
      canvas.width = video.videoWidth * ratio;
      canvas.height = video.videoHeight * ratio;

      ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL("image/jpeg", 0.8));
      URL.revokeObjectURL(video.src);
    };

    video.onerror = reject;
    video.src = URL.createObjectURL(file);
  });
};

export const useMediaStore = create<MediaStore>()(
  persist(
    (set, get) => ({
      // Initial state
      mediaItems: [],
      categories: [
        {
          id: "uncategorized",
          name: "Uncategorized",
          description: "Media items without a specific category",
          createdAt: new Date(),
        },
      ],
      uploadProgress: [],
      selectedItems: [],
      viewMode: "grid",
      sortBy: "date",
      sortOrder: "desc",
      filterBy: {},
      searchQuery: "",

      // Actions
      uploadMedia: async (files: FileList) => {
        const fileArray = Array.from(files);

        for (const file of fileArray) {
          const validation = validateFile(file);
          const progressId = uuidv4();

          // Add upload progress
          get().addUploadProgress({
            id: progressId,
            filename: file.name,
            progress: 0,
            status: validation.valid ? "uploading" : "error",
            error: validation.error,
          });

          if (!validation.valid) {
            continue;
          }

          try {
            // Update progress
            get().updateUploadProgress(progressId, {
              progress: 25,
              status: "processing",
            });

            // Extract metadata
            const metadata = await extractMetadata(file);
            get().updateUploadProgress(progressId, { progress: 50 });

            // Generate thumbnail
            const thumbnailUrl = await generateThumbnailFromFile(file);
            get().updateUploadProgress(progressId, { progress: 75 });

            // Create media item
            const mediaItem: MediaItem = {
              id: uuidv4(),
              filename: generateSafeFilename(file.name),
              originalName: file.name,
              title: file.name.split(".")[0],
              type: getMediaType(file.type),
              mimeType: file.type,
              size: file.size,
              url: URL.createObjectURL(file), // Temporary URL for now
              thumbnailUrl,
              metadata,
              categoryId: "uncategorized",
              tags: [],
              createdAt: new Date(),
              updatedAt: new Date(),
            };

            // Add dimensions if available
            if (
              SUPPORTED_IMAGE_TYPES.includes(file.type) ||
              SUPPORTED_VIDEO_TYPES.includes(file.type)
            ) {
              try {
                const dimensions = await getImageDimensions(file);
                mediaItem.dimensions = dimensions;
              } catch (error) {
                console.warn("Failed to get dimensions:", error);
              }
            }

            // Add to store
            set((state) => ({
              mediaItems: [...state.mediaItems, mediaItem],
            }));

            // Complete upload
            get().updateUploadProgress(progressId, {
              progress: 100,
              status: "completed",
            });

            // Remove progress after delay
            setTimeout(() => {
              get().removeUploadProgress(progressId);
            }, 2000);
          } catch (error) {
            console.error("Upload failed:", error);
            get().updateUploadProgress(progressId, {
              status: "error",
              error: error instanceof Error ? error.message : String(error),
            });
          }
        }
      },

      deleteMedia: async (ids: string[]) => {
        set((state) => ({
          mediaItems: state.mediaItems.filter((item) => !ids.includes(item.id)),
          selectedItems: state.selectedItems.filter((id) => !ids.includes(id)),
        }));
      },

      updateMediaMetadata: (id: string, metadata: Partial<MediaMetadata>) => {
        set((state) => ({
          mediaItems: state.mediaItems.map((item) =>
            item.id === id
              ? {
                  ...item,
                  metadata: { ...item.metadata, ...metadata },
                  updatedAt: new Date(),
                }
              : item
          ),
        }));
      },

      updateMediaItem: (id: string, updates: Partial<MediaItem>) => {
        set((state) => ({
          mediaItems: state.mediaItems.map((item) =>
            item.id === id
              ? { ...item, ...updates, updatedAt: new Date() }
              : item
          ),
        }));
      },

      createCategory: (category: Omit<MediaCategory, "id" | "createdAt">) => {
        const newCategory: MediaCategory = {
          ...category,
          id: uuidv4(),
          createdAt: new Date(),
        };
        set((state) => ({
          categories: [...state.categories, newCategory],
        }));
      },

      updateCategory: (id: string, updates: Partial<MediaCategory>) => {
        set((state) => ({
          categories: state.categories.map((cat) =>
            cat.id === id ? { ...cat, ...updates } : cat
          ),
        }));
      },

      deleteCategory: (id: string) => {
        if (id === "uncategorized") return; // Prevent deleting default category

        set((state) => ({
          categories: state.categories.filter((cat) => cat.id !== id),
          mediaItems: state.mediaItems.map((item) =>
            item.categoryId === id
              ? { ...item, categoryId: "uncategorized" }
              : item
          ),
        }));
      },

      moveToCategory: (mediaIds: string[], categoryId: string) => {
        set((state) => ({
          mediaItems: state.mediaItems.map((item) =>
            mediaIds.includes(item.id)
              ? { ...item, categoryId, updatedAt: new Date() }
              : item
          ),
        }));
      },

      generateThumbnail: async (mediaId: string) => {
        const mediaItem = get().mediaItems.find((item) => item.id === mediaId);
        if (!mediaItem) throw new Error("Media item not found");

        // For now, return existing thumbnail or empty string
        return mediaItem.thumbnailUrl || "";
      },

      searchMedia: (query: string) => {
        set({ searchQuery: query });
      },

      setFilter: (filter: Partial<MediaFilter>) => {
        set((state) => ({
          filterBy: { ...state.filterBy, ...filter },
        }));
      },

      clearFilter: () => {
        set({ filterBy: {}, searchQuery: "" });
      },

      getMediaByCategory: (categoryId: string) => {
        return get().mediaItems.filter(
          (item) => item.categoryId === categoryId
        );
      },

      getFilteredMedia: () => {
        const { mediaItems, filterBy, searchQuery, sortBy, sortOrder } = get();
        let filtered = [...mediaItems];

        // Apply search
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          filtered = filtered.filter(
            (item) =>
              item.title.toLowerCase().includes(query) ||
              item.originalName.toLowerCase().includes(query) ||
              item.description?.toLowerCase().includes(query) ||
              item.tags.some((tag) => tag.toLowerCase().includes(query))
          );
        }

        // Apply filters
        if (filterBy.type) {
          filtered = filtered.filter((item) => item.type === filterBy.type);
        }

        if (filterBy.categoryId) {
          filtered = filtered.filter(
            (item) => item.categoryId === filterBy.categoryId
          );
        }

        if (filterBy.tags && filterBy.tags.length > 0) {
          filtered = filtered.filter((item) =>
            filterBy.tags!.some((tag) => item.tags.includes(tag))
          );
        }

        if (filterBy.dateRange) {
          filtered = filtered.filter(
            (item) =>
              item.createdAt >= filterBy.dateRange!.start &&
              item.createdAt <= filterBy.dateRange!.end
          );
        }

        if (filterBy.sizeRange) {
          filtered = filtered.filter(
            (item) =>
              item.size >= filterBy.sizeRange!.min &&
              item.size <= filterBy.sizeRange!.max
          );
        }

        // Apply sorting
        filtered.sort((a, b) => {
          let comparison = 0;

          switch (sortBy) {
            case "name":
              comparison = a.title.localeCompare(b.title);
              break;
            case "date":
              comparison = a.createdAt.getTime() - b.createdAt.getTime();
              break;
            case "size":
              comparison = a.size - b.size;
              break;
            case "type":
              comparison = a.type.localeCompare(b.type);
              break;
          }

          return sortOrder === "desc" ? -comparison : comparison;
        });

        return filtered;
      },

      setViewMode: (mode: "grid" | "list") => {
        set({ viewMode: mode });
      },

      setSortBy: (
        sortBy: "name" | "date" | "size" | "type",
        order: "asc" | "desc" = "asc"
      ) => {
        set({ sortBy, sortOrder: order });
      },

      setSelectedItems: (ids: string[]) => {
        set({ selectedItems: ids });
      },

      toggleSelectedItem: (id: string) => {
        set((state) => ({
          selectedItems: state.selectedItems.includes(id)
            ? state.selectedItems.filter((selectedId) => selectedId !== id)
            : [...state.selectedItems, id],
        }));
      },

      clearSelection: () => {
        set({ selectedItems: [] });
      },

      addUploadProgress: (progress: UploadProgress) => {
        set((state) => ({
          uploadProgress: [...state.uploadProgress, progress],
        }));
      },

      updateUploadProgress: (id: string, updates: Partial<UploadProgress>) => {
        set((state) => ({
          uploadProgress: state.uploadProgress.map((progress) =>
            progress.id === id ? { ...progress, ...updates } : progress
          ),
        }));
      },

      removeUploadProgress: (id: string) => {
        set((state) => ({
          uploadProgress: state.uploadProgress.filter(
            (progress) => progress.id !== id
          ),
        }));
      },
    }),
    {
      name: "media-store",
      partialize: (state) => ({
        mediaItems: state.mediaItems,
        categories: state.categories,
        viewMode: state.viewMode,
        sortBy: state.sortBy,
        sortOrder: state.sortOrder,
      }),
    }
  )
);
