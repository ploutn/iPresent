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
import { Settings, Maximize2, Minimize2 } from "lucide-react";
import { CountdownTimer } from "./components/interactive/CountdownTimer";
import { PollElement } from "./components/interactive/PollElement";
import { InteractiveButton } from "./components/interactive/InteractiveButton";
import { PresenterNotes } from "./components/interactive/PresenterNotes";
import { InteractiveElementForm } from "./components/interactive/InteractiveElementForm";
import { AnyInteractiveElement } from "./types/interactive";

function App() {
  const { activeTab, setActiveTab } = useSidebar();
  const [showContentForm, setShowContentForm] = useState(false);
  const { setSelectedItem } = useContentStore();
  const [interactiveElements, setInteractiveElements] = useState<
    AnyInteractiveElement[]
  >([]);
  const [showInteractiveElementForm, setShowInteractiveElementForm] =
    useState(false);

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
    <div className="h-screen flex flex-col bg-[#1a1a1a] text-white overflow-auto">
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
      <div className="flex-1 overflow-auto">
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
                          <Maximize2 className="h-4 w-4" />
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

              {/* Bottom Panels - Interactive Elements */}
              <div className="flex-1 min-h-[200px] p-4 flex space-x-4 overflow-y-auto">
                <div className="flex-1 rounded-lg overflow-hidden border border-gray-800 bg-[#1a1a1a] shadow-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium text-white">
                      Interactive Elements
                    </h3>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 text-xs border-gray-700 hover:bg-gray-700"
                      onClick={() => setShowInteractiveElementForm(true)}
                    >
                      Add Element
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-4 overflow-y-auto h-full max-h-[500px]">
                    {interactiveElements.length === 0 ? (
                      <div className="col-span-2 flex items-center justify-center h-full">
                        <div className="text-center text-gray-500">
                          <p>No interactive elements added</p>
                          <Button
                            variant="link"
                            className="text-xs mt-2 text-blue-400"
                            onClick={() => setShowInteractiveElementForm(true)}
                          >
                            Add your first element
                          </Button>
                        </div>
                      </div>
                    ) : (
                      interactiveElements.map((element) => (
                        <div
                          key={element.id}
                          className="scale-90 origin-top-left"
                        >
                          {element.type === "timer" && (
                            <CountdownTimer
                              initialMinutes={element.initialMinutes}
                              initialSeconds={element.initialSeconds}
                              size="sm"
                              showControls={element.showControls}
                              autoStart={element.autoStart}
                              className="h-full"
                            />
                          )}
                          {element.type === "poll" && (
                            <PollElement
                              id={element.id}
                              question={element.question}
                              options={element.options}
                              showResults={element.showResults}
                              isVisible={element.isVisible}
                            />
                          )}
                          {element.type === "button" && (
                            <InteractiveButton
                              id={element.id}
                              label={element.label}
                              action={element.action}
                              variant={element.variant}
                              isVisible={element.isVisible}
                            />
                          )}
                          {element.type === "notes" && (
                            <PresenterNotes
                              id={element.id}
                              title={element.title}
                              notes={element.notes}
                              checklist={element.checklist}
                              isVisible={element.isVisible}
                            />
                          )}
                        </div>
                      ))
                    )}
                  </div>
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
            <div className="p-4 flex flex-col gap-4 h-full">
              <div className="h-1/3 rounded-lg overflow-hidden border border-gray-800 bg-black shadow-lg flex flex-col">
                <div className="p-3 font-semibold text-sm">PREVIEW</div>
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-gray-400 text-sm">No output selected</p>
                  </div>
                </div>
              </div>

              {/* Live Presentation Section */}
              <div className="h-[200px] rounded-lg overflow-hidden border border-gray-800 bg-[#1a1a1a] shadow-lg">
                <LivePresentation />
              </div>

              {/* Schedule View Section */}
              <div className="h-[200px] rounded-lg overflow-hidden border border-gray-800 bg-[#1a1a1a] shadow-lg">
                <ScheduleView />
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      {showContentForm && (
        <ContentForm
          onClose={() => setShowContentForm(false)}
          onAddInteractiveElements={(elements) => {
            setInteractiveElements((prev) => [...prev, ...elements]);
          }}
          existingInteractiveElements={interactiveElements}
        />
      )}

      {showInteractiveElementForm && (
        <InteractiveElementForm
          onAdd={(element) => {
            setInteractiveElements((prev) => [...prev, element]);
            setShowInteractiveElementForm(false);
          }}
          onClose={() => setShowInteractiveElementForm(false)}
          open={showInteractiveElementForm}
        />
      )}
    </div>
  );
}

export default App;
