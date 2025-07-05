// components/presentation/Preview.tsx
import React from "react";
import { useContentStore } from "../../stores/useContentStore";
import { Song, PresentationContentItem } from "../../types";
import { PresentationPlayer } from "../presentations/PresentationPlayer";
import { Button } from "../ui/button";
import { ExternalLink, Maximize2, Minimize2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function Preview() {
  const { selectedItem } = useContentStore();
  const [isFullscreen, setIsFullscreen] = React.useState(false);

  const openInSecondScreen = () => {
    if (window.electronAPI && selectedItem) {
      window.electronAPI.openPreviewWindow(selectedItem.id);
    }
  };

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      try {
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
      } catch (error) {
        console.error("Error attempting to enable fullscreen:", error);
      }
    } else {
      try {
        await document.exitFullscreen();
        setIsFullscreen(false);
      } catch (error) {
        console.error("Error attempting to exit fullscreen:", error);
      }
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-[#2D2D2D] flex justify-between items-center">
        <h2 className="text-lg font-semibold">PREVIEW</h2>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={openInSecondScreen}
            className="hover:bg-gray-800"
            title="Open in second screen"
          >
            <ExternalLink className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleFullscreen}
            className="hover:bg-gray-800"
          >
            {isFullscreen ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
      <div className="flex-1 p-6">
        <div
          className={cn(
            "w-full aspect-video bg-black rounded-lg overflow-hidden",
            "flex items-center justify-center"
          )}
        >
          {!selectedItem ? (
            <div className="flex items-center justify-center text-slate-400">
              <p>No output selected</p>
            </div>
          ) : selectedItem.type === "song" ? (
            <div className="w-full h-full p-8 overflow-auto">
              <pre className="whitespace-pre-wrap font-sans text-white">
                {(selectedItem as Song).lyrics}
              </pre>
            </div>
          ) : selectedItem.type === "presentation" ? (
            <PresentationPlayer
              presentation={selectedItem as PresentationContentItem}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}
