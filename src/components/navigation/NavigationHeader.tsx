import React from "react";
import { Breadcrumb, BreadcrumbItem } from "../ui/breadcrumb";
import { QuickAccess, QuickAccessItem } from "../ui/quick-access";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Search,
  Plus,
  FileText,
  Music,
  Image,
  Video,
  BookOpen,
  Presentation,
  Settings,
  Home,
  Calendar,
  Users,
  Folder,
  Star,
  Clock,
} from "lucide-react";
import { useSidebar } from "../hooks/useSidebar";
import { cn } from "@/lib/utils";

interface NavigationHeaderProps {
  className?: string;
  showSearch?: boolean;
  searchPlaceholder?: string;
  onSearch?: (query: string) => void;
  contextualActions?: React.ReactNode;
}

export function NavigationHeader({
  className,
  showSearch = true,
  searchPlaceholder = "Search...",
  onSearch,
  contextualActions,
}: NavigationHeaderProps) {
  const { activeTab, setActiveTab } = useSidebar();
  const [searchQuery, setSearchQuery] = React.useState("");

  // Define page metadata
  const pageMetadata = {
    home: {
      title: "Dashboard",
      icon: <Home className="h-4 w-4" />,
      description: "Overview and quick access",
    },
    songs: {
      title: "Songs",
      icon: <Music className="h-4 w-4" />,
      description: "Manage your song library",
    },
    bible: {
      title: "Bible",
      icon: <BookOpen className="h-4 w-4" />,
      description: "Scripture and verses",
    },
    media: {
      title: "Media",
      icon: <Video className="h-4 w-4" />,
      description: "Images, videos, and audio",
    },
    presentations: {
      title: "Presentations",
      icon: <Presentation className="h-4 w-4" />,
      description: "Slide presentations",
    },
    announcements: {
      title: "Announcements",
      icon: <FileText className="h-4 w-4" />,
      description: "News and updates",
    },
    settings: {
      title: "Settings",
      icon: <Settings className="h-4 w-4" />,
      description: "Application preferences",
    },
  };

  const currentPage = pageMetadata[activeTab as keyof typeof pageMetadata] || {
    title: "Unknown",
    icon: <Folder className="h-4 w-4" />,
    description: "",
  };

  // Generate breadcrumb items
  const breadcrumbItems: BreadcrumbItem[] = [
    {
      label: currentPage.title,
      icon: currentPage.icon,
      current: true,
    },
  ];

  // Define quick access items based on current page
  const getQuickAccessItems = (): QuickAccessItem[] => {
    const baseItems: QuickAccessItem[] = [
      {
        id: "search",
        label: "Global Search",
        icon: <Search className="h-4 w-4" />,
        onClick: () => {
          // Focus search input or open search modal
          const searchInput = document.querySelector(
            'input[type="search"]'
          ) as HTMLInputElement;
          if (searchInput) {
            searchInput.focus();
          }
        },
        tooltip: "Search across all content",
      },
      {
        id: "add",
        label: "Add New",
        icon: <Plus className="h-4 w-4" />,
        onClick: () => {
          // Context-aware add action
          switch (activeTab) {
            case "songs":
              // Trigger add song modal
              break;
            case "presentations":
              // Trigger add presentation modal
              break;
            case "media":
              // Trigger media import
              break;
            default:
              // Show generic add menu
              break;
          }
        },
        tooltip: `Add new ${currentPage.title.toLowerCase()}`,
      },
      {
        id: "schedule",
        label: "Schedule",
        icon: <Calendar className="h-4 w-4" />,
        onClick: () => setActiveTab("schedule-live"),
        tooltip: "View schedule and live controls",
      },
    ];

    return baseItems;
  };

  // Recent items (mock data - would come from store in real app)
  const recentItems: QuickAccessItem[] = [
    {
      id: "recent-1",
      label: "Amazing Grace",
      icon: <Music className="h-4 w-4" />,
      onClick: () => {
        setActiveTab("songs");
        // Navigate to specific song
      },
    },
    {
      id: "recent-2",
      label: "Sunday Service",
      icon: <Presentation className="h-4 w-4" />,
      onClick: () => {
        setActiveTab("presentations");
        // Navigate to specific presentation
      },
    },
  ];

  // Favorite items (mock data)
  const favoriteItems: QuickAccessItem[] = [
    {
      id: "fav-1",
      label: "Worship Set",
      icon: <Star className="h-4 w-4" />,
      onClick: () => {
        setActiveTab("songs");
        // Navigate to favorite playlist
      },
    },
  ];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearch?.(value);
  };

  return (
    <div
      className={cn(
        "flex items-center justify-between p-4 border-b border-border bg-card/50 backdrop-blur-sm",
        className
      )}
    >
      {/* Left Section: Breadcrumb and Page Info */}
      <div className="flex items-center gap-4 min-w-0 flex-1">
        <Breadcrumb
          items={breadcrumbItems}
          showHome={false}
          className="flex-shrink-0"
        />
        {currentPage.description && (
          <span className="text-sm text-muted-foreground hidden md:block">
            {currentPage.description}
          </span>
        )}
      </div>

      {/* Center Section: Search */}
      {showSearch && (
        <div className="flex-1 max-w-md mx-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={handleSearchChange}
              className="pl-10 h-9"
            />
          </div>
        </div>
      )}

      {/* Right Section: Quick Access and Contextual Actions */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <QuickAccess
          items={getQuickAccessItems()}
          recentItems={recentItems}
          favoriteItems={favoriteItems}
        />
        {contextualActions && (
          <>
            <div className="h-6 w-px bg-border" />
            {contextualActions}
          </>
        )}
      </div>
    </div>
  );
}

export type { NavigationHeaderProps };
