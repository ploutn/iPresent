import React from "react";
import { Play, Music, FileImage, File, Check } from "lucide-react";
import { MediaItem } from "../../stores/useMediaStore";
import { cn } from "../../lib/utils";
import { LazyImage } from "./LazyImage";
import { LazyVideo } from "./LazyVideo";

interface MediaThumbnailProps {
  media: MediaItem;
  isSelected?: boolean;
  onSelect?: () => void;
  onPreview?: () => void;
  size?: "sm" | "md" | "lg";
  className?: string;
  showPlayIcon?: boolean;
}

export const MediaThumbnail: React.FC<MediaThumbnailProps> = ({
  media,
  isSelected = false,
  onSelect,
  onPreview,
  size = "md",
  className,
  showPlayIcon = false,
}) => {
  const renderThumbnail = () => {
    switch (media.type) {
      case "image":
        return (
          <div className="relative w-full h-full">
            {media.thumbnailUrl || media.url ? (
              <LazyImage
                src={media.thumbnailUrl || media.url}
                alt={media.title}
                className="w-full h-full object-cover"
                fallbackIcon={<FileImage className="w-8 h-8 text-gray-400" />}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                <FileImage className="w-8 h-8 text-gray-400" />
              </div>
            )}
          </div>
        );

      case "video":
        return (
          <div className="relative w-full h-full">
            {media.thumbnailUrl ? (
              <LazyVideo
                src={media.url}
                thumbnailSrc={media.thumbnailUrl}
                alt={media.title}
                className="w-full h-full object-cover"
                showPlayIcon={showPlayIcon || !!media.duration}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                <Play className="w-8 h-8 text-gray-400" />
              </div>
            )}
            {media.duration && (
              <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                {formatDuration(media.duration)}
              </div>
            )}
          </div>
        );

      case "audio":
        return (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900 dark:to-blue-900">
            <div className="text-center">
              <Music className="w-8 h-8 mx-auto mb-1 text-purple-600 dark:text-purple-400" />
              <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                {media.originalName.split(".").pop()?.toUpperCase()}
              </div>
              {media.duration && (
                <div className="text-xs text-gray-500 dark:text-gray-500">
                  {formatDuration(media.duration)}
                </div>
              )}
            </div>
          </div>
        );

      default:
        return (
          <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
            <File className="w-8 h-8 text-gray-400" />
          </div>
        );
    }
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div
      className={cn(
        "relative group cursor-pointer rounded-lg overflow-hidden border-2 transition-all duration-200",
        isSelected
          ? "border-blue-500 ring-2 ring-blue-200"
          : "border-gray-200 hover:border-gray-300",
        "hover:shadow-lg",
        className
      )}
      onClick={onSelect}
      onDoubleClick={onPreview}
    >
      {renderThumbnail()}

      {/* Overlay with controls */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 flex items-center justify-center">
        {/* Selection checkbox */}
        {onSelect && (
          <div
            className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            onClick={(e) => {
              e.stopPropagation();
              onSelect();
            }}
          >
            <div className="w-5 h-5 rounded border-2 border-white bg-white/20 backdrop-blur-sm flex items-center justify-center">
              {isSelected && <Check className="h-3 w-3 text-white" />}
            </div>
          </div>
        )}

        {/* Preview hint */}
        {onPreview && (
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div className="bg-black/50 text-white px-2 py-1 rounded text-xs">
              Double-click to preview
            </div>
          </div>
        )}
      </div>

      {/* File type indicator */}
      <div className="absolute top-1 left-1">
        <div className="bg-black bg-opacity-50 text-white text-xs px-1 rounded">
          {media.type.charAt(0).toUpperCase()}
        </div>
      </div>
    </div>
  );
};
