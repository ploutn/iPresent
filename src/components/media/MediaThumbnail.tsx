import React from "react";
import { Play, Music, FileImage, File, Check } from "lucide-react";
import { MediaItem } from "../../stores/useMediaStore";
import { cn } from "../../lib/utils";

interface MediaThumbnailProps {
  media: MediaItem;
  isSelected?: boolean;
  onSelect?: () => void;
  onPreview?: () => void;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const MediaThumbnail: React.FC<MediaThumbnailProps> = ({
  media,
  isSelected = false,
  onSelect,
  onPreview,
  size = "md",
  className,
}) => {
  const renderThumbnail = () => {
    switch (media.type) {
      case "image":
        return (
          <div className="relative w-full h-full">
            {media.thumbnailUrl || media.url ? (
              <img
                src={media.thumbnailUrl || media.url}
                alt={media.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback to default image icon if thumbnail fails to load
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                  const parent = target.parentElement;
                  if (parent) {
                    parent.innerHTML = `
                      <div class="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                        <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                      </div>
                    `;
                  }
                }}
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
              <img
                src={media.thumbnailUrl}
                alt={media.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback to video icon if thumbnail fails to load
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                  const parent = target.parentElement;
                  if (parent) {
                    parent.innerHTML = `
                      <div class="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                        <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                        </svg>
                      </div>
                    `;
                  }
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                <div className="text-center">
                  <div className="w-8 h-8 mx-auto mb-1 flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                      ></path>
                    </svg>
                  </div>
                </div>
              </div>
            )}

            {/* Play icon overlay for videos */}
            {showPlayIcon && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-black bg-opacity-50 rounded-full p-2">
                  <Play className="w-6 h-6 text-white fill-white" />
                </div>
              </div>
            )}

            {/* Duration overlay */}
            {media.duration && (
              <div className="absolute bottom-1 right-1 bg-black bg-opacity-75 text-white text-xs px-1 rounded">
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
