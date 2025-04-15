// src/components/StageDisplayPreview.tsx
import React from "react";
import {
  StageDisplayTemplate,
  StageDisplayElement,
} from "../types/stageDisplay";
import { ContentItem, Slide } from "../types";

interface StageDisplayPreviewProps {
  template: StageDisplayTemplate;
  currentSlide?: ContentItem | Slide | null;
  nextSlide?: ContentItem | Slide | null;
  className?: string;
}

export function StageDisplayPreview({
  template,
  currentSlide,
  nextSlide,
  className = "",
}: StageDisplayPreviewProps) {
  // Format the current time for clock elements
  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Render the content for each element based on its type
  const renderElementContent = (element: StageDisplayElement) => {
    switch (element.type) {
      case "currentSlide":
        return (
          <div className="text-center h-full flex flex-col justify-center">
            {currentSlide ? (
              <>
                <div className="text-xs mb-1 opacity-70">Current Slide</div>
                <div className="overflow-hidden">{currentSlide.title}</div>
              </>
            ) : (
              <>
                <div className="text-xs mb-1 opacity-70">Current Slide</div>
                <div>No slide selected</div>
              </>
            )}
          </div>
        );

      case "nextSlide":
        return (
          <div className="text-center h-full flex flex-col justify-center">
            {nextSlide ? (
              <>
                <div className="text-xs mb-1 opacity-70">Next Slide</div>
                <div className="overflow-hidden">{nextSlide.title}</div>
              </>
            ) : (
              <>
                <div className="text-xs mb-1 opacity-70">Next Slide</div>
                <div>No next slide</div>
              </>
            )}
          </div>
        );

      case "clock":
        return (
          <div className="text-center font-mono h-full flex items-center justify-center">
            {getCurrentTime()}
          </div>
        );

      case "timer":
        return (
          <div className="text-center font-mono h-full flex items-center justify-center">
            05:00
          </div>
        );

      case "customText":
        return (
          <div className="h-full flex items-center justify-center overflow-hidden">
            {element.content}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div
      className={`relative aspect-video bg-black rounded-md overflow-hidden ${className}`}
    >
      {template.elements.map((element) => (
        <div
          key={element.id}
          className="absolute overflow-hidden"
          style={{
            left: `${element.x}%`,
            top: `${element.y}%`,
            width: `${element.width}%`,
            height: `${element.height}%`,
            backgroundColor: element.backgroundColor || "rgba(0, 0, 0, 0.5)",
            color: element.fontColor || "#ffffff",
            fontSize: `${element.fontSize || 16}px`,
            borderRadius: `${element.borderRadius || 0}px`,
            zIndex: element.zIndex || 0,
            border: "1px solid rgba(255, 255, 255, 0.2)",
          }}
        >
          <div className="w-full h-full p-2 overflow-hidden">
            {renderElementContent(element)}
          </div>
        </div>
      ))}
    </div>
  );
}
