// src/components/StageDisplayView.tsx
import React, { useEffect, useState } from "react";
import { StageDisplayPreview } from "./StageDisplayPreview";
import { useStageDisplay } from "../hooks/useStageDisplay";
import { ContentItem, Slide } from "../types";
import { useContentStore } from "../stores/useContentStore";

interface StageDisplayViewProps {
  className?: string;
  currentSlide?: ContentItem | Slide | null;
  nextSlide?: ContentItem | Slide | null;
}

export function StageDisplayView({
  className = "",
  currentSlide,
  nextSlide,
}: StageDisplayViewProps) {
  const { stageDisplayConfig, activeTemplate } = useStageDisplay();
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Handle fullscreen toggling
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      const element = document.getElementById("stage-display-container");
      if (element) {
        element.requestFullscreen().catch((err) => {
          console.error(
            `Error attempting to enable fullscreen: ${err.message}`
          );
        });
      }
    } else {
      document.exitFullscreen();
    }
  };

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  // If stage display is not active, don't render anything
  if (!stageDisplayConfig.isActive) {
    return null;
  }

  return (
    <div
      id="stage-display-container"
      className={`${className} ${
        isFullscreen ? "fixed inset-0 z-50 bg-black" : ""
      }`}
    >
      <StageDisplayPreview
        template={activeTemplate}
        currentSlide={currentSlide}
        nextSlide={nextSlide}
        className={isFullscreen ? "w-full h-full" : ""}
      />

      {!isFullscreen && (
        <div className="mt-2 flex justify-end">
          <button
            onClick={toggleFullscreen}
            className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Fullscreen
          </button>
        </div>
      )}
    </div>
  );
}
