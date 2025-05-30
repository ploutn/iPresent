import React from "react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface NavigationItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: string | number;
  disabled?: boolean;
  onClick: () => void;
}

interface PageNavigationProps {
  items: NavigationItem[];
  activeItem?: string;
  variant?: "tabs" | "pills" | "sidebar";
  orientation?: "horizontal" | "vertical";
  className?: string;
  showNavigation?: boolean;
  onPrevious?: () => void;
  onNext?: () => void;
  previousLabel?: string;
  nextLabel?: string;
}

export function PageNavigation({
  items,
  activeItem,
  variant = "tabs",
  orientation = "horizontal",
  className,
  showNavigation = false,
  onPrevious,
  onNext,
  previousLabel = "Previous",
  nextLabel = "Next",
}: PageNavigationProps) {
  const isHorizontal = orientation === "horizontal";

  const getVariantStyles = () => {
    switch (variant) {
      case "pills":
        return {
          container: cn(
            "flex gap-1 p-1 bg-muted rounded-lg",
            isHorizontal ? "flex-row" : "flex-col"
          ),
          item: "rounded-md px-3 py-2 text-sm font-medium transition-all",
          active: "bg-background text-foreground shadow-sm",
          inactive:
            "text-muted-foreground hover:text-foreground hover:bg-background/50",
        };
      case "sidebar":
        return {
          container: cn(
            "flex gap-1",
            isHorizontal ? "flex-row" : "flex-col w-full"
          ),
          item: "justify-start px-3 py-2 text-sm font-medium transition-all",
          active: "bg-accent text-accent-foreground",
          inactive:
            "text-muted-foreground hover:text-foreground hover:bg-accent/50",
        };
      default: // tabs
        return {
          container: cn(
            "flex border-b border-border",
            isHorizontal ? "flex-row" : "flex-col border-r border-b-0"
          ),
          item: cn(
            "px-4 py-2 text-sm font-medium transition-all border-b-2 border-transparent",
            isHorizontal ? "" : "border-b-0 border-r-2"
          ),
          active: cn(
            "text-foreground border-primary",
            isHorizontal ? "border-b-primary" : "border-r-primary"
          ),
          inactive:
            "text-muted-foreground hover:text-foreground hover:border-muted-foreground/50",
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div className={cn("flex items-center justify-between", className)}>
      {/* Navigation Items */}
      <nav className={styles.container}>
        {items.map((item) => {
          const isActive = activeItem === item.id;
          const isDisabled = item.disabled;

          return (
            <Button
              key={item.id}
              variant={variant === "tabs" ? "ghost" : "ghost"}
              size="sm"
              disabled={isDisabled}
              onClick={item.onClick}
              className={cn(
                styles.item,
                isActive ? styles.active : styles.inactive,
                isDisabled && "opacity-50 cursor-not-allowed"
              )}
            >
              <div className="flex items-center gap-2">
                {item.icon}
                <span>{item.label}</span>
                {item.badge && (
                  <Badge
                    variant={isActive ? "default" : "secondary"}
                    className="ml-1 h-5 px-1.5 text-xs"
                  >
                    {item.badge}
                  </Badge>
                )}
              </div>
            </Button>
          );
        })}
      </nav>

      {/* Previous/Next Navigation */}
      {showNavigation && (onPrevious || onNext) && (
        <div className="flex items-center gap-2">
          {onPrevious && (
            <Button
              variant="outline"
              size="sm"
              onClick={onPrevious}
              className="flex items-center gap-1"
            >
              <ChevronLeft className="h-4 w-4" />
              {previousLabel}
            </Button>
          )}
          {onNext && (
            <Button
              variant="outline"
              size="sm"
              onClick={onNext}
              className="flex items-center gap-1"
            >
              {nextLabel}
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

export type { NavigationItem, PageNavigationProps };
