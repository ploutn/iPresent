import React, { useState, useEffect } from "react";
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
import { Textarea } from "../../components/ui/textarea";
import { Label } from "../../components/ui/label";
import { Song, SongSlide } from "../../types";

interface EditSongModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEditSong: (song: Song) => void;
  songToEdit: Song | null;
}

export const EditSongModal: React.FC<EditSongModalProps> = ({
  isOpen,
  onClose,
  onEditSong,
  songToEdit,
}) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [lyrics, setLyrics] = useState(""); // For simplicity, editing full lyrics which then becomes the first slide's content
  const [error, setError] = useState("");

  useEffect(() => {
    if (songToEdit) {
      setTitle(songToEdit.title);
      setAuthor(songToEdit.author);
      // Assuming the main lyrics are in the first slide or the song.content
      // For simplicity, let's use song.content if available, otherwise the first slide's content
      setLyrics(
        songToEdit.content ||
          (songToEdit.slides.length > 0 ? songToEdit.slides[0].content : "")
      );
    } else {
      // Reset form if songToEdit becomes null (e.g., modal closed and reopened without a song)
      setTitle("");
      setAuthor("");
      setLyrics("");
    }
  }, [songToEdit]);

  const handleSubmit = () => {
    if (!title.trim() || !lyrics.trim()) {
      setError("Title and Lyrics are required.");
      return;
    }
    if (!songToEdit) {
      setError("No song selected for editing.");
      return;
    }
    setError("");

    // Create an updated song object
    // For now, we assume editing lyrics updates the song.content and the first slide.
    // More complex slide management would require a more detailed UI in the modal.
    const updatedSlides: SongSlide[] =
      songToEdit.slides.length > 0
        ? [
            {
              ...songToEdit.slides[0], // Preserve ID, type, label of the first slide
              content: lyrics.trim(),
            },
          ]
        : [
            {
              id: `slide-${songToEdit.id}-1`,
              type: "verse",
              label: "Verse 1",
              content: lyrics.trim(),
            },
          ];

    const updatedSong: Song = {
      ...songToEdit,
      title: title.trim(),
      author: author.trim() || "Unknown Author",
      content: lyrics.trim(),
      slides: updatedSlides,
      updatedAt: new Date(),
    };

    onEditSong(updatedSong);
    handleClose();
  };

  const handleClose = () => {
    // Don't reset form fields here immediately if user might reopen with same song
    // Resetting is handled by useEffect if songToEdit changes or on successful submit
    setError("");
    onClose();
  };

  if (!isOpen || !songToEdit) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Song: {songToEdit.title}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {error && <p className="text-sm text-red-500">{error}</p>}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-title" className="text-right">
              Title
            </Label>
            <Input
              id="edit-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="col-span-3"
              placeholder="Song Title"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-author" className="text-right">
              Author
            </Label>
            <Input
              id="edit-author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="col-span-3"
              placeholder="Song Author (Optional)"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-lyrics" className="text-right">
              Lyrics
            </Label>
            <Textarea
              id="edit-lyrics"
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
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
