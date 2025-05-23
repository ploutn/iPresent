import { Song, SongSlide } from "../types/index";

// Assuming the structure of songsdata.json is an array of objects like:
// interface RawSongData {
//   title: string;
//   verses: string[];
//   chorus: string[];
//   author?: string; // Optional, can add more fields if they exist in JSON
//   ccli?: string;
//   tags?: string[];
// }

// Helper to generate unique IDs
const generateId = () => crypto.randomUUID();

export async function loadAndParseSongs(): Promise<Song[]> {
  try {
    const response = await fetch("/data/songsdata.json");
    if (!response.ok) {
      throw new Error(`Failed to fetch songsdata.json: ${response.statusText}`);
    }
    const rawSongs: any[] = await response.json(); // Use 'any' for now, or define RawSongData

    return rawSongs.map((rawSong, songIndex) => {
      const slides: SongSlide[] = [];
      let slideIdCounter = 0;

      // Process verses
      if (rawSong.verses && Array.isArray(rawSong.verses)) {
        rawSong.verses.forEach((verseContent: string, index: number) => {
          slides.push({
            id: `${rawSong.title.replace(/\s+/g, "-")}-verse-${
              index + 1
            }-${generateId()}`,
            type: "verse",
            label: `Verse ${index + 1}`,
            content: verseContent,
          });
          slideIdCounter++;
        });
      }

      // Process chorus
      if (rawSong.chorus && Array.isArray(rawSong.chorus)) {
        // Option 1: Each chorus line as a separate slide (if chorus is an array of strings)
        // rawSong.chorus.forEach((chorusLine: string, index: number) => {
        //   slides.push({
        //     id: `${rawSong.title.replace(/\s+/g, '-')}-chorus-line-${index + 1}-${generateId()}`,
        //     type: 'chorus',
        //     label: `Chorus (Line ${index + 1})`,
        //     content: chorusLine,
        //   });
        //   slideIdCounter++;
        // });

        // Option 2: Entire chorus as one slide (if chorus is an array of strings to be joined)
        if (rawSong.chorus.length > 0) {
          slides.push({
            id: `${rawSong.title.replace(/\s+/g, "-")}-chorus-${generateId()}`,
            type: "chorus",
            label: "Chorus",
            content: rawSong.chorus.join("\n"),
          });
          slideIdCounter++;
        }
      }

      // Add other song parts if present in rawSong (e.g., bridge, intro)
      // For example, if rawSong.bridge is a string:
      // if (rawSong.bridge && typeof rawSong.bridge === 'string') {
      //   slides.push({
      //     id: `${rawSong.title.replace(/\s+/g, '-')}-bridge-${generateId()}`,
      //     type: 'bridge',
      //     label: 'Bridge',
      //     content: rawSong.bridge,
      //   });
      // }

      const fullLyrics = slides
        .map((slide) => `${slide.label}\n${slide.content}`)
        .join("\n\n");

      const song: Song = {
        id:
          rawSong.id ||
          `${rawSong.title.replace(/\s+/g, "-")}-${songIndex}-${generateId()}`,
        title: rawSong.title || "Untitled Song",
        type: "song",
        content: rawSong.content || fullLyrics, // Full lyrics for general display or search
        createdAt: rawSong.createdAt ? new Date(rawSong.createdAt) : new Date(),
        updatedAt: rawSong.updatedAt ? new Date(rawSong.updatedAt) : new Date(),
        author: rawSong.author || "Unknown Author",
        ccliNumber: rawSong.ccliNumber || rawSong.ccli || undefined,
        slides: slides,
        favorite:
          typeof rawSong.favorite === "boolean" ? rawSong.favorite : false,
        tags: Array.isArray(rawSong.tags) ? rawSong.tags : [],
        songBookId: rawSong.songBookId || null,
      };
      return song;
    });
  } catch (error) {
    console.error("Error loading or parsing songs:", error);
    return []; // Return empty array or throw error as per desired error handling
  }
}
