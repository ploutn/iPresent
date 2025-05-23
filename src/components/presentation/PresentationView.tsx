// src/components/PresentationView.tsx
import React, { useState, useEffect } from "react";
import { ContentItem, Slide, Media, Song } from "../../types";
import { StageDisplayView } from "../StageDisplayView";
import { useStageDisplay } from "../../hooks/useStageDisplay";
import { useContentStore } from "../../stores/useContentStore";

interface PresentationViewProps {
  className?: string;
}

export function PresentationView({ className = "" }: PresentationViewProps) {
  const { selectedItem, items } = useContentStore();
  const { stageDisplayConfig } = useStageDisplay();
  const [nextItem, setNextItem] = useState<ContentItem | null>(null);

  // Find the next item in the content list
  useEffect(() => {
    if (selectedItem && items.length > 1) {
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
  }, [selectedItem, items]);

  if (!selectedItem) {
    return (
      <div
        className={`h-full flex items-center justify-center bg-background text-muted-foreground ${className}`}
      >
        <p className="text-2xl font-medium">No Output Selected</p>
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
    <div className={`relative ${className}`}>
      <div
        id="presentation-container"
        className="h-full flex items-center justify-center bg-background"
      >
        {renderContent()}
      </div>

      {/* Stage Display Preview (only shown when stage display is active) */}
      {stageDisplayConfig.isActive && (
        <div className="absolute bottom-4 right-4 w-1/4 shadow-lg">
          <StageDisplayView currentSlide={selectedItem} nextSlide={nextItem} />
        </div>
      )}
    </div>
  );
}
