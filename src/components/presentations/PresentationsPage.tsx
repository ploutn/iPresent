// src/components/presentations/PresentationsPage.tsx
import React, { useState, useEffect } from "react";
// Navigation is handled by activeTab state
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "../ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  LayoutGrid,
  List,
  MoreVertical,
  FileText,
  Eye,
  Copy, // For Duplicate action
  Play,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"; // Assuming path based on ScheduleView.tsx
import { v4 as uuidv4 } from "uuid";
import { useContentStore } from "../../stores/useContentStore"; // Added import
import { SlideManager } from "./SlideManager";
import { SlideEditorDialog } from "../slides/SlideEditorDialog";
import { PresentationPlayer } from "./PresentationPlayer";
import { usePresentationStore } from "../../store/presentationStore";

import type { Slide, PresentationContentItem } from "../../types/index";

// Define the path for the live presentation output window
const LIVE_PRESENTATION_OUTPUT_PATH = "/live-presentation-output";

// Sample presentation data with enhanced slides
const createSampleSlide = (
  id: string,
  title: string,
  content: string,
  order: number
): Slide => ({
  id,
  title,
  content,
  type: "announcement",
  order,
  transition: {
    type: "fade",
    duration: 500,
    easing: "ease-in-out",
  },
  backgroundColor: "#ffffff",
  textColor: "#000000",
  fontSize: 24,
  fontFamily: "Arial",
  textAlign: "center",
  duration: 5,
  notes: "",
  createdAt: new Date(),
  updatedAt: new Date(),
});

const samplePresentations: PresentationContentItem[] = [
  {
    id: uuidv4(),
    title: "Welcome to Our Church",
    type: "presentation",
    content: "An introductory presentation for new visitors.",
    description: "An introductory presentation for new visitors.",
    createdAt: new Date(),
    updatedAt: new Date(),
    slides: [
      createSampleSlide(
        uuidv4(),
        "Welcome",
        "Welcome to our church family!",
        0
      ),
      createSampleSlide(
        uuidv4(),
        "Our Mission",
        "Spreading love and hope in our community",
        1
      ),
    ],
    settings: {
      autoAdvance: false,
      defaultSlideDuration: 5,
      loopPresentation: false,
      showSlideNumbers: true,
      showProgressBar: true,
      allowRemoteControl: false,
      backgroundColor: "#ffffff",
      defaultTransition: { type: "fade", duration: 500 },
      aspectRatio: "16:9",
      resolution: { width: 1920, height: 1080 },
    },
    metadata: {
      version: "1.0",
      totalSlides: 2,
      estimatedDuration: 10,
      isPublic: true,
      isTemplate: false,
    },
  },
  {
    id: uuidv4(),
    title: "Sermon Series: The Book of John",
    type: "presentation",
    content: "A deep dive into the Gospel of John.",
    description: "A deep dive into the Gospel of John.",
    createdAt: new Date(),
    updatedAt: new Date(),
    slides: [
      createSampleSlide(
        uuidv4(),
        "Introduction",
        "The Gospel of John - Light of the World",
        0
      ),
    ],
    settings: {
      autoAdvance: false,
      defaultSlideDuration: 5,
      loopPresentation: false,
      showSlideNumbers: true,
      showProgressBar: true,
      allowRemoteControl: false,
      backgroundColor: "#ffffff",
      defaultTransition: { type: "fade", duration: 500 },
      aspectRatio: "16:9",
      resolution: { width: 1920, height: 1080 },
    },
    metadata: {
      version: "1.0",
      totalSlides: 1,
      estimatedDuration: 5,
      isPublic: true,
      isTemplate: false,
    },
  },
  {
    id: uuidv4(),
    title: "Annual Missions Update",
    type: "presentation",
    content: "Highlights from our global missions work this past year.",
    description: "Highlights from our global missions work this past year.",
    createdAt: new Date(),
    updatedAt: new Date(),
    slides: [],
    settings: {
      autoAdvance: false,
      defaultSlideDuration: 5,
      loopPresentation: false,
      showSlideNumbers: true,
      showProgressBar: true,
      allowRemoteControl: false,
      backgroundColor: "#ffffff",
      defaultTransition: { type: "fade", duration: 500 },
      aspectRatio: "16:9",
      resolution: { width: 1920, height: 1080 },
    },
    metadata: {
      version: "1.0",
      totalSlides: 0,
      estimatedDuration: 0,
      isPublic: true,
      isTemplate: false,
    },
  },
];

export function PresentationsPage() {
  // Navigation is handled by activeTab state
  const { setSelectedItem } = useContentStore(); // Added hook usage
  const { createPresentation, updatePresentation, duplicatePresentation } =
    usePresentationStore();
  const [presentations, setPresentations] =
    useState<PresentationContentItem[]>(samplePresentations);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPresentation, setSelectedPresentation] =
    useState<PresentationContentItem | null>(null);
  const [showCreateEditDialog, setShowCreateEditDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPresentationTitle, setCurrentPresentationTitle] = useState("");
  const [currentPresentationDescription, setCurrentPresentationDescription] =
    useState("");
  const [currentSlides, setCurrentSlides] = useState<Slide[]>([]); // New state for slides
  const [layoutMode, setLayoutMode] = useState<"grid" | "list">("grid");
  const [showSlideManager, setShowSlideManager] = useState(false);
  const [showSlideEditor, setShowSlideEditor] = useState(false);
  const [editingSlide, setEditingSlide] = useState<Slide | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [previewPresentation, setPreviewPresentation] =
    useState<PresentationContentItem | null>(null);

  const handleViewPresentation = (presentation: PresentationContentItem) => {
    // Update the selected item in the content store for compatibility
    setSelectedItem({
      id: presentation.id,
      title: presentation.title,
      type: "presentation" as const,
      content: presentation.content,
      tags: [],
      createdAt: new Date(presentation.createdAt),
      updatedAt: new Date(presentation.updatedAt),
    });

    // Open the preview dialog
    setPreviewPresentation(presentation);
    setShowPreview(true);
  };

  // Initialize store with sample data if empty
  useEffect(() => {
    if (presentations.length === 0) {
      // Create sample presentations using the store
      const welcome = createPresentation(
        "Welcome to Our Church",
        "An introductory presentation for new visitors."
      );

      const sermon = createPresentation(
        "Sermon Series: The Book of John",
        "A deep dive into the Gospel of John."
      );

      const missions = createPresentation(
        "Annual Missions Update",
        "Highlights from our global missions work this past year."
      );

      // Add sample slides to the welcome presentation
      updatePresentation(welcome.id, {
        slides: [
          createSampleSlide(
            uuidv4(),
            "Welcome",
            "Welcome to our church family!",
            0
          ),
          createSampleSlide(
            uuidv4(),
            "Our Mission",
            "Spreading love and hope in our community",
            1
          ),
        ],
      });

      // Add sample slide to the sermon presentation
      updatePresentation(sermon.id, {
        slides: [
          createSampleSlide(
            uuidv4(),
            "Introduction",
            "The Gospel of John - Light of the World",
            0
          ),
        ],
      });
    }
  }, [presentations.length, createPresentation, updatePresentation]);

  const handleDuplicatePresentation = (
    presentation: PresentationContentItem
  ) => {
    try {
      const duplicated = duplicatePresentation(presentation.id);
      console.log("Duplicated presentation:", duplicated);
    } catch (error) {
      console.error("Failed to duplicate presentation:", error);
    }
  };

  const handleAddNewPresentation = () => {
    setIsEditing(false);
    setCurrentPresentationTitle("");
    setCurrentPresentationDescription("");
    setSelectedPresentation(null);
    setCurrentSlides([]); // Initialize slides for new presentation
    setShowCreateEditDialog(true);
  };

  const handleEditPresentation = (presentation: PresentationContentItem) => {
    setIsEditing(true);
    setSelectedPresentation(presentation);
    setCurrentPresentationTitle(presentation.title);
    setCurrentPresentationDescription(presentation.description || "");
    setCurrentSlides(presentation.slides || []); // Load existing slides
    setShowCreateEditDialog(true);
    // Later, would load slides into an editor
  };

  const handleDeletePresentation = (id: string) => {
    setPresentations(presentations.filter((p) => p.id !== id));
    if (selectedPresentation?.id === id) {
      setSelectedPresentation(null);
    }
  };

  const handleSavePresentation = () => {
    if (currentPresentationTitle.trim() === "") return;

    if (isEditing && selectedPresentation) {
      setPresentations(
        presentations.map((p) =>
          p.id === selectedPresentation.id
            ? {
                ...p,
                title: currentPresentationTitle,
                description: currentPresentationDescription,
                updatedAt: new Date(),
                slides: currentSlides, // Save current slides
              }
            : p
        )
      );
    } else {
      const newPresentation: PresentationContentItem = {
        id: uuidv4(),
        title: currentPresentationTitle,
        description: currentPresentationDescription,
        createdAt: new Date(),
        updatedAt: new Date(),
        slides: currentSlides, // Save current slides for new presentation
      };
      setPresentations([...presentations, newPresentation]);
    }
    setShowCreateEditDialog(false);
  };

  const filteredPresentations = presentations.filter(
    (p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.description || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col bg-background text-foreground p-4 md:p-6">
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <h2 className="text-2xl font-bold text-foreground">Presentations</h2>
        <Button
          className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-75 transition-all duration-200"
          onClick={handleAddNewPresentation}
        >
          <Plus className="h-5 w-5 mr-2" />
          New Presentation
        </Button>
      </div>

      <div className="mb-4 flex items-center justify-between">
        <div className="relative w-full max-w-xs">
          <Input
            type="text"
            placeholder="Search presentations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-input border-border text-foreground placeholder:text-muted-foreground pl-10"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        </div>
        <div>
          <Button
            variant="outline"
            size="icon"
            onClick={() =>
              setLayoutMode(layoutMode === "grid" ? "list" : "grid")
            }
            className="ml-2 bg-card border-border hover:bg-accent"
          >
            {layoutMode === "grid" ? (
              <List className="h-5 w-5" />
            ) : (
              <LayoutGrid className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {filteredPresentations.length === 0 && (
        <div className="text-center py-10">
          <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">
            No Presentations Found
          </h3>
          <p className="text-muted-foreground mb-4">
            Create a new presentation to get started.
          </p>
          <Button
            onClick={handleAddNewPresentation}
            className="bg-[#3182CE] hover:bg-[#2A6CB0]"
          >
            <Plus className="h-5 w-5 mr-2" /> Create Presentation
          </Button>
        </div>
      )}

      <div
        className={`grid gap-4 ${
          layoutMode === "grid"
            ? "md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            : "grid-cols-1"
        }`}
      >
        {filteredPresentations.map((presentation) => (
          <Card
            key={presentation.id}
            className="bg-[#2D3748] border-[#4A5568] hover:shadow-xl transition-shadow duration-200 flex flex-col"
          >
            <CardHeader>
              <CardTitle className="text-white flex justify-between items-start">
                <span className="truncate pr-2">{presentation.title}</span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-gray-400 hover:text-white -mr-2 -mt-2 flex-shrink-0"
                    >
                      <MoreVertical className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="bg-[#1A202C] border-[#4A5568] text-white"
                  >
                    <DropdownMenuItem
                      onClick={() => handleEditPresentation(presentation)}
                      className="hover:bg-[#2D3748]"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDuplicatePresentation(presentation)}
                      className="hover:bg-[#2D3748]"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDeletePresentation(presentation.id)}
                      className="text-red-400 hover:bg-[#2D3748] hover:text-red-300"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardTitle>
              <CardDescription className="text-gray-400 line-clamp-2">
                {presentation.description || "No description available."}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-sm text-gray-500">
                Slides: {presentation.slides.length}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Last updated:{" "}
                {new Date(presentation.updatedAt).toLocaleDateString()}
              </p>
            </CardContent>
            <CardFooter className="flex justify-end gap-2 border-t border-[#4A5568] pt-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleViewPresentation(presentation)}
                className="border-[#4A5568] hover:bg-[#4A5568]"
              >
                <Eye className="h-4 w-4 mr-2" /> View
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleEditPresentation(presentation)}
                className="border-[#4A5568] hover:bg-[#4A5568]"
              >
                <Edit className="h-4 w-4 mr-2" /> Edit
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Create/Edit Dialog */}
      <Dialog
        open={showCreateEditDialog}
        onOpenChange={setShowCreateEditDialog}
      >
        <DialogContent className="bg-[#1A202C] border-[#4A5568] text-white sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Edit Presentation" : "Create New Presentation"}
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              {isEditing
                ? "Update the details of your presentation."
                : "Fill in the details for your new presentation."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right text-gray-300">
                Title
              </Label>
              <Input
                id="title"
                value={currentPresentationTitle}
                onChange={(e) => setCurrentPresentationTitle(e.target.value)}
                className="col-span-3 bg-[#2D3748] border-[#4A5568] text-white"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right text-gray-300">
                Description
              </Label>
              <Textarea
                id="description"
                value={currentPresentationDescription}
                onChange={(e) =>
                  setCurrentPresentationDescription(e.target.value)
                }
                className="col-span-3 bg-[#2D3748] border-[#4A5568] text-white h-24"
                placeholder="Optional: A brief description of the presentation."
              />
            </div>
            {/* Enhanced Slide Management */}
            <div className="mt-4">
              <SlideManager
                slides={currentSlides}
                onSlidesChange={setCurrentSlides}
                className=""
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCreateEditDialog(false)}
              className="border-[#4A5568] hover:bg-[#4A5568]"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSavePresentation}
              className="bg-[#3182CE] hover:bg-[#2A6CB0]"
            >
              {isEditing ? "Save Changes" : "Create Presentation"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Presentation Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-6xl h-[80vh] p-0">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle className="flex items-center gap-2">
              <Play className="h-5 w-5" />
              {previewPresentation?.title}
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 p-6 pt-0">
            {previewPresentation && (
              <PresentationPlayer
                presentation={{
                  id: previewPresentation.id,
                  title: previewPresentation.title,
                  description: previewPresentation.description,
                  slides: previewPresentation.slides,
                  tags: [],
                  createdAt: new Date(previewPresentation.createdAt),
                  updatedAt: new Date(previewPresentation.updatedAt),
                  type: "presentation", // Explicitly set type
                  settings: {
                    // Add placeholder settings
                    autoAdvance: false,
                    defaultSlideDuration: 5,
                    loopPresentation: false,
                    showSlideNumbers: false,
                    showProgressBar: false,
                    allowRemoteControl: false,
                    backgroundColor: "#000000",
                    defaultTransition: { type: "none", duration: 0 },
                    aspectRatio: "16:9",
                    resolution: { width: 1920, height: 1080 },
                  },
                  metadata: {
                    // Add placeholder metadata
                    version: "1.0",
                    totalSlides: previewPresentation.slides.length,
                    estimatedDuration: previewPresentation.slides.reduce(
                      (sum, slide) => sum + (slide.duration || 0),
                      0
                    ),
                    isPublic: false,
                    isTemplate: false,
                  },
                }}
                className="h-full"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
