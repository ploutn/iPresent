// components/Preview.tsx
import React from "react";
import { useContentStore } from "../stores/useContentStore";
import { ContentItem, Song, Media, Announcement } from "../types"; // Updated imports

export function Preview() {
  const { selectedItem } = useContentStore();

  if (!selectedItem) {
    return (
      <div className="flex flex-col h-full">
        <div className="p-6 border-b border-[#2D2D2D]">
          <h2 className="text-lg font-semibold">PREVIEW</h2>
        </div>
        <div className="flex-1 flex items-center justify-center text-slate-400">
          <p>No output selected</p>
        </div>
      </div>
    );
  }

  const renderSelectedItemContent = () => {
    const item = selectedItem as ContentItem;

    switch (item.type) {
      case "image":
      case "video": {
        const mediaItem = item as Media;
        return mediaItem.type === "image" ? (
          <img
            src={mediaItem.url}
            alt={mediaItem.title}
            className="max-h-full max-w-full object-contain rounded-lg shadow-sm"
          />
        ) : (
          <video
            src={mediaItem.url}
            controls
            className="max-h-full max-w-full rounded-lg shadow-sm"
          />
        );
      }
      case "song": {
        const songItem = item as Song;
        return (
          <div className="p-6 max-h-full overflow-auto bg-background rounded-lg shadow-sm border">
            <h3 className="text-2xl font-semibold mb-4">{songItem.title}</h3>
            <p className="text-lg text-muted-foreground mb-4">
              By {songItem.author}
            </p>
            <pre className="whitespace-pre-wrap font-sans text-lg">
              {songItem.lyrics}
            </pre>
          </div>
        );
      }
      case "announcement": {
        const announcementItem = item as Announcement;
        return (
          <div className="p-6 max-h-full overflow-auto bg-background rounded-lg shadow-sm border">
            <h3 className="text-2xl font-semibold mb-4">
              {announcementItem.title}
            </h3>
            <p className="whitespace-pre-wrap text-lg">
              {announcementItem.content}
            </p>
          </div>
        );
      }
      default:
        // console.warn(`Preview: Unhandled content type: ${item.type}`);
        return null; // Mirroring PreviewArea.tsx behavior for unhandled types
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-[#2D2D2D]">
        <h2 className="text-lg font-semibold">PREVIEW</h2>
      </div>
      {/* Content area styling adjusted to mirror PreviewArea.tsx */}
      <div className="flex-1 flex items-center justify-center bg-background">
        {renderSelectedItemContent()}
      </div>
    </div>
  );
}
