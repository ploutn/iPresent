import React, { useState } from 'react';
import { ScrollArea } from '../ui/scroll-area';
import { Button } from '../ui/button';
import { Music, Plus, Search, Edit, Trash2 } from 'lucide-react';
import { Input } from '../ui/input';
import { Dialog, DialogContent } from '../ui/dialog';
import { SongEditor } from '../SongEditor';
import { useSongLibrary } from '../hooks/useSongLibrary';

import { Song } from '@/types/song';

// Sample song data is no longer needed since we're using useSongLibrary
// Removing sampleSongs array



export function SongsPage() {
  const { songs, handleSaveSong } = useSongLibrary();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [isAddSongDialogOpen, setIsAddSongDialogOpen] = useState(false);
  
  // Filter songs based on search query
  const filteredSongs = songs.filter(song => 
    song.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    song.artist.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddSong = () => {
    setIsAddSongDialogOpen(true);
  };

  const handleSaveSongContent = (songContent: string) => {
    handleSaveSong(songContent);
    setIsAddSongDialogOpen(false);
  };

  const handleSelectSong = (song: Song) => {
    setSelectedSong(song);
    console.log('Selected song:', song);
  };
  
  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-[#4A5568]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">Songs Library</h2>
          <Button className="bg-[#3182CE] hover:bg-[#2B6CB0]" onClick={handleAddSong}>
            <Plus className="h-4 w-4 mr-2" />
            Add Song
          </Button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#A0AEC0]" />
          <Input 
            placeholder="Search songs..." 
            className="pl-9 bg-[#1A202C] border-[#4A5568]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <ScrollArea className="flex-1 p-4">
        {filteredSongs.length > 0 ? (
          <div className="grid gap-2">
            {filteredSongs.map((song) => (
              <div
                key={song.id}
                className={`p-4 rounded-lg transition-colors cursor-pointer ${
selectedSong?.id === song.id
                    ? 'bg-[#3182CE]/20 border border-[#3182CE]/50' 
                    : 'bg-[#2D3748] hover:bg-[#4A5568] border border-transparent'
                }`}
                onClick={() => handleSelectSong(song)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#3182CE]/10 rounded-lg">
                      <Music className="h-5 w-5 text-[#3182CE]" />
                    </div>
                    <div>
                      <h3 className="font-medium text-white">{song.title}</h3>
                      <p className="text-sm text-[#A0AEC0]">{song.artist}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-[#A0AEC0] hover:text-white">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-[#A0AEC0] hover:text-red-500">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <Music className="h-12 w-12 text-[#A0AEC0] mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No songs found</h3>
            <p className="text-[#A0AEC0] max-w-md mb-4">
              {searchQuery ? 'Try a different search term' : 'Add your first song to get started'}
            </p>
            <Button className="bg-[#3182CE] hover:bg-[#2B6CB0]" onClick={handleAddSong}>
              <Plus className="h-4 w-4 mr-2" />
              Add Song
            </Button>
          </div>
        )}
      </ScrollArea>
      
      {selectedSong && (
        <div className="border-t border-[#4A5568] p-4 bg-[#1A202C]">
          <h3 className="font-medium text-white mb-2">{selectedSong.title}</h3>
          <p className="text-sm text-[#A0AEC0] mb-2">By {selectedSong.artist}</p>
          <div className="bg-[#2D3748] p-3 rounded-md text-[#E2E8F0] text-sm">
            <pre className="whitespace-pre-wrap font-sans">{selectedSong.content}</pre>
          </div>
        </div>
      )}

      {/* Add Song Dialog */}
      <Dialog open={isAddSongDialogOpen} onOpenChange={setIsAddSongDialogOpen}>
        <DialogContent className="bg-[#1A202C] border-[#4A5568] text-white max-w-2xl">
          <SongEditor 
            onSave={handleSaveSongContent}
            onCancel={() => setIsAddSongDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
