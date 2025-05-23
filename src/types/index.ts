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

export interface Slide {
  id: string; // Changed to string for better UUID support
  title: string;
  content: string;
  type: ContentType;
  thumbnail?: string;
  duration?: number; // Duration in seconds for auto-advance
  transition?: SlideTransition;
  backgroundColor?: string;
  backgroundImage?: string;
  textColor?: string;
  fontSize?: number;
  fontFamily?: string;
  textAlign?: "left" | "center" | "right" | "justify";
  order: number; // For slide ordering
  notes?: string; // Speaker notes
  createdAt: Date;
  updatedAt: Date;
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
