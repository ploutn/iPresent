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
import {
  Settings,
  Maximize2,
  User,
  Plus,
  Sun,
  Moon,
  HelpCircle,
  Keyboard,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Play,
} from "lucide-react";
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
  const [editingElement, setEditingElement] =
    useState<AnyInteractiveElement | null>(null);
  const [theme, setTheme] = useState("dark");
  const [showShortcuts, setShowShortcuts] = useState(false);

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

  // Theme toggle handler
  const handleThemeToggle = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
    document.documentElement.classList.toggle("dark");
  };

  // Helper to get display name for interactive element
  function getElementDisplayName(element: AnyInteractiveElement) {
    switch (element.type) {
      case "timer":
        return "Timer";
      case "poll":
        return element.question;
      case "button":
        return element.label;
      case "notes":
        return element.title;
    }
  }

  // Add/Edit handler
  const handleAddOrEditElement = (element: AnyInteractiveElement) => {
    setInteractiveElements((prev) => {
      if (editingElement) {
        // Edit mode
        return prev.map((el) => (el.id === element.id ? element : el));
      } else {
        // Add mode
        return [...prev, element];
      }
    });
    setShowInteractiveElementForm(false);
    setEditingElement(null);
  };

  // Remove handler
  const handleRemoveElement = (id: string) => {
    setInteractiveElements((prev) => prev.filter((el) => el.id !== id));
  };

  // Toggle visibility handler
  const handleToggleVisibility = (id: string) => {
    setInteractiveElements((prev) =>
      prev.map((el) =>
        el.id === id ? { ...el, isVisible: !el.isVisible } : el
      )
    );
  };

  return (
    <div className="h-screen flex flex-col bg-[#181A20] text-white overflow-hidden relative">
      {/* Modern Header */}
      <header className="h-14 border-b border-gray-800 px-6 flex items-center justify-between bg-[#23263A] shadow-md z-10">
        <div className="flex items-center gap-4">
          <span className="text-2xl font-extrabold tracking-tight text-blue-400">
            iPresent Pro
          </span>
          <span className="px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 font-medium text-xs">
            Connected
          </span>
        </div>
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 hover:bg-gray-700"
                  onClick={handleThemeToggle}
                >
                  {theme === "dark" ? (
                    <Sun className="h-5 w-5" />
                  ) : (
                    <Moon className="h-5 w-5" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>Toggle Theme</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 hover:bg-gray-700"
                  onClick={() => setShowShortcuts(true)}
                >
                  <Keyboard className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Keyboard Shortcuts</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 hover:bg-gray-700"
                >
                  <HelpCircle className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Help & Docs</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 hover:bg-gray-700"
                >
                  <User className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Account</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 hover:bg-gray-700"
                >
                  <Settings className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Settings</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </header>

      {/* Main Content Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside className="w-20 bg-[#1a1a1a] border-r border-gray-800 flex flex-col items-center py-4 space-y-4">
          <Sidebar onSelectItem={setSelectedItem} />
        </aside>
        {/* Main Panel */}
        <main className="flex-1 flex flex-col min-h-0 bg-[#20222E]">
          <div className="flex-1 flex flex-col min-h-0">
            <div className="flex-1 p-6 overflow-auto">
              <div className="rounded-2xl shadow-xl border border-gray-800 bg-[#23263A] p-6 min-h-[400px]">
                {renderActiveContent()}
              </div>
            </div>
            {/* Bottom Panels */}
            <div className="h-64 p-6 flex space-x-6">
              {/* Interactive Elements Panel */}
              <div className="flex-1 rounded-2xl overflow-hidden border border-gray-800 bg-[#1a1a1a] shadow-lg flex flex-col">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <span className="text-blue-400">●</span> Interactive
                    Elements
                  </h3>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 px-3 text-xs border-gray-700 hover:bg-gray-700"
                    onClick={() => {
                      setEditingElement(null);
                      setShowInteractiveElementForm(true);
                    }}
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add
                  </Button>
                </div>
                <div className="flex-1 overflow-auto p-4">
                  {interactiveElements.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500">
                      <span className="text-4xl mb-2">✨</span>
                      <p className="font-medium">No interactive elements yet</p>
                      <p className="text-xs mt-1 mb-3">
                        Add timers, polls, buttons, or notes for your
                        presentation.
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-gray-700"
                        onClick={() => {
                          setEditingElement(null);
                          setShowInteractiveElementForm(true);
                        }}
                      >
                        <Plus className="h-4 w-4 mr-1" /> Add Interactive
                        Element
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-4">
                      {interactiveElements.map((element) => (
                        <div
                          key={element.id}
                          className="bg-[#23263A] rounded-xl p-4 flex flex-col gap-2 border border-gray-800 shadow"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            {/* Icon by type */}
                            {element.type === "timer" && (
                              <CountdownTimer {...element} size="sm" />
                            )}
                            {element.type === "poll" && (
                              <PollElement {...element} />
                            )}
                            {element.type === "button" && (
                              <InteractiveButton {...element} />
                            )}
                            {element.type === "notes" && (
                              <PresenterNotes {...element} />
                            )}
                            <span className="ml-2 font-semibold text-base truncate flex-1">
                              {getElementDisplayName(element)}
                            </span>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-7 w-7"
                              onClick={() => {
                                const now = new Date();
                                let title = getElementDisplayName(element);
                                let content = JSON.stringify(element, null, 2);
                                setSelectedItem({
                                  id: element.id,
                                  title: title,
                                  type: "announcement", // or a custom type if you want
                                  content: content,
                                  createdAt: now,
                                  updatedAt: now,
                                });
                              }}
                            >
                              <Play className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="flex gap-2 mt-2">
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-7 w-7"
                              onClick={() => {
                                setEditingElement(element);
                                setShowInteractiveElementForm(true);
                              }}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-7 w-7"
                              onClick={() => handleRemoveElement(element.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-7 w-7"
                              onClick={() => handleToggleVisibility(element.id)}
                            >
                              {element.isVisible ? (
                                <Eye className="h-4 w-4" />
                              ) : (
                                <EyeOff className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              {/* Schedule Panel */}
              <div className="flex-1 rounded-2xl overflow-hidden border border-gray-800 bg-[#1a1a1a] shadow-lg">
                <ScheduleView />
              </div>
              {/* Live Panel */}
              <div className="flex-1 rounded-2xl overflow-hidden border border-gray-800 bg-[#1a1a1a] shadow-lg">
                <LivePresentation />
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Floating Quick Add Button */}
      <Button
        className="fixed bottom-8 right-8 z-20 rounded-full h-16 w-16 bg-blue-600 hover:bg-blue-500 shadow-2xl flex items-center justify-center text-white text-3xl"
        onClick={() => setShowContentForm(true)}
      >
        <Plus className="h-10 w-10" />
      </Button>

      {/* Content Form Modal */}
      {showContentForm && (
        <ContentForm onClose={() => setShowContentForm(false)} />
      )}

      {/* Keyboard Shortcuts Modal (placeholder) */}
      {showShortcuts && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-[#23263A] rounded-2xl p-8 shadow-2xl border border-gray-700 max-w-lg w-full">
            <h2 className="text-xl font-bold mb-4">Keyboard Shortcuts</h2>
            <ul className="space-y-2 text-base">
              <li>
                <b>Ctrl + N</b>: New Item
              </li>
              <li>
                <b>Ctrl + S</b>: Save
              </li>
              <li>
                <b>Ctrl + F</b>: Search
              </li>
              <li>
                <b>Ctrl + P</b>: Present
              </li>
              <li>
                <b>Esc</b>: Close Modal
              </li>
            </ul>
            <div className="mt-6 flex justify-end">
              <Button
                onClick={() => setShowShortcuts(false)}
                className="bg-blue-600 hover:bg-blue-500"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {showInteractiveElementForm && (
        <InteractiveElementForm
          open={showInteractiveElementForm}
          onAdd={handleAddOrEditElement}
          onClose={() => {
            setShowInteractiveElementForm(false);
            setEditingElement(null);
          }}
        />
      )}

      {/* Notifications/Toasts Placeholder */}
      {/* You can integrate your toast system here */}
    </div>
  );
}

export default App;
