// Make sure these types are properly exported
export type ContentType =
  | "song"
  | "image"
  | "video"
  | "announcement"
  | "blank"
  | "prayer"
  | "bible";

export interface ContentItem {
  id: string;
  title: string;
  type: ContentType;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Song extends ContentItem {
  type: "song";
  lyrics: string;
  author: string;
  ccliNumber?: string;
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
  id: number;
  title: string;
  content: string;
  type: ContentType;
  thumbnail?: string;
  duration?: number;
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
