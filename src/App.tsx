import React, { useState } from "react";
import { Sidebar } from "./components/Sidebar";
import { Suspense, lazy } from "react";

// Lazy load main page components for better code splitting
const HomePage = lazy(() =>
  import("./components/home/HomePage").then((module) => ({
    default: module.HomePage,
  }))
);
const SongsPage = lazy(() => import("./components/songs/SongsPage"));
const MediaPage = lazy(() =>
  import("./components/media/MediaPage").then((module) => ({
    default: module.MediaPage,
  }))
);
const SettingsPage = lazy(() =>
  import("./components/settings/SettingsPage").then((module) => ({
    default: module.SettingsPage,
  }))
);
const BiblePage = lazy(() =>
  import("./components/bible/BiblePage").then((module) => ({
    default: module.BiblePage,
  }))
);
const AnnouncementsPage = lazy(() =>
  import("./components/announcements/AnnouncementsPage").then((module) => ({
    default: module.AnnouncementsPage,
  }))
);
const PresentationsPage = lazy(() =>
  import("./components/presentations/PresentationsPage").then((module) => ({
    default: module.PresentationsPage,
  }))
);
const PresentationViewPage = lazy(() =>
  import("./pages/PresentationViewPage").then((module) => ({
    default: module.PresentationViewPage,
  }))
);
const OutputWindow = lazy(() => import("./pages/OutputWindow")); // Added import for OutputWindow
import { useSidebar } from "./components/hooks/useSidebar";
import { ContentForm } from "./components/ContentForm";
import { useContentStore } from "./stores/useContentStore";
import { Preview } from "./components/Preview"; // Ensure Preview is imported
import { ScheduleView } from "./components/ScheduleView";
import { LivePresentation } from "./components/LivePresentation";
import {
  ResizablePanel,
  ResizablePanelGroup,
  ResizableHandle,
} from "./components/ui/resizable";
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
import { MediaCacheProvider } from "./components/media/MediaCacheProvider";

// Loading component for lazy-loaded pages
const PageLoader = () => (
  <div className="flex items-center justify-center h-full w-full">
    <div className="flex flex-col items-center space-y-4">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      <p className="text-sm text-muted-foreground">Loading...</p>
    </div>
  </div>
);

function MainAppContent() {
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

  console.log("Current activeTab in App.tsx:", activeTab); // DEBUG LOG

  // Set a default active tab if none is selected
  if (!activeTab) {
    setActiveTab("home");
  }

  // Function to render the active page content with Suspense
  const renderActiveContent = () => {
    const content = (() => {
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
        case "presentations":
          return <PresentationsPage />;
        case "settings":
          return <SettingsPage />;
        case "schedule-live":
          return (
            <div className="flex h-full w-full gap-4">
              <div className="flex-1 min-w-0 border-r border-gray-800 pr-2 flex items-center justify-center">
                <div className="aspect-[16/9] w-full max-w-full flex items-center justify-center">
                  <ScheduleView />
                </div>
              </div>
              <div className="flex-1 min-w-0 pl-2 flex items-center justify-center">
                <div className="aspect-[16/9] w-full max-w-full flex items-center justify-center">
                  <LivePresentation />
                </div>
              </div>
            </div>
          );
        default:
          return <HomePage />;
      }
    })();

    return <Suspense fallback={<PageLoader />}>{content}</Suspense>;
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

  // Determine if the sidebar and main layout should be shown
  const showMainLayout = true;

  if (!showMainLayout) {
    return <PresentationViewPage />;
  }

  return (
    <div className="h-screen flex flex-col bg-background text-foreground overflow-hidden relative">
      {/* Modern Header */}
      <header className="h-14 border-b border-border px-6 flex items-center justify-between bg-card shadow-md z-10">
        <div className="flex items-center gap-4">
          <span className="text-2xl font-extrabold tracking-tight text-primary">
            iPresent Pro
          </span>
          <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium text-xs">
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
                  className="h-9 w-9 hover:bg-accent"
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
                  className="h-9 w-9 hover:bg-accent"
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
                  className="h-9 w-9 hover:bg-accent"
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
                  className="h-9 w-9 hover:bg-accent"
                  onClick={() => setActiveTab("schedule-live")}
                >
                  <Play className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Schedule & Live</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </header>
      <div className="flex flex-1 min-h-0">
        {/* Sidebar */}
        <div className="w-[100px] bg-card border-r border-border flex flex-col items-center py-6 h-full overflow-y-auto">
          <Sidebar onSelectItem={setSelectedItem} />
        </div>
        {/* Main Content */}
        <div className="flex-1 bg-background p-8 overflow-y-auto">
          {renderActiveContent()}
        </div>
        {/* Right Panel */}
        <div className="w-[400px] bg-background border-l border-border flex flex-col gap-6 p-6 h-full min-w-[320px] max-w-[480px]">
          <div className="bg-card rounded-xl shadow-lg p-6 flex-1 flex flex-col">
            <h2 className="text-lg font-bold mb-4 tracking-wide text-foreground">
              PREVIEW
            </h2>
            <div className="flex-1 flex flex-col items-stretch justify-stretch">
              <Preview />
            </div>
          </div>
          <div className="bg-card rounded-xl shadow-lg p-6 flex-1 flex flex-col">
            <h2 className="text-lg font-bold mb-4 tracking-wide text-foreground">
              SCHEDULE
            </h2>
            <div className="flex-1 flex items-center justify-center text-muted-foreground text-base font-medium text-center">
              Your presentation queue is empty.
              <br />
              Add items from the library to get started
            </div>
          </div>
          <div className="bg-card rounded-xl shadow-lg p-6 flex flex-col">
            <h2 className="text-lg font-bold mb-4 tracking-wide text-foreground">
              LIVE
            </h2>
            <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground text-base font-medium">
              Nothing is live
              <Button className="mt-4 px-6 py-2 bg-primary text-primary-foreground rounded-lg font-semibold text-base hover:bg-primary/90 transition-all duration-200 shadow-md">
                Start Presentation
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <MediaCacheProvider>
      <MainAppContent />
    </MediaCacheProvider>
  );
}

export default App;
