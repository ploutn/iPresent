import React, { useState, useRef, useEffect } from "react";
import { FileImage, Loader2 } from "lucide-react";
import { cn } from "../../lib/utils";
import { mediaCache, generateCacheKey } from "../../utils/mediaCache";

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackIcon?: React.ReactNode;
  onLoad?: () => void;
  onError?: () => void;
  placeholder?: React.ReactNode;
  threshold?: number; // Intersection observer threshold
}

export const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  className,
  fallbackIcon,
  onLoad,
  onError,
  placeholder,
  threshold = 0.1,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

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
        rootMargin: "50px", // Start loading 50px before the image comes into view
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  useEffect(() => {
    if (isInView && !isLoaded && !hasError && !isLoading) {
      setIsLoading(true);

      const cacheKey = generateCacheKey(src, { type: "image" });

      // Check cache first
      const cachedData = mediaCache.get(cacheKey);
      if (cachedData && typeof cachedData === "string") {
        setIsLoaded(true);
        setIsLoading(false);
        onLoad?.();
        return;
      }

      const img = new Image();

      img.onload = () => {
        // Cache the successful load
        mediaCache.set(cacheKey, src, "url");
        setIsLoaded(true);
        setIsLoading(false);
        onLoad?.();
      };

      img.onerror = () => {
        setHasError(true);
        setIsLoading(false);
        onError?.();
      };

      img.src = src;
    }
  }, [isInView, isLoaded, hasError, isLoading, src, onLoad, onError]);

  const renderContent = () => {
    if (hasError) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
          {fallbackIcon || <FileImage className="w-8 h-8 text-gray-400" />}
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

    if (isLoaded) {
      return (
        <img
          src={src}
          alt={alt}
          className={cn("w-full h-full object-cover", className)}
          loading="lazy"
        />
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
    <div ref={imgRef} className={cn("relative overflow-hidden", className)}>
      {renderContent()}
    </div>
  );
};
