import { useState, useCallback } from "react";
import { Song } from "../../types/index"; // Use Song from index.ts
import { EditSongFormData, SongBook } from "../../types/song"; // EditSongFormData and SongBook remain from song.ts

export const useSongLibrary = () => {
  const [songs, setSongs] = useState<Song[]>([
    {
      id: "1",
      title: "Amazing Grace",
      author: "John Newton",
      ccliNumber: "1234567",
      tags: ["Hymn", "Worship"],
      favorite: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      type: "song",
      content: "Amazing Grace, how sweet the sound", // Full lyrics in content
      songBookId: null,
      slides: [
        {
          id: `1-slide-${crypto.randomUUID()}`,
          type: "other",
          label: "Content",
          content: "Amazing Grace, how sweet the sound",
        },
      ],
    },
    // ... other initial songs
  ]);

  const [songBooks, setSongBooks] = useState<SongBook[]>([
    { id: "sb1", name: "Default Songbook" },
    { id: "sb2", name: "Hymns Collection" },
  ]); // Added songBooks state

  const [searchQuery, setSearchQuery] = useState("");

  const filteredSongs = songs.filter(
    (song) =>
      song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      song.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (song.tags?.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      ) ??
        false)
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
    (
      songContent: string,
      songBookId: string | null = null,
      songTitle?: string
    ) => {
      // Parse the first line which should be in format: "3. Song Title" or just "Song Title"
      const firstLine = songTitle || songContent.split("\n")[0].trim();

      // Extract number and title using regex if number is present
      const match = firstLine.match(/^(\d+)\s*\.\s*(.+)$/);

      let title = firstLine;
      let number = "";

      if (match) {
        number = match[1];
        title = match[2].trim();
      } else if (songTitle) {
        // If songTitle is provided directly and doesn't match the numbered format, use it as is.
        // If it contains a number prefix, it will be handled by the regex above.
        // If not, title remains songTitle.
      }

      const newSong: Song = {
        title: title,
        author: "", // Default author, can be set later or via dialog
        ccliNumber: number,
        tags: [],
        favorite: false,
        id: crypto.randomUUID(),
        createdAt: new Date(),
        updatedAt: new Date(),
        type: "song",
        content: songContent, // Full lyrics from form
        songBookId: songBookId,
        slides: [
          {
            id: `${crypto.randomUUID()}-slide1`,
            type: "other",
            label: "Content",
            content: songContent,
          },
        ],
      };
      setSongs((prevSongs) => [...prevSongs, newSong]);
      return newSong;
    },
    [] // Removed songs dependency as Date.now() is used for ID
  );

  const handleCreateNewSongBook = useCallback((bookName: string) => {
    const newBook: SongBook = {
      id: `sb-${Date.now()}`,
      name: bookName,
    };
    setSongBooks((prevBooks) => [...prevBooks, newBook]);
    return newBook;
  }, []);

  const handleEditSongSave = useCallback(
    (editedSongData: Partial<EditSongFormData> & { id: string }) => {
      // Expect EditSongFormData, id is required for edit
      setSongs((prevSongs) =>
        prevSongs.map((song) =>
          song.id === editedSongData.id
            ? {
                ...song, // Base is the existing song (type Song from index.ts)
                title: editedSongData.title ?? song.title,
                author: editedSongData.author ?? song.author,
                ccliNumber: editedSongData.ccliNumber ?? song.ccliNumber,
                tags: editedSongData.tags ?? song.tags,
                favorite: editedSongData.favorite ?? song.favorite,
                songBookId:
                  editedSongData.songBookId !== undefined
                    ? editedSongData.songBookId
                    : song.songBookId,
                // Update content and slides based on lyrics from EditSongFormData
                content: editedSongData.lyrics ?? song.content,
                slides: editedSongData.lyrics
                  ? [
                      {
                        id: `${song.id}-slide-edited-${crypto.randomUUID()}`,
                        type: "other",
                        label: "Content",
                        content: editedSongData.lyrics,
                      },
                    ]
                  : song.slides, // If no new lyrics, keep existing slides
                updatedAt: new Date(),
              }
            : song
        )
      );
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
    songBooks, // Expose songBooks
    handleCreateNewSongBook, // Expose create new book function
  };
};
