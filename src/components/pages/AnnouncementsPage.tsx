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
} from "lucide-react";
import {
  AnnouncementTemplates,
  AnnouncementTemplate,
} from "../AnnouncementTemplates";

import { Input } from "../ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Textarea } from "../ui/textarea";
import { useContentStore } from "../../stores/useContentStore";
import { v4 as uuidv4 } from "uuid";

// Define the Announcement type
interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  time: string;
  isPinned?: boolean;
  category?: string;
  status?: "draft" | "published";
}

// Sample announcement data
const sampleAnnouncements: Announcement[] = [
  {
    id: uuidv4(),
    title: "Church Picnic",
    content:
      "Join us for our annual church picnic at Central Park. Bring your family and friends for a day of fun, food, and fellowship.",
    date: "June 10, 2023",
    time: "12:00 PM",
    category: "Events",
    status: "published",
    isPinned: true,
  },
  {
    id: uuidv4(),
    title: "Youth Group Meeting",
    content:
      "Youth group will meet this Friday for games, worship, and Bible study. All teens are welcome!",
    date: "June 15, 2023",
    time: "7:00 PM",
    category: "Youth",
    status: "published",
  },
  {
    id: uuidv4(),
    title: "Volunteer Appreciation",
    content:
      "We're hosting a special dinner to thank all our volunteers for their dedicated service throughout the year.",
    date: "June 20, 2023",
    time: "6:30 PM",
    category: "Events",
    status: "published",
  },
  {
    id: uuidv4(),
    title: "Bible Study Series",
    content:
      "New Bible study series starting next week on the Book of Romans. Sign up at the welcome desk.",
    date: "June 22, 2023",
    time: "7:00 PM",
    category: "Bible Study",
    status: "published",
  },
  {
    id: uuidv4(),
    title: "Community Outreach",
    content:
      "Help us serve our community by volunteering at the local food bank this Saturday morning.",
    date: "June 24, 2023",
    time: "9:00 AM",
    category: "Outreach",
    status: "published",
  },
  {
    id: uuidv4(),
    title: "Worship Team Rehearsal",
    content:
      "Worship team rehearsal has been moved to Thursday evening this week due to building maintenance.",
    date: "June 14, 2023",
    time: "6:00 PM",
    category: "Worship",
    status: "draft",
  },
  {
    id: uuidv4(),
    title: "Children's Ministry Volunteers",
    content:
      "We need additional volunteers for our children's ministry. If you're interested, please contact Sarah at children@church.org.",
    date: "June 18, 2023",
    time: "10:00 AM",
    category: "Children",
    status: "published",
  },
];

export function AnnouncementsPage() {
  const [announcements, setAnnouncements] =
    useState<Announcement[]>(sampleAnnouncements);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAnnouncement, setSelectedAnnouncement] =
    useState<Announcement | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [newAnnouncementTitle, setNewAnnouncementTitle] = useState("");
  const [newAnnouncementContent, setNewAnnouncementContent] = useState("");
  const [newAnnouncementCategory, setNewAnnouncementCategory] =
    useState("Events");
  const [newAnnouncementStatus, setNewAnnouncementStatus] = useState<
    "draft" | "published"
  >("published");
  const [activeTab, setActiveTab] = useState("all");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [filterCategory, setFilterCategory] = useState<string | null>(null);

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
        (!filterCategory || announcement.category === filterCategory)
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

  const handleEditAnnouncement = (announcement: Announcement) => {
    setSelectedAnnouncement(announcement);
    setNewAnnouncementTitle(announcement.title);
    setNewAnnouncementContent(announcement.content);
    setNewAnnouncementCategory(announcement.category || "Events");
    setNewAnnouncementStatus(announcement.status || "published");
    setShowEditDialog(true);
  };

  const handleSaveAnnouncement = () => {
    if (newAnnouncementTitle.trim() === "") return;

    const newAnnouncement: Announcement = {
      id: uuidv4(),
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
    };

    setAnnouncements([...announcements, newAnnouncement]);
    setNewAnnouncementTitle("");
    setNewAnnouncementContent("");
    setShowAddDialog(false);
  };

  const handleUpdateAnnouncement = () => {
    if (!selectedAnnouncement || newAnnouncementTitle.trim() === "") return;

    const updatedAnnouncement: Announcement = {
      ...selectedAnnouncement,
      title: newAnnouncementTitle,
      content: newAnnouncementContent || "No content provided",
      category: newAnnouncementCategory,
      status: newAnnouncementStatus,
      // Keep the original date and time
    };

    setAnnouncements(
      announcements.map((a) =>
        a.id === selectedAnnouncement.id ? updatedAnnouncement : a
      )
    );
    setShowEditDialog(false);
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

  const handleSelectAnnouncement = (announcement: Announcement) => {
    setSelectedAnnouncement(announcement);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-[#4A5568]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">Announcements</h2>
          <Button
            className="bg-[#3182CE] hover:bg-[#2B6CB0]"
            onClick={handleAddAnnouncement}
          >
            <Plus className="h-4 w-4 mr-2" />
            New Announcement
          </Button>
        </div>

        <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#A0AEC0]" />
            <Input
              placeholder="Search announcements..."
              className="pl-9 bg-[#1A202C] border-[#4A5568] w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="bg-[#1A202C] border-[#4A5568]"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  {filterCategory || "All Categories"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-[#1A202C] border-[#4A5568] text-white">
                <DropdownMenuItem
                  onClick={() => setFilterCategory(null)}
                  className="hover:bg-[#2D3748]"
                >
                  All Categories
                </DropdownMenuItem>
                {categories.map((category) => (
                  <DropdownMenuItem
                    key={category}
                    onClick={() => setFilterCategory(category)}
                    className="hover:bg-[#2D3748]"
                  >
                    {category}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="outline"
              className="bg-[#1A202C] border-[#4A5568]"
              onClick={() =>
                setSortOrder(sortOrder === "desc" ? "asc" : "desc")
              }
            >
              {sortOrder === "desc" ? (
                <SortDesc className="h-4 w-4" />
              ) : (
                <SortAsc className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="bg-[#1A202C] border border-[#4A5568] w-full justify-start">
            <TabsTrigger
              value="all"
              className="data-[state=active]:bg-[#2D3748] data-[state=active]:text-white"
            >
              All
            </TabsTrigger>
            <TabsTrigger
              value="published"
              className="data-[state=active]:bg-[#2D3748] data-[state=active]:text-white"
            >
              Published
            </TabsTrigger>
            <TabsTrigger
              value="draft"
              className="data-[state=active]:bg-[#2D3748] data-[state=active]:text-white"
            >
              Drafts
            </TabsTrigger>
            <TabsTrigger
              value="pinned"
              className="data-[state=active]:bg-[#2D3748] data-[state=active]:text-white"
            >
              Pinned
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAnnouncements.length > 0 ? (
            filteredAnnouncements.map((announcement) => (
              <Card
                key={announcement.id}
                className={`bg-[#1A202C] border-[#4A5568] hover:border-[#3182CE] transition-colors cursor-pointer ${
                  announcement.isPinned ? "border-l-4 border-l-[#3182CE]" : ""
                }`}
                onClick={() => handleSelectAnnouncement(announcement)}
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
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
                <CardContent className="pb-2">
                  <p className="text-sm text-[#E2E8F0] line-clamp-3">
                    {announcement.content.replace(/<[^>]*>/g, "")}
                  </p>
                </CardContent>
                <CardFooter className="pt-0 flex justify-between">
                  <div className="flex gap-2">
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
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-12 text-[#A0AEC0]">
              <FileText className="h-12 w-12 mb-4 opacity-50" />
              <p className="text-lg font-medium">No announcements found</p>
              <p className="text-sm">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </ScrollArea>

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
                onClick={() => handleEditAnnouncement(selectedAnnouncement)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-transparent border-[#4A5568] text-red-500"
                onClick={() =>
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
        <DialogContent className="bg-[#1A202C] border-[#4A5568] text-white max-w-4xl">
          <DialogHeader>
            <DialogTitle>Choose Template</DialogTitle>
          </DialogHeader>
          <AnnouncementTemplates
            onSelectTemplate={handleSelectTemplate}
            onCreateNew={handleCreateNew}
          />
        </DialogContent>
      </Dialog>

      {/* Add Announcement Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="bg-[#1A202C] border-[#4A5568] text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              New Announcement
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <Input
              placeholder="Announcement Title"
              className="bg-[#2D3748] border-[#4A5568] text-white"
              value={newAnnouncementTitle}
              onChange={(e) => setNewAnnouncementTitle(e.target.value)}
            />

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <label className="text-sm text-[#A0AEC0] mb-2 block">
                  Category
                </label>
                <select
                  className="w-full bg-[#2D3748] border-[#4A5568] rounded-md p-2 text-white"
                  value={newAnnouncementCategory}
                  onChange={(e) => setNewAnnouncementCategory(e.target.value)}
                >
                  {[
                    "Events",
                    "Youth",
                    "Bible Study",
                    "Outreach",
                    "Worship",
                    "Children",
                    "Other",
                  ].map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm text-[#A0AEC0] mb-2 block">
                  Status
                </label>
                <select
                  className="w-full bg-[#2D3748] border-[#4A5568] rounded-md p-2 text-white"
                  value={newAnnouncementStatus}
                  onChange={(e) =>
                    setNewAnnouncementStatus(
                      e.target.value as "draft" | "published"
                    )
                  }
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
            </div>

            <div className="mt-4">
              <label className="text-sm text-[#A0AEC0] mb-2 block">
                Content
              </label>
              <Textarea
                value={newAnnouncementContent}
                onChange={(e) => setNewAnnouncementContent(e.target.value)}
                placeholder="Enter announcement content..."
                className="w-full p-2 bg-[#2D3748] border-[#4A5568] text-white min-h-[200px] rounded-md"
              />
            </div>
          </div>

          <DialogFooter className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setShowAddDialog(false)}
              className="bg-transparent border-[#4A5568] text-white"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveAnnouncement}
              className="bg-[#3182CE] hover:bg-[#2B6CB0]"
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Announcement Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="bg-[#1A202C] border-[#4A5568] text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Edit Announcement
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <Input
              placeholder="Announcement Title"
              className="bg-[#2D3748] border-[#4A5568] text-white"
              value={newAnnouncementTitle}
              onChange={(e) => setNewAnnouncementTitle(e.target.value)}
            />

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <label className="text-sm text-[#A0AEC0] mb-2 block">
                  Category
                </label>
                <select
                  className="w-full bg-[#2D3748] border-[#4A5568] rounded-md p-2 text-white"
                  value={newAnnouncementCategory}
                  onChange={(e) => setNewAnnouncementCategory(e.target.value)}
                >
                  {[
                    "Events",
                    "Youth",
                    "Bible Study",
                    "Outreach",
                    "Worship",
                    "Children",
                    "Other",
                  ].map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm text-[#A0AEC0] mb-2 block">
                  Status
                </label>
                <select
                  className="w-full bg-[#2D3748] border-[#4A5568] rounded-md p-2 text-white"
                  value={newAnnouncementStatus}
                  onChange={(e) =>
                    setNewAnnouncementStatus(
                      e.target.value as "draft" | "published"
                    )
                  }
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
            </div>

            <div className="mt-4">
              <label className="text-sm text-[#A0AEC0] mb-2 block">
                Content
              </label>
              <Textarea
                value={newAnnouncementContent}
                onChange={(e) => setNewAnnouncementContent(e.target.value)}
                placeholder="Enter announcement content..."
                className="w-full p-2 bg-[#2D3748] border-[#4A5568] text-white min-h-[200px] rounded-md"
              />
            </div>
          </div>

          <DialogFooter className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setShowEditDialog(false)}
              className="bg-transparent border-[#4A5568] text-white"
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateAnnouncement}
              className="bg-[#3182CE] hover:bg-[#2B6CB0]"
            >
              Update
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
