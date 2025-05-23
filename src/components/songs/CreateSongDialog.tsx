import React, { useState, useEffect } from "react"; // Added useEffect for completeness if needed later
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SongBook {
  id: string;
  name: string;
}

interface CreateSongDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateSong: (songData: {
    songBookId: string | null;
    title: string;
    lyrics: string;
  }) => void;
  songBooks: SongBook[];
  onCreateNewBook: () => void;
}

export function CreateSongDialog({
  isOpen,
  onClose,
  onCreateSong,
  songBooks,
  onCreateNewBook,
}: CreateSongDialogProps) {
  // Pre-select the first song book if available
  const [selectedSongBook, setSelectedSongBook] = useState<string | null>(
    songBooks.length > 0 ? songBooks[0].id : null
  );
  const [songTitle, setSongTitle] = useState("");
  const [songLyrics, setSongLyrics] = useState("");

  // Effect to reset form when dialog opens or songbooks change,
  // ensuring the first songbook is selected if the list updates.
  useEffect(() => {
    if (isOpen) {
      setSelectedSongBook(songBooks.length > 0 ? songBooks[0].id : null);
      // Optionally reset other fields if you want them cleared each time dialog opens
      // setSongTitle("");
      // setSongLyrics("");
    }
  }, [isOpen, songBooks]);

  const handleCreate = () => {
    if (!songLyrics.trim()) {
      alert("Song lyrics cannot be empty."); // Consider replacing alert with inline validation for better UX
      return;
    }
    onCreateSong({
      songBookId: selectedSongBook,
      title: songTitle || "Untitled Song",
      lyrics: songLyrics,
    });
    // Reset fields and close
    // setSelectedSongBook(songBooks.length > 0 ? songBooks[0].id : null); // Already handled by useEffect on next open
    setSongTitle("");
    setSongLyrics("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px] bg-[#2d3748] border-slate-700 text-white">
        <DialogHeader>
          {/* Updated title style */}
          <DialogTitle className="text-2xl font-semibold">
            Create new song
          </DialogTitle>
        </DialogHeader>
        {/* Adjusted main content gap */}
        <div className="grid gap-4 py-4">
          <div className="grid gap-3">
            <Label
              htmlFor="song-book"
              className="text-sm font-medium text-slate-200"
            >
              Song book
            </Label>
            <div className="flex items-center gap-2">
              <Select
                onValueChange={setSelectedSongBook}
                value={selectedSongBook || ""} // Ensure value is controlled
              >
                <SelectTrigger
                  id="song-book"
                  className="w-full bg-slate-700 border-slate-600 focus:ring-blue-500 text-white placeholder:text-slate-400"
                >
                  {/* Shows selected book name or placeholder if no book is selected/available */}
                  <SelectValue placeholder="Select song book" />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600 text-white">
                  {songBooks.map((book) => (
                    <SelectItem
                      key={book.id}
                      value={book.id}
                      className="hover:bg-slate-600 focus:bg-slate-600 cursor-pointer" // Added cursor-pointer for better affordance
                    >
                      {book.name}
                    </SelectItem>
                  ))}
                  {songBooks.length === 0 && (
                    <div className="p-2 text-sm text-slate-400 text-center">
                      No song books available.
                    </div>
                  )}
                </SelectContent>
              </Select>
              <Button
                onClick={onCreateNewBook}
                // Updated button style for flatter, consistent look
                className="bg-slate-600 hover:bg-slate-500 border border-slate-600 text-white px-4" // Added explicit border
              >
                Create new book
              </Button>
            </div>
          </div>

          <div className="grid gap-3">
            <Label
              htmlFor="song-title" // Changed from song-content to be more specific for this label
              className="text-sm font-medium text-slate-200"
            >
              Song
            </Label>
            <Input
              id="song-title"
              placeholder="e.g., 129 Господь, подяку я Тобі несу"
              value={songTitle}
              onChange={(e) => setSongTitle(e.target.value)}
              className="bg-slate-700 border-slate-600 focus:ring-blue-500 mb-2 text-white placeholder:text-slate-400"
            />
            <Textarea
              id="song-lyrics" // Changed from song-content to be more specific
              placeholder={`Господь, подяку я Тобі несу\nЗа те, що я ношу в собі Твій образ,\nЗа те, що на землі Твоїй живу\nІ впізнаю Твій добрий вічний голос.\n\nChorus / Приспів / Припев:\nЯ дякую, я дякую, я дякую\nТобі, Господь, я дякую.\n\nЯ в праці чую дивний голос Твій,\nВ солодких звуках рідної природи.\nЯ дякую, що Ти поміг пройти\nЧерез страждання і земну негоду.`}
              value={songLyrics}
              onChange={(e) => setSongLyrics(e.target.value)}
              className="min-h-[200px] bg-slate-700 border-slate-600 focus:ring-blue-500 resize-none text-white placeholder:text-slate-400"
              rows={10}
            />
          </div>
        </div>
        <DialogFooter className="sm:justify-end gap-2 pt-2">
          {" "}
          {/* Added pt-2 for slight separation */}
          <DialogClose asChild>
            <Button
              type="button"
              // Updated button style
              className="bg-slate-600 hover:bg-slate-500 border border-slate-600 text-white"
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="button"
            onClick={handleCreate}
            className="bg-blue-600 hover:bg-blue-700 text-white" // Slightly darkened blue for better contrast/standard
          >
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
