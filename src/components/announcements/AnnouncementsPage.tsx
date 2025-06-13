// components/pages/AnnouncementsPage.tsx
import React, { useState, useEffect } from "react";
import { ScrollArea } from "../ui/scroll-area";
import { Button } from "../ui/button";
import {
  FileText,
  Plus,
  Search,
  Calendar,
  Clock,
  Edit,
  Trash2,
  Filter,
  SortDesc,
  SortAsc,
  Pin,
  PinOff,
  MoreVertical,
  PlusCircle,
  Type as TypeIcon,
  Tag,
  CheckCircle,
  MessageSquare,
  X,
  Save,
  LayoutTemplate,
  LayoutGrid, // Added for layout toggle
  List, // Added for layout toggle
} from "lucide-react";
import {
  AnnouncementTemplates,
  AnnouncementTemplate,
} from "./AnnouncementTemplates";

import { Input } from "../ui/input";
import { Label } from "../ui/label"; // Add Label
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription, // Add DialogDescription
} from "../ui/dialog";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../ui/card";
import { Badge } from "../ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuCheckboxItem, // Add DropdownMenuCheckboxItem
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Textarea } from "../ui/textarea";
import { useContentStore } from "../../stores/useContentStore";
import { v4 as uuidv4 } from "uuid";
import { useSidebar } from "../hooks/useSidebar";
import type { Slide } from "../../types/index";

// Create a local type for UI state that extends Announcement with extra fields
interface AnnouncementUI {
  id: string;
  type: string;
  title: string;
  content: string;
  date: string;
  time: string;
  isPinned?: boolean;
  category?: string;
  status?: "draft" | "published";
  slides?: Slide[];
  createdAt: Date;
  updatedAt: Date;
}

// Use AnnouncementUI[] for sampleAnnouncements and all state/logic that needs these extra fields
const sampleAnnouncements: AnnouncementUI[] = [
  {
    id: uuidv4(),
    type: "announcement",
    title: "Church Picnic",
    content:
      "Join us for our annual church picnic at Central Park. Bring your family and friends for a day of fun, food, and fellowship.",
    date: "June 10, 2023",
    time: "12:00 PM",
    category: "Events",
    status: "published",
    isPinned: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: uuidv4(),
    type: "announcement",
    title: "Youth Group Meeting",
    content:
      "Youth group will meet this Friday for games, worship, and Bible study. All teens are welcome!",
    date: "June 15, 2023",
    time: "7:00 PM",
    category: "Youth",
    status: "published",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: uuidv4(),
    type: "announcement",
    title: "Volunteer Appreciation",
    content:
      "We're hosting a special dinner to thank all our volunteers for their dedicated service throughout the year.",
    date: "June 20, 2023",
    time: "6:30 PM",
    category: "Events",
    status: "published",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: uuidv4(),
    type: "announcement",
    title: "Bible Study Series",
    content:
      "New Bible study series starting next week on the Book of Romans. Sign up at the welcome desk.",
    date: "June 22, 2023",
    time: "7:00 PM",
    category: "Bible Study",
    status: "published",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: uuidv4(),
    type: "announcement",
    title: "Community Outreach",
    content:
      "Help us serve our community by volunteering at the local food bank this Saturday morning.",
    date: "June 24, 2023",
    time: "9:00 AM",
    category: "Outreach",
    status: "published",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: uuidv4(),
    type: "announcement",
    title: "Worship Team Rehearsal",
    content:
      "Worship team rehearsal has been moved to Thursday evening this week due to building maintenance.",
    date: "June 14, 2023",
    time: "6:00 PM",
    category: "Worship",
    status: "draft",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: uuidv4(),
    type: "announcement",
    title: "Children's Ministry Volunteers",
    content:
      "We need additional volunteers for our children's ministry. If you're interested, please contact Sarah at children@church.org.",
    date: "June 18, 2023",
    time: "10:00 AM",
    category: "Children",
    status: "published",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

import { AnnouncementEditor } from "./AnnouncementEditor";

export function AnnouncementsPage() {
  const [announcements, setAnnouncements] =
    useState<AnnouncementUI[]>(sampleAnnouncements);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAnnouncement, setSelectedAnnouncement] =
    useState<AnnouncementUI | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editorSlides, setEditorSlides] = useState<Slide[] | null>(null); // For AnnouncementEditor
  const [newAnnouncementTitle, setNewAnnouncementTitle] = useState("");
  const [newAnnouncementContent, setNewAnnouncementContent] = useState("");
  const [newAnnouncementCategory, setNewAnnouncementCategory] =
    useState("Events");
  const [newAnnouncementStatus, setNewAnnouncementStatus] = useState<
    "draft" | "published"
  >("published");
  const [activeTab, setActiveTab] = useState("all");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  // const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]); // New state for multiple categories
  const [layoutMode, setLayoutMode] = useState<"grid" | "list">("grid");
  const { activeTab: currentSidebarTab } = useSidebar();

  const handleEditAnnouncement = (announcement: AnnouncementUI) => {
    setSelectedAnnouncement(announcement);
    setNewAnnouncementTitle(announcement.title);
    setNewAnnouncementContent(announcement.content);
    setNewAnnouncementCategory(announcement.category || "Events");
    setNewAnnouncementStatus(announcement.status || "published");
    setEditorSlides(announcement.slides || null);
    setShowEditDialog(true);
  };

  const handleUpdateAnnouncement = () => {
    if (!selectedAnnouncement) {
      console.error("Update called without a selected announcement.");
      return;
    }
    // Assuming newAnnouncementTitle, newAnnouncementContent etc. are populated by handleEditAnnouncement
    if (newAnnouncementTitle.trim() === "") {
      alert("Title cannot be empty."); // Simple feedback, consider a more integrated UI notification
      return;
    }

    setAnnouncements(
      announcements.map((ann) =>
        ann.id === selectedAnnouncement.id
          ? {
              ...ann, // Preserve existing fields like id, original date/time unless they are also editable
              title: newAnnouncementTitle,
              content: newAnnouncementContent,
              category: newAnnouncementCategory,
              status: newAnnouncementStatus,
              slides: editorSlides !== null ? editorSlides : ann.slides, // Update slides if editor was used
              updatedAt: new Date(),
            }
          : ann
      )
    );
    setShowEditDialog(false);
    setSelectedAnnouncement(null); // Clear the selected announcement
    // Reset form fields to avoid carrying over data to "add new" if they are shared
    setNewAnnouncementTitle("");
    setNewAnnouncementContent("");
    setNewAnnouncementCategory("Events");
    setNewAnnouncementStatus("published");
    setEditorSlides(null); // Reset editor slides state
  };

  const handleOpenAddDialog = () => {
    setNewAnnouncementTitle("");
    setNewAnnouncementContent("");
    setNewAnnouncementCategory("Events"); // Reset to default or last used
    setNewAnnouncementStatus("published"); // Reset to default
    setSelectedAnnouncement(null); // Ensure not in edit mode
    // setEditorSlides(null); // Consider if editorSlides state needs reset for add dialog
    setShowAddDialog(true);
  };

  // Define handleSaveAnnouncement inside the component
  const handleSaveAnnouncement = (slides: Slide[]) => {
    if (newAnnouncementTitle.trim() === "") return;
    const newAnnouncement: AnnouncementUI = {
      id: uuidv4(),
      type: "announcement",
      title: newAnnouncementTitle,
      content: newAnnouncementContent || "No content provided",
      date: new Date().toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
      time: new Date().toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      }),
      category: newAnnouncementCategory,
      status: newAnnouncementStatus,
      slides: slides,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setAnnouncements([...announcements, newAnnouncement]);
    setNewAnnouncementTitle("");
    setNewAnnouncementContent("");
    setEditorSlides(null);
    setShowAddDialog(false);
  };

  const handleSaveAnnouncementWithSlides = (slides: Slide[]) => {
    if (newAnnouncementTitle.trim() === "") return;
    const newAnnouncement: AnnouncementUI = {
      id: uuidv4(),
      type: "announcement",
      title: newAnnouncementTitle,
      content: newAnnouncementContent || "No content provided", // Or use a dedicated state for editor content
      date: new Date().toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
      time: new Date().toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      }),
      category: newAnnouncementCategory, // Or use a dedicated state for editor category
      status: newAnnouncementStatus, // Or use a dedicated state for editor status
      slides: slides,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setAnnouncements([...announcements, newAnnouncement]);
    setNewAnnouncementTitle("");
    setNewAnnouncementContent("");
    setEditorSlides(null);
    setShowAddDialog(false); // Close the main add dialog as well if open
  };

  const handleUpdateAnnouncementWithSlides = (slides: Slide[]) => {
    if (!selectedAnnouncement) return;
    if (newAnnouncementTitle.trim() === "") return;

    const updatedAnnouncement: AnnouncementUI = {
      ...selectedAnnouncement,
      title: newAnnouncementTitle,
      content: newAnnouncementContent,
      category: newAnnouncementCategory,
      status: newAnnouncementStatus,
      slides: slides,
      updatedAt: new Date(),
    };

    setAnnouncements(
      announcements.map((ann) =>
        ann.id === selectedAnnouncement.id ? updatedAnnouncement : ann
      )
    );
    setSelectedAnnouncement(null);
    setNewAnnouncementTitle("");
    setNewAnnouncementContent("");
    setNewAnnouncementCategory("Events");
    setNewAnnouncementStatus("published");
    setEditorSlides(null);
    setShowEditDialog(false);
  };

  // Filter announcements based on search query, tab, and category
  const filteredAnnouncements = announcements
    .filter(
      (announcement) =>
        (announcement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          announcement.content
            .toLowerCase()
            .includes(searchQuery.toLowerCase())) &&
        (activeTab === "all" ||
          (activeTab === "published" && announcement.status === "published") ||
          (activeTab === "draft" && announcement.status === "draft") ||
          (activeTab === "pinned" && announcement.isPinned)) &&
        // (!filterCategory || announcement.category === filterCategory) // Old single category filter
        (selectedCategories.length === 0 ||
          (announcement.category &&
            selectedCategories.includes(announcement.category))) // New multi-category filter
    )
    .sort((a, b) => {
      // First sort by pinned status
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;

      // Then sort by date
      const dateA = new Date(a.date + " " + a.time);
      const dateB = new Date(b.date + " " + b.time);
      return sortOrder === "desc"
        ? dateB.getTime() - dateA.getTime()
        : dateA.getTime() - dateB.getTime();
    });

  // Get unique categories for filter dropdown
  const categories = Array.from(
    new Set(announcements.map((a) => a.category).filter(Boolean))
  ) as string[];

  // State for template selection dialog
  const [showTemplateDialog, setShowTemplateDialog] = useState(false);

  const handleAddAnnouncement = () => {
    // Show template selection dialog instead of directly showing add dialog
    setShowTemplateDialog(true);
  };

  // Handle creating a new announcement without template
  const handleCreateNew = () => {
    setNewAnnouncementTitle("");
    setNewAnnouncementContent("");
    setNewAnnouncementCategory("Events");
    setNewAnnouncementStatus("published");
    setShowTemplateDialog(false);
    setShowAddDialog(true);
  };

  // Handle selecting a template
  const handleSelectTemplate = (template: AnnouncementTemplate) => {
    setNewAnnouncementTitle(template.title);
    setNewAnnouncementContent(template.content);
    setNewAnnouncementCategory(template.category);
    setNewAnnouncementStatus("published");
    setShowTemplateDialog(false);
    setShowAddDialog(true);
  };

  const handleAddAnnouncementFromDialog = () => {
    if (newAnnouncementTitle.trim() === "") return;

    const newAnnouncement: AnnouncementUI = {
      id: uuidv4(),
      type: "announcement",
      title: newAnnouncementTitle,
      content: newAnnouncementContent || "No content provided",
      date: new Date().toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
      time: new Date().toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      }),
      category: newAnnouncementCategory,
      status: newAnnouncementStatus,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setAnnouncements([...announcements, newAnnouncement]);
    setNewAnnouncementTitle("");
    setNewAnnouncementContent("");
    setShowAddDialog(false);
  };

  const handleDeleteAnnouncement = (id: string) => {
    setAnnouncements(announcements.filter((a) => a.id !== id));
    if (selectedAnnouncement?.id === id) {
      setSelectedAnnouncement(null);
    }
  };

  const handleTogglePinned = (id: string) => {
    setAnnouncements(
      announcements.map((a) =>
        a.id === id ? { ...a, isPinned: !a.isPinned } : a
      )
    );
  };

  const handleSelectAnnouncement = (announcement: AnnouncementUI) => {
    setSelectedAnnouncement(announcement);
  };

  return (
    <Tabs
      defaultValue="all"
      className="h-full flex flex-col bg-background text-foreground"
    >
      <div className="flex items-center justify-between p-4 md:p-6 border-b border-border bg-card">
        <h2 className="text-2xl font-bold text-foreground">Announcements</h2>
        <Button
          className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-75 transition-all duration-200"
          onClick={handleOpenAddDialog}
        >
          <PlusCircle className="h-5 w-5 mr-2" />
          New Announcement
        </Button>
      </div>

      <div className="flex items-center justify-between p-4 md:p-6 border-b border-border">
        <div className="relative w-full max-w-xs mr-4">
          <Input
            type="text"
            placeholder="Search announcements..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-input border-border text-foreground placeholder:text-muted-foreground pl-10"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        </div>
        <div className="flex items-center space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="bg-card border-border hover:bg-accent"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-[#2D3748] border-[#4A5568] text-slate-100 rounded-lg shadow-xl w-56 mt-1">
              <DropdownMenuItem
                onClick={() => setSelectedCategories([])}
                className="hover:bg-[#374151] focus:bg-[#374151] px-3 py-2 text-sm cursor-pointer transition-colors"
              >
                All Categories
              </DropdownMenuItem>
              {categories.map((category) => (
                <DropdownMenuCheckboxItem
                  key={category}
                  checked={selectedCategories.includes(category)}
                  onCheckedChange={(checked) => {
                    setSelectedCategories((prev) =>
                      checked
                        ? [...prev, category]
                        : prev.filter((c) => c !== category)
                    );
                  }}
                  className="hover:bg-[#374151] focus:bg-[#374151] px-3 py-2 text-sm cursor-pointer transition-colors"
                >
                  {category}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
        <TabsList className="bg-[#232B3A] border border-[#4A5568] w-full justify-start rounded-lg p-1 space-x-1">
          <TabsTrigger
            value="all"
            className="text-slate-400 hover:text-white data-[state=active]:bg-[#3182CE] data-[state=active]:text-white data-[state=active]:shadow-md rounded-md px-4 py-2 text-sm font-medium transition-all duration-150 ease-in-out flex-1 justify-center"
          >
            All
          </TabsTrigger>
          <TabsTrigger
            value="published"
            className="text-slate-400 hover:text-white data-[state=active]:bg-[#3182CE] data-[state=active]:text-white data-[state=active]:shadow-md rounded-md px-4 py-2 text-sm font-medium transition-all duration-150 ease-in-out flex-1 justify-center"
          >
            Published
          </TabsTrigger>
          <TabsTrigger
            value="draft"
            className="text-slate-400 hover:text-white data-[state=active]:bg-[#3182CE] data-[state=active]:text-white data-[state=active]:shadow-md rounded-md px-4 py-2 text-sm font-medium transition-all duration-150 ease-in-out flex-1 justify-center"
          >
            Drafts
          </TabsTrigger>
          <TabsTrigger
            value="pinned"
            className="text-slate-400 hover:text-white data-[state=active]:bg-[#3182CE] data-[state=active]:text-white data-[state=active]:shadow-md rounded-md px-4 py-2 text-sm font-medium transition-all duration-150 ease-in-out flex-1 justify-center"
          >
            Pinned
          </TabsTrigger>
        </TabsList>
        <TabsContent value={activeTab} className="flex-1">
          <ScrollArea className="flex-1 p-4 md:p-6">
            <div
              className={
                layoutMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
                  : "flex flex-col gap-4"
              }
            >
              {filteredAnnouncements.length > 0 ? (
                filteredAnnouncements.map((announcement) => (
                  <Card
                    key={announcement.id}
                    className={`bg-[#232B3A] border border-[#4A5568] rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out cursor-pointer overflow-hidden 
                      ${
                        layoutMode === "grid"
                          ? "flex flex-col justify-between h-full"
                          : "flex flex-row items-center w-full p-3 hover:bg-[#2D3748]"
                      }
                      ${
                        announcement.isPinned
                          ? "ring-2 ring-[#3182CE] ring-offset-2 ring-offset-[#1A202C]"
                          : layoutMode === "grid"
                          ? "hover:border-2 hover:border-[#3182CE] hover:shadow-2xl transition-all duration-200 ease-in-out"
                          : "hover:border-transparent"
                      }
                    `}
                    onClick={() => handleSelectAnnouncement(announcement)}
                  >
                    {/* Conditional rendering for Grid vs List view */}
                    {layoutMode === "grid" ? (
                      <>
                        <CardHeader className="pb-3 pt-4 px-4">
                          <div className="flex justify-between items-start mb-1">
                            <div>
                              <CardTitle className="text-white">
                                {announcement.title}
                              </CardTitle>
                              <div className="flex items-center mt-1 text-[#A0AEC0] text-xs">
                                <Calendar className="h-3 w-3 mr-1" />
                                <span>{announcement.date}</span>
                                <Clock className="h-3 w-3 ml-2 mr-1" />
                                <span>{announcement.time}</span>
                              </div>
                            </div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-[#A0AEC0] hover:text-white"
                                >
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent className="bg-[#1A202C] border-[#4A5568] text-white">
                                <DropdownMenuItem
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEditAnnouncement(announcement);
                                  }}
                                  className="hover:bg-[#2D3748]"
                                >
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleTogglePinned(announcement.id);
                                  }}
                                  className="hover:bg-[#2D3748]"
                                >
                                  {announcement.isPinned ? (
                                    <>
                                      <PinOff className="h-4 w-4 mr-2" />
                                      Unpin
                                    </>
                                  ) : (
                                    <>
                                      <Pin className="h-4 w-4 mr-2" />
                                      Pin
                                    </>
                                  )}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteAnnouncement(announcement.id);
                                  }}
                                  className="text-red-500 hover:bg-[#2D3748]"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </CardHeader>
                        <CardContent className="pb-2 px-4">
                          <p className="text-sm text-[#E2E8F0] line-clamp-3">
                            {announcement.content.replace(/<[^>]*>/g, "")}
                          </p>
                        </CardContent>
                        <CardFooter className="pt-2 pb-3 px-4 flex justify-between items-center">
                          <div className="flex gap-2 flex-wrap">
                            {announcement.category && (
                              <Badge className="bg-[#2D3748] text-[#A0AEC0] hover:bg-[#4A5568]">
                                {announcement.category}
                              </Badge>
                            )}
                            {announcement.status === "draft" && (
                              <Badge className="bg-[#553C9A] text-white hover:bg-[#6B46C1]">
                                Draft
                              </Badge>
                            )}
                          </div>
                          {announcement.isPinned && (
                            <Pin className="h-4 w-4 text-[#3182CE]" />
                          )}
                        </CardFooter>
                      </>
                    ) : (
                      /* List View Layout */
                      <>
                        <div className="flex-grow flex items-center">
                          {announcement.isPinned && (
                            <Pin className="h-5 w-5 text-[#3182CE] mr-3 flex-shrink-0" />
                          )}
                          <div className="flex-grow">
                            <h3
                              className="text-md font-semibold text-white truncate"
                              title={announcement.title}
                            >
                              {announcement.title}
                            </h3>
                            <p
                              className="text-xs text-[#A0AEC0] truncate"
                              title={announcement.content.replace(
                                /<[^>]*>/g,
                                ""
                              )}
                            >
                              {announcement.content.replace(/<[^>]*>/g, "")}
                            </p>
                            <div className="flex items-center mt-1 text-[#A0AEC0] text-xs">
                              <Calendar className="h-3 w-3 mr-1" />
                              <span>{announcement.date}</span>
                              <Clock className="h-3 w-3 ml-2 mr-1" />
                              <span>{announcement.time}</span>
                              {announcement.category && (
                                <Badge className="ml-2 bg-[#2D3748] text-[#A0AEC0] text-xs px-1.5 py-0.5">
                                  {announcement.category}
                                </Badge>
                              )}
                              {announcement.status === "draft" && (
                                <Badge className="ml-2 bg-[#553C9A] text-white text-xs px-1.5 py-0.5">
                                  Draft
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex-shrink-0 ml-2">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-[#A0AEC0] hover:text-white hover:bg-[#374151]"
                                onClick={(e) => e.stopPropagation()} // Prevent card click when opening menu
                              >
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="bg-[#1A202C] border-[#4A5568] text-white">
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditAnnouncement(announcement);
                                }}
                                className="hover:bg-[#2D3748]"
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleTogglePinned(announcement.id);
                                }}
                                className="hover:bg-[#2D3748]"
                              >
                                {announcement.isPinned ? (
                                  <>
                                    <PinOff className="h-4 w-4 mr-2" />
                                    Unpin
                                  </>
                                ) : (
                                  <>
                                    <Pin className="h-4 w-4 mr-2" />
                                    Pin
                                  </>
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteAnnouncement(announcement.id);
                                }}
                                className="text-red-500 hover:bg-[#2D3748]"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </>
                    )}
                  </Card>
                ))
              ) : (
                <div className="col-span-full flex flex-col items-center justify-center py-12 text-[#A0AEC0]">
                  <FileText className="h-12 w-12 mb-4 opacity-50" />
                  <p className="text-lg font-medium">No announcements found</p>
                  <p className="text-sm">
                    Try adjusting your search or filters
                  </p>
                </div>
              )}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>

      {selectedAnnouncement && (
        <div className="border-t border-[#4A5568] p-4 bg-[#1A202C]">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-semibold text-white">
                {selectedAnnouncement.title}
              </h3>
              <div className="flex items-center mt-1 text-[#A0AEC0] text-sm">
                <Calendar className="h-4 w-4 mr-1" />
                <span>{selectedAnnouncement.date}</span>
                <Clock className="h-4 w-4 ml-3 mr-1" />
                <span>{selectedAnnouncement.time}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="bg-transparent border-[#4A5568]"
                onClick={() =>
                  selectedAnnouncement &&
                  handleEditAnnouncement(selectedAnnouncement)
                }
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-transparent border-[#4A5568] text-red-500"
                onClick={() =>
                  selectedAnnouncement &&
                  handleDeleteAnnouncement(selectedAnnouncement.id)
                }
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
          <div className="bg-[#2D3748] rounded-md p-4 text-[#E2E8F0]">
            <div
              dangerouslySetInnerHTML={{ __html: selectedAnnouncement.content }}
            />
          </div>
        </div>
      )}

      {/* Template Selection Dialog */}
      <Dialog open={showTemplateDialog} onOpenChange={setShowTemplateDialog}>
        <DialogContent className="bg-[#1A202C] border-[#4A5568] text-white max-w-4xl p-6 rounded-lg shadow-xl">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-2xl font-bold text-white flex items-center gap-2">
              <LayoutTemplate className="h-6 w-6 text-[#3182CE]" /> Choose
              Announcement Template
            </DialogTitle>
            <DialogDescription className="text-[#A0AEC0] mt-1">
              Select a pre-designed template to get started quickly, or create a
              new announcement from scratch.
            </DialogDescription>
          </DialogHeader>
          <AnnouncementTemplates
            onSelectTemplate={handleSelectTemplate}
            onCreateNew={handleCreateNew}
          />
        </DialogContent>
      </Dialog>

      {/* Add Announcement Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="bg-[#1A202C] border-[#4A5568] text-white max-w-2xl p-6 rounded-lg shadow-xl">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-2xl font-bold text-white flex items-center gap-2">
              <PlusCircle className="h-6 w-6 text-[#3182CE]" /> New Announcement
            </DialogTitle>
            <DialogDescription className="text-[#A0AEC0] mt-1">
              Create a new announcement to share with your community. Fill in
              the details below.
            </DialogDescription>
          </DialogHeader>

          <AnnouncementEditor
            title={newAnnouncementTitle}
            content={newAnnouncementContent}
            category={newAnnouncementCategory}
            status={newAnnouncementStatus}
            onTitleChange={setNewAnnouncementTitle}
            onContentChange={setNewAnnouncementContent}
            onCategoryChange={setNewAnnouncementCategory}
            onStatusChange={setNewAnnouncementStatus}
          />

          <DialogFooter className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setShowAddDialog(false)}
              className="bg-transparent border-[#4A5568] text-slate-300 hover:text-white hover:border-[#5A6578] transition-colors flex items-center gap-2"
            >
              <X className="h-4 w-4" /> Cancel
            </Button>
            <Button
              onClick={handleAddAnnouncementFromDialog}
              className="bg-[#3182CE] hover:bg-[#2B6CB0] text-white transition-colors flex items-center gap-2"
            >
              <Save className="h-4 w-4" /> Save Announcement
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Announcement Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="bg-[#1A202C] border-[#4A5568] text-white max-w-2xl p-6 rounded-lg shadow-xl">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-2xl font-bold text-white flex items-center gap-2">
              <Edit className="h-6 w-6 text-[#3182CE]" /> Edit Announcement
            </DialogTitle>
            <DialogDescription className="text-[#A0AEC0] mt-1">
              Update the details of the announcement below.
            </DialogDescription>
          </DialogHeader>

          <AnnouncementEditor
            title={newAnnouncementTitle}
            content={newAnnouncementContent}
            category={newAnnouncementCategory}
            status={newAnnouncementStatus}
            onTitleChange={setNewAnnouncementTitle}
            onContentChange={setNewAnnouncementContent}
            onCategoryChange={setNewAnnouncementCategory}
            onStatusChange={setNewAnnouncementStatus}
          />

          <DialogFooter className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setShowEditDialog(false)}
              className="bg-transparent border-[#4A5568] text-slate-300 hover:text-white hover:border-[#5A6578] transition-colors flex items-center gap-2"
            >
              <X className="h-4 w-4" /> Cancel
            </Button>
            <Button
              onClick={handleUpdateAnnouncement}
              className="bg-[#3182CE] hover:bg-[#2B6CB0] text-white transition-colors flex items-center gap-2"
            >
              <Save className="h-4 w-4" /> Update Announcement
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Tabs>
  );
}
