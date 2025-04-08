import { Song } from "../types/song";

interface ParsedSong {
  title: string;
  verses: string[];
  chorus?: string;
}

export function parseSongFile(content: string, fileName: string): Song {
  const lines = content
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line);

  // First line is the title
  const title = lines[0];

  // Parse verses and chorus
  const verses: string[] = [];
  let currentVerse: string[] = [];
  let chorus: string[] = [];
  let isChorus = false;

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];

    if (line.toLowerCase() === "chorus") {
      isChorus = true;
      continue;
    }

    if (line.toLowerCase() === "verse") {
      if (currentVerse.length > 0) {
        verses.push(currentVerse.join("\n"));
        currentVerse = [];
      }
      isChorus = false;
      continue;
    }

    if (isChorus) {
      chorus.push(line);
    } else {
      currentVerse.push(line);
    }
  }

  // Add the last verse if exists
  if (currentVerse.length > 0) {
    verses.push(currentVerse.join("\n"));
  }

  // Combine all lyrics
  const lyrics = [
    ...verses.map((verse, index) => `Verse ${index + 1}\n${verse}`),
    ...(chorus.length > 0 ? [`Chorus\n${chorus.join("\n")}`] : []),
  ].join("\n\n");

  return {
    id: crypto.randomUUID(),
    title,
    author: "Песни Возрождения МСЦ ЕХБ",
    lyrics,
    favorite: false,
    tags: ["Песни Возрождения"],
    createdAt: new Date(),
    updatedAt: new Date(),
    type: "song",
    content: lyrics, // For compatibility
  };
}
