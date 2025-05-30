import React from "react";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
  icon?: React.ReactNode;
  current?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
  showHome?: boolean;
}

export function Breadcrumb({
  items,
  className,
  showHome = true,
}: BreadcrumbProps) {
  const allItems = showHome
    ? [
        {
          label: "Home",
          icon: <Home className="h-4 w-4" />,
          onClick: () => {}, // Will be handled by parent
        },
        ...items,
      ]
    : items;

  return (
    <nav
      className={cn(
        "flex items-center space-x-1 text-sm text-muted-foreground",
        className
      )}
      aria-label="Breadcrumb"
    >
      {allItems.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && (
            <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
          )}
          <div className="flex items-center">
            {item.current ? (
              <span className="flex items-center gap-1.5 font-medium text-foreground">
                {item.icon}
                {item.label}
              </span>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-1 font-normal text-muted-foreground hover:text-foreground"
                onClick={item.onClick || (() => {})}
              >
                <span className="flex items-center gap-1.5">
                  {item.icon}
                  {item.label}
                </span>
              </Button>
            )}
          </div>
        </React.Fragment>
      ))}
    </nav>
  );
}

export type { BreadcrumbItem, BreadcrumbProps };
