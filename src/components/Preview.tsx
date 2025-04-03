// components/Preview.tsx
import React, { useState, useEffect, useRef } from "react";
import { useContentStore } from "../stores/useContentStore";
import { ContentItem, Song, Media } from "../types";
import { Button } from "./ui/button";
import {
  Maximize2,
  Minimize2,
  X,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  Timer,
  Volume2,
  VolumeX,
  ExternalLink,
} from "lucide-react";
import { Slider } from "./ui/slider";
import { cn } from "../lib/utils";

export function Preview() {
  const { selectedItem, setSelectedItem } = useContentStore();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [transition, setTransition] = useState("fade");
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

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
    const previewElement = document.getElementById("preview-container");
    if (!document.fullscreenElement && previewElement) {
      previewElement.requestFullscreen().then(() => {
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

  const openPresentation = () => {
    const presentationWindow = window.open(
      "",
      "_blank",
      "width=1024,height=768"
    );
    if (presentationWindow && selectedItem) {
      presentationWindow.document.write(`
        <html>
          <head>
            <title>Preview - ${selectedItem.title}</title>
            <style>
              body {
                margin: 0;
                padding: 0;
                background: black;
                color: white;
                font-family: system-ui;
                overflow: hidden;
                display: flex;
                align-items: center;
                justify-content: center;
                height: 100vh;
              }
              img, video {
                max-width: 100%;
                max-height: 100vh;
                object-fit: contain;
              }
              .content {
                padding: 2rem;
                max-width: 80%;
                text-align: center;
              }
              h1 {
                font-size: 2.5rem;
                margin-bottom: 1rem;
              }
              pre {
                white-space: pre-wrap;
                font-family: inherit;
                font-size: 1.5rem;
                line-height: 1.5;
              }
              .timer {
                position: fixed;
                top: 20px;
                right: 20px;
                font-size: 1.5rem;
                background: rgba(0, 0, 0, 0.5);
                padding: 0.5rem 1rem;
                border-radius: 4px;
              }
              .controls {
                position: fixed;
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%);
                display: flex;
                gap: 1rem;
                background: rgba(0, 0, 0, 0.5);
                padding: 0.5rem;
                border-radius: 4px;
              }
              button {
                background: transparent;
                border: 1px solid rgba(255, 255, 255, 0.2);
                color: white;
                padding: 0.5rem 1rem;
                border-radius: 4px;
                cursor: pointer;
                font-size: 0.875rem;
              }
              button:hover {
                background: rgba(255, 255, 255, 0.1);
              }
              .transition-fade { transition: opacity 0.5s ease-in-out; }
              .transition-slide { transition: transform 0.5s ease-in-out; }
              .transition-zoom { transition: transform 0.5s ease-in-out; }
            </style>
          </head>
          <body>
            <div class="timer" id="timer">00:00</div>
            <div class="content" id="presentation-content"></div>
            <div class="controls">
              <button onclick="window.close()">Close</button>
              <button onclick="document.documentElement.requestFullscreen()">Fullscreen</button>
            </div>
          </body>
        </html>
      `);

      const contentElement = presentationWindow.document.getElementById(
        "presentation-content"
      );
      if (contentElement) {
        if ((selectedItem as Media).type === "image") {
          const img = presentationWindow.document.createElement("img");
          img.src = (selectedItem as Media).url;
          img.alt = selectedItem.title;
          contentElement.appendChild(img);
        } else if ((selectedItem as Media).type === "video") {
          const video = presentationWindow.document.createElement("video");
          video.src = (selectedItem as Media).url;
          video.controls = true;
          video.autoplay = true;
          contentElement.appendChild(video);
        } else if ((selectedItem as Song).type === "song") {
          const title = presentationWindow.document.createElement("h1");
          title.textContent = selectedItem.title;

          const lyrics = presentationWindow.document.createElement("pre");
          lyrics.textContent = (selectedItem as Song).lyrics;

          contentElement.appendChild(title);
          contentElement.appendChild(lyrics);
        }
      }
    }
  };

  if (!selectedItem) {
    return (
      <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-background rounded-lg">
        <p className="text-sm font-medium">No Output Selected</p>
      </div>
    );
  }

  const renderContent = () => {
    return (
      <div className="w-full h-full flex flex-col">
        <div className="flex-1 relative">
          {/* Top Controls */}
          <div className="absolute top-0 left-0 right-0 p-2 flex justify-between items-center z-10 bg-gradient-to-b from-black/50 to-transparent">
            <div className="flex items-center gap-2">
              <div className="bg-black/50 px-2 py-1 rounded text-sm flex items-center gap-2">
                <Timer className="h-4 w-4" />
                <span>{formatTime(timer)}</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 bg-black/50"
                onClick={() => setIsTimerRunning(!isTimerRunning)}
              >
                {isTimerRunning ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={transition}
                onChange={(e) => setTransition(e.target.value)}
                className="bg-black/50 text-white text-sm rounded px-2 py-1 border border-white/10"
              >
                <option value="fade">Fade</option>
                <option value="slide">Slide</option>
                <option value="zoom">Zoom</option>
              </select>
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
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 bg-black/50"
                onClick={openPresentation}
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 bg-black/50"
                onClick={() => setSelectedItem(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="w-full h-full flex items-center justify-center">
            {(selectedItem as Media).type === "image" && (
              <img
                src={(selectedItem as Media).url}
                alt={selectedItem.title}
                className={cn(
                  "max-w-full max-h-full object-contain",
                  transition === "fade" && "transition-opacity duration-500",
                  transition === "slide" && "transition-transform duration-500",
                  transition === "zoom" && "transition-transform duration-500"
                )}
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
      id="preview-container"
      className={cn(
        "flex flex-col h-full bg-black text-white",
        isFullscreen && "fixed inset-0 z-50"
      )}
    >
      {renderContent()}
    </div>
  );
}
