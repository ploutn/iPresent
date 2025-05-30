// Make sure these types are properly exported
export type ContentType =
  | "song"
  | "image"
  | "video"
  | "announcement"
  | "blank"
  | "prayer"
  | "bible"
  | "presentation";

export interface ContentItem {
  id: string;
  title: string;
  type: ContentType;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SongSlide {
  id: string; // Unique ID for the slide, e.g., generated or verse/chorus index based
  type:
    | "verse"
    | "chorus"
    | "bridge"
    | "intro"
    | "outro"
    | "tag"
    | "prechorus"
    | "vamp"
    | "other"; // Type of song part
  label: string; // e.g., "Verse 1", "Chorus", "Bridge"
  content: string; // The actual lyric text for this slide
}

export interface Song extends ContentItem {
  type: "song";
  lyrics?: string; // Added to resolve type error, was previously commented
  author: string;
  ccliNumber?: string;
  slides: SongSlide[];
  favorite?: boolean; // Consolidated from src/types/song.ts
  tags?: string[]; // Consolidated from src/types/song.ts
  songBookId?: string | null; // Consolidated from src/types/song.ts
}

export interface Media extends ContentItem {
  type: "image" | "video";
  url: string;
  thumbnail?: string;
  duration?: number;
}

export interface Announcement extends ContentItem {
  type: "announcement";
}

export interface ScheduledItem {
  id: string;
  contentId: string;
  scheduledFor: Date;
  duration: number;
  delay: number;
  order: number;
  transition?: "fade" | "slide" | "zoom";
}

export interface SlideMediaElement {
  id: string;
  mediaId: string; // Reference to MediaItem.id
  type: "image" | "video" | "audio";
  layer: number; // Z-index for layering (0 = background, higher = foreground)
  position: {
    x: number; // X position as percentage (0-100)
    y: number; // Y position as percentage (0-100)
    width: number; // Width as percentage (0-100)
    height: number; // Height as percentage (0-100)
  };
  opacity?: number; // 0-1, default 1
  rotation?: number; // Rotation in degrees, default 0
  scale?: number; // Scale factor, default 1
  cropArea?: {
    x: number; // Crop start X as percentage
    y: number; // Crop start Y as percentage
    width: number; // Crop width as percentage
    height: number; // Crop height as percentage
  };
  effects?: {
    blur?: number; // Blur radius in pixels
    brightness?: number; // 0-2, default 1
    contrast?: number; // 0-2, default 1
    saturation?: number; // 0-2, default 1
    sepia?: number; // 0-1, default 0
    grayscale?: number; // 0-1, default 0
  };
  animation?: {
    type: "none" | "fade-in" | "slide-in" | "zoom-in" | "bounce";
    duration: number; // Animation duration in milliseconds
    delay?: number; // Animation delay in milliseconds
    direction?: "left" | "right" | "up" | "down";
  };
  playback?: {
    autoplay?: boolean; // For video/audio
    loop?: boolean; // For video/audio
    volume?: number; // 0-1, for audio/video
    startTime?: number; // Start time in seconds for video/audio
    endTime?: number; // End time in seconds for video/audio
  };
  visible?: boolean; // Whether the element is visible, default true
  locked?: boolean; // Whether the element is locked from editing, default false
}

export interface Slide {
  id: string; // Changed to string for better UUID support
  title: string;
  content: string;
  type: ContentType;
  thumbnail?: string;
  duration?: number; // Duration in seconds for auto-advance
  transition?: SlideTransition;
  backgroundColor?: string;
  backgroundImage?: string; // Kept for backward compatibility
  textColor?: string;
  fontSize?: number;
  fontFamily?: string;
  textAlign?: "left" | "center" | "right" | "justify";
  order: number; // For slide ordering
  notes?: string; // Speaker notes
  createdAt: Date;
  updatedAt: Date;
  // New media support properties
  mediaElements?: SlideMediaElement[]; // Array of media elements on this slide
  backgroundMedia?: SlideMediaElement; // Dedicated background media (replaces backgroundImage)
  overlaySettings?: {
    textOverlay?: boolean; // Whether text content overlays media
    textBackground?: {
      enabled: boolean;
      color?: string;
      opacity?: number; // 0-1
      blur?: number; // Background blur for text readability
    };
    safeArea?: {
      enabled: boolean;
      padding: number; // Padding percentage for text safe area
    };
  };
}

export interface SlideTransition {
  type: "none" | "fade" | "slide" | "zoom" | "flip" | "cube" | "dissolve";
  duration: number; // Transition duration in milliseconds
  direction?: "left" | "right" | "up" | "down";
  easing?: "linear" | "ease-in" | "ease-out" | "ease-in-out";
}

export interface Screen {
  id: string;
  name: string;
  type: "output" | "preview" | "control";
  isActive: boolean;
}

export interface ScreenControlProps {
  className?: string;
}

export interface ScreenState {
  mainScreen: boolean;
  outputDisplay: boolean;
  blackout: boolean;
  outputsEnabled: boolean;
}

export interface PresentationContentItem extends ContentItem {
  type: "presentation";
  slides: Slide[];
  description?: string;
  author?: string;
  tags?: string[];
  category?: string;
  thumbnail?: string;
  template?: string; // Template ID for styling
  settings: PresentationSettings;
  metadata: PresentationMetadata;
}

export interface PresentationSettings {
  autoAdvance: boolean;
  defaultSlideDuration: number; // Default duration in seconds
  loopPresentation: boolean;
  showSlideNumbers: boolean;
  showProgressBar: boolean;
  allowRemoteControl: boolean;
  backgroundColor: string;
  defaultTransition: SlideTransition;
  aspectRatio: "16:9" | "4:3" | "16:10" | "custom";
  resolution: {
    width: number;
    height: number;
  };
}

export interface PresentationMetadata {
  version: string;
  lastModifiedBy?: string;
  totalSlides: number;
  estimatedDuration: number; // Total estimated duration in seconds
  fileSize?: number; // Size in bytes
  exportFormats?: string[]; // Supported export formats
  collaborators?: string[]; // List of collaborator IDs
  isPublic: boolean;
  isTemplate: boolean;
  templateCategory?: string;
}

export interface PresentationTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  thumbnail: string;
  slides: Partial<Slide>[]; // Template slides with default content
  settings: Partial<PresentationSettings>;
  tags: string[];
  isBuiltIn: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Union type for items that can be selected
export type SelectableContentItem =
  | ContentItem
  | Song
  | Media
  | Announcement
  | PresentationContentItem;
