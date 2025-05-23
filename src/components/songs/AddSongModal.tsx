import React, { useState } from "react";
import { Button } from "../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea"; // Assuming this exists or will be created
import { Label } from "../../components/ui/label"; // Assuming this exists or will be created
import { Song, SongSlide } from "../../types";

interface AddSongModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSong: (song: Song) => void;
}

export const AddSongModal: React.FC<AddSongModalProps> = ({
  isOpen,
  onClose,
  onAddSong,
}) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [lyrics, setLyrics] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!title.trim() || !lyrics.trim()) {
      setError("Title and Lyrics are required.");
      return;
    }
    setError("");

    const newSongId = `song-${Date.now()}`;
    const firstSlideId = `slide-${newSongId}-1`;

    const newSong: Song = {
      id: newSongId,
      title: title.trim(),
      author: author.trim() || "Unknown Author",
      type: "song",
      content: lyrics.trim(), // Full lyrics for searchability
      slides: [
        {
          id: firstSlideId,
          type: "verse", // Default to verse, can be expanded later
          label: "Verse 1", // Default label
          content: lyrics.trim(),
        },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
      // Optional fields, can be added later if needed
      // ccliNumber: '',
      // favorite: false,
      // tags: [],
      // songBookId: null,
    };

    onAddSong(newSong);
    handleClose();
  };

  const handleClose = () => {
    setTitle("");
    setAuthor("");
    setLyrics("");
    setError("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Song</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {error && <p className="text-sm text-red-500">{error}</p>}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Title
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="col-span-3"
              placeholder="Song Title"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="author" className="text-right">
              Author
            </Label>
            <Input
              id="author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="col-span-3"
              placeholder="Song Author (Optional)"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="lyrics" className="text-right">
              Lyrics
            </Label>
            <Textarea
              id="lyrics"
              value={lyrics}
              onChange={(e) => setLyrics(e.target.value)}
              className="col-span-3"
              placeholder="Enter song lyrics here..."
              rows={6}
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
          </DialogClose>
          <Button type="button" onClick={handleSubmit}>
            Save Song
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
