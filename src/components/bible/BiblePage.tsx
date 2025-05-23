import React, { useState } from "react";
import { BibleSearch } from "../bible/BibleSearch";
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
      {/* Sidebar/Navigation - Allow this to fill the width */}
      <aside className="flex-1 border-r border-gray-800 bg-[#20222E] flex flex-col shadow-lg">
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
    </div>
  );
}
