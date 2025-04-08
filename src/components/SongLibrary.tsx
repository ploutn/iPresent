import React, { useState, useEffect } from "react";
import {
  Search,
  Music,
  Plus,
  Star,
  StarOff,
  Filter,
  Edit2,
  Trash2,
  Play,
  Tag,
  Upload,
  Download,
  MoreVertical,
} from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { usePresentationStore } from "../store/presentationStore";
import { useSongStore } from "../store/songStore";
import { Slide } from "../types";
import { Song } from "../types/song";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { SongEditor } from "./SongEditor";
import { Badge } from "./ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { useToast } from "./ui/use-toast";
import { parseSongFile } from "../utils/songParser";

function getInitials(title: string): string {
  return title
    .split(" ")
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

export function SongLibrary() {
  const { toast } = useToast();
  const { items } = usePresentationStore();
  const { addSlide } = usePresentationStore();
  const { songs, favorites, tags, toggleFavorite, deleteSong, importSongs } =
    useSongStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [isAddSongDialogOpen, setIsAddSongDialogOpen] = useState(false);
  const [isEditSongDialogOpen, setIsEditSongDialogOpen] = useState(false);
  const [filter, setFilter] = useState<"all" | "favorites">("all");
  const [sortBy, setSortBy] = useState<"title" | "author" | "date">("title");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isImporting, setIsImporting] = useState(false);

  const filteredSongs = songs
    .filter((song) => {
      const matchesSearch =
        song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        song.lyrics.toLowerCase().includes(searchQuery.toLowerCase()) ||
        song.author.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesFilter = filter === "all" || favorites.includes(song.id);
      const matchesTags =
        selectedTags.length === 0 ||
        selectedTags.every((tag) => song.tags.includes(tag));

      return matchesSearch && matchesFilter && matchesTags;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "title":
          return a.title.localeCompare(b.title);
        case "author":
          return a.author.localeCompare(b.author);
        case "date":
          return b.createdAt.getTime() - a.createdAt.getTime();
        default:
          return 0;
      }
    });

  const handleAddSong = (song: Song) => {
    const newSlide: Slide = {
      id: Date.now(),
      type: "song",
      title: song.title,
      content: song.lyrics,
    };
    addSlide(newSlide);
    toast({
      title: "Added to presentation",
      description: `${song.title} has been added to your presentation.`,
    });
  };

  const handleToggleFavorite = (song: Song) => {
    toggleFavorite(song.id);
    toast({
      title: favorites.includes(song.id)
        ? "Removed from favorites"
        : "Added to favorites",
      description: `${song.title} has been ${
        favorites.includes(song.id) ? "removed from" : "added to"
      } your favorites.`,
    });
  };

  const handleEditSong = (song: Song) => {
    setSelectedSong(song);
    setIsEditSongDialogOpen(true);
  };

  const handleDeleteSong = async (song: Song) => {
    if (window.confirm(`Are you sure you want to delete "${song.title}"?`)) {
      deleteSong(song.id);
      toast({
        title: "Song deleted",
        description: `${song.title} has been deleted from your library.`,
      });
    }
  };

  const handleImportSongs = async () => {
    try {
      setIsImporting(true);
      const input = document.createElement("input");
      input.type = "file";
      input.accept = ".txt";
      input.multiple = true;

      input.onchange = async (e) => {
        const files = (e.target as HTMLInputElement).files;
        if (!files) return;

        const importedSongs: Song[] = [];
        for (const file of files) {
          const text = await file.text();
          const song = parseSongFile(text, file.name);
          importedSongs.push(song);
        }

        importSongs(importedSongs);
        toast({
          title: "Songs imported",
          description: `Successfully imported ${importedSongs.length} songs.`,
        });
      };

      input.click();
    } catch (error) {
      toast({
        title: "Import failed",
        description: "There was an error importing the songs.",
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="grid grid-cols-[1fr,400px] h-full">
      {/* Left Panel - Song List */}
      <div className="flex flex-col h-full bg-[#121212]">
        <div className="p-6 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold tracking-tight">SONGS</h1>
            <Button
              className="bg-[#2D4B98] hover:bg-[#2D4B98]/90 text-white"
              size="sm"
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
                onClick={() => setSelectedSong(song)}
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

      {/* Right Panel - Preview */}
      <div className="border-l border-[#2D2D2D] bg-[#121212]">
        <div className="p-6 border-b border-[#2D2D2D]">
          <h2 className="text-lg font-semibold">PREVIEW</h2>
        </div>
        <div className="p-6 flex items-center justify-center h-[calc(100%-81px)] text-slate-400">
          {selectedSong ? (
            <div className="w-full">
              <pre className="whitespace-pre-wrap font-sans">
                {selectedSong.lyrics}
              </pre>
            </div>
          ) : (
            <div className="text-center">
              <p>No output selected</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
