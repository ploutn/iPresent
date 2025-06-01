// src/types/stageDisplay.ts

export type StageDisplayElementType =
  | "currentSlide"
  | "nextSlide"
  | "clock"
  | "timer"
  | "speakerNotes"
  | "customText"
  | "songLyrics"
  | "countdownTimer" // Use this for countdowns
  | "participantCount"
  | "microphoneStatus"
  | "announcementBanner" // Use this for announcements
  | "media"; // If you have a media element type

export interface StageDisplayElement {
  id: string;
  type: StageDisplayElementType;
  x: number; // Direct X coordinate
  y: number; // Direct Y coordinate
  width: number; // Direct width
  height: number; // Direct height
  isVisible: boolean;
  text?: string; // For elements with simple text content (like customText)
  style?: React.CSSProperties; // For flexible styling
  // Removed: position?: "top-left" | ... ; as it conflicts with x,y,w,h usage
}

export interface StageDisplayTemplate {
  id: string;
  name: string;
  description?: string; // ADDED
  elements: StageDisplayElement[];
  backgroundColor?: string;
  backgroundImage?: string;
}

export interface StageDisplayConfig {
  activeTemplateId: string;
  templates: StageDisplayTemplate[];
  isActive: boolean;
  targetDisplayId?: string;
}
