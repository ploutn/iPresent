// src/types/slide.ts
export interface Slide {
    id: number; // Or string, if you prefer UUIDs for slides
    title: string;
    content: string;
    type: 'song' | 'announcement' | 'image' | 'video';
  }