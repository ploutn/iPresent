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
import { Song, SongSlide, SlideMediaElement, MediaItem } from "../../types";
import { lazy, Suspense } from "react";

// Lazy load MediaSelector for better performance
const MediaSelector = lazy(() =>
  import("../media/MediaSelector").then((module) => ({
    default: module.MediaSelector,
  }))
);
import { Plus, ImageIcon, VideoIcon, VolumeX } from "lucide-react";
import { Card, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { v4 as uuidv4 } from "uuid";

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
  const [showMediaSelector, setShowMediaSelector] = useState(false);
  const [mediaElements, setMediaElements] = useState<SlideMediaElement[]>([]);
  const [editingMediaElement, setEditingMediaElement] =
    useState<SlideMediaElement | null>(null);

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
      setMediaElements(songToEdit.mediaElements || []);
    } else {
      // Reset form if songToEdit becomes null (e.g., modal closed and reopened without a song)
      setTitle("");
      setAuthor("");
      setLyrics("");
      setMediaElements([]);
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
      mediaElements: mediaElements,
      updatedAt: new Date(),
    };

    onEditSong(updatedSong);
    handleClose();
  };

  const handleMediaSelect = (selectedMedia: MediaItem[]) => {
    const newMediaElements: SlideMediaElement[] = selectedMedia.map(
      (media, index) => ({
        id: uuidv4(),
        mediaId: media.id,
        name: media.name,
        type: media.type,
        url: media.url,
        layer: (mediaElements.length || 0) + index + 1,
        position: { x: 0, y: 0 },
        size:
          media.type === "image" || media.type === "video"
            ? { width: 400, height: 300 }
            : undefined,
        opacity: 1,
        visible: true,
        playback:
          media.type === "video" || media.type === "audio"
            ? {
                autoplay: false,
                loop: false,
                volume: 1,
                startTime: 0,
              }
            : undefined,
      })
    );
    setMediaElements((prev) => [...prev, ...newMediaElements]);
    setShowMediaSelector(false);
  };

  const removeMediaElement = (index: number) => {
    setMediaElements((prev) => prev.filter((_, i) => i !== index));
  };

  const handleClose = () => {
    // Don't reset form fields here immediately if user might reopen with same song
    // Resetting is handled by useEffect if songToEdit changes or on successful submit
    setError("");
    onClose();
  };

  if (!isOpen || !songToEdit) return null;

  return (
    <>
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

            {/* Media Elements */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Background Media</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowMediaSelector(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Media
                </Button>
              </div>

              {mediaElements && mediaElements.length > 0 && (
                <div className="space-y-2">
                  {mediaElements.map((mediaElement, index) => (
                    <Card key={index} className="bg-gray-700 border-gray-600">
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            {mediaElement.type === "image" && (
                              <ImageIcon className="w-5 h-5 text-blue-400" />
                            )}
                            {mediaElement.type === "video" && (
                              <VideoIcon className="w-5 h-5 text-green-400" />
                            )}
                            {mediaElement.type === "audio" && (
                              <VolumeX className="w-5 h-5 text-purple-400" />
                            )}
                            <div>
                              <p className="text-sm font-medium text-white">
                                {mediaElement.name}
                              </p>
                              <div className="flex items-center space-x-2 text-xs text-gray-400">
                                <Badge variant="secondary" className="text-xs">
                                  {mediaElement.type}
                                </Badge>
                                <span>Layer {mediaElement.layer}</span>
                                <span>
                                  ({mediaElement.position.x},{" "}
                                  {mediaElement.position.y})
                                </span>
                                {mediaElement.size && (
                                  <span>
                                    {mediaElement.size.width}×
                                    {mediaElement.size.height}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex space-x-1">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                setEditingMediaElement(mediaElement)
                              }
                              className="text-blue-400 hover:text-blue-300 hover:bg-blue-400/10"
                            >
                              Edit
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeMediaElement(index)}
                              className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                            >
                              Remove
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
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

      <Suspense
        fallback={
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-background rounded-lg p-6 flex flex-col items-center space-y-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="text-sm text-muted-foreground">
                Loading Media Selector...
              </p>
            </div>
          </div>
        }
      >
        <MediaSelector
          isOpen={showMediaSelector}
          onClose={() => setShowMediaSelector(false)}
          onSelect={handleMediaSelect}
          allowMultiple={true}
          restrictToTypes={["image", "video", "audio"]}
        />
      </Suspense>

      {/* Media Element Editor Dialog */}
      <Dialog
        open={!!editingMediaElement}
        onOpenChange={(open) => !open && setEditingMediaElement(null)}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Media Element</DialogTitle>
          </DialogHeader>
          {editingMediaElement && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="media-name" className="text-right">
                  Name
                </Label>
                <Input
                  id="media-name"
                  value={editingMediaElement.name}
                  readOnly
                  className="col-span-3"
                />
              </div>

              {/* Position */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="pos-x" className="text-right">
                  Position (X)
                </Label>
                <Input
                  id="pos-x"
                  type="number"
                  value={editingMediaElement.position.x}
                  onChange={(e) =>
                    setEditingMediaElement({
                      ...editingMediaElement,
                      position: {
                        ...editingMediaElement.position,
                        x: parseFloat(e.target.value) || 0,
                      },
                    })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="pos-y" className="text-right">
                  Position (Y)
                </Label>
                <Input
                  id="pos-y"
                  type="number"
                  value={editingMediaElement.position.y}
                  onChange={(e) =>
                    setEditingMediaElement({
                      ...editingMediaElement,
                      position: {
                        ...editingMediaElement.position,
                        y: parseFloat(e.target.value) || 0,
                      },
                    })
                  }
                  className="col-span-3"
                />
              </div>

              {/* Size (only for image/video) */}
              {(editingMediaElement.type === "image" ||
                editingMediaElement.type === "video") && (
                <>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="width" className="text-right">
                      Width
                    </Label>
                    <Input
                      id="width"
                      type="number"
                      value={editingMediaElement.size?.width || ""}
                      onChange={(e) =>
                        setEditingMediaElement({
                          ...editingMediaElement,
                          size: {
                            ...editingMediaElement.size,
                            width: parseFloat(e.target.value) || 0,
                          },
                        })
                      }
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="height" className="text-right">
                      Height
                    </Label>
                    <Input
                      id="height"
                      type="number"
                      value={editingMediaElement.size?.height || ""}
                      onChange={(e) =>
                        setEditingMediaElement({
                          ...editingMediaElement,
                          size: {
                            ...editingMediaElement.size,
                            height: parseFloat(e.target.value) || 0,
                          },
                        })
                      }
                      className="col-span-3"
                    />
                  </div>
                </>
              )}

              {/* Opacity */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="opacity" className="text-right">
                  Opacity
                </Label>
                <Input
                  id="opacity"
                  type="number"
                  step="0.1"
                  min="0"
                  max="1"
                  value={editingMediaElement.opacity}
                  onChange={(e) =>
                    setEditingMediaElement({
                      ...editingMediaElement,
                      opacity: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="col-span-3"
                />
              </div>

              {/* Playback (only for audio/video) */}
              {(editingMediaElement.type === "audio" ||
                editingMediaElement.type === "video") && (
                <>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="autoplay" className="text-right">
                      Autoplay
                    </Label>
                    <input
                      id="autoplay"
                      type="checkbox"
                      checked={editingMediaElement.playback?.autoplay || false}
                      onChange={(e) =>
                        setEditingMediaElement({
                          ...editingMediaElement,
                          playback: {
                            ...editingMediaElement.playback,
                            autoplay: e.target.checked,
                          },
                        })
                      }
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="loop" className="text-right">
                      Loop
                    </Label>
                    <input
                      id="loop"
                      type="checkbox"
                      checked={editingMediaElement.playback?.loop || false}
                      onChange={(e) =>
                        setEditingMediaElement({
                          ...editingMediaElement,
                          playback: {
                            ...editingMediaElement.playback,
                            loop: e.target.checked,
                          },
                        })
                      }
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="volume" className="text-right">
                      Volume
                    </Label>
                    <Input
                      id="volume"
                      type="number"
                      step="0.1"
                      min="0"
                      max="1"
                      value={editingMediaElement.playback?.volume || 0}
                      onChange={(e) =>
                        setEditingMediaElement({
                          ...editingMediaElement,
                          playback: {
                            ...editingMediaElement.playback,
                            volume: parseFloat(e.target.value) || 0,
                          },
                        })
                      }
                      className="col-span-3"
                    />
                  </div>
                </>
              )}
            </div>
          )}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setEditingMediaElement(null)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={() => {
                if (editingMediaElement) {
                  setMediaElements((prev) =>
                    prev.map((el) =>
                      el.id === editingMediaElement.id
                        ? editingMediaElement
                        : el
                    )
                  );
                  setEditingMediaElement(null);
                }
              }}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
