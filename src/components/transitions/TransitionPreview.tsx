import React, { useState, useRef, useEffect } from "react";
import { SlideTransition } from "@/types";
import {
  SlideTransitionEngine,
  transitionPresets,
} from "./SlideTransitionEngine";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

interface TransitionPreviewProps {
  onTransitionSelect?: (transition: SlideTransition) => void;
  selectedTransition?: SlideTransition;
  className?: string;
}

interface PreviewSlide {
  id: string;
  title: string;
  content: string;
  backgroundColor: string;
  textColor: string;
}

const sampleSlides: PreviewSlide[] = [
  {
    id: "1",
    title: "Welcome",
    content: "Welcome to our presentation",
    backgroundColor: "#3B82F6",
    textColor: "#FFFFFF",
  },
  {
    id: "2",
    title: "About Us",
    content: "Learn more about our company",
    backgroundColor: "#10B981",
    textColor: "#FFFFFF",
  },
  {
    id: "3",
    title: "Our Services",
    content: "Discover what we can do for you",
    backgroundColor: "#F59E0B",
    textColor: "#FFFFFF",
  },
];

export function TransitionPreview({
  onTransitionSelect,
  selectedTransition,
  className,
}: TransitionPreviewProps) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [previewTransition, setPreviewTransition] = useState<SlideTransition>(
    selectedTransition || transitionPresets.fadeIn
  );
  const [isTransitioning, setIsTransitioning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (selectedTransition) {
      setPreviewTransition(selectedTransition);
    }
  }, [selectedTransition]);

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        nextSlide();
      }, previewTransition.duration + 1000); // Add 1 second pause between transitions
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, previewTransition.duration]);

  const nextSlide = () => {
    if (isTransitioning) return;
    setCurrentSlideIndex((prev) => (prev + 1) % sampleSlides.length);
    setIsTransitioning(true);
  };

  const previousSlide = () => {
    if (isTransitioning) return;
    setCurrentSlideIndex(
      (prev) => (prev - 1 + sampleSlides.length) % sampleSlides.length
    );
    setIsTransitioning(true);
  };

  const goToSlide = (index: number) => {
    if (isTransitioning || index === currentSlideIndex) return;
    setCurrentSlideIndex(index);
    setIsTransitioning(true);
  };

  const handleTransitionComplete = () => {
    setIsTransitioning(false);
  };

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };

  const resetPreview = () => {
    setIsPlaying(false);
    setCurrentSlideIndex(0);
    setIsTransitioning(false);
  };

  const selectTransition = (transition: SlideTransition) => {
    setPreviewTransition(transition);
    onTransitionSelect?.(transition);
    resetPreview();
  };

  const currentSlide = sampleSlides[currentSlideIndex];

  return (
    <div className={cn("space-y-6", className)}>
      {/* Preview Area */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Transition Preview</span>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={togglePlayback}
                disabled={isTransitioning}
              >
                {isPlaying ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
              </Button>
              <Button variant="outline" size="sm" onClick={resetPreview}>
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            {/* Preview Container */}
            <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden relative">
              <SlideTransitionEngine
                transition={previewTransition}
                isActive={isTransitioning}
                onTransitionComplete={handleTransitionComplete}
                className="absolute inset-0"
              >
                <div
                  className="w-full h-full flex items-center justify-center text-center p-8"
                  style={{
                    backgroundColor: currentSlide.backgroundColor,
                    color: currentSlide.textColor,
                  }}
                >
                  <div>
                    <h2 className="text-3xl font-bold mb-4">
                      {currentSlide.title}
                    </h2>
                    <p className="text-lg">{currentSlide.content}</p>
                  </div>
                </div>
              </SlideTransitionEngine>
            </div>

            {/* Slide Navigation */}
            <div className="flex justify-center mt-4 space-x-2">
              {sampleSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={cn(
                    "w-3 h-3 rounded-full transition-colors",
                    index === currentSlideIndex
                      ? "bg-primary"
                      : "bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500"
                  )}
                  disabled={isTransitioning}
                />
              ))}
            </div>

            {/* Current Transition Info */}
            <div className="mt-4 text-center">
              <Badge variant="secondary">
                {previewTransition.type.charAt(0).toUpperCase() +
                  previewTransition.type.slice(1)}
                {previewTransition.direction &&
                  ` - ${previewTransition.direction}`}
                {` (${previewTransition.duration}ms)`}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transition Presets */}
      <Card>
        <CardHeader>
          <CardTitle>Transition Effects</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {Object.entries(transitionPresets).map(([name, transition]) => (
              <Button
                key={name}
                variant={
                  previewTransition === transition ? "default" : "outline"
                }
                size="sm"
                onClick={() => selectTransition(transition)}
                className="h-auto p-3 flex flex-col items-center space-y-1"
              >
                <span className="font-medium text-xs">
                  {name
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^./, (str) => str.toUpperCase())}
                </span>
                <span className="text-xs text-muted-foreground">
                  {transition.duration}ms
                </span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Custom Transition Builder */}
      <Card>
        <CardHeader>
          <CardTitle>Custom Transition</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Type</label>
              <select
                value={previewTransition.type}
                onChange={(e) => {
                  const newTransition = {
                    ...previewTransition,
                    type: e.target.value as SlideTransition["type"],
                  };
                  selectTransition(newTransition);
                }}
                className="w-full p-2 border rounded-md bg-background"
              >
                <option value="none">None</option>
                <option value="fade">Fade</option>
                <option value="slide">Slide</option>
                <option value="zoom">Zoom</option>
                <option value="flip">Flip</option>
                <option value="cube">Cube</option>
                <option value="dissolve">Dissolve</option>
              </select>
            </div>

            {(previewTransition.type === "slide" ||
              previewTransition.type === "flip" ||
              previewTransition.type === "cube") && (
              <div>
                <label className="block text-sm font-medium mb-2">
                  Direction
                </label>
                <select
                  value={previewTransition.direction || "left"}
                  onChange={(e) => {
                    const newTransition = {
                      ...previewTransition,
                      direction: e.target.value as SlideTransition["direction"],
                    };
                    selectTransition(newTransition);
                  }}
                  className="w-full p-2 border rounded-md bg-background"
                >
                  <option value="left">Left</option>
                  <option value="right">Right</option>
                  <option value="up">Up</option>
                  <option value="down">Down</option>
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2">
                Duration ({previewTransition.duration}ms)
              </label>
              <input
                type="range"
                min="100"
                max="2000"
                step="100"
                value={previewTransition.duration}
                onChange={(e) => {
                  const newTransition = {
                    ...previewTransition,
                    duration: parseInt(e.target.value),
                  };
                  selectTransition(newTransition);
                }}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Easing</label>
              <select
                value={previewTransition.easing || "ease-in-out"}
                onChange={(e) => {
                  const newTransition = {
                    ...previewTransition,
                    easing: e.target.value as SlideTransition["easing"],
                  };
                  selectTransition(newTransition);
                }}
                className="w-full p-2 border rounded-md bg-background"
              >
                <option value="linear">Linear</option>
                <option value="ease-in">Ease In</option>
                <option value="ease-out">Ease Out</option>
                <option value="ease-in-out">Ease In Out</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
