// src/components/PresentationView.tsx
import React, { useState, useEffect, useCallback, useRef } from "react";
import { ContentItem, Slide, Media, Song } from "../../types";
import { StageDisplayView } from "../StageDisplayView";
import { useStageDisplay } from "../../hooks/useStageDisplay";
import { useContentStore } from "../../stores/useContentStore";
import {
  SlideTransitionRenderer,
  useSlideTransitions,
} from "../transitions/SlideTransitionRenderer";
import { usePresentationStore } from "../../store/presentationStore";

interface PresentationViewProps {
  className?: string;
}

export function PresentationView({ className = "" }: PresentationViewProps) {
  const { selectedItem, items } = useContentStore();
  const { stageDisplayConfig } = useStageDisplay();
  const { currentPresentation } = usePresentationStore();
  const [nextItem, setNextItem] = useState<ContentItem | null>(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const presentationRef = useRef<HTMLDivElement>(null);
  const {
    isTransitioning,
    startTransition,
    completeTransition,
    clearTransitionQueue,
  } = useSlideTransitions();

  // Handle slide navigation for presentations
  useEffect(() => {
    if (currentPresentation?.slides) {
      const slides = currentPresentation.slides;
      if (currentSlideIndex < slides.length - 1) {
        setNextItem(slides[currentSlideIndex + 1]);
      } else {
        setNextItem(null);
      }
    } else if (selectedItem && items.length > 1) {
      const currentIndex = items.findIndex(
        (item) => item.id === selectedItem.id
      );
      if (currentIndex !== -1 && currentIndex < items.length - 1) {
        setNextItem(items[currentIndex + 1]);
      } else {
        setNextItem(null);
      }
    } else {
      setNextItem(null);
    }
  }, [selectedItem, items, currentPresentation, currentSlideIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (!currentPresentation?.slides) return;

      switch (event.key) {
        case "ArrowRight":
        case " ": // Spacebar
          event.preventDefault();
          nextSlide();
          break;
        case "ArrowLeft":
          event.preventDefault();
          previousSlide();
          break;
        case "Escape":
          event.preventDefault();
          exitFullscreen();
          break;
        case "f":
        case "F11":
          event.preventDefault();
          toggleFullscreen();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [currentPresentation, currentSlideIndex]);

  const nextSlide = useCallback(() => {
    if (!currentPresentation?.slides) return;

    const slides = currentPresentation.slides;
    if (currentSlideIndex < slides.length - 1) {
      const nextSlideData = slides[currentSlideIndex + 1];
      startTransition(nextSlideData);
    }
  }, [currentPresentation, currentSlideIndex, startTransition]);

  const previousSlide = useCallback(() => {
    if (!currentPresentation?.slides) return;

    if (currentSlideIndex > 0) {
      setCurrentSlideIndex((prev) => prev - 1);
      clearTransitionQueue();
    }
  }, [currentSlideIndex, clearTransitionQueue]);

  const handleTransitionComplete = useCallback(() => {
    setCurrentSlideIndex((prev) => prev + 1);
    completeTransition();
  }, [completeTransition]);

  const toggleFullscreen = useCallback(async () => {
    if (!presentationRef.current) return;

    try {
      if (!document.fullscreenElement) {
        await presentationRef.current.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (error) {
      console.error("Fullscreen error:", error);
    }
  }, []);

  const exitFullscreen = useCallback(async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (error) {
      console.error("Exit fullscreen error:", error);
    }
  }, []);

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  // Determine current content to display
  const currentContent =
    currentPresentation?.slides?.[currentSlideIndex] || selectedItem;
  const nextContent =
    currentPresentation?.slides?.[currentSlideIndex + 1] || nextItem;

  if (!currentContent) {
    return (
      <div
        className={`h-full flex items-center justify-center bg-background text-muted-foreground ${className}`}
      >
        <p className="text-2xl font-medium">No Content Selected</p>
        <div className="mt-4 text-sm opacity-75">
          <p>Press F11 or 'f' for fullscreen</p>
          <p>Use arrow keys or spacebar to navigate slides</p>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (selectedItem.type) {
      case "image": {
        const mediaItem = selectedItem as Media;
        return (
          <img
            src={mediaItem.url}
            alt={mediaItem.title}
            className="max-h-full max-w-full object-contain"
          />
        );
      }

      case "video": {
        const mediaItem = selectedItem as Media;
        return (
          <video
            src={mediaItem.url}
            controls
            autoPlay
            className="max-h-full max-w-full"
          />
        );
      }

      case "song": {
        const songItem = selectedItem as Song;
        return (
          <div className="p-8 max-h-full overflow-auto">
            <h2 className="text-3xl font-semibold mb-4">{songItem.title}</h2>
            <p className="text-xl text-muted-foreground mb-6">
              By {songItem.author}
            </p>
            <pre className="whitespace-pre-wrap font-sans text-2xl leading-relaxed">
              {songItem.lyrics}
            </pre>
          </div>
        );
      }

      default:
        return (
          <div className="p-8 max-h-full overflow-auto">
            <h2 className="text-3xl font-semibold mb-6">
              {selectedItem.title}
            </h2>
            <div className="whitespace-pre-wrap text-2xl leading-relaxed">
              {selectedItem.content}
            </div>
          </div>
        );
    }
  };

  return (
    <div
      ref={presentationRef}
      className={`relative ${className} ${isFullscreen ? "bg-black" : ""}`}
    >
      {/* Main Presentation Area */}
      {currentPresentation?.slides ? (
        // Slide-based presentation with transitions
        <SlideTransitionRenderer
          currentSlide={currentContent as Slide}
          nextSlide={nextContent as Slide}
          isTransitioning={isTransitioning}
          onTransitionComplete={handleTransitionComplete}
          className="h-full"
        />
      ) : (
        // Legacy content display
        <div
          id="presentation-container"
          className="h-full flex items-center justify-center bg-background"
        >
          {renderContent()}
        </div>
      )}

      {/* Presentation Controls (only in non-fullscreen mode) */}
      {!isFullscreen && currentPresentation?.slides && (
        <div className="absolute bottom-4 left-4 flex items-center space-x-2 bg-black/50 rounded-lg p-2">
          <button
            onClick={previousSlide}
            disabled={currentSlideIndex === 0}
            className="px-3 py-1 bg-white/20 hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed rounded text-white text-sm"
          >
            Previous
          </button>
          <span className="text-white text-sm px-2">
            {currentSlideIndex + 1} / {currentPresentation.slides.length}
          </span>
          <button
            onClick={nextSlide}
            disabled={
              currentSlideIndex === currentPresentation.slides.length - 1
            }
            className="px-3 py-1 bg-white/20 hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed rounded text-white text-sm"
          >
            Next
          </button>
          <button
            onClick={toggleFullscreen}
            className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded text-white text-sm"
          >
            Fullscreen
          </button>
        </div>
      )}

      {/* Fullscreen Controls */}
      {isFullscreen && (
        <div className="absolute top-4 right-4 flex items-center space-x-2 bg-black/50 rounded-lg p-2">
          <span className="text-white text-sm px-2">
            {currentSlideIndex + 1} / {currentPresentation?.slides?.length || 1}
          </span>
          <button
            onClick={exitFullscreen}
            className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded text-white text-sm"
          >
            Exit (ESC)
          </button>
        </div>
      )}

      {/* Stage Display Preview (only shown when stage display is active and not in fullscreen) */}
      {stageDisplayConfig.isActive && !isFullscreen && (
        <div className="absolute bottom-4 right-4 w-1/4 shadow-lg">
          <StageDisplayView
            currentSlide={currentContent}
            nextSlide={nextContent}
          />
        </div>
      )}
    </div>
  );
}
