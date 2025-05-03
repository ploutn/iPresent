import React, { useState, useRef, useEffect } from "react";
import { Search, Book, ChevronDown, BookOpen, Check } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";
import { usePresentationStore } from "../store/presentationStore";
import { useContentStore } from "../stores/useContentStore";
import { ContentItem, Slide } from "../types";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
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
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVersion, setSelectedVersion] = useState("KJV");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [bookSearch, setBookSearch] = useState("");
  const [isVersionPopoverOpen, setIsVersionPopoverOpen] = useState(false);

  const currentBook = BIBLE_BOOKS.find((b) => b.id === selectedBook);
  const chapters = currentBook
    ? Array.from({ length: currentBook.chapters }, (_, i) => i + 1)
    : [];

  const fetchVerses = async (book: string, chapter: number) => {
    if (!book || !chapter) return;
    setIsLoading(true);
    setError(null);
    setVerses([]); // Clear previous verses
    try {
      const bookDetails = BIBLE_BOOKS.find((b) => b.id === book);
      if (!bookDetails) throw new Error("Invalid book selected");

      const response = await fetch(
        `https://bible-api.com/${
          bookDetails.name
        } ${chapter}?translation=${selectedVersion.toLowerCase()}`
      );

      if (!response.ok) {
        throw new Error("Verses not found for this chapter.");
      }

      const data = await response.json();

      if (data.verses && Array.isArray(data.verses)) {
        const fetchedVerses: BibleVerse[] = data.verses.map((v: any) => ({
          reference: `${data.reference}:${v.verse}`,
          text: v.text.replace(/\n/g, " ").trim(), // Clean up verse text
          version: selectedVersion,
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
        setError("No verses found for this chapter.");
      }
    } catch (error) {
      console.error("Error fetching Bible verses:", error);
      setError(
        error instanceof Error ? error.message : "Failed to fetch verses"
      );
      setVerses([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch verses when book or chapter changes
  useEffect(() => {
    if (selectedBook && selectedChapter) {
      fetchVerses(selectedBook, selectedChapter);
    }
  }, [selectedBook, selectedChapter, selectedVersion]);

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

  const handleVerseSelect = (verse: BibleVerse) => {
    setSelectedVerse(verse.verse);
    if (onPassageSelect) {
      onPassageSelect(verse.text, verse.reference);
    }
  };

  const filteredBooks = BIBLE_BOOKS.filter((book) =>
    book.name.toLowerCase().includes(bookSearch.toLowerCase())
  );

  const selectedVersionObj =
    BIBLE_VERSIONS.find((v) => v.id === selectedVersion) || BIBLE_VERSIONS[0];

  return (
    <div className="flex flex-col h-full bg-[#181A20] text-white">
      {/* Header: Search and Version Selector */}
      <div className="flex items-center p-3 border-b border-gray-700 bg-[#20222E] gap-2 sticky top-0 z-10">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            ref={searchInputRef}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search reference (e.g., John 3:16)"
            className="pl-9 bg-[#2b2d3a] border-gray-600 focus:border-blue-500 focus:ring-blue-500 text-sm h-9 rounded-md"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                // Implement direct search logic if needed
                console.log("Direct search:", searchQuery);
              }
            }}
          />
        </div>
        <Popover
          open={isVersionPopoverOpen}
          onOpenChange={setIsVersionPopoverOpen}
        >
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="justify-between w-[180px] h-9 text-sm bg-[#2b2d3a] border-gray-600 hover:bg-[#353848]"
            >
              {selectedVersionObj.name}
              <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0 bg-[#2b2d3a] border-gray-600 text-white">
            <ScrollArea className="h-[200px]">
              {BIBLE_VERSIONS.map((version) => (
                <div
                  key={version.id}
                  onClick={() => {
                    setSelectedVersion(version.id);
                    setIsVersionPopoverOpen(false);
                  }}
                  className="flex items-center justify-between p-2 hover:bg-[#353848] cursor-pointer text-sm"
                >
                  {version.name}
                  {selectedVersion === version.id && (
                    <Check className="h-4 w-4 text-blue-400" />
                  )}
                </div>
              ))}
            </ScrollArea>
          </PopoverContent>
        </Popover>
      </div>

      {/* Main Content: 3 Columns */}
      {/* Added gap-2 for spacing between columns and padding */}
      <div className="flex flex-1 overflow-hidden gap-2 p-2">
        {/* Column 1: Books - Adjusted width, added rounded corners, border, and overflow handling */}
        <div className="flex-[0_0_30%] min-w-[200px] border border-gray-700 rounded-lg flex flex-col bg-[#20222E] overflow-hidden">
          <div className="p-2 border-b border-gray-700 flex-shrink-0">
            <Input
              placeholder="Filter books..."
              value={bookSearch}
              onChange={(e) => setBookSearch(e.target.value)}
              className="bg-[#2b2d3a] border-gray-600 focus:border-blue-500 focus:ring-blue-500 text-xs h-8 rounded-md"
            />
          </div>
          <ScrollArea className="flex-1 min-h-0">
            {" "}
            {/* Added min-h-0 */}
            <div className="p-1">
              {filteredBooks.map((book) => (
                <Button
                  key={book.id}
                  variant="ghost"
                  onClick={() => handleBookSelect(book.id)}
                  className={cn(
                    "w-full justify-start h-8 px-2 text-sm font-normal rounded-md transition-colors duration-150",
                    selectedBook === book.id
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "text-gray-300 hover:bg-[#353848] hover:text-white"
                  )}
                >
                  {book.name}
                </Button>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Column 2: Chapters - Adjusted width, added rounded corners, border, and overflow handling */}
        <div className="flex-[0_0_15%] min-w-[100px] border border-gray-700 rounded-lg flex flex-col bg-[#20222E] overflow-hidden">
          <ScrollArea className="flex-1 min-h-0">
            {" "}
            {/* Added min-h-0 */}
            <div className="p-1 grid grid-cols-4 gap-1">
              {chapters.map((chapter) => (
                <Button
                  key={chapter}
                  variant="ghost"
                  onClick={() => handleChapterSelect(chapter)}
                  className={cn(
                    "h-8 w-full flex items-center justify-center text-sm rounded-md transition-colors duration-150 aspect-square",
                    selectedChapter === chapter
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "text-gray-300 hover:bg-[#353848] hover:text-white"
                  )}
                >
                  {chapter}
                </Button>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Column 3: Verses - Added rounded corners, border, and overflow handling */}
        <div className="flex-1 flex flex-col bg-[#181A20] border border-gray-700 rounded-lg overflow-hidden min-w-0">
          <ScrollArea className="flex-1 min-h-0">
            {" "}
            {/* Added min-h-0 */}
            <div className="p-4 space-y-1">
              {isLoading && (
                <p className="text-gray-400 text-center py-4">
                  Loading verses...
                </p>
              )}
              {error && (
                <p className="text-red-400 text-center py-4">Error: {error}</p>
              )}
              {!isLoading &&
                !error &&
                verses.length === 0 &&
                selectedBook &&
                selectedChapter && (
                  <p className="text-gray-500 text-center py-4">
                    No verses found or chapter not loaded.
                  </p>
                )}
              {verses.map((verse) => (
                <div
                  key={verse.reference}
                  onClick={() => handleVerseSelect(verse)}
                  onDoubleClick={() => handleAddVerse(verse)}
                  className={cn(
                    "flex items-start gap-3 p-2 rounded-md cursor-pointer transition-colors duration-150 group", // Added group for potential hover effects
                    selectedVerse === verse.verse
                      ? "bg-blue-900/50 ring-1 ring-blue-600/70" // Enhanced selected state
                      : "hover:bg-[#23263A]"
                  )}
                >
                  <span className="text-xs font-semibold text-gray-400 w-8 text-right pt-1">
                    {verse.verse}
                  </span>
                  <p className="flex-1 text-sm text-gray-200 leading-relaxed group-hover:text-white transition-colors">
                    {" "}
                    {/* Subtle text color change on hover */}
                    {verse.text}
                  </p>
                  {/* Optional: Add button or indicator */}
                  {addedVerses.has(verse.reference) && (
                    <Check className="h-4 w-4 text-green-500 ml-auto flex-shrink-0" />
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* Feedback Toast */}
      {showAddedFeedback && (
        <div className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-in fade-in slide-in-from-bottom-3 duration-300 border border-green-400/50">
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-green-200" />
            <span className="text-sm font-medium">
              Added {showAddedFeedback} to presentation
            </span>
          </div>
        </div>
      )}
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
