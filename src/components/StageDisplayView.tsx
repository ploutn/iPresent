// src/components/StageDisplayView.tsx
import React, { useState, useEffect, useRef } from "react";
import { useStageDisplay } from "../hooks/useStageDisplay";
import { useOutputManagement } from "../hooks/useOutputManagement";
import { ContentItem, Slide } from "../types";
import {
  StageDisplayElement,
  StageDisplayConfig,
  StageDisplayTemplate,
} from "../types/stageDisplay";

const defaultStageDisplayTemplate: StageDisplayTemplate = {
  id: "default-empty-template",
  name: "Default Empty Template",
  elements: [],
  backgroundColor: "#000000",
  backgroundImage: "",
};
import { StageDisplayPreview } from "./stageDisplay/StageDisplayPreview";
import { StageDisplayConfigPanel } from "./stageDisplay/StageDisplayConfigPanel";
import { MultiScreenManager } from "./output/MultiScreenManager";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Monitor,
  Settings,
  Eye,
  Maximize,
  Minimize,
  RefreshCw,
  Clock,
  Timer,
  Users,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Calendar,
  Type,
} from "lucide-react";

interface StageDisplayViewProps {
  className?: string;
  currentSlide?: ContentItem | Slide | null;
  nextSlide?: ContentItem | Slide | null;
  speakerNotes?: string;
  isPresenting?: boolean;
  presentationTime?: number;
  mode?: "display" | "preview" | "config";
}

interface LiveDisplayData {
  currentTime: string;
  presentationTimer: string;
  participantCount: number;
  microphoneStatus: "on" | "off" | "muted";
  announcementText: string;
  customText: string;
  songLyrics: string;
  countdownTarget: Date | null;
}

function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }
  return `${minutes.toString().padStart(2, "0")}:${secs
    .toString()
    .padStart(2, "0")}`;
}

function formatCountdown(target: Date): string {
  const now = new Date();
  const diff = target.getTime() - now.getTime();

  if (diff <= 0) {
    return "00:00:00";
  }

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

// Helper function to check if item is a Slide
function isSlide(item: ContentItem | Slide | null | undefined): item is Slide {
  return (
    item !== null && item !== undefined && "content" in item && "order" in item
  );
}

// Helper function to check if item is a ContentItem
function isContentItem(
  item: ContentItem | Slide | null | undefined
): item is ContentItem {
  return (
    item !== null && item !== undefined && "type" in item && !("order" in item)
  );
}

export function StageDisplayView({
  className = "",
  currentSlide,
  nextSlide,
  speakerNotes,
  isPresenting = false,
  presentationTime = 0,
  mode = "display",
}: StageDisplayViewProps) {
  const {
    stageDisplayConfig,
    activeTemplate,
    setActiveTemplate,
    updateStageDisplayConfig,
    exportTemplate,
    importTemplate,
    setTargetDisplayId,
  } = useStageDisplay();
  const {
    screenState,
    outputSettings,
    toggleMainScreen,
    toggleOutputWindow,
    availableDisplays,
    updateOutputSettings,
    refreshDisplays,
  } = useOutputManagement();

  const templateToRender = activeTemplate || defaultStageDisplayTemplate;

  const [liveData, setLiveData] = useState<LiveDisplayData>({
    currentTime: new Date().toLocaleTimeString(),
    presentationTimer: formatTime(presentationTime),
    participantCount: 42,
    microphoneStatus: "on",
    announcementText: "Welcome to our presentation!",
    customText: "Custom display text",
    songLyrics:
      "Amazing grace, how sweet the sound\nThat saved a wretch like me",
    countdownTarget: new Date(Date.now() + 3600000), // 1 hour from now
  });

  const [isFullscreen, setIsFullscreen] = useState(false);
  const displayRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Update live data periodically
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setLiveData((prev) => ({
        ...prev,
        currentTime: new Date().toLocaleTimeString(),
        presentationTimer: formatTime(presentationTime),
      }));
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [presentationTime]);

  // Handle fullscreen mode
  const handleFullscreen = () => {
    if (!isFullscreen && displayRef.current) {
      displayRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else if (document.fullscreenElement) {
      document.exitFullscreen();
      setIsFullscreen(false);
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

  // Render element content based on type
  const renderElementContent = (element: StageDisplayElement) => {
    if (!element.isVisible) return null;

    let content: React.ReactNode = null;

    switch (element.type) {
      case "currentSlide":
        content = (
          <div className="w-full h-full flex flex-col p-2">
            {currentSlide && (
              <>
                <div className="font-bold text-lg mb-2 truncate">
                  {isSlide(currentSlide)
                    ? currentSlide.title
                    : currentSlide.title}
                </div>
                <div className="flex-1 overflow-auto">
                  {isSlide(currentSlide)
                    ? currentSlide.content
                    : currentSlide.content}
                </div>
              </>
            )}
          </div>
        );
        break;

      case "nextSlide":
        content = (
          <div className="w-full h-full flex flex-col p-2">
            <div className="text-sm opacity-75 mb-1">Next:</div>
            {nextSlide && (
              <>
                <div className="font-semibold truncate">
                  {isSlide(nextSlide) ? nextSlide.title : nextSlide.title}
                </div>
                <div className="flex-1 overflow-auto text-sm">
                  {isSlide(nextSlide) ? nextSlide.content : nextSlide.content}
                </div>
              </>
            )}
          </div>
        );
        break;

      case "clock":
        content = (
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            <span className="font-mono">{liveData.currentTime}</span>
          </div>
        );
        break;

      case "timer":
        content = (
          <div className="flex items-center gap-2">
            <Timer className="h-5 w-5" />
            <span className="font-mono">{liveData.presentationTimer}</span>
          </div>
        );
        break;

      case "speakerNotes":
        content = (
          <div className="w-full h-full p-2">
            <div className="text-sm opacity-75 mb-1">Notes:</div>
            <div className="overflow-auto text-sm">
              {speakerNotes || "No notes available"}
            </div>
          </div>
        );
        break;

      case "announcementBanner":
        content = (
          <div className="flex items-center gap-2 w-full p-2">
            <Volume2 className="h-5 w-5 flex-shrink-0" />
            <div className="flex-1 overflow-hidden">
              {element.text || liveData.announcementText}
            </div>
          </div>
        );
        break;

      case "customText":
        content = (
          <div className="w-full h-full flex items-center justify-center p-2">
            {element.text || liveData.customText}
          </div>
        );
        break;

      case "songLyrics":
        content = (
          <div className="w-full h-full flex flex-col justify-center p-2">
            <div className="text-center whitespace-pre-line">
              {element.text || liveData.songLyrics}
            </div>
          </div>
        );
        break;

      case "countdownTimer":
        content = (
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            <span className="font-mono">
              {liveData.countdownTarget
                ? formatCountdown(liveData.countdownTarget)
                : "00:00:00"}
            </span>
          </div>
        );
        break;

      case "participantCount":
        content = (
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            <span>{liveData.participantCount} participants</span>
          </div>
        );
        break;

      case "microphoneStatus":
        content = (
          <div className="flex items-center gap-2">
            {liveData.microphoneStatus === "on" && (
              <Mic className="h-5 w-5 text-green-500" />
            )}
            {liveData.microphoneStatus === "off" && (
              <MicOff className="h-5 w-5 text-red-500" />
            )}
            {liveData.microphoneStatus === "muted" && (
              <VolumeX className="h-5 w-5 text-yellow-500" />
            )}
            <span className="capitalize">{liveData.microphoneStatus}</span>
          </div>
        );
        break;

      default:
        content = (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Type className="h-4 w-4" />
            <span>{element.type}</span>
          </div>
        );
    }

    return content;
  };

  // Handle config updates
  const handleConfigUpdate = (updatedConfig: StageDisplayConfig) => {
    // Update the config through individual operations
    if (
      updatedConfig.activeTemplateId !== stageDisplayConfig.activeTemplateId
    ) {
      setActiveTemplate(updatedConfig.activeTemplateId);
    }

    // Update templates if changed
    const currentTemplate = stageDisplayConfig.templates.find(
      (t) => t.id === updatedConfig.activeTemplateId
    );
    const updatedTemplate = updatedConfig.templates.find(
      (t) => t.id === updatedConfig.activeTemplateId
    );

    if (
      currentTemplate &&
      updatedTemplate &&
      JSON.stringify(currentTemplate) !== JSON.stringify(updatedTemplate)
    ) {
      updateStageDisplayConfig({
        ...stageDisplayConfig,
        templates: stageDisplayConfig.templates.map((t) =>
          t.id === updatedTemplate.id ? updatedTemplate : t
        ),
      });
    }

    // Update other settings
    if (updatedConfig.isActive !== stageDisplayConfig.isActive) {
      updateStageDisplayConfig({
        ...stageDisplayConfig,
        isActive: updatedConfig.isActive,
      });
    }

    if (updatedConfig.targetDisplayId !== stageDisplayConfig.targetDisplayId) {
      setTargetDisplayId(updatedConfig.targetDisplayId || "");
    }
  };

  // Display mode - actual stage display output
  if (mode === "display") {
    if (!stageDisplayConfig.isActive || !activeTemplate) {
      return (
        <div
          className={`w-full h-full bg-black text-white flex items-center justify-center ${className}`}
        >
          <div className="text-center">
            <Monitor className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <p className="text-xl opacity-75">
              {!stageDisplayConfig.isActive
                ? "Stage Display Inactive"
                : "No Active Template"}
            </p>
          </div>
        </div>
      );
    }

    return (
      <div
        ref={displayRef}
        id="stage-display-container"
        className={`w-full h-full relative overflow-hidden ${className} ${
          isFullscreen ? "fixed inset-0 z-50" : ""
        }`}
        style={{ backgroundColor: activeTemplate.backgroundColor }}
      >
        {activeTemplate.elements.map((element) => {
          if (!element.isVisible) return null;

          const elementStyle: React.CSSProperties = {
            position: "absolute",
            left: `${element.x}px`,
            top: `${element.y}px`,
            width: `${element.width}px`,
            height: `${element.height}px`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            wordWrap: "break-word",
            ...element.style,
          };

          // Adjust justifyContent based on textAlign
          if (element.style?.textAlign) {
            elementStyle.justifyContent =
              element.style.textAlign === "center"
                ? "center"
                : element.style.textAlign === "right"
                ? "flex-end"
                : "flex-start";
          }

          return (
            <div key={element.id} style={elementStyle}>
              {renderElementContent(element)}
            </div>
          );
        })}

        {/* Fullscreen controls overlay */}
        {!isFullscreen && (
          <div className="absolute top-4 right-4 flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleFullscreen}
              className="bg-black/50 text-white hover:bg-black/70"
            >
              <Maximize className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    );
  }

  // Preview mode - enhanced preview with controls
  if (mode === "preview") {
    return (
      <div className={className}>
        <StageDisplayPreview
          template={templateToRender}
          currentSlide={currentSlide as Slide}
          nextSlide={nextSlide as Slide}
          speakerNotes={speakerNotes}
          isPresenting={isPresenting}
          presentationTime={presentationTime}
          onConfigChange={handleConfigUpdate}
        />
      </div>
    );
  }

  // Config mode - configuration interface
  if (mode === "config") {
    return (
      <div className={`w-full max-w-6xl mx-auto p-6 ${className}`}>
        <Tabs defaultValue="stage-display" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="stage-display">Stage Display</TabsTrigger>
            <TabsTrigger value="multi-screen">Multi-Screen</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>

          <TabsContent value="stage-display" className="space-y-6">
            <StageDisplayConfigPanel
              config={stageDisplayConfig}
              onConfigChange={handleConfigUpdate}
              exportTemplate={exportTemplate}
              importTemplate={importTemplate}
            />
          </TabsContent>

          <TabsContent value="multi-screen" className="space-y-6">
            <MultiScreenManager
              availableDisplays={availableDisplays}
              outputSettings={outputSettings}
              updateOutputSettings={updateOutputSettings}
              refreshDisplays={refreshDisplays}
            />
          </TabsContent>

          <TabsContent value="preview" className="space-y-6">
            <StageDisplayPreview
              template={templateToRender}
              currentSlide={currentSlide as Slide}
              nextSlide={nextSlide as Slide}
              speakerNotes={speakerNotes}
              isPresenting={isPresenting}
              presentationTime={presentationTime}
              onConfigChange={handleConfigUpdate}
            />
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  return null;
}
