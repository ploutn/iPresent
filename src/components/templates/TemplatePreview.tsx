// src/components/templates/TemplatePreview.tsx
import React, { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Badge } from "../ui/badge";
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  RotateCcw,
  Maximize2,
  Download,
  Copy,
  Check,
} from "lucide-react";
import { PresentationTemplate, Slide } from "../../types";

export interface TemplatePreviewProps {
  template: PresentationTemplate | null;
  isOpen: boolean;
  onClose: () => void;
  onUseTemplate?: (template: PresentationTemplate) => void;
  onDuplicateTemplate?: (template: PresentationTemplate) => void;
  className?: string;
}

export function TemplatePreview({
  template,
  isOpen,
  onClose,
  onUseTemplate,
  onDuplicateTemplate,
  className = "",
}: TemplatePreviewProps) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (!template) return null;

  const currentSlide = template.slides[currentSlideIndex];
  const totalSlides = template.slides.length;

  const nextSlide = () => {
    setCurrentSlideIndex((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlideIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const goToSlide = (index: number) => {
    setCurrentSlideIndex(index);
  };

  const resetPreview = () => {
    setCurrentSlideIndex(0);
    setIsPlaying(false);
  };

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };

  const handleUseTemplate = () => {
    onUseTemplate?.(template);
    onClose();
  };

  const handleDuplicateTemplate = () => {
    onDuplicateTemplate?.(template);
  };

  // Auto-advance slides when playing
  React.useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      nextSlide();
    }, template.settings.defaultSlideDuration * 1000);

    return () => clearInterval(interval);
  }, [isPlaying, currentSlideIndex, template.settings.defaultSlideDuration]);

  const renderSlidePreview = (
    slide: Slide,
    index: number,
    isActive: boolean = false
  ) => (
    <div
      key={index}
      className={`${
        isActive ? "ring-2 ring-primary" : "ring-1 ring-border"
      } rounded-lg overflow-hidden cursor-pointer transition-all duration-200 hover:ring-primary/50`}
      onClick={() => goToSlide(index)}
    >
      <div
        className="aspect-video flex items-center justify-center p-4 text-center"
        style={{
          backgroundColor: slide.backgroundColor || "#ffffff",
          color: slide.textColor || "#000000",
          fontSize: "12px",
          fontFamily: slide.fontFamily || "Inter",
        }}
      >
        <div>
          <div className="font-semibold mb-1">{slide.title}</div>
          <div className="text-xs opacity-75">
            {slide.content?.substring(0, 50)}
            {slide.content && slide.content.length > 50 ? "..." : ""}
          </div>
        </div>
      </div>
      <div className="p-2 bg-muted text-xs text-center">Slide {index + 1}</div>
    </div>
  );

  const renderMainSlide = () => (
    <div
      className="w-full aspect-video rounded-lg overflow-hidden shadow-lg flex items-center justify-center p-8 text-center transition-all duration-300"
      style={{
        backgroundColor: currentSlide.backgroundColor || "#ffffff",
        color: currentSlide.textColor || "#000000",
        fontSize: `${(currentSlide.fontSize || 24) * 0.8}px`,
        fontFamily: currentSlide.fontFamily || "Inter",
        textAlign: currentSlide.textAlign || "center",
      }}
    >
      <div className="max-w-4xl">
        <h1 className="font-bold mb-4 leading-tight">{currentSlide.title}</h1>
        {currentSlide.content && (
          <div className="opacity-90 whitespace-pre-line leading-relaxed">
            {currentSlide.content}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl">{template.name}</DialogTitle>
              <DialogDescription className="mt-1">
                {template.description}
              </DialogDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{template.category}</Badge>
              <Badge variant="outline">
                {totalSlides} slide{totalSlides !== 1 ? "s" : ""}
              </Badge>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* Main slide preview */}
          <div className="relative">
            {renderMainSlide()}

            {/* Slide navigation overlay */}
            <div className="absolute inset-0 flex items-center justify-between p-4 opacity-0 hover:opacity-100 transition-opacity duration-200">
              <Button
                variant="secondary"
                size="sm"
                onClick={prevSlide}
                disabled={totalSlides <= 1}
                className="bg-black/20 hover:bg-black/40 text-white border-0"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={nextSlide}
                disabled={totalSlides <= 1}
                className="bg-black/20 hover:bg-black/40 text-white border-0"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Slide counter */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
              <Badge
                variant="secondary"
                className="bg-black/20 text-white border-0"
              >
                {currentSlideIndex + 1} / {totalSlides}
              </Badge>
            </div>
          </div>

          {/* Playback controls */}
          <div className="flex items-center justify-center gap-2">
            <Button variant="outline" size="sm" onClick={resetPreview}>
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={togglePlayback}
              disabled={totalSlides <= 1}
            >
              {isPlaying ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsFullscreen(true)}
            >
              <Maximize2 className="h-4 w-4" />
            </Button>
          </div>

          {/* Slide thumbnails */}
          {totalSlides > 1 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Slides</h4>
              <div className="grid grid-cols-6 gap-2 max-h-32 overflow-y-auto">
                {template.slides.map((slide, index) =>
                  renderSlidePreview(slide, index, index === currentSlideIndex)
                )}
              </div>
            </div>
          )}

          {/* Template info */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <div>
              <h4 className="text-sm font-medium mb-2">Template Details</h4>
              <div className="space-y-1 text-sm text-muted-foreground">
                <div>Category: {template.category}</div>
                <div>Slides: {totalSlides}</div>
                <div>Aspect Ratio: {template.settings.aspectRatio}</div>
                <div>
                  Default Transition: {template.settings.defaultTransition.type}
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium mb-2">Tags</h4>
              <div className="flex flex-wrap gap-1">
                {template.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleDuplicateTemplate}>
              <Copy className="h-4 w-4 mr-2" />
              Duplicate
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button onClick={handleUseTemplate}>
              <Check className="h-4 w-4 mr-2" />
              Use This Template
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>

      {/* Fullscreen preview */}
      {isFullscreen && (
        <Dialog open={isFullscreen} onOpenChange={setIsFullscreen}>
          <DialogContent className="max-w-full max-h-full w-screen h-screen p-0 bg-black">
            <div className="relative w-full h-full flex items-center justify-center">
              <div
                className="w-full h-full flex items-center justify-center p-16 text-center"
                style={{
                  backgroundColor: currentSlide.backgroundColor || "#ffffff",
                  color: currentSlide.textColor || "#000000",
                  fontSize: `${currentSlide.fontSize || 24}px`,
                  fontFamily: currentSlide.fontFamily || "Inter",
                  textAlign: currentSlide.textAlign || "center",
                }}
              >
                <div className="max-w-6xl">
                  <h1 className="font-bold mb-8 leading-tight">
                    {currentSlide.title}
                  </h1>
                  {currentSlide.content && (
                    <div className="opacity-90 whitespace-pre-line leading-relaxed text-lg">
                      {currentSlide.content}
                    </div>
                  )}
                </div>
              </div>

              {/* Fullscreen controls */}
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-4 bg-black/50 rounded-lg p-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={prevSlide}
                  disabled={totalSlides <= 1}
                  className="text-white hover:bg-white/20"
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <Badge
                  variant="secondary"
                  className="bg-white/20 text-white border-0"
                >
                  {currentSlideIndex + 1} / {totalSlides}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={nextSlide}
                  disabled={totalSlides <= 1}
                  className="text-white hover:bg-white/20"
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsFullscreen(false)}
                  className="text-white hover:bg-white/20 ml-4"
                >
                  Exit Fullscreen
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </Dialog>
  );
}
