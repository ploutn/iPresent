import React, { useState, useEffect } from "react";
import { useContentStore } from "../stores/useContentStore";
import {
  ContentItem,
  Media,
  Song,
  Announcement,
  Slide as GenericSlideType,
  PresentationContentItem,
} from "../types";
import { StageDisplayView } from "../components/StageDisplayView";

const OutputWindow: React.FC = () => {
  const { selectedItem, items, currentPresentationSlideIndex } =
    useContentStore();

  const [displayCurrent, setDisplayCurrent] = useState<
    ContentItem | GenericSlideType | null
  >(null);
  const [displayNext, setDisplayNext] = useState<
    ContentItem | GenericSlideType | null
  >(null);

  useEffect(() => {
    if (selectedItem && selectedItem.type === "presentation") {
      const presItem = selectedItem as PresentationContentItem;
      if (
        presItem.slides &&
        currentPresentationSlideIndex !== null &&
        currentPresentationSlideIndex >= 0 &&
        currentPresentationSlideIndex < presItem.slides.length
      ) {
        setDisplayCurrent(presItem.slides[currentPresentationSlideIndex]);
        if (currentPresentationSlideIndex + 1 < presItem.slides.length) {
          setDisplayNext(presItem.slides[currentPresentationSlideIndex + 1]);
        } else {
          setDisplayNext(null); // No more internal slides
        }
      } else {
        // Presentation item, but no slides or invalid index, show presentation shell or nothing
        setDisplayCurrent(presItem); // Or null, or a placeholder slide
        setDisplayNext(null);
      }
    } else if (selectedItem) {
      // Not a presentation, or selectedItem is null initially
      setDisplayCurrent(selectedItem);
      // Calculate next item from the main list for non-presentation items
      if (items.length > 1) {
        const currentIndex = items.findIndex(
          (item) => item.id === selectedItem.id
        );
        if (currentIndex !== -1 && currentIndex < items.length - 1) {
          setDisplayNext(items[currentIndex + 1]);
        } else {
          setDisplayNext(null);
        }
      } else {
        setDisplayNext(null);
      }
    } else {
      // No selected item at all
      setDisplayCurrent(null);
      setDisplayNext(null);
    }
  }, [selectedItem, items, currentPresentationSlideIndex]);

  if (
    !displayCurrent &&
    !(selectedItem && selectedItem.type === "presentation")
  ) {
    // Show "no content" if not a presentation being processed
    if (!selectedItem) {
      return (
        <div className="flex items-center justify-center h-screen bg-black text-white">
          <p className="text-2xl">No content selected for output.</p>
        </div>
      );
    }
  }

  const renderContent = () => {
    const item = selectedItem as ContentItem;

    switch (item.type) {
      case "image":
      case "video": {
        const mediaItem = item as Media;
        return mediaItem.type === "image" ? (
          <img
            src={mediaItem.url}
            alt={mediaItem.title}
            className="max-h-screen max-w-screen object-contain"
          />
        ) : (
          <video
            src={mediaItem.url}
            controls
            autoPlay // Autoplay for presentation output
            className="max-h-screen max-w-screen"
          />
        );
      }
      case "song": {
        const songItem = item as Song;
        return (
          <div className="p-10 h-screen w-screen flex flex-col items-center justify-center bg-black text-white text-center overflow-auto">
            <h3 className="text-5xl font-semibold mb-6">{songItem.title}</h3>
            <p className="text-3xl text-gray-300 mb-6">By {songItem.author}</p>
            <pre className="whitespace-pre-wrap font-sans text-4xl leading-relaxed">
              {songItem.lyrics}
            </pre>
          </div>
        );
      }
      case "announcement": {
        const announcementItem = item as Announcement;
        return (
          <div className="p-10 h-screen w-screen flex flex-col items-center justify-center bg-black text-white text-center overflow-auto">
            {announcementItem.title && (
              <h3 className="text-5xl font-semibold mb-6">
                {announcementItem.title}
              </h3>
            )}
            {announcementItem.content &&
              announcementItem.content !== "No description available." && (
                <p className="whitespace-pre-wrap text-4xl leading-relaxed mt-4">
                  {announcementItem.content}
                </p>
              )}
            {!announcementItem.title &&
              (!announcementItem.content ||
                announcementItem.content === "No description available.") && (
                <p className="text-3xl text-gray-400">
                  Presentation content not fully loaded.
                </p>
              )}
          </div>
        );
      }
      default:
        // console.warn(`OutputWindow: Unhandled content type: ${item.type}`);
        return (
          <div className="flex items-center justify-center h-screen bg-black text-white">
            <p className="text-2xl">Unsupported content type for output.</p>
          </div>
        );
    }
  };

  return (
    <div className="h-screen w-screen bg-black">
      <StageDisplayView
        currentSlide={displayCurrent}
        nextSlide={displayNext}
        className="w-full h-full"
      />
    </div>
  );
};

export default OutputWindow;
