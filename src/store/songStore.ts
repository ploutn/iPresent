import { create } from "zustand";
import { Song } from "../types/song";

interface SongStore {
  songs: Song[];
  favorites: string[]; // Array of song IDs
  tags: string[]; // Unique tags across all songs
  addSong: (song: Omit<Song, "id" | "createdAt" | "updatedAt">) => void;
  updateSong: (id: string, song: Partial<Song>) => void;
  deleteSong: (id: string) => void;
  toggleFavorite: (id: string) => void;
  addTag: (songId: string, tag: string) => void;
  removeTag: (songId: string, tag: string) => void;
  importSongs: (songs: Song[]) => void;
}

export const useSongStore = create<SongStore>((set, get) => ({
  songs: [],
  favorites: [],
  tags: [],

  addSong: (song) => {
    const newSong: Song = {
      ...song,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    set((state) => ({
      songs: [...state.songs, newSong],
      tags: [...new Set([...state.tags, ...song.tags])],
    }));
  },

  updateSong: (id, song) => {
    set((state) => ({
      songs: state.songs.map((s) =>
        s.id === id ? { ...s, ...song, updatedAt: new Date() } : s
      ),
    }));
  },

  deleteSong: (id) => {
    set((state) => ({
      songs: state.songs.filter((s) => s.id !== id),
      favorites: state.favorites.filter((f) => f !== id),
    }));
  },

  toggleFavorite: (id) => {
    set((state) => ({
      favorites: state.favorites.includes(id)
        ? state.favorites.filter((f) => f !== id)
        : [...state.favorites, id],
    }));
  },

  addTag: (songId, tag) => {
    set((state) => ({
      songs: state.songs.map((s) =>
        s.id === songId ? { ...s, tags: [...new Set([...s.tags, tag])] } : s
      ),
      tags: [...new Set([...state.tags, tag])],
    }));
  },

  removeTag: (songId, tag) => {
    set((state) => ({
      songs: state.songs.map((s) =>
        s.id === songId ? { ...s, tags: s.tags.filter((t) => t !== tag) } : s
      ),
    }));
  },

  importSongs: (songs) => {
    set((state) => ({
      songs: [...state.songs, ...songs],
      tags: [...new Set([...state.tags, ...songs.flatMap((s) => s.tags)])],
    }));
  },
}));
