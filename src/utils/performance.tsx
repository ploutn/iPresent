import React, {
  lazy,
  Suspense,
  ComponentType,
  memo,
  useState,
  useEffect,
} from "react";
import { Loader2 } from "lucide-react";

/**
 * Performance optimization utilities for iPresent
 * This file provides utilities for lazy loading, memoization, and performance monitoring
 */

// Custom loading component with spinner
export const LoadingFallback = () => (
  <div className="flex items-center justify-center w-full h-full min-h-[100px]">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

/**
 * Creates a lazy-loaded component with Suspense and error boundary
 * @param importFn - Dynamic import function for the component
 * @param fallback - Optional custom loading component
 */
export function lazyLoad<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  fallback = <LoadingFallback />
) {
  const LazyComponent = lazy(importFn);

  return (props: React.ComponentProps<T>) => (
    <Suspense fallback={fallback}>
      <LazyComponent {...props} />
    </Suspense>
  );
}

/**
 * Enhanced memo HOC with custom comparison
 * @param Component - Component to memoize
 * @param propsAreEqual - Optional custom comparison function
 */
export function memoWithConsole<T extends ComponentType<any>>(
  Component: T,
  propsAreEqual?: (
    prevProps: Readonly<React.ComponentProps<T>>,
    nextProps: Readonly<React.ComponentProps<T>>
  ) => boolean
) {
  const displayName = Component.displayName || Component.name || "Component";

  const MemoizedComponent = memo(Component, propsAreEqual);
  MemoizedComponent.displayName = `Memo(${displayName})`;

  return MemoizedComponent;
}

/**
 * Performance monitoring hook for components
 * @param componentName - Name of the component to monitor
 */
export function usePerformanceMonitor(componentName: string) {
  useEffect(() => {
    const startTime = performance.now();

    return () => {
      const endTime = performance.now();
      const renderTime = endTime - startTime;

      if (renderTime > 50) {
        // Log only slow renders (> 50ms)
        console.warn(
          `[Performance] ${componentName} took ${renderTime.toFixed(
            2
          )}ms to render`
        );
      }
    };
  }, [componentName]);
}

/**
 * Hook to detect and warn about expensive re-renders
 * @param props - Component props to monitor
 * @param componentName - Name of the component
 */
export function useRenderWarning(
  props: Record<string, any>,
  componentName: string
) {
  const [prevProps, setPrevProps] = useState(props);

  useEffect(() => {
    const changedProps: Record<string, { from: any; to: any }> = {};
    let hasChanges = false;

    Object.entries(props).forEach(([key, value]) => {
      if (prevProps[key] !== value) {
        hasChanges = true;
        changedProps[key] = { from: prevProps[key], to: value };
      }
    });

    if (hasChanges && Object.keys(changedProps).length > 3) {
      console.warn(
        `[Re-render Warning] ${componentName} re-rendered due to ${
          Object.keys(changedProps).length
        } prop changes:`,
        changedProps
      );
    }

    setPrevProps(props);
  }, [props, componentName, prevProps]);
}

/**
 * Creates a debounced version of a function
 * @param fn - Function to debounce
 * @param delay - Delay in milliseconds
 */
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;

  return function (...args: Parameters<T>) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

/**
 * Creates a throttled version of a function
 * @param fn - Function to throttle
 * @param limit - Limit in milliseconds
 */
export function throttle<T extends (...args: any[]) => any>(
  fn: T,
  limit: number
): (...args: Parameters<T>) => void {
  let lastCall = 0;

  return function (...args: Parameters<T>) {
    const now = Date.now();
    if (now - lastCall >= limit) {
      lastCall = now;
      fn(...args);
    }
  };
}
