// src/types/stageDisplay.ts

export type StageDisplayElementType =
  | "currentSlide"
  | "nextSlide"
  | "clock"
  | "timer"
  | "notes"
  | "customText"
  | "countdownTimer"
  | "announcementBanner";

export interface StageDisplayElement {
  id: string;
  type: StageDisplayElementType;
  x: number; // Position X (percentage of canvas width)
  y: number; // Position Y (percentage of canvas height)
  width: number; // Width (percentage of canvas width)
  height: number; // Height (percentage of canvas height)
  isVisible?: boolean; // Controls element visibility
  backgroundColor?: string; // Background color of the element
  borderRadius?: number; // Border radius in pixels
  zIndex?: number; // Z-index for layering elements
  fontSize?: number;
  fontColor?: string;
  fontFamily?: string; // Added in 10.2
  textAlign?: "left" | "center" | "right" | "justify"; // Added for 10.3
  fontWeight?: "normal" | "bold"; // Added for 10.4
  fontStyle?: "normal" | "italic"; // Added for 10.4
  textDecoration?: "none" | "underline"; // Added for 10.4

  // Specific properties for element types
  // For customText
  text?: string;

  // For countdownTimer
  durationSeconds?: number; // Duration in seconds for the countdown
  timerTitle?: string; // Optional title for the timer
  timerEndMessage?: string; // Message to display when timer ends

  // For announcementBanner
  bannerText?: string;
  scrollSpeed?: "slow" | "medium" | "fast";
  bannerDirection?: "left-to-right" | "right-to-left";
}

export interface StageDisplayTemplate {
  id: string;
  name: string;
  elements: StageDisplayElement[];
  previewImage?: string;
  isDefault?: boolean;
}

export interface StageDisplayConfig {
  activeTemplateId: string;
  templates: StageDisplayTemplate[];
  isActive: boolean;
  targetDisplayId?: string; // Which display to show the stage display on
}
