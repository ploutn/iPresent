import React, { useState, useRef } from "react";
import { Search, Book, ChevronDown, BookOpen } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";
import { usePresentationStore } from "../store/presentationStore";
import { useContentStore } from "../stores/useContentStore";
import { ContentItem, Slide } from "../types";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

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
  { id: "psalms", name: "Psalms", chapters: 150, testament: "old" },
  { id: "proverbs", name: "Proverbs", chapters: 31, testament: "old" },

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
];

export function BibleSearch() {
  const { addSlide } = usePresentationStore();
  const [searchResults, setSearchResults] = useState<BibleVerse[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVersion, setSelectedVersion] = useState("KJV");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("search");
  const [selectedBook, setSelectedBook] = useState<string | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<number | null>(null);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [addedVerses, setAddedVerses] = useState<Set<string>>(new Set());
  const [showAddedFeedback, setShowAddedFeedback] = useState<string | null>(
    null
  );
  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleSearch = async () => {
    try {
      let query = searchQuery;

      // If using book/chapter navigation
      if (activeTab === "browse" && selectedBook && selectedChapter) {
        const book = BIBLE_BOOKS.find((b) => b.id === selectedBook);
        if (book) {
          query = `${book.name} ${selectedChapter}`;
        }
      }

      if (!query) return;

      setIsLoading(true);
      setError(null);

      const formattedQuery = query.trim().replace(/\s+/g, "");
      const response = await fetch(
        `https://bible-api.com/${formattedQuery}?translation=${selectedVersion.toLowerCase()}`
      );

      if (!response.ok) {
        throw new Error("Verse not found. Please check the reference format.");
      }

      const data = await response.json();

      if (data.text) {
        // Add to recent searches if not already there
        if (!recentSearches.includes(data.reference)) {
          setRecentSearches((prev) => [data.reference, ...prev].slice(0, 5));
        }

        const results: BibleVerse[] = [
          {
            reference: data.reference,
            text: `<div class="flex flex-col items-center justify-center h-full bg-gradient-to-b from-slate-900 to-black text-white p-10">
                  <div class="max-w-3xl w-full mx-auto">
                    <div class="mb-8 text-center">
                      <h2 class="text-4xl font-bold mb-2 text-blue-400">${data.reference}</h2>
                      <div class="w-16 h-1 bg-blue-500 mx-auto"></div>
                    </div>
                    <p class="text-2xl text-center leading-relaxed">${data.text}</p>
                    <div class="flex justify-end w-full mt-8">
                      <p class="text-lg text-slate-400 italic">${selectedVersion}</p>
                    </div>
                  </div>
                </div>`,
            version: selectedVersion,
          },
        ];
        setSearchResults(results);
      }
    } catch (error) {
      console.error("Error fetching Bible verse:", error);
      setError(
        error instanceof Error ? error.message : "Failed to fetch verse"
      );
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddVerse = (verse: BibleVerse) => {
    const newSlide: Slide = {
      id: Date.now(),
      type: "bible",
      title: `${verse.reference} (${verse.version})`,
      content: verse.text,
    };
    addSlide(newSlide);

    // Track added verses for UI feedback
    setAddedVerses((prev) => new Set(prev).add(verse.reference));

    // Show in-component feedback
    setShowAddedFeedback(verse.reference);
    setTimeout(() => setShowAddedFeedback(null), 3000);
  };

  const handleBookSelect = (bookId: string) => {
    setSelectedBook(bookId);
    setSelectedChapter(null);
  };

  const handleChapterSelect = (chapter: number) => {
    setSelectedChapter(chapter);
    // Auto-search when both book and chapter are selected
    setTimeout(() => handleSearch(), 100);
  };

  const selectedVersionObj =
    BIBLE_VERSIONS.find((v) => v.id === selectedVersion) || BIBLE_VERSIONS[0];

  return (
    <div className="p-6 space-y-6">
      {/* Feedback Toast */}
      {showAddedFeedback && (
        <div className="fixed bottom-6 right-6 bg-green-600 text-white px-4 py-3 rounded-lg shadow-xl z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 6L9 17l-5-5"></path>
            </svg>
            <span>
              Added <strong>{showAddedFeedback}</strong> to presentation
            </span>
          </div>
        </div>
      )}

      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-500/20 rounded-md">
              <Book className="h-5 w-5 text-blue-500" />
            </div>
            <h2 className="text-xl font-semibold text-white">Bible Search</h2>
          </div>
          <div className="text-sm font-medium px-3 py-1.5 rounded-full bg-blue-500/10 text-blue-400">
            {selectedVersion} ·{" "}
            {BIBLE_VERSIONS.find((v) => v.id === selectedVersion)?.name}
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-slate-800/60 border border-slate-700 rounded-lg overflow-hidden shadow-inner">
            <TabsTrigger
              value="search"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white py-3 transition-all duration-200"
            >
              <Search className="h-4 w-4 mr-2" />
              Search by Reference
            </TabsTrigger>
            <TabsTrigger
              value="browse"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white py-3 transition-all duration-200"
            >
              <BookOpen className="h-4 w-4 mr-2" />
              Browse Books
            </TabsTrigger>
          </TabsList>

          <TabsContent value="search" className="mt-5">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400">
                  <Search className="h-4 w-4" />
                </div>
                <Input
                  ref={searchInputRef}
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Enter reference (e.g. John 3:16)"
                  className={`w-full pl-10 bg-slate-800/80 border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 h-11 text-base ${
                    error
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                      : ""
                  }`}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  disabled={isLoading}
                  autoFocus
                />
                {error && (
                  <div className="text-sm text-red-500 mt-2 p-2 bg-red-500/10 rounded-md border border-red-500/20">
                    <div className="flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="12"></line>
                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                      </svg>
                      {error}
                    </div>
                  </div>
                )}
              </div>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="min-w-[140px] border-slate-700 bg-slate-800 hover:bg-slate-700 flex justify-between items-center"
                    disabled={isLoading}
                  >
                    <span>{selectedVersionObj.id}</span>
                    <ChevronDown className="h-4 w-4 ml-2 opacity-70" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0 bg-slate-800 border-slate-700 rounded-md shadow-lg">
                  <div className="py-1">
                    {BIBLE_VERSIONS.map((version) => (
                      <button
                        key={version.id}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-700 transition-colors ${
                          version.id === selectedVersion
                            ? "bg-blue-600 text-white"
                            : "text-slate-200"
                        }`}
                        onClick={() => setSelectedVersion(version.id)}
                      >
                        <div className="font-medium">{version.id}</div>
                        <div className="text-xs opacity-70">{version.name}</div>
                      </button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>

              <Button
                onClick={handleSearch}
                className="bg-blue-600 hover:bg-blue-500 min-w-[100px] transition-colors h-11"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Searching
                  </div>
                ) : (
                  <div className="flex items-center">
                    <Search className="h-4 w-4 mr-2" />
                    Search
                  </div>
                )}
              </Button>
            </div>

            {recentSearches.length > 0 &&
              searchResults.length === 0 &&
              !isLoading &&
              !error && (
                <div className="mt-5 bg-slate-800/40 p-3 rounded-lg border border-slate-700/50">
                  <h3 className="text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    Recent Searches
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((reference) => (
                      <Button
                        key={reference}
                        variant="outline"
                        size="sm"
                        className="text-blue-400 border-slate-700 hover:bg-slate-700 hover:text-blue-300 transition-colors"
                        onClick={() => {
                          setSearchQuery(reference);
                          setTimeout(() => handleSearch(), 100);
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="mr-1"
                        >
                          <path d="m15 18-6-6 6-6" />
                        </svg>
                        {reference}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
          </TabsContent>

          <TabsContent value="browse" className="mt-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-800/80 border border-slate-700 rounded-lg p-4 shadow-md">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-slate-200 flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                    </svg>
                    Select Book
                  </h3>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 px-2 text-xs text-blue-400 border-slate-700 hover:bg-slate-700 hover:text-blue-300"
                      onClick={() =>
                        setSelectedBook(
                          BIBLE_BOOKS.filter((b) => b.testament === "old")[0]
                            ?.id
                        )
                      }
                    >
                      Old Testament
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 px-2 text-xs text-blue-400 border-slate-700 hover:bg-slate-700 hover:text-blue-300"
                      onClick={() =>
                        setSelectedBook(
                          BIBLE_BOOKS.filter((b) => b.testament === "new")[0]
                            ?.id
                        )
                      }
                    >
                      New Testament
                    </Button>
                  </div>
                </div>
                <ScrollArea className="h-[300px] overflow-y-auto pr-4 overflow-x-hidden wheel-scrollable">
                  <div className="grid grid-cols-2 gap-2 pb-2">
                    {BIBLE_BOOKS.map((book) => (
                      <Button
                        key={book.id}
                        variant="ghost"
                        size="sm"
                        className={`justify-start text-left ${
                          selectedBook === book.id
                            ? "bg-blue-600 text-white hover:bg-blue-500"
                            : "text-slate-300 hover:bg-slate-700"
                        }`}
                        onClick={() => handleBookSelect(book.id)}
                      >
                        {book.name}
                        {book.testament === "old" ? (
                          <span className="ml-1 text-xs opacity-50">(OT)</span>
                        ) : (
                          <span className="ml-1 text-xs opacity-50">(NT)</span>
                        )}
                      </Button>
                    ))}
                  </div>
                </ScrollArea>
              </div>

              <div className="bg-slate-800/80 border border-slate-700 rounded-lg p-4 shadow-md">
                <h3 className="text-sm font-medium text-slate-200 mb-3 flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M16 6h3a1 1 0 0 1 1 1v11a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-1"></path>
                    <path d="M14 16H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11a1 1 0 0 1 1 1v3"></path>
                  </svg>
                  Select Chapter
                </h3>
                {selectedBook ? (
                  <ScrollArea className="h-[300px] overflow-auto pr-4 overflow-x-hidden wheel-scrollable">
                    <div className="grid grid-cols-5 gap-2 pb-2">
                      {Array.from({
                        length:
                          BIBLE_BOOKS.find((b) => b.id === selectedBook)
                            ?.chapters || 0,
                      }).map((_, i) => (
                        <Button
                          key={i}
                          variant="outline"
                          size="sm"
                          className={`justify-center border-slate-700 ${
                            selectedChapter === i + 1
                              ? "bg-blue-600 text-white hover:bg-blue-500 border-blue-500"
                              : "text-slate-300 hover:bg-slate-700"
                          }`}
                          onClick={() => handleChapterSelect(i + 1)}
                        >
                          {i + 1}
                        </Button>
                      ))}
                    </div>
                  </ScrollArea>
                ) : (
                  <div className="flex flex-col items-center justify-center h-[300px] text-slate-500 bg-slate-800/30 rounded-lg border border-dashed border-slate-700">
                    <BookOpen className="h-10 w-10 mb-3 opacity-30" />
                    <p className="font-medium">Select a book first</p>
                    <p className="text-xs mt-1 max-w-[200px] text-center">
                      Choose a book from the left panel to view available
                      chapters
                    </p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <div className="mt-8">
        <ScrollArea className="h-auto max-h-[calc(100vh-260px)] pr-4 overflow-x-hidden wheel-scrollable">
          <div className="space-y-4 pb-6">
            {searchResults.length === 0 && !isLoading && !error && (
              <div className="flex flex-col items-center justify-center py-12 px-6 text-slate-400 bg-gradient-to-b from-slate-800/40 to-slate-900/40 rounded-xl border border-slate-700/50 shadow-lg">
                <div className="p-4 bg-blue-500/10 rounded-full mb-5">
                  <Book className="h-12 w-12 text-blue-400" />
                </div>
                <p className="text-center font-medium text-slate-200 text-lg">
                  Enter a Bible reference to search
                </p>
                <p className="text-sm opacity-80 mt-2 text-center max-w-md">
                  Example: John 3:16, Psalm 23, Genesis 1:1-10, or browse by
                  book and chapter
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-slate-700 hover:bg-slate-700 hover:text-blue-300 transition-colors"
                    onClick={() => {
                      setSearchQuery("John 3:16");
                      setActiveTab("search");
                      setTimeout(() => handleSearch(), 100);
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-1"
                    >
                      <path d="m9 18 6-6-6-6" />
                    </svg>
                    John 3:16
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-slate-700 hover:bg-slate-700 hover:text-blue-300 transition-colors"
                    onClick={() => {
                      setSearchQuery("Psalm 23");
                      setActiveTab("search");
                      setTimeout(() => handleSearch(), 100);
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-1"
                    >
                      <path d="m9 18 6-6-6-6" />
                    </svg>
                    Psalm 23
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-slate-700 hover:bg-slate-700 hover:text-blue-300 transition-colors"
                    onClick={() => {
                      setSearchQuery("Romans 8:28");
                      setActiveTab("search");
                      setTimeout(() => handleSearch(), 100);
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-1"
                    >
                      <path d="m9 18 6-6-6-6" />
                    </svg>
                    Romans 8:28
                  </Button>
                </div>
              </div>
            )}

            {isLoading && (
              <div className="flex flex-col items-center justify-center py-16 text-slate-400 bg-slate-800/20 rounded-xl border border-slate-700/30">
                <div className="relative">
                  <svg
                    className="animate-spin h-12 w-12 text-blue-500 mb-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <Book className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-5 w-5 text-blue-200" />
                </div>
                <p className="text-lg font-medium text-slate-300">
                  Searching Bible verses...
                </p>
                <p className="text-sm text-slate-400 mt-1">
                  This may take a moment
                </p>
              </div>
            )}

            {searchResults.map((verse) => (
              <Card
                key={verse.reference}
                className={`p-5 cursor-pointer hover:bg-slate-800/80 transition-all duration-200 border-slate-700 shadow-md ${
                  addedVerses.has(verse.reference)
                    ? "border-blue-500/50 bg-blue-500/10 shadow-blue-500/5"
                    : "hover:border-blue-500 hover:shadow-lg hover:-translate-y-0.5"
                }`}
                onClick={() => handleAddVerse(verse)}
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold text-lg text-blue-400 flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                    </svg>
                    {verse.reference}
                  </h3>
                  <span className="text-sm px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 font-medium">
                    {verse.version}
                  </span>
                </div>
                <div className="bg-slate-800/50 p-3 rounded-md border border-slate-700/50 my-3">
                  <p className="text-base leading-relaxed text-slate-200">
                    {verse.text.replace(/<[^>]*>/g, "")}
                  </p>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-700 flex justify-between items-center">
                  <div className="text-xs text-slate-400">
                    {addedVerses.has(verse.reference) ? (
                      <span className="flex items-center gap-1 text-green-400 bg-green-500/10 px-2 py-1 rounded-full">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M20 6L9 17l-5-5"></path>
                        </svg>
                        Added to presentation
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M12 5v14"></path>
                          <path d="M5 12h14"></path>
                        </svg>
                        Click to add to presentation
                      </span>
                    )}
                  </div>
                  <Button
                    size="sm"
                    className={`${
                      addedVerses.has(verse.reference)
                        ? "bg-green-600 hover:bg-green-500"
                        : "bg-blue-600 hover:bg-blue-500"
                    } text-white transition-colors shadow-md`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddVerse(verse);
                    }}
                  >
                    {addedVerses.has(verse.reference) ? (
                      <>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="mr-1"
                        >
                          <path d="M20 6L9 17l-5-5"></path>
                        </svg>
                        Added
                      </>
                    ) : (
                      <>Add Verse</>
                    )}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
