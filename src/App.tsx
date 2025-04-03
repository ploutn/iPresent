import React, { useState } from "react";
import { Sidebar } from "./components/Sidebar";
import { HomePage } from "./components/pages/HomePage";
import { SongsPage } from "./components/pages/SongsPage";
import { MediaPage } from "./components/pages/MediaPage";
import { SettingsPage } from "./components/pages/SettingsPage";
import { BiblePage } from "./components/pages/BiblePage";
import { AnnouncementsPage } from "./components/pages/AnnouncementsPage";
import { useSidebar } from "./components/hooks/useSidebar";
import { ContentForm } from "./components/ContentForm";
import { useContentStore } from "./stores/useContentStore";
import { OutputManagement } from "./components/OutputManagement";
import { Preview } from "./components/Preview";
import { ScheduleView } from "./components/ScheduleView";
import { LivePresentation } from "./components/LivePresentation";
import { ResizablePanel, ResizablePanelGroup } from "./components/ui/resizable";
import { Button } from "./components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./components/ui/tooltip";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Settings,
  Maximize2,
  Minimize2,
} from "lucide-react";

function App() {
  const { activeTab, setActiveTab } = useSidebar();
  const [showContentForm, setShowContentForm] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { setSelectedItem } = useContentStore();

  // Set a default active tab if none is selected
  if (!activeTab) {
    setActiveTab("home");
  }

  // Function to render the active page content
  const renderActiveContent = () => {
    switch (activeTab) {
      case "home":
        return <HomePage />;
      case "songs":
        return <SongsPage />;
      case "bible":
        return <BiblePage />;
      case "media":
        return <MediaPage />;
      case "announcements":
        return <AnnouncementsPage />;
      case "settings":
        return <SettingsPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="h-screen flex flex-col bg-[#1a1a1a] text-white overflow-hidden">
      {/* Header */}
      <header className="h-12 border-b border-gray-800 px-4 flex items-center justify-between bg-[#2D3748] shadow-md">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-bold tracking-tight">iPresent Pro</h1>
          <div className="flex items-center gap-2 text-xs">
            <span className="px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 font-medium">
              Connected
            </span>
            <span className="text-gray-400">v2.0.0</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 hover:bg-gray-700"
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Settings</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal">
          {/* Sidebar */}
          <ResizablePanel
            defaultSize={15}
            minSize={12}
            maxSize={20}
            className="bg-[#1a1a1a] border-r border-gray-800"
          >
            <Sidebar onSelectItem={(item) => setSelectedItem(item)} />
          </ResizablePanel>

          {/* Content Panel */}
          <ResizablePanel defaultSize={60} minSize={40}>
            <div className="h-full flex flex-col">
              {/* Preview Header */}
              <div className="h-10 border-b border-gray-800 px-4 flex justify-between items-center bg-[#2D3748]">
                <h2 className="text-sm font-medium">Preview</h2>
                <div className="flex items-center gap-1">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:bg-gray-700"
                        >
                          {isMuted ? (
                            <VolumeX className="h-4 w-4" />
                          ) : (
                            <Volume2 className="h-4 w-4" />
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Toggle Mute</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:bg-gray-700"
                        >
                          {isFullscreen ? (
                            <Minimize2 className="h-4 w-4" />
                          ) : (
                            <Maximize2 className="h-4 w-4" />
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Toggle Fullscreen</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>

              {/* Preview Content */}
              <div className="flex-1 p-4">
                <div className="h-full rounded-lg overflow-hidden border border-gray-800 bg-black shadow-lg">
                  {renderActiveContent()}
                </div>
              </div>

              {/* Controls Bar */}
              <div className="h-10 border-t border-gray-800 px-4 flex justify-between items-center bg-[#2D3748]">
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-medium">Schedule</h2>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 hover:bg-gray-700"
                    >
                      <SkipBack className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 hover:bg-gray-700"
                      onClick={() => setIsPlaying(!isPlaying)}
                    >
                      {isPlaying ? (
                        <Pause className="h-3.5 w-3.5" />
                      ) : (
                        <Play className="h-3.5 w-3.5" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 hover:bg-gray-700"
                    >
                      <SkipForward className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-medium">Live</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs bg-red-500/20 text-red-400 hover:bg-red-500/30"
                  >
                    Blackout
                  </Button>
                </div>
              </div>

              {/* Bottom Panels */}
              <div className="h-64 p-4 flex space-x-4">
                <div className="flex-1 rounded-lg overflow-hidden border border-gray-800 bg-[#1a1a1a] shadow-lg">
                  <ScheduleView />
                </div>
                <div className="flex-1 rounded-lg overflow-hidden border border-gray-800 bg-[#1a1a1a] shadow-lg">
                  <LivePresentation />
                </div>
              </div>
            </div>
          </ResizablePanel>

          {/* Output Panel */}
          <ResizablePanel
            defaultSize={25}
            minSize={20}
            className="bg-[#1a1a1a] border-l border-gray-800"
          >
            {/* Output Preview Header */}
            <div className="h-10 border-b border-gray-800 px-4 flex justify-between items-center bg-[#2D3748]">
              <h2 className="text-sm font-medium">Output Preview</h2>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs hover:bg-gray-700"
                >
                  Program
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs hover:bg-gray-700"
                >
                  Stage
                </Button>
              </div>
            </div>

            {/* Output Preview Content */}
            <div className="p-4 h-1/3 min-h-[200px]">
              <div className="h-full rounded-lg overflow-hidden border border-gray-800 bg-black shadow-lg">
                <Preview />
              </div>
            </div>

            {/* Outputs Section */}
            <div className="h-10 border-b border-t border-gray-800 px-4 flex justify-between items-center bg-[#2D3748]">
              <h2 className="text-sm font-medium">Outputs</h2>
              <div className="flex space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs hover:bg-gray-700"
                >
                  +
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs hover:bg-gray-700"
                >
                  ⋮
                </Button>
              </div>
            </div>

            {/* Outputs Content */}
            <div className="p-4 h-2/3">
              <OutputManagement className="h-full" />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      {showContentForm && (
        <ContentForm onClose={() => setShowContentForm(false)} />
      )}
    </div>
  );
}

export default App;
