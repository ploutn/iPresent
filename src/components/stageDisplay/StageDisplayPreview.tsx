import React, { useEffect, useRef, useState } from "react";
import {
  StageDisplayTemplate,
  StageDisplayElement,
} from "@/types/stageDisplay";
import { Slide } from "@/types";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Maximize2, Minimize2, RefreshCw, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

interface StageDisplayPreviewProps {
  template?: StageDisplayTemplate;
  currentSlide?: Slide;
  nextSlide?: Slide;
  speakerNotes?: string;
  isPresenting?: boolean;
  presentationTime?: number;
  onConfigChange?: (template: StageDisplayTemplate) => void;
  className?: string;
}

export function StageDisplayPreview({
  template,
  currentSlide,
  nextSlide,
  speakerNotes,
  isPresenting = false,
  presentationTime = 0,
  onConfigChange,
  className,
}: StageDisplayPreviewProps) {
  const previewRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [scale, setScale] = useState(1);

  // Handle fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  // Handle resize and scaling
  useEffect(() => {
    const handleResize = () => {
      if (previewRef.current) {
        const container = previewRef.current.parentElement;
        if (container) {
          const containerWidth = container.clientWidth;
          const containerHeight = container.clientHeight;
          const aspectRatio = 16 / 9;

          let newScale = 1;
          if (containerWidth / containerHeight > aspectRatio) {
            newScale = containerHeight / 1080; // Height is limiting factor
          } else {
            newScale = containerWidth / 1920; // Width is limiting factor
          }

          setScale(Math.min(newScale, 1)); // Don't scale up beyond 1
        }
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement && previewRef.current) {
      try {
        await previewRef.current.requestFullscreen();
      } catch (error) {
        console.error("Error attempting to enable fullscreen:", error);
      }
    } else if (document.fullscreenElement) {
      try {
        await document.exitFullscreen();
      } catch (error) {
        console.error("Error attempting to exit fullscreen:", error);
      }
    }
  };

  const openInSecondScreen = () => {
    if (window.electronAPI) {
      window.electronAPI.openPresentationWindow();
    }
  };

  const renderElement = (element: StageDisplayElement) => {
    if (!element.isVisible) return null;

    const elementStyle: React.CSSProperties = {
      position: "absolute",
      left: `${element.x}px`,
      top: `${element.y}px`,
      width: `${element.width}px`,
      height: `${element.height}px`,
      ...element.style,
    };

    switch (element.type) {
      case "currentSlide":
        return (
          <div key={element.id} style={elementStyle}>
            {currentSlide && (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor:
                    currentSlide.backgroundColor || "transparent",
                  color: currentSlide.textColor || "inherit",
                  fontSize: currentSlide.fontSize || "inherit",
                  fontFamily: currentSlide.fontFamily || "inherit",
                  textAlign: currentSlide.textAlign || "center",
                }}
              >
                {currentSlide.content}
              </div>
            )}
          </div>
        );

      case "nextSlide":
        return (
          <div key={element.id} style={elementStyle}>
            {nextSlide && (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: nextSlide.backgroundColor || "transparent",
                  color: nextSlide.textColor || "inherit",
                  fontSize: nextSlide.fontSize || "inherit",
                  fontFamily: nextSlide.fontFamily || "inherit",
                  textAlign: nextSlide.textAlign || "center",
                }}
              >
                {nextSlide.content}
              </div>
            )}
          </div>
        );

      case "speakerNotes":
        return (
          <div key={element.id} style={elementStyle}>
            {speakerNotes && (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  padding: "1rem",
                  backgroundColor: "rgba(0, 0, 0, 0.8)",
                  color: "white",
                  fontSize: "1.2rem",
                  overflow: "auto",
                }}
              >
                {speakerNotes}
              </div>
            )}
          </div>
        );

      case "timer":
        return (
          <div key={element.id} style={elementStyle}>
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "2rem",
                fontWeight: "bold",
              }}
            >
              {formatTime(presentationTime)}
            </div>
          </div>
        );

      case "clock":
        return (
          <div key={element.id} style={elementStyle}>
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "2rem",
                fontWeight: "bold",
              }}
            >
              {new Date().toLocaleTimeString()}
            </div>
          </div>
        );

      case "customText":
        return (
          <div key={element.id} style={elementStyle}>
            {element.text}
          </div>
        );

      default:
        return null;
    }
  };

  // If no template is provided, show a placeholder
  if (!template) {
    return (
      <Card
        ref={previewRef}
        className={cn(
          "relative overflow-hidden bg-black",
          isFullscreen ? "w-screen h-screen" : "w-full aspect-video",
          className
        )}
      >
        <div className="absolute inset-0 flex items-center justify-center text-white/50">
          <p>No template selected</p>
        </div>
      </Card>
    );
  }

  return (
    <Card
      ref={previewRef}
      className={cn(
        "relative overflow-hidden bg-black",
        isFullscreen ? "w-screen h-screen" : "w-full aspect-video",
        className
      )}
      style={{
        transform: `scale(${scale})`,
        transformOrigin: "top left",
      }}
    >
      {/* Background */}
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: template.backgroundColor || "black",
          backgroundImage: template.backgroundImage
            ? `url(${template.backgroundImage})`
            : "none",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* Elements */}
      {template.elements.map(renderElement)}

      {/* Controls */}
      <div className="absolute bottom-4 right-4 flex gap-2">
        <Button
          variant="secondary"
          size="icon"
          onClick={openInSecondScreen}
          className="bg-black/50 hover:bg-black/70"
          title="Open in second screen"
        >
          <ExternalLink className="h-4 w-4" />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          onClick={toggleFullscreen}
          className="bg-black/50 hover:bg-black/70"
        >
          {isFullscreen ? (
            <Minimize2 className="h-4 w-4" />
          ) : (
            <Maximize2 className="h-4 w-4" />
          )}
        </Button>
        <Button
          variant="secondary"
          size="icon"
          onClick={() => window.location.reload()}
          className="bg-black/50 hover:bg-black/70"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
}

function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  }
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}
