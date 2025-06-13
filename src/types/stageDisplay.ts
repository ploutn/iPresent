// src/types/stageDisplay.ts
import { Slide } from "./slide";

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
  description?: string;
  elements: StageDisplayElement[];
  backgroundColor?: string;
  backgroundImage?: string;
  isDefault?: boolean; // Whether this is a default template that cannot be deleted
  targetDisplayId?: string; // ID of the display this template is assigned to
  layout?: {
    rows: number;
    columns: number;
    gap: number;
  };
  currentSlide?: Slide; // Current slide being displayed
  nextSlide?: Slide; // Next slide to be displayed
  speakerNotes?: string; // Speaker notes for the current slide
}

export interface StageDisplayConfig {
  activeTemplateId: string;
  templates: StageDisplayTemplate[];
  isActive: boolean;
  targetDisplayId?: string;
}
