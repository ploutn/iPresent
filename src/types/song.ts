import { SongSlide } from "./index";

import { SlideMediaElement } from "./index";

export interface SongBook {
  id: string;
  name: string;
}

export interface Song {
  id: string;
  title: string;
  author: string;
  lyrics?: string;
  ccliNumber?: string;
  favorite?: boolean;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
  type: "song";
  content: string; // For compatibility with the existing type
  songBookId?: string | null; // Added songBookId
  slides: SongSlide[];
  mediaElements?: SlideMediaElement[];
}

export interface EditSongFormData {
  id?: string;
  title: string;
  author: string;
  ccliNumber?: string;
  lyrics: string;
  tags?: string[];
  favorite?: boolean;
  type?: "song";
  content?: string;
  songBookId?: string | null; // Added songBookId
  slides?: SongSlide[];
}
