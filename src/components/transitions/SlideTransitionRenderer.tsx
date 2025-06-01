import React, { useEffect, useRef, useState } from "react";
import { SlideTransition, Slide } from "@/types";
import { cn } from "@/lib/utils";
import "./slide-transitions.css";

interface SlideTransitionRendererProps {
  currentSlide: Slide;
  nextSlide?: Slide;
  isTransitioning: boolean;
  onTransitionComplete: () => void;
  className?: string;
}

export function SlideTransitionRenderer({
  currentSlide,
  nextSlide,
  isTransitioning,
  onTransitionComplete,
  className,
}: SlideTransitionRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const currentSlideRef = useRef<HTMLDivElement>(null);
  const nextSlideRef = useRef<HTMLDivElement>(null);
  const [animationState, setAnimationState] = useState<
    "idle" | "transitioning" | "complete"
  >("idle");

  useEffect(() => {
    if (isTransitioning && nextSlide) {
      setAnimationState("transitioning");
      performTransition();
    }
  }, [isTransitioning, nextSlide]);

  const performTransition = async () => {
    if (!currentSlideRef.current || !nextSlideRef.current || !nextSlide) return;

    const transition = nextSlide.transition || {
      type: "fade",
      duration: 500,
      direction: "left",
      easing: "ease-in-out",
    };

    const currentElement = currentSlideRef.current;
    const nextElement = nextSlideRef.current;

    // Reset any previous animations
    currentElement.style.animation = "";
    nextElement.style.animation = "";
    currentElement.classList.remove(...getTransitionClasses(transition, "out"));
    nextElement.classList.remove(...getTransitionClasses(transition, "in"));

    // Force reflow
    currentElement.offsetHeight;
    nextElement.offsetHeight;

    // Apply transition classes
    const outClasses = getTransitionClasses(transition, "out");
    const inClasses = getTransitionClasses(transition, "in");

    currentElement.classList.add(...outClasses);
    nextElement.classList.add(...inClasses);

    // Set CSS custom properties for dynamic values
    const container = containerRef.current;
    if (container) {
      container.style.setProperty(
        "--transition-duration",
        `${transition.duration}ms`
      );
      container.style.setProperty(
        "--transition-easing",
        transition.easing || "ease-in-out"
      );
    }

    // Wait for transition to complete
    await new Promise((resolve) => {
      const timeout = setTimeout(resolve, transition.duration);

      const handleTransitionEnd = () => {
        clearTimeout(timeout);
        resolve(undefined);
      };

      currentElement.addEventListener("transitionend", handleTransitionEnd, {
        once: true,
      });
      nextElement.addEventListener("transitionend", handleTransitionEnd, {
        once: true,
      });
      currentElement.addEventListener("animationend", handleTransitionEnd, {
        once: true,
      });
      nextElement.addEventListener("animationend", handleTransitionEnd, {
        once: true,
      });
    });

    // Clean up
    currentElement.classList.remove(...outClasses);
    nextElement.classList.remove(...inClasses);

    setAnimationState("complete");
    onTransitionComplete();
  };

  const getTransitionClasses = (
    transition: SlideTransition,
    phase: "in" | "out"
  ): string[] => {
    const classes: string[] = [];
    const { type, direction, effect } = transition;

    // Base transition class
    classes.push("slide-transition");

    // Type-specific classes
    switch (type) {
      case "fade":
        classes.push(phase === "out" ? "fade-out" : "fade-in");
        break;
      case "slide":
        classes.push(
          phase === "out" ? `slide-out-${direction}` : `slide-in-${direction}`
        );
        break;
      case "zoom":
        classes.push(phase === "out" ? "zoom-out" : "zoom-in");
        break;
      case "flip":
        classes.push(
          phase === "out" ? `flip-out-${direction}` : `flip-in-${direction}`
        );
        break;
      case "cube":
        classes.push(
          phase === "out" ? `cube-out-${direction}` : `cube-in-${direction}`
        );
        break;
      case "dissolve":
        classes.push(phase === "out" ? "dissolve-out" : "dissolve-in");
        break;
      case "wipe":
        classes.push(
          phase === "out" ? `wipe-out-${direction}` : `wipe-in-${direction}`
        );
        break;
      case "iris":
        classes.push(phase === "out" ? "iris-out" : "iris-in");
        break;
      case "curtain":
        classes.push(phase === "out" ? "curtain-out" : "curtain-in");
        break;
      case "none":
      default:
        // No transition classes for 'none'
        break;
    }

    // Effect modifiers
    if (effect) {
      classes.push(`effect-${effect}`);
    }

    return classes;
  };

  const renderSlideContent = (slide: Slide) => {
    return (
      <div className="slide-content w-full h-full flex flex-col">
        {/* Slide Title */}
        {slide.title && (
          <div className="slide-title text-4xl font-bold mb-8 text-center">
            {slide.title}
          </div>
        )}

        {/* Slide Content */}
        <div className="slide-body flex-1 flex flex-col justify-center">
          {slide.content && (
            <div
              className="slide-text text-xl leading-relaxed"
              style={{
                textAlign: slide.textAlign || "center",
                fontSize: slide.fontSize ? `${slide.fontSize}px` : undefined,
                fontFamily: slide.fontFamily || undefined,
                color: slide.textColor || undefined,
              }}
              dangerouslySetInnerHTML={{ __html: slide.content }}
            />
          )}

          {/* Media Elements */}
          {slide.media && slide.media.length > 0 && (
            <div className="slide-media mt-8 flex flex-wrap justify-center gap-4">
              {slide.media.map((mediaItem, index) => (
                <div key={index} className="media-item">
                  {mediaItem.type === "image" && (
                    <img
                      src={mediaItem.url}
                      alt={mediaItem.alt || `Media ${index + 1}`}
                      className="max-w-full max-h-96 object-contain rounded-lg shadow-lg"
                      style={{
                        width: mediaItem.width
                          ? `${mediaItem.width}px`
                          : undefined,
                        height: mediaItem.height
                          ? `${mediaItem.height}px`
                          : undefined,
                      }}
                    />
                  )}
                  {mediaItem.type === "video" && (
                    <video
                      src={mediaItem.url}
                      controls={mediaItem.controls !== false}
                      autoPlay={mediaItem.autoplay}
                      loop={mediaItem.loop}
                      muted={mediaItem.muted}
                      className="max-w-full max-h-96 rounded-lg shadow-lg"
                      style={{
                        width: mediaItem.width
                          ? `${mediaItem.width}px`
                          : undefined,
                        height: mediaItem.height
                          ? `${mediaItem.height}px`
                          : undefined,
                      }}
                    />
                  )}
                  {mediaItem.type === "audio" && (
                    <audio
                      src={mediaItem.url}
                      controls
                      autoPlay={mediaItem.autoplay}
                      loop={mediaItem.loop}
                      className="w-full max-w-md"
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Slide Notes (for presenter view) */}
        {slide.notes && (
          <div className="slide-notes mt-8 p-4 bg-black/20 rounded-lg text-sm opacity-75">
            <div className="font-medium mb-2">Speaker Notes:</div>
            <div>{slide.notes}</div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "slide-transition-container relative w-full h-full overflow-hidden",
        className
      )}
    >
      {/* Current Slide */}
      <div
        ref={currentSlideRef}
        className="slide-wrapper absolute inset-0 w-full h-full flex items-center justify-center p-8"
        style={{
          backgroundColor: currentSlide.backgroundColor || "transparent",
          backgroundImage: currentSlide.backgroundImage
            ? `url(${currentSlide.backgroundImage})`
            : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {renderSlideContent(currentSlide)}
      </div>

      {/* Next Slide (only visible during transition) */}
      {nextSlide && isTransitioning && (
        <div
          ref={nextSlideRef}
          className="slide-wrapper absolute inset-0 w-full h-full flex items-center justify-center p-8"
          style={{
            backgroundColor: nextSlide.backgroundColor || "transparent",
            backgroundImage: nextSlide.backgroundImage
              ? `url(${nextSlide.backgroundImage})`
              : undefined,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            zIndex: animationState === "transitioning" ? 10 : 0,
          }}
        >
          {renderSlideContent(nextSlide)}
        </div>
      )}

      {/* Transition Overlay (for special effects) */}
      {isTransitioning && nextSlide?.transition?.type === "iris" && (
        <div className="transition-overlay absolute inset-0 pointer-events-none">
          <div className="iris-mask w-full h-full" />
        </div>
      )}
    </div>
  );
}

// Hook for managing slide transitions
export function useSlideTransitions() {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionQueue, setTransitionQueue] = useState<Slide[]>([]);

  const startTransition = (nextSlide: Slide) => {
    if (isTransitioning) {
      // Queue the transition if one is already in progress
      setTransitionQueue((prev) => [...prev, nextSlide]);
      return;
    }

    setIsTransitioning(true);
  };

  const completeTransition = () => {
    setIsTransitioning(false);

    // Process queued transitions
    setTransitionQueue((prev) => {
      if (prev.length > 0) {
        const [nextSlide, ...remaining] = prev;
        setTimeout(() => startTransition(nextSlide), 50);
        return remaining;
      }
      return prev;
    });
  };

  const clearTransitionQueue = () => {
    setTransitionQueue([]);
    setIsTransitioning(false);
  };

  return {
    isTransitioning,
    transitionQueue,
    startTransition,
    completeTransition,
    clearTransitionQueue,
  };
}
