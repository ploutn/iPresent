import React, { useState } from 'react';
import { ScrollArea } from '../ui/scroll-area';
import { Button } from '../ui/button';
import { BookOpen, Plus } from 'lucide-react';
import { Input } from '../ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

export function BiblePage() {
  const [selectedBook, setSelectedBook] = useState('');
  const [selectedChapter, setSelectedChapter] = useState('');

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-[#4A5568]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">Bible Verses</h2>
          <Button className="bg-[#3182CE] hover:bg-[#2B6CB0]">
            <Plus className="h-4 w-4 mr-2" />
            Add Verse
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Select value={selectedBook} onValueChange={setSelectedBook}>
            <SelectTrigger className="bg-[#1A202C] border-[#4A5568]">
              <SelectValue placeholder="Select Book" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="genesis">Genesis</SelectItem>
              <SelectItem value="exodus">Exodus</SelectItem>
              <SelectItem value="leviticus">Leviticus</SelectItem>
              <SelectItem value="matthew">Matthew</SelectItem>
              <SelectItem value="mark">Mark</SelectItem>
              <SelectItem value="luke">Luke</SelectItem>
              <SelectItem value="john">John</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedChapter} onValueChange={setSelectedChapter}>
            <SelectTrigger className="bg-[#1A202C] border-[#4A5568]">
              <SelectValue placeholder="Chapter" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 20 }).map((_, i) => (
                <SelectItem key={i} value={`${i + 1}`}>{i + 1}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {selectedBook && selectedChapter ? (
            <div className="space-y-4">
              <div className="p-4 bg-[#2D3748] rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-[#3182CE]/10 rounded-lg">
                    <BookOpen className="h-5 w-5 text-[#3182CE]" />
                  </div>
                  <h3 className="font-medium text-white">{selectedBook.charAt(0).toUpperCase() + selectedBook.slice(1)} {selectedChapter}:1-5</h3>
                </div>
                <p className="text-[#A0AEC0] leading-relaxed">
                  1 In the beginning God created the heavens and the earth.<br />
                  2 Now the earth was formless and empty, darkness was over the surface of the deep, and the Spirit of God was hovering over the waters.<br />
                  3 And God said, "Let there be light," and there was light.<br />
                  4 God saw that the light was good, and he separated the light from the darkness.<br />
                  5 God called the light "day," and the darkness he called "night." And there was evening, and there was morning—the first day.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <BookOpen className="h-12 w-12 text-[#A0AEC0] mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">Select a Book and Chapter</h3>
              <p className="text-[#A0AEC0] max-w-md">
                Choose a book and chapter from the dropdown menus above to view verses.
              </p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}