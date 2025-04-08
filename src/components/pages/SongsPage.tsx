import React, { useState } from "react";
import { ScrollArea } from "../ui/scroll-area";
import { Button } from "../ui/button";
import { MoreVertical, Plus, Search } from "lucide-react";
import { Input } from "../ui/input";
import { Dialog, DialogContent } from "../ui/dialog";
import { SongEditor } from "../SongEditor";
import { useSongLibrary } from "../hooks/useSongLibrary";
import { Song } from "@/types/song";

function getInitials(title: string): string {
  return title
    .split(" ")
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

export function SongsPage() {
  const { songs, handleSaveSong } = useSongLibrary();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [isAddSongDialogOpen, setIsAddSongDialogOpen] = useState(false);

  // Filter songs based on search query
  const filteredSongs = songs.filter(
    (song) =>
      song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      song.author.toLowerCase().includes(searchQuery.toLowerCase())
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
  };

  return (
    <div className="grid grid-cols-1 h-full">
      {/* Left Panel - Song List */}
      <div className="flex flex-col h-full bg-[#121212]">
        <div className="p-6 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold tracking-tight">SONGS</h1>
            <Button
              className="bg-[#2D4B98] hover:bg-[#2D4B98]/90 text-white"
              size="sm"
              onClick={handleAddSong}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Song
            </Button>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search song"
              className="pl-9 bg-[#1E1E1E] border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="px-2">
            {filteredSongs.map((song) => (
              <button
                key={song.id}
                onClick={() => handleSelectSong(song)}
                className={`w-full flex items-center gap-3 p-4 rounded-lg hover:bg-white/5 transition-colors ${
                  selectedSong?.id === song.id ? "bg-white/5" : ""
                }`}
              >
                <div className="h-8 w-8 rounded bg-[#2D2D2D] text-white flex items-center justify-center text-sm font-medium">
                  {getInitials(song.title)}
                </div>
                <div className="flex-1 text-left">
                  <div className="font-medium">{song.title}</div>
                  <div className="text-sm text-slate-400">{song.author}</div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="opacity-0 group-hover:opacity-100"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>

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
