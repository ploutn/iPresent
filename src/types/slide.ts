// src/types/slide.ts
export interface Slide {
  id: string;
  title: string;
  content: string;
  duration: number;
  backgroundColor?: string;
  textColor?: string;
  fontSize?: string;
  fontFamily?: string;
  textAlign?: "left" | "center" | "right";
  mediaElements?: MediaElement[];
}

export interface MediaElement {
  id: string;
  type: "image" | "video" | "audio";
  url: string;
  altText?: string;
  isVisible: boolean;
}
