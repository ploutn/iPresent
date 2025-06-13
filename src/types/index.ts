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

export interface ImageItem {
  id: string;
  url: string; // URL or path to the image
  altText?: string; // Alt text for accessibility
  caption?: string;
}

export interface VideoItem {
  id: string;
  url: string; // URL or path to the video
  title: string;
  description?: string;
}

export type MediaItem = Media | ImageItem | VideoItem;

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

export interface SlideElement {
  id: string;
  type: "text" | "image" | "video" | "audio" | "bible" | "song";
  content?: string;
  src?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fontSize?: number;
  fontFamily?: string;
  fontColor?: string;
  textAlign?: "left" | "center" | "right";
}

export interface Slide {
  id: string;
  title: string;
  content: string;
  type: "presentation";
  order: number;
  createdAt: Date;
  updatedAt: Date;
  backgroundColor: string;
  textColor: string;
  fontSize: number;
  fontFamily: string;
  textAlign: "left" | "center" | "right";
  elements: SlideElement[];
  transition?: SlideTransition;
  duration?: number;
  thumbnail?: string;
  notes?: string;
  mediaElements?: SlideMediaElement[];
  overlaySettings?: {
    textOverlay: boolean;
    textBackground: {
      enabled: boolean;
      color?: string;
      opacity?: number;
    };
  };
}

export interface MediaElement {
  id?: string;
  mediaId?: string; // Reference to MediaItem.id
  name?: string; // Added name property
  url: string; // Added url property
  altText?: string; // Alt text for accessibility
  type: "image" | "video" | "audio";
  layer?: number; // Z-index for layering (0 = background, higher = foreground)
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
  isVisible: boolean; // Whether the element is visible, default true
  locked?: boolean; // Whether the element is locked from editing, default false
}

export interface SlideTransition {
  type:
    | "none"
    | "fade"
    | "slide"
    | "zoom"
    | "flip"
    | "cube"
    | "dissolve"
    | "wipe"
    | "iris"
    | "curtain";
  duration: number; // Transition duration in milliseconds
  direction?: "left" | "right" | "up" | "down";
  easing?: "linear" | "ease-in" | "ease-out" | "ease-in-out";
  effect?: "bounce" | "elastic" | "rotate" | "scale" | "perspective"; // Additional effect modifiers
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
  theme: string;
  transition: string;
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
  image?: string;
  slides: Partial<Slide>[];
  settings: Partial<PresentationSettings>;
  tags: string[];
  isBuiltIn: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface SlideMediaElement {
  id: string;
  type: "image" | "video" | "audio";
  url: string;
  name?: string;
  position: {
    x: number;
    y: number;
  };
  size?: {
    width: number;
    height: number;
  };
  opacity: number;
  layer: number;
  playback?: {
    autoplay: boolean;
    loop: boolean;
    volume: number;
  };
}

// Union type for items that can be selected
export type SelectableContentItem =
  | ContentItem
  | Song
  | Media
  | Announcement
  | PresentationContentItem;
