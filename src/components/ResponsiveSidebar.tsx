import React, { useState, useEffect, useRef } from "react";
import { ScrollArea } from "./ui/scroll-area";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import {
  Music,
  Image,
  Video,
  FileText,
  Settings,
  BookOpen,
  Home,
  Presentation,
  Menu,
  X,
} from "lucide-react";
import { useContentStore } from "../stores/useContentStore";
import { ContentItem } from "../types";
import { useSidebar } from "./hooks/useSidebar";
import { useResponsive } from "../hooks/useResponsive";
import { useAccessibleNavigation } from "../hooks/useAccessibleNavigation";
import {
  announceToScreenReader,
  FocusManager,
  AriaUtils,
} from "../utils/accessibility";
import { cn } from "../lib/utils";
import "../styles/accessibility.css";

interface ResponsiveSidebarProps {
  onSelectItem: (item: ContentItem) => void;
}

const navigationItems = [
  {
    id: "home" as const,
    label: "Home",
    icon: Home,
    description: "Go to home page",
    shortcut: "Alt+H",
  },
  {
    id: "songs" as const,
    label: "Songs",
    icon: Music,
    description: "Browse and manage songs",
    shortcut: "Alt+S",
  },
  {
    id: "bible" as const,
    label: "Bible",
    icon: BookOpen,
    description: "Search and display Bible verses",
    shortcut: "Alt+B",
  },
  {
    id: "media" as const,
    label: "Media",
    icon: Video,
    description: "Manage images and videos",
    shortcut: "Alt+M",
  },
  {
    id: "announcements" as const,
    label: "Announcements",
    icon: FileText,
    description: "Create and display announcements",
    shortcut: "Alt+A",
  },
  {
    id: "presentations" as const,
    label: "Presentations",
    icon: Presentation,
    description: "Manage presentation slides",
    shortcut: "Alt+P",
  },
  {
    id: "settings" as const,
    label: "Settings",
    icon: Settings,
    description: "Configure application settings",
    shortcut: "Alt+T",
  },
];

function SidebarContent({
  onSelectItem,
  onItemClick,
}: {
  onSelectItem: (item: ContentItem) => void;
  onItemClick?: () => void;
}) {
  const { activeTab, setActiveTab } = useSidebar();
  const { isMobile } = useResponsive();
  const navigationId = useRef(AriaUtils.generateId("sidebar-nav"));
  const logoRef = useRef<HTMLDivElement>(null);

  // Convert navigation items for accessibility hook
  const accessibleNavItems = navigationItems.map((item) => ({
    id: item.id,
    label: item.label,
    onClick: () => handleTabClick(item.id),
    disabled: false,
  }));

  const {
    currentIndex,
    isKeyboardNavActive,
    getItemProps,
    getContainerProps,
    focusItem,
  } = useAccessibleNavigation({
    items: accessibleNavItems,
    orientation: "vertical",
    loop: true,
    autoFocus: false,
    announceChanges: true,
  });

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    announceToScreenReader(
      `${navigationItems.find((item) => item.id === tabId)?.label} selected`
    );
    onItemClick?.(); // Close mobile menu
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.altKey) {
        const item = navigationItems.find(
          (item) => item.shortcut === `Alt+${event.key.toUpperCase()}`
        );
        if (item) {
          event.preventDefault();
          handleTabClick(item.id);
          const index = navigationItems.findIndex((nav) => nav.id === item.id);
          focusItem(index);
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [focusItem]);

  // Skip link for keyboard users
  const skipToContent = () => {
    const mainContent = document.getElementById("main-content");
    if (mainContent) {
      mainContent.focus();
      mainContent.scrollIntoView({ behavior: "smooth" });
      announceToScreenReader("Skipped to main content");
    }
  };

  return (
    <div
      className={cn("flex flex-col h-full", isMobile ? "w-full" : "w-[100px]")}
      role="banner"
    >
      {/* Skip Link */}
      <a
        href="#main-content"
        className="skip-link"
        onClick={(e) => {
          e.preventDefault();
          skipToContent();
        }}
      >
        Skip to main content
      </a>

      {/* Logo */}
      <div
        ref={logoRef}
        className={cn(
          "flex items-center justify-center mb-8",
          isMobile ? "py-4" : "py-6"
        )}
        role="img"
        aria-label="iPresent application logo"
      >
        <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
          <span
            className="text-2xl font-bold text-primary-foreground"
            aria-hidden="true"
          >
            iP
          </span>
        </div>
        {isMobile && (
          <span className="ml-3 text-xl font-bold text-foreground">
            iPresent
          </span>
        )}
      </div>

      {/* Navigation Items */}
      <nav
        {...getContainerProps()}
        className={cn(
          "flex-1 flex gap-2",
          isMobile ? "flex-col px-4" : "flex-col items-center"
        )}
        aria-label="Main navigation"
      >
        <div className="sr-only" aria-live="polite" id="nav-instructions">
          Use arrow keys to navigate, Enter to select, or use keyboard shortcuts
        </div>

        {navigationItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          const itemProps = getItemProps(accessibleNavItems[index], index);

          return (
            <Button
              key={item.id}
              {...itemProps}
              variant="ghost"
              size={isMobile ? "default" : "icon"}
              className={cn(
                "transition-all duration-200 touch-target",
                isMobile
                  ? isActive
                    ? "bg-primary text-primary-foreground justify-start"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground justify-start"
                  : isActive
                  ? "w-12 h-12 rounded-xl bg-primary text-primary-foreground shadow-md"
                  : "w-12 h-12 rounded-xl text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                isKeyboardNavActive && index === currentIndex && "focus-visible"
              )}
              aria-label={`${item.label}. ${item.description}. Keyboard shortcut: ${item.shortcut}`}
              aria-describedby={isMobile ? undefined : `tooltip-${item.id}`}
              title={isMobile ? undefined : `${item.label} (${item.shortcut})`}
            >
              <Icon
                className={cn("h-5 w-5", isMobile && "mr-3")}
                aria-hidden="true"
              />
              {isMobile && (
                <span className="flex-1 text-left">{item.label}</span>
              )}
              {isMobile && (
                <span className="text-xs text-muted-foreground ml-auto">
                  {item.shortcut.replace("Alt+", "⌥")}
                </span>
              )}
            </Button>
          );
        })}

        {/* Tooltips for desktop mode */}
        {!isMobile &&
          navigationItems.map((item) => (
            <div
              key={`tooltip-${item.id}`}
              id={`tooltip-${item.id}`}
              className="sr-only"
              role="tooltip"
            >
              {item.description}. Keyboard shortcut: {item.shortcut}
            </div>
          ))}
      </nav>

      {/* Keyboard shortcuts help */}
      <div className="sr-only" aria-live="polite">
        Navigation shortcuts:{" "}
        {navigationItems
          .map((item) => `${item.label}: ${item.shortcut}`)
          .join(", ")}
      </div>
    </div>
  );
}

export function ResponsiveSidebar({ onSelectItem }: ResponsiveSidebarProps) {
  const { isMobile } = useResponsive();
  const [isOpen, setIsOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  // Handle escape key to close mobile menu
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        setIsOpen(false);
        // Return focus to menu button
        setTimeout(() => {
          menuButtonRef.current?.focus();
        }, 100);
        announceToScreenReader("Navigation menu closed");
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      // Save focus when opening
      FocusManager.saveFocus();
      announceToScreenReader("Navigation menu opened");
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  // Handle mobile menu state changes
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      // Restore focus when closing
      FocusManager.restoreFocus();
      announceToScreenReader("Navigation menu closed");
    }
  };

  if (isMobile) {
    return (
      <>
        <Sheet open={isOpen} onOpenChange={handleOpenChange}>
          <SheetTrigger asChild>
            <Button
              ref={menuButtonRef}
              variant="ghost"
              size="icon"
              className="fixed top-4 left-4 z-50 md:hidden bg-background/80 backdrop-blur-sm border border-border touch-target"
              aria-label="Open navigation menu"
              aria-expanded={isOpen}
              aria-controls="mobile-navigation"
              aria-haspopup="true"
            >
              <Menu className="h-5 w-5" aria-hidden="true" />
              <span className="sr-only">
                {isOpen ? "Close" : "Open"} navigation menu
              </span>
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="w-[280px] p-0 focus-trap"
            id="mobile-navigation"
            aria-label="Mobile navigation menu"
            onOpenAutoFocus={(event) => {
              // Prevent auto focus on sheet content, let our navigation handle it
              event.preventDefault();
            }}
          >
            <SidebarContent
              onSelectItem={onSelectItem}
              onItemClick={() => setIsOpen(false)}
            />
          </SheetContent>
        </Sheet>

        {/* Mobile navigation landmark for screen readers */}
        <div className="sr-only" aria-live="polite">
          {isOpen ? "Navigation menu is open" : "Navigation menu is closed"}
        </div>
      </>
    );
  }

  return (
    <aside
      className="w-[100px] bg-card border-r border-border flex flex-col items-center py-6 h-full overflow-y-auto"
      role="navigation"
      aria-label="Main navigation sidebar"
      id="desktop-navigation"
    >
      <SidebarContent onSelectItem={onSelectItem} />
    </aside>
  );
}
