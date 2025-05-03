import React, { useState } from "react";
import { BibleSearch } from "../BibleSearch";
import { Button } from "../ui/button";
import { BookOpen, ChevronRight, Plus } from "lucide-react";

export function BiblePage() {
  // State to hold both the selected passage text and its reference
  const [selectedPassage, setSelectedPassage] = useState<{
    text: string;
    reference: string;
  } | null>(null);

  // Updated handler for onPassageSelect
  const handlePassageSelect = (text: string, reference: string) => {
    setSelectedPassage({ text, reference });
  };

  return (
    <div className="flex h-full w-full bg-[#181A20] text-white">
      {/* Sidebar/Navigation - Keep this relatively clean */}
      <aside className="w-72 min-w-[200px] max-w-xs border-r border-gray-800 bg-[#20222E] flex flex-col shadow-lg">
        <div className="sticky top-0 z-10 bg-[#20222E] p-4 border-b border-gray-800 shadow-sm">
          <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-1">
            <BookOpen className="h-5 w-5 text-blue-400" />
            Bible
          </h2>
          <p className="text-xs text-gray-400">Search or browse passages</p>
        </div>
        <div className="flex-1 overflow-auto p-0">
          {/* Pass the updated handler */}
          <BibleSearch onPassageSelect={handlePassageSelect} />
        </div>
      </aside>

      {/* Main Content: Passage/Results - Simplify this area */}
      <main className="flex-1 flex flex-col items-center justify-center bg-[#181A20] p-6 overflow-auto">
        <div className="w-full max-w-4xl bg-[#23263A]/50 rounded-2xl shadow-xl border border-blue-900/30 p-8 flex flex-col gap-6 animate-fade-in backdrop-blur-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl font-semibold text-white flex items-center gap-3">
              <BookOpen className="h-6 w-6 text-blue-400" />
              {selectedPassage ? selectedPassage.reference : "Passage Viewer"}
            </h3>
            <Button
              variant="outline"
              className="gap-2 text-sm border-blue-700 px-4 py-2 rounded-lg hover:bg-blue-900/40 transition-all duration-200 shadow-md hover:scale-105"
              disabled={!selectedPassage}
              // Add onClick handler to add the selected passage to the presentation
              onClick={() => {
                if (selectedPassage) {
                  // Logic to add slide - needs access to addSlide from store
                  console.log("Add to presentation:", selectedPassage);
                }
              }}
            >
              <Plus className="h-4 w-4" /> Add to Presentation
            </Button>
          </div>

          {/* Passage display - Cleaner presentation */}
          <div className="bg-[#1a1c24] rounded-xl p-6 border border-gray-700/50 shadow-inner min-h-[300px] flex items-center justify-center">
            {selectedPassage ? (
              <div className="prose prose-invert max-w-none text-xl leading-relaxed animate-fade-in transition-all duration-300">
                {/* Display the selected passage text */}
                {selectedPassage.text}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-blue-300/80 animate-fade-in">
                <span className="text-5xl mb-3">📖</span>
                <p className="font-medium text-lg mb-1">Select a passage</p>
                <p className="text-xs opacity-70">
                  Use the search or browse options
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
