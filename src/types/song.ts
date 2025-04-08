export interface Song {
  id: string;
  title: string;
  author: string;
  lyrics: string;
  ccliNumber?: string;
  favorite: boolean;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  type: "song";
  content?: string; // For compatibility with the existing type
}

export interface EditSongFormData {
  id?: string;
  title: string;
  author: string;
  ccliNumber?: string;
  lyrics: string;
  tags: string[];
  favorite: boolean;
  type?: "song";
  content?: string;
}
