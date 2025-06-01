import React from "react";
import { useResponsive } from "../hooks/useResponsive";

interface ResponsivePerformanceProps {
  children: React.ReactNode;
  mobileThreshold?: number;
  tabletThreshold?: number;
  desktopThreshold?: number;
  fallback?: React.ReactNode;
}

/**
 * ResponsivePerformance component that conditionally renders content
 * based on device capabilities and screen size to optimize performance
 */
export function ResponsivePerformance({
  children,
  mobileThreshold = 10,
  tabletThreshold = 25,
  desktopThreshold = 50,
  fallback = null,
}: ResponsivePerformanceProps) {
  const { isMobile, isTablet, isDesktop } = useResponsive();
  const [shouldRender, setShouldRender] = React.useState(true);
  const [itemCount, setItemCount] = React.useState(0);

  React.useEffect(() => {
    // Count renderable items based on device type
    let threshold = desktopThreshold;
    if (isMobile) threshold = mobileThreshold;
    else if (isTablet) threshold = tabletThreshold;

    // Simple heuristic: if we have too many items for the device, show fallback
    const shouldShowFallback = itemCount > threshold;
    setShouldRender(!shouldShowFallback);
  }, [
    isMobile,
    isTablet,
    isDesktop,
    itemCount,
    mobileThreshold,
    tabletThreshold,
    desktopThreshold,
  ]);

  // Count children if they are an array
  React.useEffect(() => {
    if (React.isValidElement(children)) {
      setItemCount(1);
    } else if (Array.isArray(children)) {
      setItemCount(children.length);
    } else {
      setItemCount(0);
    }
  }, [children]);

  if (!shouldRender && fallback) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

/**
 * ResponsiveVirtualList component for handling large lists efficiently
 */
interface ResponsiveVirtualListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  itemHeight?: number;
  containerHeight?: number;
  className?: string;
}

export function ResponsiveVirtualList<T>({
  items,
  renderItem,
  itemHeight = 60,
  containerHeight = 400,
  className = "",
}: ResponsiveVirtualListProps<T>) {
  const { isMobile, isTablet } = useResponsive();
  const [scrollTop, setScrollTop] = React.useState(0);
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Adjust item height for mobile
  const adjustedItemHeight = isMobile ? itemHeight + 10 : itemHeight;
  const adjustedContainerHeight = isMobile
    ? containerHeight * 0.8
    : containerHeight;

  // Calculate visible range
  const startIndex = Math.floor(scrollTop / adjustedItemHeight);
  const endIndex = Math.min(
    startIndex + Math.ceil(adjustedContainerHeight / adjustedItemHeight) + 1,
    items.length
  );

  // Only virtualize on mobile/tablet for performance
  const shouldVirtualize = (isMobile || isTablet) && items.length > 20;

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  };

  if (!shouldVirtualize) {
    // Render all items for desktop or small lists
    return (
      <div className={`space-y-2 ${className}`}>
        {items.map((item, index) => (
          <div key={index}>{renderItem(item, index)}</div>
        ))}
      </div>
    );
  }

  // Virtual rendering for mobile/tablet with large lists
  const visibleItems = items.slice(startIndex, endIndex);
  const totalHeight = items.length * adjustedItemHeight;
  const offsetY = startIndex * adjustedItemHeight;

  return (
    <div
      ref={containerRef}
      className={`overflow-auto ${className}`}
      style={{ height: adjustedContainerHeight }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: "relative" }}>
        <div style={{ transform: `translateY(${offsetY}px)` }}>
          {visibleItems.map((item, index) => (
            <div
              key={startIndex + index}
              style={{ height: adjustedItemHeight }}
              className="flex items-center"
            >
              {renderItem(item, startIndex + index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * ResponsiveLazyLoad component for lazy loading content
 */
interface ResponsiveLazyLoadProps {
  children: React.ReactNode;
  placeholder?: React.ReactNode;
  threshold?: number;
  className?: string;
}

export function ResponsiveLazyLoad({
  children,
  placeholder = <div className="animate-pulse bg-muted h-20 rounded" />,
  threshold = 100,
  className = "",
}: ResponsiveLazyLoadProps) {
  const [isVisible, setIsVisible] = React.useState(false);
  const [hasLoaded, setHasLoaded] = React.useState(false);
  const elementRef = React.useRef<HTMLDivElement>(null);
  const { isMobile } = useResponsive();

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Add delay for mobile to improve performance
          const delay = isMobile ? 150 : 0;
          setTimeout(() => setHasLoaded(true), delay);
        }
      },
      {
        rootMargin: `${threshold}px`,
        threshold: 0.1,
      }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, [threshold, isMobile]);

  return (
    <div ref={elementRef} className={className}>
      {hasLoaded ? children : placeholder}
    </div>
  );
}

/**
 * ResponsiveImageOptimizer for optimizing images based on device
 */
interface ResponsiveImageProps
  extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  mobileQuality?: "low" | "medium" | "high";
  tabletQuality?: "low" | "medium" | "high";
  desktopQuality?: "low" | "medium" | "high";
}

export function ResponsiveImage({
  src,
  alt,
  mobileQuality = "medium",
  tabletQuality = "high",
  desktopQuality = "high",
  className = "",
  ...props
}: ResponsiveImageProps) {
  const { isMobile, isTablet, isDesktop } = useResponsive();
  const [imageSrc, setImageSrc] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(true);
  const [hasError, setHasError] = React.useState(false);

  React.useEffect(() => {
    let quality = desktopQuality;
    if (isMobile) quality = mobileQuality;
    else if (isTablet) quality = tabletQuality;

    // In a real implementation, you would modify the src based on quality
    // For now, we'll just use the original src
    setImageSrc(src);
  }, [
    src,
    isMobile,
    isTablet,
    isDesktop,
    mobileQuality,
    tabletQuality,
    desktopQuality,
  ]);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  if (hasError) {
    return (
      <div className={`bg-muted flex items-center justify-center ${className}`}>
        <span className="text-muted-foreground text-sm">
          Failed to load image
        </span>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-muted animate-pulse rounded" />
      )}
      <img
        src={imageSrc}
        alt={alt}
        onLoad={handleLoad}
        onError={handleError}
        className={`img-responsive transition-opacity duration-300 ${
          isLoading ? "opacity-0" : "opacity-100"
        }`}
        {...props}
      />
    </div>
  );
}
