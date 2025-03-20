import React, { useState } from 'react';
import { Search, Music, Plus } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { usePresentationStore } from '../store/presentationStore';
import { useContentStore } from '../stores/useContentStore';
import { Song, Slide } from '../types';

export function SongLibrary() {
  const { items } = useContentStore();
  const { addSlide } = usePresentationStore();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Fixed type guard for Song type
  const songs = items.filter((item): item is Song => 
    item.type === 'song' && 'lyrics' in item && 'author' in item
  );

  const filteredSongs = songs.filter(song =>
    song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    song.lyrics.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddSong = (song: Song) => {
    const newSlide: Slide = {
      id: Date.now(),
      type: 'song',
      title: song.title,
      content: song.lyrics
    };
    addSlide(newSlide);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-slate-800">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search songs..."
            className="pl-9 bg-slate-900"
          />
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {filteredSongs.map(song => (
            <div 
              key={song.id} 
              className="p-4 bg-slate-800 rounded-lg cursor-pointer hover:bg-slate-700 transition-colors"
              onClick={() => handleAddSong(song)}
            >
              <h3 className="font-medium">{song.title}</h3>
              <p className="text-sm text-slate-400">By {song.author}</p>
              <p className="mt-2 text-sm text-slate-300 line-clamp-2">{song.lyrics}</p>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}