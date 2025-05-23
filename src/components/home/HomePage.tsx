import React from "react";
import {
  Music,
  Book,
  Video,
  FileText,
  Clock,
  Plus,
  Search,
  ChevronRight,
} from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { cn } from "../../lib/utils";
import { useContentStore } from "../../stores/useContentStore";
import { useRouter } from "next/router";
import {
  QuickAccessCustomize,
  useQuickAccessSettings,
} from "../QuickAccessCustomize";
import { useSidebar } from "../hooks/useSidebar";

interface QuickAccessItem {
  id: "home" | "songs" | "bible" | "media" | "announcements" | "settings";
  title: string;
  icon: React.ReactNode;
  bgColor: string;
  iconColor: string;
  path: string;
}

interface RecentItem {
  id: string;
  title: string;
  type: "song" | "bible" | "media" | "announcement";
  timestamp: Date;
}

export function HomePage() {
  // Remove router usage
  const { setSelectedItem } = useContentStore();
  const { setActiveTab } = useSidebar();
  const { items: quickAccessSettings } = useQuickAccessSettings();

  const quickAccessItems: QuickAccessItem[] = [
    {
      id: "songs",
      title: "Songs",
      icon: <Music className="h-8 w-8" />,
      bgColor: "bg-[#1e3a8a]",
      iconColor: "text-blue-300",
      path: "/songs",
    },
    {
      id: "bible",
      title: "Bible",
      icon: <Book className="h-8 w-8" />,
      bgColor: "bg-[#5b21b6]",
      iconColor: "text-purple-300",
      path: "/bible",
    },
    {
      id: "media",
      title: "Media",
      icon: <Video className="h-8 w-8" />,
      bgColor: "bg-[#7c2d12]",
      iconColor: "text-orange-300",
      path: "/media",
    },
    {
      id: "announcements",
      title: "Announcements",
      icon: <FileText className="h-8 w-8" />,
      bgColor: "bg-[#166534]",
      iconColor: "text-green-300",
      path: "/announcements",
    },
  ];

  const handleQuickAccessClick = (item: QuickAccessItem) => {
    setActiveTab(item.id);
    // Instead of using router.push, just use setActiveTab
  };

  const recentItems: RecentItem[] = [
    // This would normally come from your content store
  ];

  // Filter and sort quick access items based on settings
  const filteredQuickAccessItems = quickAccessItems
    .filter(
      (item) =>
        quickAccessSettings.find((setting) => setting.id === item.id)?.enabled
    )
    .sort((a, b) => {
      const aOrder =
        quickAccessSettings.find((setting) => setting.id === a.id)?.order || 0;
      const bOrder =
        quickAccessSettings.find((setting) => setting.id === b.id)?.order || 0;
      return aOrder - bOrder;
    });

  return (
    <div className="h-full flex flex-col bg-[#1e293b] overflow-y-auto">
      {/* Welcome Header */}
      <div className="p-6 border-b border-gray-700/50">
        <h1 className="text-2xl font-bold text-white mb-2">
          Welcome to iPresent 2.0
        </h1>
        <p className="text-gray-300">
          Get started by selecting an item from Quick Access or searching your
          library.
        </p>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto p-6 space-y-8">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search your library..."
              className="w-full pl-10 bg-[#0f172a]/50 border-gray-700/50 text-white placeholder-gray-400 focus:border-gray-600"
            />
          </div>

          {/* Quick Access Section */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Quick Access</h2>
              <QuickAccessCustomize />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredQuickAccessItems.map((item) => (
                <Button
                  key={item.id}
                  variant="ghost"
                  className={cn(
                    "relative h-32 p-0 flex flex-col items-center justify-center gap-4 rounded-lg border-0 overflow-hidden transition-all hover:scale-[1.02] hover:shadow-lg hover:brightness-110",
                    item.bgColor
                  )}
                  onClick={() => handleQuickAccessClick(item)}
                >
                  <div
                    className={cn(
                      "transition-transform group-hover:scale-110",
                      item.iconColor
                    )}
                  >
                    {item.icon}
                  </div>
                  <span className="font-medium text-white text-lg">
                    {item.title}
                  </span>
                </Button>
              ))}
            </div>
          </section>

          {/* Recent Items Section */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Recent Items</h2>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-300 hover:text-white hover:bg-gray-700/50"
              >
                View All <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
            {recentItems.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recentItems.map((item) => (
                  <Button
                    key={item.id}
                    variant="ghost"
                    className="flex items-center justify-between p-4 h-auto text-left border border-gray-700/50 rounded-lg hover:bg-gray-700/30"
                  >
                    <div className="flex items-center gap-3">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="font-medium text-white">{item.title}</p>
                        <p className="text-sm text-gray-400">
                          {item.type.charAt(0).toUpperCase() +
                            item.type.slice(1)}{" "}
                          • {new Date(item.timestamp).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </Button>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 border border-gray-700/50 rounded-lg bg-[#0f172a]/30">
                <Clock className="h-8 w-8 text-gray-400 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-white mb-1">
                  No Recent Items
                </h3>
                <p className="text-gray-300 mb-4">
                  Items you've recently worked with will appear here
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 border-gray-700 hover:bg-gray-700/30 hover:border-gray-600"
                >
                  <Plus className="h-4 w-4" /> Create New Item
                </Button>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
