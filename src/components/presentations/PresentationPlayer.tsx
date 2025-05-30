import React, { useState, useEffect, useCallback } from "react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import {
  Play,
  Pause,
  Square,
  SkipBack,
  SkipForward,
  Maximize,
  Minimize,
  Volume2,
  Settings,
  Clock,
} from "lucide-react";
import { usePresentationStore } from "../../store/presentationStore";
import type {
  PresentationContentItem,
  Slide,
  SlideMediaElement,
} from "../../types";

interface PresentationPlayerProps {
  presentation: PresentationContentItem;
  className?: string;
}

export function PresentationPlayer({
  presentation,
  className = "",
}: PresentationPlayerProps) {
  const {
    currentSlideIndex,
    isPlaying,
    isPaused,
    playbackSpeed,
    startPresentation,
    stopPresentation,
    pausePresentation,
    resumePresentation,
    nextSlide,
    previousSlide,
    goToSlide,
    setPlaybackSpeed,
  } = usePresentationStore();

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [autoAdvanceTimer, setAutoAdvanceTimer] =
    useState<NodeJS.Timeout | null>(null);

  const currentSlide = presentation.slides[currentSlideIndex] || null;
  const totalSlides = presentation.slides.length;

  // Auto-advance functionality
  useEffect(() => {
    if (
      isPlaying &&
      !isPaused &&
      currentSlide?.duration &&
      currentSlide.duration > 0
    ) {
      const timer = setTimeout(() => {
        if (currentSlideIndex < totalSlides - 1) {
          nextSlide();
        } else {
          stopPresentation();
        }
      }, (currentSlide.duration * 1000) / playbackSpeed);

      setAutoAdvanceTimer(timer);
      return () => clearTimeout(timer);
    }
  }, [
    isPlaying,
    isPaused,
    currentSlide,
    currentSlideIndex,
    totalSlides,
    playbackSpeed,
    nextSlide,
    stopPresentation,
  ]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      switch (event.key) {
        case " ":
        case "Enter":
          event.preventDefault();
          if (isPlaying) {
            isPaused ? resumePresentation() : pausePresentation();
          } else {
            startPresentation(presentation.id);
          }
          break;
        case "ArrowRight":
        case "ArrowDown":
          event.preventDefault();
          nextSlide();
          break;
        case "ArrowLeft":
        case "ArrowUp":
          event.preventDefault();
          previousSlide();
          break;
        case "Escape":
          event.preventDefault();
          if (isFullscreen) {
            exitFullscreen();
          } else {
            stopPresentation();
          }
          break;
        case "f":
        case "F":
          event.preventDefault();
          toggleFullscreen();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [isPlaying, isPaused, isFullscreen, presentation.id]);

  // Fullscreen functionality
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  const exitFullscreen = useCallback(() => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  // Handle fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  // Auto-hide controls in fullscreen
  useEffect(() => {
    if (isFullscreen) {
      const timer = setTimeout(() => setShowControls(false), 3000);
      return () => clearTimeout(timer);
    } else {
      setShowControls(true);
    }
  }, [isFullscreen, showControls]);

  const handlePlayPause = () => {
    if (isPlaying) {
      isPaused ? resumePresentation() : pausePresentation();
    } else {
      startPresentation(presentation.id);
    }
  };

  const handleStop = () => {
    stopPresentation();
    if (autoAdvanceTimer) {
      clearTimeout(autoAdvanceTimer);
      setAutoAdvanceTimer(null);
    }
  };

  const handleSlideClick = (index: number) => {
    goToSlide(index);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getSlideBackground = (slide: Slide) => {
    // If there's a background image specified directly on the slide, use it
    if (slide.backgroundImage) {
      return {
        backgroundImage: `url(${slide.backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      };
    }
    // Otherwise, use the background color
    return {
      backgroundColor: slide.backgroundColor || "#ffffff",
    };
  };

  const renderMediaElements = (mediaElements: SlideMediaElement[]) => {
    return mediaElements
      .sort((a, b) => a.layer - b.layer)
      .map((media) => {
        const style: React.CSSProperties = {
          position: "absolute",
          left: `${media.position.x}%`,
          top: `${media.position.y}%`,
          width: media.size ? `${media.size.width}%` : "auto",
          height: media.size ? `${media.size.height}%` : "auto",
          opacity: media.opacity,
          zIndex: media.layer,
          objectFit: "contain",
        };

        if (media.type === "image") {
          return (
            <img
              key={media.id}
              src={media.url}
              alt={media.name}
              style={style}
            />
          );
        } else if (media.type === "video") {
          return (
            <video
              key={media.id}
              src={media.url}
              style={style}
              autoPlay={media.playback?.autoplay}
              loop={media.playback?.loop}
              muted={media.playback?.volume === 0}
              volume={media.playback?.volume}
            />
          );
        } else if (media.type === "audio") {
          return (
            <audio
              key={media.id}
              src={media.url}
              autoPlay={media.playback?.autoplay}
              loop={media.playback?.loop}
              muted={media.playback?.volume === 0}
              volume={media.playback?.volume}
              style={{ display: "none" }} // Audio elements are not visible
            />
          );
        }
        return null;
      });
  };

  const getSlideTextStyle = (slide: Slide) => {
    return {
      color: slide.textColor || "#000000",
      fontSize: `${slide.fontSize || 24}px`,
      fontFamily: slide.fontFamily || "Arial",
      textAlign: slide.textAlign || ("center" as const),
    };
  };

  return (
    <div
      className={`presentation-player ${className} ${
        isFullscreen ? "fixed inset-0 z-50 bg-black" : "relative"
      }`}
      onMouseMove={() => isFullscreen && setShowControls(true)}
    >
      {/* Main Slide Display */}
      <div
        className={`slide-display ${
          isFullscreen ? "h-full" : "aspect-video bg-gray-900"
        } relative overflow-hidden`}
      >
        {currentSlide ? (
          <div
            className="w-full h-full flex items-center justify-center p-8 overflow-hidden"
            style={getSlideBackground(currentSlide)}
          >
            {currentSlide.mediaElements &&
              renderMediaElements(currentSlide.mediaElements)}
            <div
              className="max-w-4xl text-center relative z-10"
              style={getSlideTextStyle(currentSlide)}
            >
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                {currentSlide.title}
              </h1>
              {currentSlide.content && (
                <div className="text-xl md:text-3xl leading-relaxed whitespace-pre-wrap">
                  {currentSlide.content}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-800 text-white">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">{presentation.title}</h2>
              <p className="text-gray-300 mb-6">{presentation.description}</p>
              <Button onClick={handlePlayPause} size="lg">
                <Play className="h-6 w-6 mr-2" />
                Start Presentation
              </Button>
            </div>
          </div>
        )}

        {/* Slide Transition Overlay */}
        {isPlaying && currentSlide?.transition && (
          <div className="absolute inset-0 pointer-events-none transition-opacity duration-500" />
        )}
      </div>

      {/* Controls */}
      {showControls && (
        <div
          className={`controls ${
            isFullscreen ? "absolute bottom-0 left-0 right-0" : "mt-4"
          } bg-black bg-opacity-75 text-white p-4`}
        >
          <div className="flex items-center justify-between">
            {/* Playback Controls */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={previousSlide}
                disabled={currentSlideIndex === 0}
                className="text-white hover:bg-white hover:bg-opacity-20"
              >
                <SkipBack className="h-4 w-4" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={handlePlayPause}
                className="text-white hover:bg-white hover:bg-opacity-20"
              >
                {isPlaying && !isPaused ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleStop}
                className="text-white hover:bg-white hover:bg-opacity-20"
              >
                <Square className="h-4 w-4" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={nextSlide}
                disabled={currentSlideIndex >= totalSlides - 1}
                className="text-white hover:bg-white hover:bg-opacity-20"
              >
                <SkipForward className="h-4 w-4" />
              </Button>
            </div>

            {/* Slide Progress */}
            <div className="flex items-center gap-4">
              <span className="text-sm">
                {currentSlideIndex + 1} / {totalSlides}
              </span>

              {currentSlide?.duration && (
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm">
                    {formatTime(currentSlide.duration)}
                  </span>
                </div>
              )}
            </div>

            {/* Additional Controls */}
            <div className="flex items-center gap-2">
              <select
                value={playbackSpeed}
                onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
                className="bg-transparent border border-gray-500 rounded px-2 py-1 text-sm"
              >
                <option value={0.5}>0.5x</option>
                <option value={1}>1x</option>
                <option value={1.5}>1.5x</option>
                <option value={2}>2x</option>
              </select>

              <Button
                variant="ghost"
                size="sm"
                onClick={toggleFullscreen}
                className="text-white hover:bg-white hover:bg-opacity-20"
              >
                {isFullscreen ? (
                  <Minimize className="h-4 w-4" />
                ) : (
                  <Maximize className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Slide Thumbnails */}
          {!isFullscreen && (
            <div className="mt-4 flex gap-2 overflow-x-auto">
              {presentation.slides.map((slide, index) => (
                <button
                  key={slide.id}
                  onClick={() => handleSlideClick(index)}
                  className={`flex-shrink-0 w-20 h-12 rounded border-2 overflow-hidden ${
                    index === currentSlideIndex
                      ? "border-blue-500"
                      : "border-gray-500 hover:border-gray-300"
                  }`}
                >
                  <div
                    className="w-full h-full flex items-center justify-center text-xs p-1"
                    style={{
                      backgroundColor: slide.backgroundColor || "#ffffff",
                      color: slide.textColor || "#000000",
                    }}
                  >
                    {slide.title}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Speaker Notes (only visible when not in fullscreen) */}
      {!isFullscreen && currentSlide?.notes && (
        <Card className="mt-4">
          <CardContent className="p-4">
            <h4 className="font-semibold mb-2">Speaker Notes:</h4>
            <p className="text-sm text-gray-600 whitespace-pre-wrap">
              {currentSlide.notes}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
