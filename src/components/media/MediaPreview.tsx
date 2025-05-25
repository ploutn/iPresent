import React, { useState, useRef, useEffect } from "react";
import {
  X,
  Play,
  Pause,
  Volume2,
  VolumeX,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Download,
  Trash2,
} from "lucide-react";
import { MediaItem } from "../../stores/useMediaStore";
import { Button } from "../ui/button";
import { Slider } from "../ui/slider";
import { formatFileSize, formatDuration } from "../../utils/formatters";

interface MediaPreviewProps {
  media: MediaItem;
  isOpen: boolean;
  onClose: () => void;
  onDelete?: (id: string) => void;
}

export const MediaPreview: React.FC<MediaPreviewProps> = ({
  media,
  isOpen,
  onClose,
  onDelete,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const mediaRef = media.type === "video" ? videoRef : audioRef;

  useEffect(() => {
    if (!isOpen) {
      setIsPlaying(false);
      setCurrentTime(0);
      setZoom(1);
      setRotation(0);
      setPosition({ x: 0, y: 0 });
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case "Escape":
          onClose();
          break;
        case " ":
          e.preventDefault();
          togglePlayPause();
          break;
        case "ArrowLeft":
          if (mediaRef?.current) {
            mediaRef.current.currentTime = Math.max(
              0,
              mediaRef.current.currentTime - 10
            );
          }
          break;
        case "ArrowRight":
          if (mediaRef?.current) {
            mediaRef.current.currentTime = Math.min(
              duration,
              mediaRef.current.currentTime + 10
            );
          }
          break;
        case "+":
        case "=":
          if (media.type === "image") {
            setZoom((prev) => Math.min(5, prev + 0.25));
          }
          break;
        case "-":
          if (media.type === "image") {
            setZoom((prev) => Math.max(0.25, prev - 0.25));
          }
          break;
        case "r":
          if (media.type === "image") {
            setRotation((prev) => (prev + 90) % 360);
          }
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, duration, media.type, onClose]);

  const togglePlayPause = () => {
    if (!mediaRef?.current) return;

    if (isPlaying) {
      mediaRef.current.pause();
    } else {
      mediaRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    if (mediaRef?.current) {
      mediaRef.current.volume = newVolume;
    }
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    if (!mediaRef?.current) return;

    const newMuted = !isMuted;
    setIsMuted(newMuted);
    mediaRef.current.muted = newMuted;
  };

  const handleTimeUpdate = () => {
    if (mediaRef?.current) {
      setCurrentTime(mediaRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (mediaRef?.current) {
      setDuration(mediaRef.current.duration);
    }
  };

  const handleSeek = (value: number[]) => {
    const newTime = value[0];
    setCurrentTime(newTime);
    if (mediaRef?.current) {
      mediaRef.current.currentTime = newTime;
    }
  };

  const handleImageMouseDown = (e: React.MouseEvent) => {
    if (media.type !== "image") return;

    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleImageMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || media.type !== "image") return;

    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleImageMouseUp = () => {
    setIsDragging(false);
  };

  const resetImageTransform = () => {
    setZoom(1);
    setRotation(0);
    setPosition({ x: 0, y: 0 });
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = media.url;
    link.download = media.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = () => {
    if (
      onDelete &&
      confirm(`Are you sure you want to delete "${media.name}"?`)
    ) {
      onDelete(media.id);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/50 to-transparent p-4">
        <div className="flex items-center justify-between text-white">
          <div className="flex-1">
            <h2 className="text-lg font-semibold truncate">{media.name}</h2>
            <p className="text-sm text-gray-300">
              {media.type.toUpperCase()} • {formatFileSize(media.size)}
              {media.metadata.duration &&
                ` • ${formatDuration(media.metadata.duration)}`}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDownload}
              className="text-white hover:bg-white/20"
            >
              <Download className="h-4 w-4" />
            </Button>
            {onDelete && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                className="text-white hover:bg-red-500/20"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-white/20"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Media Content */}
      <div
        ref={containerRef}
        className="flex-1 flex items-center justify-center p-16"
        onMouseMove={handleImageMouseMove}
        onMouseUp={handleImageMouseUp}
        onMouseLeave={handleImageMouseUp}
      >
        {media.type === "image" && (
          <div className="relative">
            <img
              ref={imageRef}
              src={media.url}
              alt={media.name}
              className="max-w-full max-h-full object-contain cursor-move"
              style={{
                transform: `scale(${zoom}) rotate(${rotation}deg) translate(${position.x}px, ${position.y}px)`,
                transition: isDragging ? "none" : "transform 0.2s ease",
              }}
              onMouseDown={handleImageMouseDown}
              draggable={false}
            />
          </div>
        )}

        {media.type === "video" && (
          <video
            ref={videoRef}
            src={media.url}
            className="max-w-full max-h-full"
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />
        )}

        {media.type === "audio" && (
          <div className="flex flex-col items-center gap-4 text-white">
            <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <Volume2 className="h-16 w-16" />
            </div>
            <h3 className="text-xl font-semibold">{media.name}</h3>
            <audio
              ref={audioRef}
              src={media.url}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />
          </div>
        )}
      </div>

      {/* Controls */}
      {(media.type === "video" || media.type === "audio") && (
        <div className="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black/50 to-transparent p-4">
          <div className="flex items-center gap-4 text-white">
            {/* Play/Pause */}
            <Button
              variant="ghost"
              size="sm"
              onClick={togglePlayPause}
              className="text-white hover:bg-white/20"
            >
              {isPlaying ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
            </Button>

            {/* Progress */}
            <div className="flex-1 flex items-center gap-2">
              <span className="text-xs">{formatDuration(currentTime)}</span>
              <Slider
                value={[currentTime]}
                max={duration}
                step={0.1}
                onValueChange={handleSeek}
                className="flex-1"
              />
              <span className="text-xs">{formatDuration(duration)}</span>
            </div>

            {/* Volume */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleMute}
                className="text-white hover:bg-white/20"
              >
                {isMuted ? (
                  <VolumeX className="h-4 w-4" />
                ) : (
                  <Volume2 className="h-4 w-4" />
                )}
              </Button>
              <Slider
                value={[volume]}
                max={1}
                step={0.01}
                onValueChange={handleVolumeChange}
                className="w-20"
              />
            </div>
          </div>
        </div>
      )}

      {/* Image Controls */}
      {media.type === "image" && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
          <div className="flex items-center gap-2 bg-black/50 rounded-lg p-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setZoom((prev) => Math.max(0.25, prev - 0.25))}
              className="text-white hover:bg-white/20"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-white text-sm px-2">
              {Math.round(zoom * 100)}%
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setZoom((prev) => Math.min(5, prev + 0.25))}
              className="text-white hover:bg-white/20"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setRotation((prev) => (prev + 90) % 360)}
              className="text-white hover:bg-white/20"
            >
              <RotateCw className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={resetImageTransform}
              className="text-white hover:bg-white/20"
            >
              Reset
            </Button>
          </div>
        </div>
      )}

      {/* Metadata Panel */}
      <div className="absolute top-16 right-4 w-80 bg-black/70 backdrop-blur-sm rounded-lg p-4 text-white text-sm">
        <h3 className="font-semibold mb-3">Media Information</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-300">Type:</span>
            <span>{media.type.toUpperCase()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Size:</span>
            <span>{formatFileSize(media.size)}</span>
          </div>
          {media.metadata.duration && (
            <div className="flex justify-between">
              <span className="text-gray-300">Duration:</span>
              <span>{formatDuration(media.metadata.duration)}</span>
            </div>
          )}
          {media.metadata.dimensions && (
            <div className="flex justify-between">
              <span className="text-gray-300">Dimensions:</span>
              <span>
                {media.metadata.dimensions.width} ×{" "}
                {media.metadata.dimensions.height}
              </span>
            </div>
          )}
          {media.metadata.format && (
            <div className="flex justify-between">
              <span className="text-gray-300">Format:</span>
              <span>{media.metadata.format.toUpperCase()}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-gray-300">Added:</span>
            <span>{new Date(media.createdAt).toLocaleDateString()}</span>
          </div>
          {media.tags.length > 0 && (
            <div>
              <span className="text-gray-300">Tags:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {media.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
