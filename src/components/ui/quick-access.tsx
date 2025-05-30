import React from "react";
import { Button } from "./button";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { Plus, Search, Clock, Star, Zap, ChevronDown } from "lucide-react";

interface QuickAccessItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  tooltip?: string;
  badge?: string | number;
}

interface QuickAccessProps {
  items: QuickAccessItem[];
  recentItems?: QuickAccessItem[];
  favoriteItems?: QuickAccessItem[];
  className?: string;
}

export function QuickAccess({
  items,
  recentItems = [],
  favoriteItems = [],
  className,
}: QuickAccessProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      {/* Primary Quick Actions */}
      <div className="flex items-center gap-1">
        {items.slice(0, 3).map((item) => (
          <TooltipProvider key={item.id}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 hover:bg-accent relative"
                  onClick={item.onClick}
                >
                  {item.icon}
                  {item.badge && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>{item.tooltip || item.label}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>

      {/* More Actions Dropdown */}
      {(items.length > 3 ||
        recentItems.length > 0 ||
        favoriteItems.length > 0) && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-muted-foreground hover:text-foreground"
            >
              <Zap className="h-4 w-4 mr-1" />
              Quick
              <ChevronDown className="h-3 w-3 ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            {/* Additional Primary Actions */}
            {items.length > 3 && (
              <>
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                {items.slice(3).map((item) => (
                  <DropdownMenuItem
                    key={item.id}
                    onClick={item.onClick}
                    className="flex items-center gap-2"
                  >
                    {item.icon}
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="ml-auto text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded">
                        {item.badge}
                      </span>
                    )}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
              </>
            )}

            {/* Favorites */}
            {favoriteItems.length > 0 && (
              <>
                <DropdownMenuLabel className="flex items-center gap-1">
                  <Star className="h-3 w-3" />
                  Favorites
                </DropdownMenuLabel>
                {favoriteItems.map((item) => (
                  <DropdownMenuItem
                    key={item.id}
                    onClick={item.onClick}
                    className="flex items-center gap-2"
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
              </>
            )}

            {/* Recent Items */}
            {recentItems.length > 0 && (
              <>
                <DropdownMenuLabel className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Recent
                </DropdownMenuLabel>
                {recentItems.map((item) => (
                  <DropdownMenuItem
                    key={item.id}
                    onClick={item.onClick}
                    className="flex items-center gap-2"
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </DropdownMenuItem>
                ))}
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}

export type { QuickAccessItem, QuickAccessProps };
