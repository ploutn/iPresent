import React, { useState, useEffect, useRef } from "react";
// Consolidate and use consistent paths (e.g., @/ aliased paths if configured)
import {
  StageDisplayConfig,
  // StageDisplayTemplate, // Not directly used as a prop type here, but part of StageDisplayConfig
  StageDisplayElement,
  StageDisplayElementType, // Make sure this is imported if you use it for explicit typing
} from "@/types/stageDisplay"; // Assuming @/types is your alias for src/types
import { Slide, MediaElement } from "@/types";

import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import {
  Monitor,
  Play,
  Pause,
  Square,
  Maximize,
  Minimize,
  RefreshCw,
  Settings,
  Eye,
  EyeOff,
  Clock,
  Timer,
  Volume2,
  Mic,
  Users,
  Calendar,
  MessageSquare,
  FileText,
  Music,
  Type,
  MicOff, // Ensure this is imported
  VolumeX, // Ensure this is imported (Lucide's mute icon is often VolumeX or VolumeMute)
} from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";

// Removed duplicate imports that caused 'Duplicate identifier' errors

interface StageDisplayPreviewProps {
  config: StageDisplayConfig;
  currentSlide?: Slide;
  nextSlide?: Slide;
  speakerNotes?: string;
  isPresenting: boolean;
  presentationTime: number;
  onConfigChange: (config: StageDisplayConfig) => void;
}

interface PreviewSettings {
  scale: number;
  showGrid: boolean;
  showElementBounds: boolean;
  autoRefresh: boolean;
  refreshInterval: number;
}

interface LiveData {
  currentTime: string;
  presentationTimer: string;
  participantCount: number;
  microphoneStatus: "on" | "off" | "muted";
  announcementText: string;
  customText: string; // For "customText" type elements
  songLyrics: string; // For "songLyrics" type elements
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
  if (diff <= 0) return "00:00:00";
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

function renderElement(
  element: StageDisplayElement,
  liveData: LiveData,
  currentSlide?: Slide,
  nextSlide?: Slide,
  speakerNotes?: string,
  slideMediaElements?: MediaElement[]
) {
  if (!element.isVisible) return null;

  const elementProvidedStyle = element.style || {};

  const computedStyle: React.CSSProperties = {
    position: "absolute",
    left: `${element.x}px`, // Assuming x, y, width, height are pixel values
    top: `${element.y}px`, // If they are percentages, use `${element.x}%`
    width: `${element.width}px`,
    height: `${element.height}px`,

    // Default flex behavior for content within the element
    display: "flex",
    alignItems: "center", // Default, can be overridden by element.style.alignItems
    justifyContent: "center", // Default, can be overridden by element.style.justifyContent or textAlign
    overflow: "hidden", // Prevent content spill
    wordWrap: "break-word", // For text wrapping

    // Spread styles from element.style. These can override the defaults above.
    ...elementProvidedStyle,
  };

  // If textAlign is provided in element.style, let it control justify-content for flex items
  if (elementProvidedStyle.textAlign) {
    computedStyle.justifyContent =
      elementProvidedStyle.textAlign === "center"
        ? "center"
        : elementProvidedStyle.textAlign === "right"
        ? "flex-end"
        : "flex-start";
  }

  let content: React.ReactNode = null;

  // FIX: Compare element.type with the exact string literals from StageDisplayElementType
  // Also, ensure typos from error messages (extra quotes) are removed.
  switch (element.type) {
    case "currentSlide": // Was "current-slide" in error, type is "currentSlide"
      content = (
        <div className="w-full h-full flex flex-col p-2 box-border">
          {" "}
          {/* Added padding & box-sizing */}
          {currentSlide && (
            <>
              <div className="font-bold text-lg mb-1 truncate">
                {" "}
                {/* Reduced margin */}
                {currentSlide.title}
              </div>
              <div className="flex-1 overflow-auto text-sm">
                {" "}
                {/* Ensure text can scroll */}
                {currentSlide.content}
              </div>
            </>
          )}
        </div>
      );
      break;

    case "nextSlide": // Was "next-slide"
      content = (
        <div className="w-full h-full flex flex-col p-2 box-border">
          <div className="text-xs opacity-75 mb-1">Next:</div>{" "}
          {/* Smaller "Next:" label */}
          {nextSlide && (
            <>
              <div className="font-semibold truncate text-base">
                {" "}
                {/* Adjusted size */}
                {nextSlide.title}
              </div>
              <div className="flex-1 overflow-auto text-xs">
                {nextSlide.content}
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

    case "speakerNotes": // Was "speaker-notes"
      content = (
        <div className="w-full h-full overflow-auto p-2 box-border">
          <p className="text-sm text-muted-foreground whitespace-pre-wrap">
            {speakerNotes || "No speaker notes."}
          </p>
        </div>
      );
      break;

    case "announcementBanner": // Was "announcement", type is "announcementBanner"
      content = (
        <div className="w-full h-full flex items-center justify-center text-center p-2 box-border">
          {/* Assuming announcementText comes from liveData */}
          <p className="text-xl font-semibold">
            {liveData.announcementText || element.text || "Announcement"}
          </p>
        </div>
      );
      break;

    case "customText": // Was "custom-text"
      content = (
        <div className="w-full h-full flex items-center justify-center text-center p-2 box-border">
          {/* Prioritize liveData, fallback to element.text if available */}
          <p className="text-lg">
            {liveData.customText || element.text || "Custom Text"}
          </p>
        </div>
      );
      break;

    case "songLyrics": // Was "song-lyrics"
      content = (
        <div className="w-full h-full flex items-center justify-center text-center p-2 box-border">
          <p className="text-xl whitespace-pre-wrap">
            {liveData.songLyrics || element.text || "Lyrics..."}
          </p>
        </div>
      );
      break;

    case "countdownTimer": // Was "countdown", type is "countdownTimer"
      content = (
        <div className="flex items-center gap-2">
          <Timer className="h-5 w-5" />
          <span className="font-mono">
            {liveData.countdownTarget
              ? formatCountdown(liveData.countdownTarget)
              : "00:00:00"}
          </span>
        </div>
      );
      break;

    case "participantCount": // Was "participant-count"
      content = (
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          <span className="font-mono">{liveData.participantCount}</span>
        </div>
      );
      break;

    case "microphoneStatus": // Was "microphone-status"
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
          <span className="font-mono capitalize">
            {liveData.microphoneStatus}
          </span>
        </div>
      );
      break;

    case "media": // Ensure "media" is in StageDisplayElementType
      const mediaElement = slideMediaElements?.find(
        (media) => media.id === element.id // This assumes element.id can map to a media.id
        // Or, element might have a specific mediaId property
      );
      if (mediaElement && mediaElement.isVisible) {
        if (mediaElement.type === "image") {
          content = (
            <img
              src={mediaElement.url}
              alt={mediaElement.altText || "Media"}
              className="w-full h-full object-contain"
            />
          );
        } else if (mediaElement.type === "video") {
          content = (
            <video
              src={mediaElement.url}
              controls
              className="w-full h-full object-contain"
            />
          );
        } else if (mediaElement.type === "audio") {
          content = (
            <audio src={mediaElement.url} controls className="w-full" />
          );
        }
      } else {
        content = (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            Media Content
          </div>
        );
      }
      break;

    default:
      // Use ((_: never) => {})(element.type); for exhaustive check if StageDisplayElementType is an enum
      content = (
        <div className="w-full h-full flex items-center justify-center text-center text-muted-foreground p-2 box-border">
          Unsupported: {element.type}
        </div>
      );
  }

  return (
    <div
      key={element.id}
      style={computedStyle}
      // className="absolute" // Redundant as position: "absolute" is in computedStyle
      title={`Element: ${element.type} (ID: ${element.id})`} // For easier debugging
    >
      {content}
    </div>
  );
}

export function StageDisplayPreview({
  config,
  currentSlide,
  nextSlide,
  speakerNotes,
  isPresenting,
  presentationTime,
  onConfigChange,
}: StageDisplayPreviewProps) {
  const [previewSettings, setPreviewSettings] = useState<PreviewSettings>({
    scale: 0.5,
    showGrid: true,
    showElementBounds: true,
    autoRefresh: true,
    refreshInterval: 1000, // Faster default refresh
  });
  const [liveData, setLiveData] = useState<LiveData>({
    currentTime: new Date().toLocaleTimeString(),
    presentationTimer: formatTime(presentationTime),
    participantCount: 0, // Or fetch from a source
    microphoneStatus: "off",
    announcementText: "Welcome!",
    customText: "Your custom message here.",
    songLyrics: "Amazing Grace...",
    countdownTarget: null, // e.g., new Date(Date.now() + 5 * 60 * 1000) for 5 mins
  });

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const updateLiveData = () => {
      setLiveData((prev) => ({
        ...prev,
        currentTime: new Date().toLocaleTimeString(),
        presentationTimer: formatTime(presentationTime),
        // Potentially update other live data points here if they change over time
      }));
    };

    updateLiveData(); // Initial call

    if (previewSettings.autoRefresh) {
      intervalRef.current = setInterval(
        updateLiveData,
        previewSettings.refreshInterval
      );
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [
    previewSettings.autoRefresh,
    previewSettings.refreshInterval,
    presentationTime,
  ]);

  const stageWidth = 1920; // Base width for scaling calculations
  const stageHeight = 1080; // Base height

  const activeTemplate = config.templates.find(
    (t) => t.id === config.activeTemplateId
  );

  const containerStyle: React.CSSProperties = {
    width: stageWidth,
    height: stageHeight,
    backgroundColor: activeTemplate?.backgroundColor || "#1A1A1A", // Darker default bg
    backgroundImage: activeTemplate?.backgroundImage
      ? `url(${activeTemplate.backgroundImage})`
      : undefined,
    backgroundSize: "cover",
    backgroundPosition: "center",
    transform: `scale(${previewSettings.scale})`,
    transformOrigin: "top left",
    position: "relative",
    overflow: "hidden", // Important for scaled content
    border: "1px solid #444", // Border for the preview stage itself
  };

  if (!activeTemplate) {
    return (
      <div className="flex flex-col h-full items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>No Template Selected</CardTitle>
            <CardDescription>
              Please select or create an active stage display template to see a
              preview.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-800 text-white">
      {" "}
      {/* Overall container theme */}
      <div className="flex-none p-3 border-b border-gray-700">
        <h2 className="text-lg font-semibold">Stage Display Preview</h2>
      </div>
      <div className="flex-1 p-4 overflow-auto flex items-center justify-center bg-gray-900">
        {" "}
        {/* Preview area */}
        <div style={containerStyle}>
          {activeTemplate.elements.map((element) =>
            renderElement(
              element,
              liveData,
              currentSlide,
              nextSlide,
              speakerNotes,
              currentSlide?.mediaElements
            )
          )}
          {/* TODO: Implement Grid and Bounds rendering based on previewSettings */}
        </div>
      </div>
      <div className="flex-none p-3 border-t border-gray-700">
        <h3 className="text-md font-semibold mb-3">Preview Settings</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
          <div className="flex items-center space-x-2">
            <Label htmlFor="scale" className="whitespace-nowrap">
              Scale:
            </Label>
            <Slider
              id="scale"
              min={0.1}
              max={1}
              step={0.01}
              value={[previewSettings.scale]}
              onValueChange={([value]) =>
                setPreviewSettings((p) => ({ ...p, scale: value }))
              }
              className="w-full max-w-[120px]"
            />
            <span className="text-xs text-gray-400 w-10 text-right">
              {(previewSettings.scale * 100).toFixed(0)}%
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="showGrid"
              checked={previewSettings.showGrid}
              onCheckedChange={(c) =>
                setPreviewSettings((p) => ({ ...p, showGrid: c }))
              }
            />
            <Label htmlFor="showGrid">Show Grid</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="showElementBounds"
              checked={previewSettings.showElementBounds}
              onCheckedChange={(c) =>
                setPreviewSettings((p) => ({ ...p, showElementBounds: c }))
              }
            />
            <Label htmlFor="showElementBounds">Show Bounds</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="autoRefresh"
              checked={previewSettings.autoRefresh}
              onCheckedChange={(c) =>
                setPreviewSettings((p) => ({ ...p, autoRefresh: c }))
              }
            />
            <Label htmlFor="autoRefresh">Auto Refresh</Label>
          </div>
          {previewSettings.autoRefresh && (
            <div className="flex items-center space-x-2">
              <Label htmlFor="refreshInterval" className="whitespace-nowrap">
                Interval (ms):
              </Label>
              <Input
                id="refreshInterval"
                type="number"
                min="100"
                step="100"
                value={previewSettings.refreshInterval}
                onChange={(e) =>
                  setPreviewSettings((p) => ({
                    ...p,
                    refreshInterval: parseInt(e.target.value) || 1000,
                  }))
                }
                className="w-[80px] bg-gray-700 border-gray-600 text-white"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
