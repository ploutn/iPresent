import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { ScrollArea } from './ui/scroll-area';
import { usePresentationStore } from '../store/presentationStore';
import { useContentStore } from '../stores/useContentStore';
import { ContentItem, Slide } from '../types';

interface BibleVerse {
  reference: string;
  text: string;
  version: string;
}

export function BibleSearch() {
  const { addSlide } = usePresentationStore();
  const [searchResults, setSearchResults] = useState<BibleVerse[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVersion, setSelectedVersion] = useState('KJV');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    try {
      if (!searchQuery) return;
      
      setIsLoading(true);
      setError(null);
      
      const formattedQuery = searchQuery.trim().replace(/\s+/g, '');
      const response = await fetch(`https://bible-api.com/${formattedQuery}?translation=${selectedVersion.toLowerCase()}`);
      
      if (!response.ok) {
        throw new Error('Verse not found. Please check the reference format.');
      }
      
      const data = await response.json();
      
      if (data.text) {
        const results: BibleVerse[] = [{
          reference: data.reference,
          text: `<div class="flex flex-col items-center justify-center h-full bg-black text-white p-8">
                  <h2 class="text-3xl font-bold mb-4">${data.reference}</h2>
                  <p class="text-2xl text-center leading-relaxed">${data.text}</p>
                  <p class="text-lg text-slate-400 mt-6">${selectedVersion}</p>
                </div>`,
          version: selectedVersion
        }];
        setSearchResults(results);
      }
    } catch (error) {
      console.error('Error fetching Bible verse:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch verse');
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddVerse = (verse: BibleVerse) => {
    const newSlide: Slide = {
      id: Date.now(),
      type: 'bible',
      title: `${verse.reference} (${verse.version})`,
      content: verse.text
    };
    addSlide(newSlide);
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex gap-2">
        <div className="flex-1">
          <Input 
            type="search" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Enter reference (e.g. John 3:16)" 
            className={`w-full ${error ? 'border-red-500' : ''}`}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            disabled={isLoading}
          />
          {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
        </div>
        <select
          value={selectedVersion}
          onChange={(e) => setSelectedVersion(e.target.value)}
          className="bg-slate-800 border border-slate-700 rounded-md px-3 text-white"
          aria-label="Select Bible version"
          disabled={isLoading}
        >
          <option value="KJV">King James</option>
          <option value="NIV">NIV</option>
          <option value="ESV">ESV</option>
          <option value="NLT">NLT</option>
        </select>
        <Button 
          onClick={handleSearch} 
          className="bg-blue-600 hover:bg-blue-500"
          disabled={isLoading}
        >
          {isLoading ? 'Searching...' : 'Search'}
        </Button>
      </div>
      <ScrollArea className="h-[calc(100vh-200px)]">
        <div className="space-y-2">
          {searchResults.map((verse) => (
            <Card 
              key={verse.reference} 
              className="p-4 cursor-pointer hover:bg-slate-800 transition-colors"
              onClick={() => handleAddVerse(verse)}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-lg text-blue-400">{verse.reference}</h3>
                <span className="text-sm text-slate-400">{verse.version}</span>
              </div>
              <p className="text-base leading-relaxed text-slate-200">
                {verse.text.replace(/<[^>]*>/g, '')}
              </p>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}