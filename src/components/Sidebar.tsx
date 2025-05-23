import React from "react";
import { ScrollArea } from "./ui/scroll-area";
import { Button } from "./ui/button";
import {
  Music,
  Image,
  Video,
  FileText,
  Plus,
  Search,
  Settings,
  BookOpen,
  Home,
  Play,
  Presentation, // Added Presentation for Presentations page
} from "lucide-react";
import { Input } from "./ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { useContentStore } from "../stores/useContentStore";
import { ContentItem, ContentType } from "../types";
import { useSidebar } from "./hooks/useSidebar";

interface SidebarProps {
  onSelectItem: (item: ContentItem) => void;
}

export function Sidebar({ onSelectItem }: SidebarProps) {
  const { items, searchQuery, setSearchQuery } = useContentStore();
  const { activeTab, setActiveTab } = useSidebar();

  const getIcon = (type: string) => {
    switch (type) {
      case "home":
        return <Home className="h-5 w-5" />;
      case "songs":
        return <Music className="h-5 w-5" />;
      case "bible":
        return <BookOpen className="h-5 w-5" />;
      case "media":
        return <Video className="h-5 w-5" />;
      case "announcements":
        return <FileText className="h-5 w-5" />;
      case "settings":
        return <Settings className="h-5 w-5" />;
      case "presentations": // Added case for presentations
        return <Presentation className="h-5 w-5" />;
      default:
        return null;
    }
  };

  return (
    <div className="w-[100px] bg-[#1A202C] border-r border-[#4A5568] flex flex-col items-center py-6 h-full overflow-y-auto">
      <div className="w-12 h-12 bg-[#3182CE] rounded-xl flex items-center justify-center mb-8">
        <span className="text-2xl font-bold text-white">iP</span>
      </div>

      <div className="flex-1 flex flex-col items-center gap-6">
        <Button
          variant="ghost"
          size="icon"
          className={`w-12 h-12 rounded-xl transition-all duration-200 ${
            activeTab === "home"
              ? "bg-[#3182CE] text-white shadow-md shadow-blue-500/20"
              : "text-[#A0AEC0] hover:bg-[#2D3748]"
          }`}
          onClick={() => setActiveTab("home")}
        >
          <Home className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className={`w-12 h-12 rounded-xl transition-all duration-200 ${
            activeTab === "songs"
              ? "bg-[#3182CE] text-white shadow-md shadow-blue-500/20"
              : "text-[#A0AEC0] hover:bg-[#2D3748]"
          }`}
          onClick={() => setActiveTab("songs")}
        >
          <Music className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className={`w-12 h-12 rounded-xl transition-all duration-200 ${
            activeTab === "bible"
              ? "bg-[#3182CE] text-white shadow-md shadow-blue-500/20"
              : "text-[#A0AEC0] hover:bg-[#2D3748]"
          }`}
          onClick={() => setActiveTab("bible")}
        >
          <BookOpen className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className={`w-12 h-12 rounded-xl transition-all duration-200 ${
            activeTab === "media"
              ? "bg-[#3182CE] text-white shadow-md shadow-blue-500/20"
              : "text-[#A0AEC0] hover:bg-[#2D3748]"
          }`}
          onClick={() => setActiveTab("media")}
        >
          <Video className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className={`w-12 h-12 rounded-xl transition-all duration-200 ${
            activeTab === "announcements"
              ? "bg-[#3182CE] text-white shadow-md shadow-blue-500/20"
              : "text-[#A0AEC0] hover:bg-[#2D3748]"
          }`}
          onClick={() => setActiveTab("announcements")}
        >
          <FileText className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className={`w-12 h-12 rounded-xl transition-all duration-200 ${
            activeTab === "settings"
              ? "bg-[#3182CE] text-white shadow-md shadow-blue-500/20"
              : "text-[#A0AEC0] hover:bg-[#2D3748]"
          }`}
          onClick={() => setActiveTab("settings")}
        >
          <Settings className="h-5 w-5" />
        </Button>
        {/* Presentations Button Start */}
        <Button
          variant="ghost"
          size="icon"
          className={`w-12 h-12 rounded-xl transition-all duration-200 ${
            activeTab === "presentations"
              ? "bg-[#3182CE] text-white shadow-md shadow-blue-500/20"
              : "text-[#A0AEC0] hover:bg-[#2D3748]"
          }`}
          onClick={() => setActiveTab("presentations")}
        >
          <Presentation className="h-5 w-5" />
        </Button>
        {/* Presentations Button End */}
      </div>
    </div>
  );
}
