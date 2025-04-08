import { useState, useCallback } from "react";
import { Song, EditSongFormData } from "../../types/song";

export const useSongLibrary = () => {
  const [songs, setSongs] = useState<Song[]>([
    {
      id: "1",
      title: "Amazing Grace",
      author: "John Newton",
      ccliNumber: "1234567",
      lyrics: "Amazing Grace, how sweet the sound",
      tags: ["Hymn", "Worship"],
      favorite: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      type: "song",
      content: "Amazing Grace, how sweet the sound",
    },
    // ... other initial songs
  ]);

  const [searchQuery, setSearchQuery] = useState("");

  const filteredSongs = songs.filter(
    (song) =>
      song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      song.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      song.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  const handleToggleFavorite = useCallback((id: string) => {
    setSongs((prevSongs) =>
      prevSongs.map((song) =>
        song.id === id ? { ...song, favorite: !song.favorite } : song
      )
    );
  }, []);

  const handleDeleteSong = useCallback((id: string) => {
    setSongs((prevSongs) => prevSongs.filter((s) => s.id !== id));
  }, []);

  const handleSaveSong = useCallback(
    (song: string) => {
      // Parse the first line which should be in format: "3. Song Title"
      const firstLine = song.split("\n")[0].trim();

      // Extract number and title using regex
      const match = firstLine.match(/^(\d+)\s*\.\s*(.+)$/);

      let title = firstLine;
      let number = "";

      if (match) {
        number = match[1];
        title = match[2].trim();
      }

      const newSong: Song = {
        title: title,
        author: "",
        ccliNumber: number, // Store the song number in the ccli field
        lyrics: song,
        tags: [],
        favorite: false,
        id: String(songs.length + 1),
        createdAt: new Date(),
        updatedAt: new Date(),
        type: "song",
        content: song,
      };
      setSongs((prevSongs) => [...prevSongs, newSong]);
      return newSong;
    },
    [songs]
  );

  const handleEditSongSave = useCallback(
    (editedSong: Partial<Song> & { id?: string }) => {
      setSongs((prevSongs) => {
        if (editedSong.id) {
          return prevSongs.map((song) =>
            song.id === editedSong.id
              ? {
                  ...song,
                  ...editedSong,
                  updatedAt: new Date(),
                }
              : song
          );
        } else {
          const newSong: Song = {
            ...(editedSong as Song),
            id: String(prevSongs.length + 1),
            createdAt: new Date(),
            updatedAt: new Date(),
            type: "song",
            lyrics: editedSong.lyrics || "",
            author: editedSong.author || "",
            tags: editedSong.tags || [],
            favorite: editedSong.favorite || false,
            content: editedSong.content || "",
          };
          return [newSong, ...prevSongs];
        }
      });
    },
    []
  );

  return {
    songs: filteredSongs,
    searchQuery,
    setSearchQuery,
    handleToggleFavorite,
    handleDeleteSong,
    handleSaveSong,
    handleEditSongSave,
  };
};
