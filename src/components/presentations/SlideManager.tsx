import React, { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import {
  Plus,
  Edit,
  Trash2,
  ChevronUp,
  ChevronDown,
  Copy,
  FileText,
  Image,
  Video,
  Music,
  MessageSquare,
} from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import type { Slide, SlideTransition, ContentType } from "../../types/index";

interface SlideManagerProps {
  slides: Slide[];
  onSlidesChange: (slides: Slide[]) => void;
  className?: string;
}

const contentTypeIcons = {
  song: Music,
  announcement: MessageSquare,
  image: Image,
  video: Video,
  presentation: FileText,
  blank: FileText, // Using FileText as a placeholder icon
  prayer: MessageSquare, // Using MessageSquare as a placeholder icon
  bible: FileText, // Using FileText as a placeholder icon
};

const defaultTransition: SlideTransition = {
  type: "fade",
  duration: 500,
  easing: "ease-in-out",
};

const getDefaultSlide = (order: number): Slide => ({
  id: uuidv4(),
  title: `Slide ${order + 1}`,
  content: "Enter your slide content here...",
  type: "announcement" as ContentType,
  order,
  transition: defaultTransition,
  backgroundColor: "#ffffff",
  textColor: "#000000",
  fontSize: 24,
  fontFamily: "Arial",
  textAlign: "center",
  duration: 5,
  notes: "",
  createdAt: new Date(),
  updatedAt: new Date(),
});

export function SlideManager({
  slides,
  onSlidesChange,
  className,
}: SlideManagerProps) {
  const [selectedSlide, setSelectedSlide] = useState<Slide | null>(null);
  const [showSlideEditor, setShowSlideEditor] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingSlide, setEditingSlide] = useState<Slide | null>(null);

  const handleAddSlide = () => {
    const newSlide = getDefaultSlide(slides.length);
    const updatedSlides = [...slides, newSlide];
    onSlidesChange(updatedSlides);
    setEditingSlide(newSlide);
    setIsEditing(false);
    setShowSlideEditor(true);
  };

  const handleEditSlide = (slide: Slide) => {
    setEditingSlide({ ...slide });
    setIsEditing(true);
    setShowSlideEditor(true);
  };

  const handleDuplicateSlide = (slide: Slide) => {
    const duplicatedSlide: Slide = {
      ...slide,
      id: uuidv4(),
      title: `${slide.title} (Copy)`,
      order: slides.length,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const updatedSlides = [...slides, duplicatedSlide];
    onSlidesChange(updatedSlides);
  };

  const handleDeleteSlide = (slideId: string) => {
    const updatedSlides = slides
      .filter((s) => s.id !== slideId)
      .map((s, index) => ({ ...s, order: index }));
    onSlidesChange(updatedSlides);
  };

  const handleMoveSlide = (slideId: string, direction: "up" | "down") => {
    const slideIndex = slides.findIndex((s) => s.id === slideId);
    if (
      (direction === "up" && slideIndex === 0) ||
      (direction === "down" && slideIndex === slides.length - 1)
    ) {
      return;
    }

    const newSlides = [...slides];
    const targetIndex = direction === "up" ? slideIndex - 1 : slideIndex + 1;

    // Swap slides
    [newSlides[slideIndex], newSlides[targetIndex]] = [
      newSlides[targetIndex],
      newSlides[slideIndex],
    ];

    // Update order property
    newSlides.forEach((slide, index) => {
      slide.order = index;
      slide.updatedAt = new Date();
    });

    onSlidesChange(newSlides);
  };

  const handleSaveSlide = () => {
    if (!editingSlide) return;

    editingSlide.updatedAt = new Date();

    if (isEditing) {
      const updatedSlides = slides.map((s) =>
        s.id === editingSlide.id ? editingSlide : s
      );
      onSlidesChange(updatedSlides);
    } else {
      // This case shouldn't happen as we handle new slides differently,
      // but keeping for safety
      const updatedSlides = [...slides, editingSlide];
      onSlidesChange(updatedSlides);
    }

    setShowSlideEditor(false);
    setEditingSlide(null);
  };

  const handleSlidePropertyChange = (property: keyof Slide, value: any) => {
    if (!editingSlide) return;
    setEditingSlide({
      ...editingSlide,
      [property]: value,
    });
  };

  const handleTransitionChange = (
    property: keyof SlideTransition,
    value: any
  ) => {
    if (!editingSlide) return;
    setEditingSlide({
      ...editingSlide,
      transition: {
        ...editingSlide.transition,
        [property]: value,
      } as SlideTransition,
    });
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-300">Slides</h3>
        <Button
          onClick={handleAddSlide}
          size="sm"
          className="bg-primary hover:bg-primary/90"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Slide
        </Button>
      </div>

      {slides.length === 0 ? (
        <div className="text-center py-8 border border-dashed border-gray-600 rounded-lg">
          <FileText className="h-12 w-12 mx-auto text-gray-500 mb-3" />
          <p className="text-gray-400 mb-4">No slides yet</p>
          <Button onClick={handleAddSlide} variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Create your first slide
          </Button>
        </div>
      ) : (
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {slides
            .sort((a, b) => a.order - b.order)
            .map((slide, index) => {
              const IconComponent = contentTypeIcons[slide.type] || FileText;
              return (
                <Card
                  key={slide.id}
                  className="bg-[#2D3748] border-[#4A5568] hover:border-[#718096] transition-colors"
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <IconComponent className="h-4 w-4 text-gray-400" />
                        <CardTitle className="text-sm text-gray-200">
                          {slide.title}
                        </CardTitle>
                        <span className="text-xs text-gray-500">
                          ({slide.type})
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleMoveSlide(slide.id, "up")}
                          disabled={index === 0}
                          className="h-6 w-6 text-gray-400 hover:text-gray-200"
                        >
                          <ChevronUp className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleMoveSlide(slide.id, "down")}
                          disabled={index === slides.length - 1}
                          className="h-6 w-6 text-gray-400 hover:text-gray-200"
                        >
                          <ChevronDown className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditSlide(slide)}
                          className="h-6 w-6 text-gray-400 hover:text-gray-200"
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDuplicateSlide(slide)}
                          className="h-6 w-6 text-gray-400 hover:text-gray-200"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteSlide(slide.id)}
                          className="h-6 w-6 text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-xs text-gray-400 line-clamp-2">
                      {slide.content}
                    </p>
                    <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                      <span>Duration: {slide.duration}s</span>
                      <span>Order: {slide.order + 1}</span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
        </div>
      )}

      {/* Slide Editor Dialog */}
      <Dialog open={showSlideEditor} onOpenChange={setShowSlideEditor}>
        <DialogContent className="bg-[#1A202C] border-[#4A5568] text-white max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Edit Slide" : "Create New Slide"}
            </DialogTitle>
          </DialogHeader>

          {editingSlide && (
            <div className="grid gap-6 py-4">
              {/* Basic Properties */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="slide-title">Title</Label>
                  <Input
                    id="slide-title"
                    value={editingSlide.title}
                    onChange={(e) =>
                      handleSlidePropertyChange("title", e.target.value)
                    }
                    className="bg-[#2D3748] border-[#4A5568]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slide-type">Type</Label>
                  <Select
                    value={editingSlide.type}
                    onValueChange={(value) =>
                      handleSlidePropertyChange("type", value)
                    }
                  >
                    <SelectTrigger className="bg-[#2D3748] border-[#4A5568]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#2D3748] border-[#4A5568]">
                      <SelectItem value="song">Song</SelectItem>
                      <SelectItem value="announcement">Announcement</SelectItem>
                      <SelectItem value="image">Image</SelectItem>
                      <SelectItem value="video">Video</SelectItem>
                      <SelectItem value="presentation">Presentation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Content */}
              <div className="space-y-2">
                <Label htmlFor="slide-content">Content</Label>
                <Textarea
                  id="slide-content"
                  value={editingSlide.content}
                  onChange={(e) =>
                    handleSlidePropertyChange("content", e.target.value)
                  }
                  className="bg-[#2D3748] border-[#4A5568] min-h-[120px]"
                  placeholder="Enter your slide content..."
                />
              </div>

              {/* Styling Properties */}
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="background-color">Background Color</Label>
                  <Input
                    id="background-color"
                    type="color"
                    value={editingSlide.backgroundColor || "#ffffff"}
                    onChange={(e) =>
                      handleSlidePropertyChange(
                        "backgroundColor",
                        e.target.value
                      )
                    }
                    className="bg-[#2D3748] border-[#4A5568] h-10"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="text-color">Text Color</Label>
                  <Input
                    id="text-color"
                    type="color"
                    value={editingSlide.textColor || "#000000"}
                    onChange={(e) =>
                      handleSlidePropertyChange("textColor", e.target.value)
                    }
                    className="bg-[#2D3748] border-[#4A5568] h-10"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="font-size">Font Size</Label>
                  <Input
                    id="font-size"
                    type="number"
                    min="8"
                    max="72"
                    value={editingSlide.fontSize || 24}
                    onChange={(e) =>
                      handleSlidePropertyChange(
                        "fontSize",
                        parseInt(e.target.value)
                      )
                    }
                    className="bg-[#2D3748] border-[#4A5568]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="font-family">Font Family</Label>
                  <Select
                    value={editingSlide.fontFamily || "Arial"}
                    onValueChange={(value) =>
                      handleSlidePropertyChange("fontFamily", value)
                    }
                  >
                    <SelectTrigger className="bg-[#2D3748] border-[#4A5568]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#2D3748] border-[#4A5568]">
                      <SelectItem value="Arial">Arial</SelectItem>
                      <SelectItem value="Helvetica">Helvetica</SelectItem>
                      <SelectItem value="Times New Roman">
                        Times New Roman
                      </SelectItem>
                      <SelectItem value="Georgia">Georgia</SelectItem>
                      <SelectItem value="Verdana">Verdana</SelectItem>
                      <SelectItem value="Trebuchet MS">Trebuchet MS</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="text-align">Text Alignment</Label>
                  <Select
                    value={editingSlide.textAlign || "center"}
                    onValueChange={(value) =>
                      handleSlidePropertyChange("textAlign", value)
                    }
                  >
                    <SelectTrigger className="bg-[#2D3748] border-[#4A5568]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#2D3748] border-[#4A5568]">
                      <SelectItem value="left">Left</SelectItem>
                      <SelectItem value="center">Center</SelectItem>
                      <SelectItem value="right">Right</SelectItem>
                      <SelectItem value="justify">Justify</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Timing and Transition */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (seconds)</Label>
                  <Input
                    id="duration"
                    type="number"
                    min="1"
                    max="300"
                    value={editingSlide.duration || 5}
                    onChange={(e) =>
                      handleSlidePropertyChange(
                        "duration",
                        parseInt(e.target.value)
                      )
                    }
                    className="bg-[#2D3748] border-[#4A5568]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="transition-type">Transition</Label>
                  <Select
                    value={editingSlide.transition?.type || "fade"}
                    onValueChange={(value) =>
                      handleTransitionChange("type", value)
                    }
                  >
                    <SelectTrigger className="bg-[#2D3748] border-[#4A5568]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#2D3748] border-[#4A5568]">
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="fade">Fade</SelectItem>
                      <SelectItem value="slide">Slide</SelectItem>
                      <SelectItem value="zoom">Zoom</SelectItem>
                      <SelectItem value="flip">Flip</SelectItem>
                      <SelectItem value="cube">Cube</SelectItem>
                      <SelectItem value="dissolve">Dissolve</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Speaker Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes">Speaker Notes</Label>
                <Textarea
                  id="notes"
                  value={editingSlide.notes || ""}
                  onChange={(e) =>
                    handleSlidePropertyChange("notes", e.target.value)
                  }
                  className="bg-[#2D3748] border-[#4A5568] min-h-[80px]"
                  placeholder="Add speaker notes for this slide..."
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowSlideEditor(false)}
              className="border-[#4A5568] hover:bg-[#4A5568]"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveSlide}
              className="bg-primary hover:bg-primary/90"
            >
              {isEditing ? "Save Changes" : "Create Slide"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
