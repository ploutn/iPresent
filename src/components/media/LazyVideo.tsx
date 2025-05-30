import React, { useState, useRef, useEffect } from "react";
import { Play, Loader2, FileVideo } from "lucide-react";
import { cn } from "../../lib/utils";
import { mediaCache, generateCacheKey } from "../../utils/mediaCache";

interface LazyVideoProps {
  src: string;
  thumbnailSrc?: string;
  alt: string;
  className?: string;
  showPlayIcon?: boolean;
  onLoad?: () => void;
  onError?: () => void;
  placeholder?: React.ReactNode;
  threshold?: number;
  preload?: "none" | "metadata" | "auto";
}

export const LazyVideo: React.FC<LazyVideoProps> = ({
  src,
  thumbnailSrc,
  alt,
  className,
  showPlayIcon = true,
  onLoad,
  onError,
  placeholder,
  threshold = 0.1,
  preload = "none",
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [thumbnailLoaded, setThumbnailLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        threshold,
        rootMargin: "50px",
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  // Load thumbnail first when in view
  useEffect(() => {
    if (
      isInView &&
      thumbnailSrc &&
      !thumbnailLoaded &&
      !hasError &&
      !isLoading
    ) {
      setIsLoading(true);

      const cacheKey = generateCacheKey(thumbnailSrc, { type: "thumbnail" });

      // Check cache first
      const cachedData = mediaCache.get(cacheKey);
      if (cachedData && typeof cachedData === "string") {
        setThumbnailLoaded(true);
        setIsLoading(false);
        onLoad?.();
        return;
      }

      const img = new Image();

      img.onload = () => {
        // Cache the successful load
        mediaCache.set(cacheKey, thumbnailSrc, "thumbnail");
        setThumbnailLoaded(true);
        setIsLoading(false);
        onLoad?.();
      };

      img.onerror = () => {
        setHasError(true);
        setIsLoading(false);
        onError?.();
      };

      img.src = thumbnailSrc;
    }
  }, [
    isInView,
    thumbnailSrc,
    thumbnailLoaded,
    hasError,
    isLoading,
    onLoad,
    onError,
  ]);

  // Load video metadata when thumbnail is loaded (if preload is set)
  useEffect(() => {
    if (thumbnailLoaded && preload !== "none" && !isLoaded) {
      setIsLoaded(true);
    }
  }, [thumbnailLoaded, preload, isLoaded]);

  const renderContent = () => {
    if (hasError) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
          <FileVideo className="w-8 h-8 text-gray-400" />
        </div>
      );
    }

    if (isLoading) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
          {placeholder || (
            <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
          )}
        </div>
      );
    }

    if (thumbnailLoaded && thumbnailSrc) {
      return (
        <div className="relative w-full h-full">
          <img
            src={thumbnailSrc}
            alt={alt}
            className={cn("w-full h-full object-cover", className)}
            loading="lazy"
          />
          {showPlayIcon && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-black/50 rounded-full p-2">
                <Play className="w-6 h-6 text-white fill-white" />
              </div>
            </div>
          )}
        </div>
      );
    }

    if (isLoaded) {
      return (
        <div className="relative w-full h-full">
          <video
            src={src}
            className={cn("w-full h-full object-cover", className)}
            preload={preload}
            muted
            playsInline
          />
          {showPlayIcon && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-black/50 rounded-full p-2">
                <Play className="w-6 h-6 text-white fill-white" />
              </div>
            </div>
          )}
        </div>
      );
    }

    // Not in view yet - show placeholder
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
        {placeholder || (
          <div className="w-full h-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
        )}
      </div>
    );
  };

  return (
    <div
      ref={containerRef}
      className={cn("relative overflow-hidden", className)}
    >
      {renderContent()}
    </div>
  );
};
