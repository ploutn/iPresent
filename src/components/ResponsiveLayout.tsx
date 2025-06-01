import React from "react";
import { cn } from "../lib/utils";
import { useResponsive } from "../hooks/useResponsive";
import { ResponsiveSidebar } from "./ResponsiveSidebar";
import { ContentItem } from "../types";

interface ResponsiveLayoutProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
  onSelectItem?: (item: ContentItem) => void;
  className?: string;
}

export function ResponsiveLayout({
  children,
  sidebar,
  onSelectItem,
  className,
}: ResponsiveLayoutProps) {
  const { isMobile, isTablet, breakpoint } = useResponsive();

  return (
    <div className={cn("flex h-screen bg-background", className)}>
      {/* Sidebar - Hidden on mobile, shown as drawer */}
      {!isMobile && (
        <aside className="flex-shrink-0">
          {sidebar ||
            (onSelectItem && <ResponsiveSidebar onSelectItem={onSelectItem} />)}
        </aside>
      )}

      {/* Mobile sidebar as drawer */}
      {isMobile && onSelectItem && (
        <ResponsiveSidebar onSelectItem={onSelectItem} />
      )}

      {/* Main content area */}
      <main
        className={cn(
          "flex-1 flex flex-col overflow-hidden",
          isMobile && "pt-16" // Add top padding for mobile menu button
        )}
      >
        <div
          className={cn(
            "flex-1 overflow-auto",
            // Responsive padding
            isMobile ? "p-2" : isTablet ? "p-4" : "p-6"
          )}
        >
          {children}
        </div>
      </main>
    </div>
  );
}

// Responsive container component
interface ResponsiveContainerProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
}

export function ResponsiveContainer({
  children,
  className,
  maxWidth = "full",
}: ResponsiveContainerProps) {
  const { isMobile, isTablet } = useResponsive();

  const maxWidthClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    full: "max-w-full",
  };

  return (
    <div
      className={cn(
        "w-full mx-auto",
        maxWidthClasses[maxWidth],
        // Responsive padding
        isMobile ? "px-2" : isTablet ? "px-4" : "px-6",
        className
      )}
    >
      {children}
    </div>
  );
}

// Responsive grid component
interface ResponsiveGridProps {
  children: React.ReactNode;
  className?: string;
  cols?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
    wide?: number;
  };
  gap?: "sm" | "md" | "lg" | "xl";
}

export function ResponsiveGrid({
  children,
  className,
  cols = { mobile: 1, tablet: 2, desktop: 3, wide: 4 },
  gap = "md",
}: ResponsiveGridProps) {
  const { breakpoint } = useResponsive();

  const gapClasses = {
    sm: "gap-2",
    md: "gap-4",
    lg: "gap-6",
    xl: "gap-8",
  };

  const getGridCols = () => {
    switch (breakpoint) {
      case "mobile":
        return `grid-cols-${cols.mobile || 1}`;
      case "tablet":
        return `grid-cols-${cols.tablet || 2}`;
      case "desktop":
        return `grid-cols-${cols.desktop || 3}`;
      case "wide":
        return `grid-cols-${cols.wide || 4}`;
      default:
        return "grid-cols-1";
    }
  };

  return (
    <div className={cn("grid", getGridCols(), gapClasses[gap], className)}>
      {children}
    </div>
  );
}

// Responsive stack component
interface ResponsiveStackProps {
  children: React.ReactNode;
  className?: string;
  direction?: {
    mobile?: "row" | "col";
    tablet?: "row" | "col";
    desktop?: "row" | "col";
  };
  gap?: "sm" | "md" | "lg" | "xl";
  align?: "start" | "center" | "end" | "stretch";
  justify?: "start" | "center" | "end" | "between" | "around" | "evenly";
}

export function ResponsiveStack({
  children,
  className,
  direction = { mobile: "col", tablet: "row", desktop: "row" },
  gap = "md",
  align = "start",
  justify = "start",
}: ResponsiveStackProps) {
  const { isMobile, isTablet } = useResponsive();

  const gapClasses = {
    sm: "gap-2",
    md: "gap-4",
    lg: "gap-6",
    xl: "gap-8",
  };

  const alignClasses = {
    start: "items-start",
    center: "items-center",
    end: "items-end",
    stretch: "items-stretch",
  };

  const justifyClasses = {
    start: "justify-start",
    center: "justify-center",
    end: "justify-end",
    between: "justify-between",
    around: "justify-around",
    evenly: "justify-evenly",
  };

  const getDirection = () => {
    if (isMobile) return direction.mobile === "row" ? "flex-row" : "flex-col";
    if (isTablet) return direction.tablet === "row" ? "flex-row" : "flex-col";
    return direction.desktop === "row" ? "flex-row" : "flex-col";
  };

  return (
    <div
      className={cn(
        "flex",
        getDirection(),
        gapClasses[gap],
        alignClasses[align],
        justifyClasses[justify],
        className
      )}
    >
      {children}
    </div>
  );
}
