import React, { useEffect, useRef, useState } from "react";
import { SlideTransition } from "@/types";
import "./slide-transitions.css";

interface SlideTransitionEngineProps {
  children: React.ReactNode;
  transition: SlideTransition;
  isActive: boolean;
  onTransitionComplete?: () => void;
  className?: string;
}

export function SlideTransitionEngine({
  children,
  transition,
  isActive,
  onTransitionComplete,
  className = "",
}: SlideTransitionEngineProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionClass, setTransitionClass] = useState("");

  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    setIsTransitioning(true);
    const transitionClassName = getTransitionClass(transition);
    setTransitionClass(transitionClassName);

    const timer = setTimeout(() => {
      setIsTransitioning(false);
      setTransitionClass("");
      onTransitionComplete?.();
    }, transition.duration);

    return () => clearTimeout(timer);
  }, [isActive, transition, onTransitionComplete]);

  const getTransitionClass = (transition: SlideTransition): string => {
    const { type, direction, easing } = transition;
    const baseClass = `slide-transition-${type}`;
    const directionClass = direction ? `slide-direction-${direction}` : "";
    const easingClass = `slide-easing-${easing || "ease-in-out"}`;

    return `${baseClass} ${directionClass} ${easingClass}`.trim();
  };

  const getTransitionStyle = (): React.CSSProperties => {
    return {
      "--transition-duration": `${transition.duration}ms`,
      "--transition-easing": transition.easing || "ease-in-out",
    } as React.CSSProperties;
  };

  return (
    <div
      ref={containerRef}
      className={`slide-transition-container ${transitionClass} ${className}`}
      style={getTransitionStyle()}
      data-transitioning={isTransitioning}
    >
      {children}
    </div>
  );
}

// Hook for managing slide transitions in presentations
export function useSlideTransition() {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionQueue, setTransitionQueue] = useState<number[]>([]);

  const transitionToSlide = (slideIndex: number, immediate = false) => {
    if (isTransitioning && !immediate) {
      setTransitionQueue((prev) => [...prev, slideIndex]);
      return;
    }

    setIsTransitioning(true);
    setCurrentSlideIndex(slideIndex);
  };

  const onTransitionComplete = () => {
    setIsTransitioning(false);

    // Process next transition in queue
    if (transitionQueue.length > 0) {
      const nextSlideIndex = transitionQueue[0];
      setTransitionQueue((prev) => prev.slice(1));
      setTimeout(() => transitionToSlide(nextSlideIndex), 50);
    }
  };

  const nextSlide = (totalSlides: number) => {
    if (currentSlideIndex < totalSlides - 1) {
      transitionToSlide(currentSlideIndex + 1);
    }
  };

  const previousSlide = () => {
    if (currentSlideIndex > 0) {
      transitionToSlide(currentSlideIndex - 1);
    }
  };

  const goToSlide = (index: number) => {
    transitionToSlide(index);
  };

  return {
    currentSlideIndex,
    isTransitioning,
    transitionToSlide,
    onTransitionComplete,
    nextSlide,
    previousSlide,
    goToSlide,
  };
}

// Transition presets for common effects
export const transitionPresets: Record<string, SlideTransition> = {
  none: {
    type: "none",
    duration: 0,
    easing: "linear",
  },
  fadeIn: {
    type: "fade",
    duration: 500,
    easing: "ease-in-out",
  },
  fadeInSlow: {
    type: "fade",
    duration: 1000,
    easing: "ease-in-out",
  },
  slideLeft: {
    type: "slide",
    duration: 600,
    direction: "left",
    easing: "ease-out",
  },
  slideRight: {
    type: "slide",
    duration: 600,
    direction: "right",
    easing: "ease-out",
  },
  slideUp: {
    type: "slide",
    duration: 600,
    direction: "up",
    easing: "ease-out",
  },
  slideDown: {
    type: "slide",
    duration: 600,
    direction: "down",
    easing: "ease-out",
  },
  zoomIn: {
    type: "zoom",
    duration: 500,
    easing: "ease-out",
  },
  zoomOut: {
    type: "zoom",
    duration: 500,
    easing: "ease-in",
  },
  flipHorizontal: {
    type: "flip",
    duration: 800,
    direction: "left",
    easing: "ease-in-out",
  },
  flipVertical: {
    type: "flip",
    duration: 800,
    direction: "up",
    easing: "ease-in-out",
  },
  cubeLeft: {
    type: "cube",
    duration: 1000,
    direction: "left",
    easing: "ease-in-out",
  },
  cubeRight: {
    type: "cube",
    duration: 1000,
    direction: "right",
    easing: "ease-in-out",
  },
  dissolve: {
    type: "dissolve",
    duration: 800,
    easing: "ease-in-out",
  },
};
