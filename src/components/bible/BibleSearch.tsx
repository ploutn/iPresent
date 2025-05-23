import React, { useState, useRef, useEffect } from "react";
import { Search, Book, ChevronDown, BookOpen, Check } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { ScrollArea } from "../ui/scroll-area";
import { usePresentationStore } from "../../store/presentationStore";
import { useContentStore } from "../../stores/useContentStore";
import { ContentItem, Slide } from "../../types";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils"; // Assuming utils are in lib

interface BibleVerse {
  reference: string;
  text: string;
  version: string;
}

const BIBLE_VERSIONS = [
  { id: "KJV", name: "King James Version" },
  { id: "NIV", name: "New International Version" },
  { id: "ESV", name: "English Standard Version" },
  { id: "NLT", name: "New Living Translation" },
];

const BIBLE_BOOKS = [
  // Old Testament
  { id: "genesis", name: "Genesis", chapters: 50, testament: "old" },
  { id: "exodus", name: "Exodus", chapters: 40, testament: "old" },
  { id: "leviticus", name: "Leviticus", chapters: 27, testament: "old" },
  { id: "numbers", name: "Numbers", chapters: 36, testament: "old" },
  { id: "deuteronomy", name: "Deuteronomy", chapters: 34, testament: "old" },
  { id: "joshua", name: "Joshua", chapters: 24, testament: "old" },
  { id: "judges", name: "Judges", chapters: 21, testament: "old" },
  { id: "ruth", name: "Ruth", chapters: 4, testament: "old" },
  { id: "1samuel", name: "1 Samuel", chapters: 31, testament: "old" },
  { id: "2samuel", name: "2 Samuel", chapters: 24, testament: "old" },
  { id: "1kings", name: "1 Kings", chapters: 22, testament: "old" },
  { id: "2kings", name: "2 Kings", chapters: 25, testament: "old" },
  { id: "1chronicles", name: "1 Chronicles", chapters: 29, testament: "old" },
  { id: "2chronicles", name: "2 Chronicles", chapters: 36, testament: "old" },
  { id: "ezra", name: "Ezra", chapters: 10, testament: "old" },
  { id: "nehemiah", name: "Nehemiah", chapters: 13, testament: "old" },
  { id: "esther", name: "Esther", chapters: 10, testament: "old" },
  { id: "job", name: "Job", chapters: 42, testament: "old" },
  { id: "psalms", name: "Psalms", chapters: 150, testament: "old" },
  { id: "proverbs", name: "Proverbs", chapters: 31, testament: "old" },
  { id: "ecclesiastes", name: "Ecclesiastes", chapters: 12, testament: "old" },
  {
    id: "songofsolomon",
    name: "Song of Solomon",
    chapters: 8,
    testament: "old",
  },
  { id: "isaiah", name: "Isaiah", chapters: 66, testament: "old" },
  // ... Add other OT books as needed

  // New Testament
  { id: "matthew", name: "Matthew", chapters: 28, testament: "new" },
  { id: "mark", name: "Mark", chapters: 16, testament: "new" },
  { id: "luke", name: "Luke", chapters: 24, testament: "new" },
  { id: "john", name: "John", chapters: 21, testament: "new" },
  { id: "acts", name: "Acts", chapters: 28, testament: "new" },
  { id: "romans", name: "Romans", chapters: 16, testament: "new" },
  { id: "1corinthians", name: "1 Corinthians", chapters: 16, testament: "new" },
  { id: "2corinthians", name: "2 Corinthians", chapters: 13, testament: "new" },
  { id: "galatians", name: "Galatians", chapters: 6, testament: "new" },
  { id: "ephesians", name: "Ephesians", chapters: 6, testament: "new" },
  { id: "philippians", name: "Philippians", chapters: 4, testament: "new" },
  { id: "colossians", name: "Colossians", chapters: 4, testament: "new" },
  { id: "revelation", name: "Revelation", chapters: 22, testament: "new" },
  // ... Add other NT books as needed
];

interface BibleSearchProps {
  onPassageSelect?: (passage: string, reference: string) => void;
}

export function BibleSearch({ onPassageSelect }: BibleSearchProps) {
  const { addSlide } = usePresentationStore();
  // Remove searchQuery, selectedVersion, isLoading, error, searchInputRef, isVersionPopoverOpen states
  // const [searchQuery, setSearchQuery] = useState("");
  // const [selectedVersion, setSelectedVersion] = useState("KJV");
  // const [isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState<string | null>(null);
  const [selectedBook, setSelectedBook] = useState<string | null>(
    BIBLE_BOOKS[0].id
  ); // Default to Genesis
  const [selectedChapter, setSelectedChapter] = useState<number | null>(1); // Default to chapter 1
  const [selectedVerse, setSelectedVerse] = useState<number | null>(null);
  const [verses, setVerses] = useState<BibleVerse[]>([]);
  const [addedVerses, setAddedVerses] = useState<Set<string>>(new Set());
  const [showAddedFeedback, setShowAddedFeedback] = useState<string | null>(
    null
  );
  // const searchInputRef = useRef<HTMLInputElement>(null);
  const [bookSearch, setBookSearch] = useState("");
  // const [isVersionPopoverOpen, setIsVersionPopoverOpen] = useState(false);

  const currentBook = BIBLE_BOOKS.find((b) => b.id === selectedBook);
  const chapters = currentBook
    ? Array.from({ length: currentBook.chapters }, (_, i) => i + 1)
    : [];

  const fetchVerses = async (book: string, chapter: number) => {
    if (!book || !chapter) return;
    // setIsLoading(true);
    // setError(null);
    setVerses([]); // Clear previous verses
    try {
      const bookDetails = BIBLE_BOOKS.find((b) => b.id === book);
      if (!bookDetails) throw new Error("Invalid book selected");

      // Use a default version or remove version logic if not needed
      const version = "kjv"; // Or remove version parameter if API allows

      const response = await fetch(
        `https://bible-api.com/${bookDetails.name} ${chapter}?translation=${version}`
      );

      if (!response.ok) {
        throw new Error("Verses not found for this chapter.");
      }

      const data = await response.json();

      if (data.verses && Array.isArray(data.verses)) {
        const fetchedVerses: BibleVerse[] = data.verses.map((v: any) => ({
          reference: `${data.reference}:${v.verse}`,
          text: v.text.replace(/\n/g, " ").trim(), // Clean up verse text
          version: data.translation_name, // Use version from response
          book: data.book_name,
          chapter: data.chapter,
          verse: v.verse,
        }));
        setVerses(fetchedVerses);
        if (onPassageSelect && fetchedVerses.length > 0) {
          // Select the first verse by default when chapter changes
          handleVerseSelect(fetchedVerses[0]);
        }
      } else {
        setVerses([]);
        // setError("No verses found for this chapter.");
      }
    } catch (error) {
      console.error("Error fetching Bible verses:", error);
      // setError(
      //   error instanceof Error ? error.message : "Failed to fetch verses"
      // );
      setVerses([]);
    } finally {
      // setIsLoading(false);
    }
  };

  // Fetch verses when book or chapter changes
  useEffect(() => {
    if (selectedBook && selectedChapter) {
      fetchVerses(selectedBook, selectedChapter);
    }
  }, [selectedBook, selectedChapter]); // Removed selectedVersion dependency

  const handleAddVerse = (verse: BibleVerse) => {
    const slideContent = `<div class="flex flex-col items-center justify-center h-full bg-gradient-to-b from-slate-900 to-black text-white p-10">
        <div class="max-w-3xl w-full mx-auto">
          <div class="mb-8 text-center">
            <h2 class="text-4xl font-bold mb-2 text-blue-400">${verse.reference}</h2>
            <div class="w-16 h-1 bg-blue-500 mx-auto"></div>
          </div>
          <p class="text-2xl text-center leading-relaxed">${verse.text}</p>
          <div class="flex justify-end w-full mt-8">
            <p class="text-lg text-slate-400 italic">${verse.version}</p>
          </div>
        </div>
      </div>`;

    const newSlide: Slide = {
      id: Date.now(),
      type: "bible",
      title: `${verse.reference} (${verse.version})`,
      content: slideContent,
    };
    addSlide(newSlide);

    setAddedVerses((prev) => new Set(prev).add(verse.reference));
    setShowAddedFeedback(verse.reference);
    setTimeout(() => setShowAddedFeedback(null), 3000);
  };

  const handleBookSelect = (bookId: string) => {
    setSelectedBook(bookId);
    setSelectedChapter(1); // Reset to chapter 1 when book changes
    setSelectedVerse(null);
    setVerses([]); // Clear verses
  };

  const handleChapterSelect = (chapter: number) => {
    setSelectedChapter(chapter);
    setSelectedVerse(null);
    setVerses([]); // Clear verses
  };

  // Remove handleSearchSubmit function
  // const handleSearchSubmit = (e?: React.FormEvent) => {
  //   e?.preventDefault();
  //   if (!searchQuery.trim()) return;
  //   // Implement search logic here if needed, or remove if search is not part of the new design
  //   console.log("Searching for:", searchQuery, "in", selectedVersion);
  //   // Example: fetchVerses based on searchQuery
  // };

  const handleVerseSelect = (verse: BibleVerse) => {
    setSelectedVerse(verse.verse);
    if (onPassageSelect) {
      onPassageSelect(verse.text, verse.reference);
    }
  };

  const filteredBooks = BIBLE_BOOKS.filter((book) =>
    book.name.toLowerCase().includes(bookSearch.toLowerCase())
  );

  return (
    // Adjust main container for full height and remove padding if needed
    <div className="flex flex-col h-full bg-[#181A20] text-white">
      {/* Remove Header Section */}
      {/* <div className="p-4 border-b border-slate-800 flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            ref={searchInputRef}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearchSubmit()}
            placeholder="Search Bible (e.g., John 3:16)"
            className="pl-9 bg-slate-900 border-slate-700 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <Popover open={isVersionPopoverOpen} onOpenChange={setIsVersionPopoverOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-[180px] justify-between">
              {BIBLE_VERSIONS.find((v) => v.id === selectedVersion)?.name ||
                "Select Version"}
              <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0 bg-slate-800 border-slate-700">
            <ScrollArea className="h-[200px]">
              {BIBLE_VERSIONS.map((version) => (
                <div
                  key={version.id}
                  onClick={() => {
                    setSelectedVersion(version.id);
                    setIsVersionPopoverOpen(false);
                  }}
                  className="flex items-center justify-between p-2 hover:bg-slate-700 cursor-pointer text-sm"
                >
                  {version.name}
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedVersion === version.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                </div>
              ))}
            </ScrollArea>
          </PopoverContent>
        </Popover>

        <Button onClick={() => handleSearchSubmit()} disabled={isLoading}>
          {isLoading ? "Searching..." : "Search"}
        </Button>
      </div> */}

      {/* Main Content: 3 Columns - Ensure flex-1 to fill height */}
      {/* Make sure the parent flex container takes full height */}
      <div className="flex flex-1 h-full overflow-hidden bg-[#181A20] rounded-lg shadow-lg border border-slate-800">
        {/* Column 1: Books */}
        <div className="w-1/4 border-r border-slate-800 flex flex-col bg-[#20222E] h-full overflow-hidden">
          <div className="p-3 border-b border-slate-800 bg-[#20222E]">
            <Input
              placeholder="Search books..."
              value={bookSearch}
              onChange={(e) => setBookSearch(e.target.value)}
              className="bg-slate-900 border-slate-700 h-8 text-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <ScrollArea className="flex-1 h-full overflow-y-scroll">
            <div className="p-0">
              {filteredBooks.map((book) => (
                <Button
                  key={book.id}
                  variant={selectedBook === book.id ? "default" : "ghost"}
                  onClick={() => handleBookSelect(book.id)}
                  className={cn(
                    "w-full justify-start px-4 py-3 text-left text-sm rounded-none transition-colors duration-150",
                    selectedBook === book.id
                      ? "bg-blue-600 text-white hover:bg-blue-700 shadow-md"
                      : "hover:bg-slate-700/50 text-slate-300"
                  )}
                >
                  {book.name}
                </Button>
              ))}
            </div>
          </ScrollArea>
        </div>
        {/* Column 2: Chapters */}
        {/* Ensure column takes full height and handles overflow */}
        <div className="w-1/6 border-r border-slate-800 flex flex-col bg-[#181A20] h-full overflow-hidden">
          {" "}
          {/* Adjusted width and background */}
          {/* ScrollArea takes remaining space */}
          <ScrollArea className="flex-1 h-full overflow-y-scroll">
            {" "}
            {/* Added overflow-y-scroll */} {/* Added flex-1 */}
            <div className="p-0 grid grid-cols-3 gap-0">
              {" "}
              {/* Removed padding and gap */}
              {chapters.map((chapter) => (
                <Button
                  key={chapter}
                  variant="ghost"
                  onClick={() => handleChapterSelect(chapter)}
                  className={cn(
                    "aspect-square justify-center items-center text-base p-3 rounded-none", // Increased padding and font size
                    selectedChapter === chapter
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "hover:bg-slate-700/50 text-slate-300"
                  )}
                >
                  {chapter}
                </Button>
              ))}
            </div>
          </ScrollArea>
        </div>
        {/* Column 3: Verses */}
        {/* Ensure column takes full height and handles overflow */}
        <div className="flex-1 flex flex-col bg-[#181A20] h-full overflow-hidden">
          {" "}
          {/* Adjusted background */}
          {/* ScrollArea takes remaining space */}
          <ScrollArea className="flex-1 h-full overflow-y-scroll">
            {" "}
            {/* Added overflow-y-scroll */} {/* Added flex-1 */}
            <div className="p-4">
              {" "}
              {/* Keep padding for verses */}
              {/* Remove loading and error states if not used */}
              {/* {isLoading && <p className="text-center text-slate-400">Loading verses...</p>}
              {error && <p className="text-center text-red-500">{error}</p>} */}
              {verses.length > 0 ? (
                <ul className="space-y-3">
                  {verses.map((verse) => (
                    <li
                      key={verse.reference}
                      onClick={() => handleVerseSelect(verse)}
                      onDoubleClick={() => handleAddVerse(verse)}
                      className={cn(
                        "flex items-start gap-3 cursor-pointer p-4 rounded-md transition-colors", // Increased padding
                        selectedVerse === verse.verse
                          ? "bg-blue-900/50"
                          : "hover:bg-slate-800/50",
                        addedVerses.has(verse.reference) ? "opacity-60" : ""
                      )}
                    >
                      <span className="font-mono text-sm text-slate-500 w-8 text-right pt-1">
                        {" "}
                        {/* Increased verse number size */}
                        {verse.verse}
                      </span>
                      <p
                        className={cn(
                          "flex-1 text-lg leading-relaxed", // Increased verse text size
                          selectedVerse === verse.verse
                            ? "text-white"
                            : "text-slate-300"
                        )}
                      >
                        {verse.text}
                      </p>
                      {/* Optionally keep add button or rely on double-click */}
                      {/* <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent li onClick
                          handleAddVerse(verse);
                        }}
                        className={cn(
                          "ml-auto transition-opacity duration-300",
                          showAddedFeedback === verse.reference
                            ? "opacity-100 text-green-500"
                            : "opacity-0 group-hover:opacity-100 text-slate-400 hover:text-white"
                        )}
                        disabled={showAddedFeedback === verse.reference}
                      >
                        {showAddedFeedback === verse.reference ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Plus className="h-4 w-4" />
                        )}
                      </Button> */}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-center text-slate-500 mt-10">
                  Select a book and chapter to view verses.
                </p>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}

// Define BibleVerse interface if not already defined globally
interface BibleVerse {
  reference: string;
  text: string;
  version: string;
  book: string;
  chapter: number;
  verse: number;
}
