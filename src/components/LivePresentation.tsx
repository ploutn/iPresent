// components/LivePresentation.tsx
import React, { useState, useRef, useEffect } from "react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Timer,
  Maximize2,
  Minimize2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "./ui/button";
import { useContentStore } from "../stores/useContentStore";
import { Slider } from "./ui/slider";
import { cn } from "../lib/utils";
import { Media, Song } from "../types";

export function LivePresentation() {
  const { liveQueue, selectedItem } = useContentStore();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        setIsPlaying(!isPlaying);
      } else if (e.code === "ArrowLeft") {
        handlePrevious();
      } else if (e.code === "ArrowRight") {
        handleNext();
      } else if (e.code === "KeyM") {
        setIsMuted(!isMuted);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [isPlaying, isMuted]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = volume;
      videoRef.current.muted = isMuted;
    }
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.muted = isMuted;
    }
  }, [volume, isMuted]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const toggleFullscreen = () => {
    const liveElement = document.getElementById("live-container");
    if (!document.fullscreenElement && liveElement) {
      liveElement.requestFullscreen().then(() => {
        setIsFullscreen(true);
      });
    } else if (document.fullscreenElement) {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      });
    }
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
  };

  const handlePrevious = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(
        0,
        videoRef.current.currentTime - 5
      );
    }
  };

  const handleNext = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.min(
        duration,
        videoRef.current.currentTime + 5
      );
    }
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
    if (value[0] === 0) {
      setIsMuted(true);
    } else if (isMuted) {
      setIsMuted(false);
    }
  };

  const handleProgress = (value: number[]) => {
    if (videoRef.current) {
      videoRef.current.currentTime = value[0];
    }
  };

  const renderContent = () => {
    if (!selectedItem) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center p-4 bg-black text-white">
          <h2 className="text-lg font-semibold mb-4">LIVE</h2>
          <p className="text-sm text-gray-400 mb-3">Nothing is live</p>
          <Button
            variant="outline"
            className="text-xs bg-transparent border border-gray-800 text-gray-400 hover:bg-gray-800 h-8 px-3"
          >
            Start Presentation
          </Button>
        </div>
      );
    }

    return (
      <div className="w-full h-full flex flex-col">
        <div className="flex-1 relative">
          {/* Top Controls */}
          <div className="absolute top-0 left-0 right-0 p-2 flex justify-between items-center z-10 bg-gradient-to-b from-black/50 to-transparent">
            <div className="flex items-center gap-2">
              <div className="bg-black/50 px-2 py-1 rounded text-sm flex items-center gap-2">
                <Timer className="h-4 w-4" />
                <span>{formatTime(currentTime)}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 bg-black/50"
                  onClick={() => setShowVolumeSlider(!showVolumeSlider)}
                  onMouseEnter={() => setShowVolumeSlider(true)}
                >
                  {isMuted ? (
                    <VolumeX className="h-4 w-4" />
                  ) : (
                    <Volume2 className="h-4 w-4" />
                  )}
                </Button>
                {showVolumeSlider && (
                  <div
                    className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-2 bg-black/90 rounded-lg"
                    onMouseLeave={() => setShowVolumeSlider(false)}
                  >
                    <Slider
                      orientation="vertical"
                      value={[volume]}
                      max={1}
                      step={0.1}
                      className="h-24"
                      onValueChange={handleVolumeChange}
                    />
                  </div>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 bg-black/50"
                onClick={toggleFullscreen}
              >
                {isFullscreen ? (
                  <Minimize2 className="h-4 w-4" />
                ) : (
                  <Maximize2 className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="w-full h-full flex items-center justify-center">
            {(selectedItem as Media).type === "image" && (
              <img
                src={(selectedItem as Media).url}
                alt={selectedItem.title}
                className="max-w-full max-h-full object-contain"
              />
            )}
            {(selectedItem as Media).type === "video" && (
              <video
                ref={videoRef}
                src={(selectedItem as Media).url}
                className="max-w-full max-h-full"
                onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
                onTimeUpdate={(e) =>
                  setCurrentTime(e.currentTarget.currentTime)
                }
                onClick={handlePlayPause}
              />
            )}
            {(selectedItem as Song).type === "song" && (
              <div className="text-center max-w-3xl p-4">
                <h2 className="text-2xl font-bold mb-4">
                  {selectedItem.title}
                </h2>
                <pre className="whitespace-pre-wrap font-sans text-xl leading-relaxed">
                  {(selectedItem as Song).lyrics}
                </pre>
              </div>
            )}
          </div>

          {/* Playback Controls Overlay */}
          {(selectedItem as Media).type === "video" && (
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/50 to-transparent">
              <div className="flex flex-col gap-2">
                <Slider
                  value={[currentTime]}
                  max={duration}
                  step={0.1}
                  onValueChange={handleProgress}
                  className="w-full"
                />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={handlePrevious}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={handlePlayPause}
                    >
                      {isPlaying ? (
                        <Pause className="h-4 w-4" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={handleNext}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span>{formatTime(currentTime)}</span>
                    <span>/</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div
      id="live-container"
      className={cn(
        "flex flex-col h-full bg-black text-white",
        isFullscreen && "fixed inset-0 z-50"
      )}
    >
      {renderContent()}
    </div>
  );
}
