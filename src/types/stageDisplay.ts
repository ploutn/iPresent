// src/types/stageDisplay.ts

export type StageDisplayElementType =
  | "currentSlide"
  | "nextSlide"
  | "clock"
  | "timer"
  | "notes"
  | "customText";

export interface StageDisplayElement {
  id: string;
  type: StageDisplayElementType;
  x: number; // Position X (percentage of canvas width)
  y: number; // Position Y (percentage of canvas height)
  width: number; // Width (percentage of canvas width)
  height: number; // Height (percentage of canvas height)
  content?: string; // For customText type
  fontSize?: number;
  fontColor?: string;
  backgroundColor?: string;
  borderRadius?: number;
  zIndex?: number;
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
