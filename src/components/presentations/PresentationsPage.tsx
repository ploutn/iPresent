// src/components/presentations/PresentationsPage.tsx
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useContentStore } from "@/stores/useContentStore";
import { usePresentationStore } from "@/store/presentationStore";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  Plus,
  Search,
  LayoutGrid,
  List,
  Edit,
  Copy,
  Trash2,
  Share2,
  Download,
  Eye,
  FileText,
  X,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "../ui/dialog";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { v4 as uuidv4 } from "uuid";
import { PresentationTemplate, PresentationContentItem, Slide } from "@/types";
import { TemplateSelector } from "../templates/TemplateSelector";
import { AnnouncementEditor } from "../announcements/AnnouncementEditor";
import { PresentationPlayer } from "../presentations/PresentationPlayer";
import { TemplateShareManager } from "../templates/TemplateShareManager";
import { useToast } from "../ui/use-toast";
import { ScrollArea } from "../ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Checkbox } from "../ui/checkbox";
import PresentationEditor from "./PresentationEditor";

const samplePresentations: PresentationContentItem[] = [
  {
    id: "1",
    title: "Sunday Service",
    description: "Main service presentation for Sunday worship.",
    type: "presentation",
    content: "",
    createdAt: new Date("2024-01-01T09:00:00Z"),
    updatedAt: new Date("2024-01-01T09:00:00Z"),
    template: "church",
    slides: [
      {
        id: "1",
        title: "Welcome",
        content: "Welcome to our Sunday Service",
        type: "presentation",
        order: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        backgroundColor: "#000000",
        textColor: "#ffffff",
        fontSize: 24,
        fontFamily: "Arial",
        textAlign: "center",
        elements: [
          {
            id: uuidv4(),
            type: "text",
            content: "Welcome to our Sunday Service",
            x: 10,
            y: 10,
            width: 80,
            height: 20,
            fontSize: 36,
            fontFamily: "Arial",
            fontColor: "#ffffff",
            textAlign: "center",
          },
        ],
      },
    ],
    category: "Worship",
    tags: ["sunday", "worship", "service"],
    settings: {
      autoAdvance: false,
      defaultSlideDuration: 5,
      theme: "church",
      transition: "fade",
      loopPresentation: false,
      showSlideNumbers: true,
      showProgressBar: true,
      allowRemoteControl: true,
      backgroundColor: "#000000",
      defaultTransition: {
        type: "fade",
        duration: 500,
        direction: "right",
        easing: "ease-in-out",
      },
      aspectRatio: "16:9",
      resolution: { width: 1920, height: 1080 },
    },
    metadata: {
      version: "1.0",
      totalSlides: 1,
      estimatedDuration: 0,
      isPublic: false,
      isTemplate: false,
    },
  },
  {
    id: "2",
    title: "Bible Study",
    description: "Weekly Bible study presentation.",
    type: "presentation",
    content: "",
    createdAt: new Date("2024-01-02T19:00:00Z"),
    updatedAt: new Date("2024-01-02T19:00:00Z"),
    template: "church",
    slides: [
      {
        id: "1",
        title: "Bible Study",
        content: "Welcome to Bible Study",
        type: "presentation",
        order: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        backgroundColor: "#000000",
        textColor: "#ffffff",
        fontSize: 24,
        fontFamily: "Arial",
        textAlign: "center",
        elements: [
          {
            id: uuidv4(),
            type: "text",
            content: "Welcome to Bible Study",
            x: 10,
            y: 10,
            width: 80,
            height: 20,
            fontSize: 36,
            fontFamily: "Arial",
            fontColor: "#ffffff",
            textAlign: "center",
          },
        ],
      },
    ],
    category: "Study",
    tags: ["bible", "study", "weekly"],
    settings: {
      autoAdvance: false,
      defaultSlideDuration: 5,
      theme: "church",
      transition: "fade",
      loopPresentation: false,
      showSlideNumbers: true,
      showProgressBar: true,
      allowRemoteControl: true,
      backgroundColor: "#000000",
      defaultTransition: {
        type: "fade",
        duration: 500,
        direction: "right",
        easing: "ease-in-out",
      },
      aspectRatio: "16:9",
      resolution: { width: 1920, height: 1080 },
    },
    metadata: {
      version: "1.0",
      totalSlides: 1,
      estimatedDuration: 0,
      isPublic: false,
      isTemplate: false,
    },
  },
  {
    id: "3",
    title: "Youth Group",
    description: "Youth group meeting presentation.",
    type: "presentation",
    content: "",
    createdAt: new Date("2024-01-03T18:00:00Z"),
    updatedAt: new Date("2024-01-03T18:00:00Z"),
    template: "church",
    slides: [
      {
        id: "1",
        title: "Youth Group",
        content: "Welcome to Youth Group",
        type: "presentation",
        order: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        backgroundColor: "#000000",
        textColor: "#ffffff",
        fontSize: 24,
        fontFamily: "Arial",
        textAlign: "center",
        elements: [
          {
            id: uuidv4(),
            type: "text",
            content: "Welcome to Youth Group",
            x: 10,
            y: 10,
            width: 80,
            height: 20,
            fontSize: 36,
            fontFamily: "Arial",
            fontColor: "#ffffff",
            textAlign: "center",
          },
        ],
      },
    ],
    category: "Youth",
    tags: ["youth", "group", "meeting"],
    settings: {
      autoAdvance: false,
      defaultSlideDuration: 5,
      theme: "church",
      transition: "fade",
      loopPresentation: false,
      showSlideNumbers: true,
      showProgressBar: true,
      allowRemoteControl: true,
      backgroundColor: "#000000",
      defaultTransition: {
        type: "fade",
        duration: 500,
        direction: "right",
        easing: "ease-in-out",
      },
      aspectRatio: "16:9",
      resolution: { width: 1920, height: 1080 },
    },
    metadata: {
      version: "1.0",
      totalSlides: 1,
      estimatedDuration: 0,
      isPublic: false,
      isTemplate: false,
    },
  },
  {
    id: "4",
    title: "Q4 Financial Report",
    description: "Quarterly financial overview and projections.",
    type: "presentation",
    content: "",
    createdAt: new Date("2024-01-04T14:00:00Z"),
    updatedAt: new Date("2024-01-04T14:00:00Z"),
    template: "business",
    slides: [
      {
        id: "1",
        title: "Q4 Financial Report",
        content: "Financial Overview",
        type: "presentation",
        order: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        backgroundColor: "#000000",
        textColor: "#ffffff",
        fontSize: 24,
        fontFamily: "Arial",
        textAlign: "center",
        elements: [
          {
            id: uuidv4(),
            type: "text",
            content: "Q4 Financial Report",
            x: 10,
            y: 10,
            width: 80,
            height: 20,
            fontSize: 36,
            fontFamily: "Arial",
            fontColor: "#ffffff",
            textAlign: "center",
          },
        ],
      },
    ],
    category: "Finance",
    tags: ["finance", "report", "quarterly"],
    settings: {
      autoAdvance: false,
      defaultSlideDuration: 5,
      theme: "business",
      transition: "fade",
      loopPresentation: false,
      showSlideNumbers: true,
      showProgressBar: true,
      allowRemoteControl: true,
      backgroundColor: "#000000",
      defaultTransition: {
        type: "fade",
        duration: 500,
        direction: "right",
        easing: "ease-in-out",
      },
      aspectRatio: "16:9",
      resolution: { width: 1920, height: 1080 },
    },
    metadata: {
      version: "1.0",
      totalSlides: 1,
      estimatedDuration: 0,
      isPublic: false,
      isTemplate: false,
    },
  },
  {
    id: "5",
    title: "Design Portfolio",
    description: "Showcase of recent design projects and concepts.",
    type: "presentation",
    content: "",
    createdAt: new Date("2024-01-05T11:00:00Z"),
    updatedAt: new Date("2024-01-05T11:00:00Z"),
    template: "creative",
    slides: [
      {
        id: "1",
        title: "Design Portfolio",
        content: "Recent Projects",
        type: "presentation",
        order: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        backgroundColor: "#000000",
        textColor: "#ffffff",
        fontSize: 24,
        fontFamily: "Arial",
        textAlign: "center",
        elements: [
          {
            id: uuidv4(),
            type: "text",
            content: "Design Portfolio",
            x: 10,
            y: 10,
            width: 80,
            height: 20,
            fontSize: 36,
            fontFamily: "Arial",
            fontColor: "#ffffff",
            textAlign: "center",
          },
        ],
      },
    ],
    category: "Design",
    tags: ["design", "portfolio", "projects"],
    settings: {
      autoAdvance: false,
      defaultSlideDuration: 5,
      theme: "creative",
      transition: "fade",
      loopPresentation: false,
      showSlideNumbers: true,
      showProgressBar: true,
      allowRemoteControl: true,
      backgroundColor: "#000000",
      defaultTransition: {
        type: "fade",
        duration: 500,
        direction: "right",
        easing: "ease-in-out",
      },
      aspectRatio: "16:9",
      resolution: { width: 1920, height: 1080 },
    },
    metadata: {
      version: "1.0",
      totalSlides: 1,
      estimatedDuration: 0,
      isPublic: false,
      isTemplate: false,
    },
  },
  {
    id: "6",
    title: "React Workshop",
    description: "Introduction to React and modern web development.",
    type: "presentation",
    content: "",
    createdAt: new Date("2024-01-06T13:00:00Z"),
    updatedAt: new Date("2024-01-06T13:00:00Z"),
    template: "education",
    slides: [
      {
        id: "1",
        title: "React Workshop",
        content: "Introduction to React",
        type: "presentation",
        order: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        backgroundColor: "#000000",
        textColor: "#ffffff",
        fontSize: 24,
        fontFamily: "Arial",
        textAlign: "center",
        elements: [
          {
            id: uuidv4(),
            type: "text",
            content: "React Workshop",
            x: 10,
            y: 10,
            width: 80,
            height: 20,
            fontSize: 36,
            fontFamily: "Arial",
            fontColor: "#ffffff",
            textAlign: "center",
          },
        ],
      },
    ],
    category: "Education",
    tags: ["react", "javascript", "webdev"],
    settings: {
      autoAdvance: false,
      defaultSlideDuration: 5,
      theme: "education",
      transition: "fade",
      loopPresentation: false,
      showSlideNumbers: true,
      showProgressBar: true,
      allowRemoteControl: true,
      backgroundColor: "#000000",
      defaultTransition: {
        type: "fade",
        duration: 500,
        direction: "right",
        easing: "ease-in-out",
      },
      aspectRatio: "16:9",
      resolution: { width: 1920, height: 1080 },
    },
    metadata: {
      version: "1.0",
      totalSlides: 1,
      estimatedDuration: 0,
      isPublic: false,
      isTemplate: false,
    },
  },
  {
    id: "7",
    title: "Community Outreach",
    description: "Plans and initiatives for community engagement.",
    type: "presentation",
    content: "",
    createdAt: new Date("2024-01-07T15:00:00Z"),
    updatedAt: new Date("2024-01-07T15:00:00Z"),
    template: "community",
    slides: [
      {
        id: "1",
        title: "Community Outreach",
        content: "Engagement Plans",
        type: "presentation",
        order: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        backgroundColor: "#000000",
        textColor: "#ffffff",
        fontSize: 24,
        fontFamily: "Arial",
        textAlign: "center",
        elements: [
          {
            id: uuidv4(),
            type: "text",
            content: "Community Outreach",
            x: 10,
            y: 10,
            width: 80,
            height: 20,
            fontSize: 36,
            fontFamily: "Arial",
            fontColor: "#ffffff",
            textAlign: "center",
          },
        ],
      },
    ],
    category: "Community",
    tags: ["community", "outreach", "engagement"],
    settings: {
      autoAdvance: false,
      defaultSlideDuration: 5,
      theme: "community",
      transition: "fade",
      loopPresentation: false,
      showSlideNumbers: true,
      showProgressBar: true,
      allowRemoteControl: true,
      backgroundColor: "#000000",
      defaultTransition: {
        type: "fade",
        duration: 500,
        direction: "right",
        easing: "ease-in-out",
      },
      aspectRatio: "16:9",
      resolution: { width: 1920, height: 1080 },
    },
    metadata: {
      version: "1.0",
      totalSlides: 1,
      estimatedDuration: 0,
      isPublic: false,
      isTemplate: false,
    },
  },
];

// Add presentation templates constant
const presentationTemplates: PresentationTemplate[] = [
  {
    id: "church",
    name: "Church Service",
    description: "Template for church services",
    category: "Worship",
    thumbnail: "",
    slides: [],
    image: "",
    settings: {
      autoAdvance: false,
      defaultSlideDuration: 5,
      theme: "church",
      transition: "fade",
      loopPresentation: false,
      showSlideNumbers: true,
      showProgressBar: true,
      allowRemoteControl: true,
      backgroundColor: "#000000",
      defaultTransition: {
        type: "fade",
        duration: 500,
        direction: "right",
        easing: "ease-in-out",
      },
      aspectRatio: "16:9",
      resolution: { width: 1920, height: 1080 },
    },
    tags: ["church", "worship", "service"],
    isBuiltIn: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const PresentationsPage: React.FC = () => {
  const { toast } = useToast();
  const {
    presentations,
    setPresentations,
    addPresentation,
    updatePresentation,
    deletePresentation,
  } = usePresentationStore();
  const [selectedPresentation, setSelectedPresentation] =
    useState<PresentationContentItem | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isTemplateSelectorOpen, setIsTemplateSelectorOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"date" | "name">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [newPresentation, setNewPresentation] = useState<
    Partial<PresentationContentItem>
  >({
    title: "",
    description: "",
    type: "presentation",
    content: "",
    createdAt: new Date(),
    updatedAt: new Date(),
    template: "default",
    slides: [],
    category: "Worship",
    tags: [],
    settings: {
      autoAdvance: false,
      defaultSlideDuration: 5,
      theme: "church",
      transition: "fade",
      loopPresentation: false,
      showSlideNumbers: true,
      showProgressBar: true,
      allowRemoteControl: true,
      backgroundColor: "#000000",
      defaultTransition: {
        type: "fade",
        duration: 500,
        direction: "right",
        easing: "ease-in-out",
      },
      aspectRatio: "16:9",
      resolution: { width: 1920, height: 1080 },
    },
    metadata: {
      version: "1.0",
      totalSlides: 0,
      estimatedDuration: 0,
      isPublic: false,
      isTemplate: false,
    },
  });

  // Load presentations from localStorage
  useEffect(() => {
    try {
      setIsLoading(true);
      const savedPresentations = localStorage.getItem("presentations");
      if (savedPresentations) {
        const parsedPresentations = JSON.parse(savedPresentations);
        setPresentations(parsedPresentations);
      }
    } catch (err) {
      console.error("Error loading presentations:", err);
      setError("Failed to load presentations");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save presentations to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("presentations", JSON.stringify(presentations));
  }, [presentations]);

  // Filter and sort presentations
  const filteredPresentations = useMemo(() => {
    return presentations
      .filter((presentation) => {
        const matchesSearch =
          presentation.title
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          (presentation.description || "")
            .toLowerCase()
            .includes(searchQuery.toLowerCase());
        const matchesCategory =
          !selectedCategory || presentation.category === selectedCategory;
        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => {
        if (sortBy === "date") {
          const aDate = new Date(a.createdAt).getTime();
          const bDate = new Date(b.createdAt).getTime();
          return sortOrder === "asc" ? aDate - bDate : bDate - aDate;
        } else {
          const aTitle = a.title.toLowerCase();
          const bTitle = b.title.toLowerCase();
          return sortOrder === "asc"
            ? aTitle.localeCompare(bTitle)
            : bTitle.localeCompare(aTitle);
        }
      });
  }, [presentations, searchQuery, selectedCategory, sortBy, sortOrder]);

  const handleViewPresentation = useCallback(
    (presentation: PresentationContentItem) => {
      setSelectedPresentation(presentation);
      setIsEditorOpen(true);
    },
    []
  );

  const handleDuplicatePresentation = useCallback(
    (presentation: PresentationContentItem) => {
      const duplicatedPresentation: PresentationContentItem = {
        ...presentation,
        id: uuidv4(),
        title: `${presentation.title} (Copy)`,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      addPresentation(duplicatedPresentation);
      toast({
        title: "Presentation Duplicated",
        description: `${presentation.title} has been duplicated.`,
      });
    },
    [addPresentation, toast]
  );

  const handleAddNewPresentation = useCallback(() => {
    setSelectedPresentation(null);
    setNewPresentation({
      title: "",
      description: "",
      type: "presentation",
      content: "",
      createdAt: new Date(),
      updatedAt: new Date(),
      template: undefined,
      slides: [],
      category: "Worship",
      tags: [],
      settings: {
        autoAdvance: false,
        defaultSlideDuration: 5,
        theme: "church",
        transition: "fade",
        loopPresentation: false,
        showSlideNumbers: true,
        showProgressBar: true,
        allowRemoteControl: true,
        backgroundColor: "#000000",
        defaultTransition: {
          type: "fade",
          duration: 500,
          direction: "right",
          easing: "ease-in-out",
        },
        aspectRatio: "16:9",
        resolution: { width: 1920, height: 1080 },
      },
      metadata: {
        version: "1.0",
        lastModifiedBy: "",
        totalSlides: 0,
        estimatedDuration: 0,
        fileSize: 0,
        exportFormats: [],
        collaborators: [],
        isPublic: false,
        isTemplate: false,
      },
    });
    setIsTemplateSelectorOpen(true);
  }, []);

  const handleTemplateSelect = (template: PresentationTemplate) => {
    const newPresentationData: PresentationContentItem = {
      id: uuidv4(),
      title: `${template.name} Presentation`,
      description: template.description,
      type: "presentation",
      content: "",
      createdAt: new Date(),
      updatedAt: new Date(),
      template: template.id,
      slides: template.slides.map((slide) => ({
        id: uuidv4(),
        title: slide.title || "New Slide",
        content: slide.content || "",
        type: "presentation",
        order: slide.order || 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        backgroundColor: slide.backgroundColor || "#000000",
        textColor: slide.textColor || "#ffffff",
        fontSize: slide.fontSize || 24,
        fontFamily: slide.fontFamily || "Arial",
        textAlign: slide.textAlign || "center",
        elements: [
          {
            id: uuidv4(),
            type: "text",
            content: slide.title || "New Slide",
            x: 10,
            y: 10,
            width: 80,
            height: 20,
            fontSize: 36,
            fontFamily: "Arial",
            fontColor: "#ffffff",
            textAlign: "center",
          },
        ],
        transition: slide.transition || {
          type: "fade",
          duration: 500,
          direction: "right",
          easing: "ease-in-out",
        },
        duration: slide.duration || 5,
        thumbnail: slide.thumbnail || "",
        notes: slide.notes || "",
        mediaElements: slide.mediaElements || [],
        overlaySettings: slide.overlaySettings || {
          textOverlay: false,
          textBackground: { enabled: false },
        },
      })),
      category: template.category,
      tags: template.tags,
      settings: {
        autoAdvance: template.settings?.autoAdvance ?? false,
        defaultSlideDuration: template.settings?.defaultSlideDuration ?? 5,
        theme: template.settings?.theme ?? "church",
        transition: template.settings?.transition ?? "fade",
        loopPresentation: template.settings?.loopPresentation ?? false,
        showSlideNumbers: template.settings?.showSlideNumbers ?? true,
        showProgressBar: template.settings?.showProgressBar ?? true,
        allowRemoteControl: template.settings?.allowRemoteControl ?? true,
        backgroundColor: template.settings?.backgroundColor ?? "#000000",
        defaultTransition: template.settings?.defaultTransition ?? {
          type: "fade",
          duration: 500,
          direction: "right",
          easing: "ease-in-out",
        },
        aspectRatio: template.settings?.aspectRatio ?? "16:9",
        resolution: template.settings?.resolution ?? {
          width: 1920,
          height: 1080,
        },
      },
      metadata: {
        version: "1.0",
        lastModifiedBy: "",
        totalSlides: template.slides.length,
        estimatedDuration: template.slides.reduce(
          (sum, slide) => sum + (slide.duration || 0),
          0
        ),
        fileSize: 0,
        exportFormats: [],
        collaborators: [],
        isPublic: false,
        isTemplate: false,
        templateCategory: template.category,
      },
    };

    setSelectedPresentation(newPresentationData);
    setNewPresentation(newPresentationData);
    setIsTemplateSelectorOpen(false);
    setIsEditorOpen(true);
  };

  const handleCreateBlank = () => {
    const blankPresentation: PresentationContentItem = {
      id: uuidv4(),
      title: "New Presentation",
      description: "",
      type: "presentation",
      content: "",
      createdAt: new Date(),
      updatedAt: new Date(),
      template: undefined,
      slides: [
        {
          id: uuidv4(),
          title: "New Slide",
          content: "",
          type: "presentation",
          order: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
          backgroundColor: "#000000",
          textColor: "#ffffff",
          fontSize: 24,
          fontFamily: "Arial",
          textAlign: "center",
          elements: [
            {
              id: uuidv4(),
              type: "text",
              content: "New Slide",
              x: 10,
              y: 10,
              width: 80,
              height: 20,
              fontSize: 36,
              fontFamily: "Arial",
              fontColor: "#ffffff",
              textAlign: "center",
            },
          ],
        },
      ],
      category: "Worship",
      tags: [],
      settings: {
        autoAdvance: false,
        defaultSlideDuration: 5,
        theme: "church",
        transition: "fade",
        loopPresentation: false,
        showSlideNumbers: true,
        showProgressBar: true,
        allowRemoteControl: true,
        backgroundColor: "#000000",
        defaultTransition: {
          type: "fade",
          duration: 500,
          direction: "right",
          easing: "ease-in-out",
        },
        aspectRatio: "16:9",
        resolution: { width: 1920, height: 1080 },
      },
      metadata: {
        version: "1.0",
        lastModifiedBy: "",
        totalSlides: 1,
        estimatedDuration: 0,
        fileSize: 0,
        exportFormats: [],
        collaborators: [],
        isPublic: false,
        isTemplate: false,
      },
    };

    setSelectedPresentation(blankPresentation);
    setNewPresentation(blankPresentation);
    setIsTemplateSelectorOpen(false);
    setIsEditorOpen(true);
  };

  const handleEditPresentation = useCallback(
    (presentation: PresentationContentItem) => {
      setSelectedPresentation(presentation);
      setNewPresentation({
        title: presentation.title,
        description: presentation.description || "",
        slides: presentation.slides,
        template: presentation.template || undefined,
      });
      setIsEditorOpen(true);
    },
    []
  );

  const handleDeletePresentation = useCallback(
    (id: string) => {
      deletePresentation(id);
      toast({
        title: "Presentation Deleted",
        description: "The presentation has been successfully deleted.",
      });
    },
    [deletePresentation, toast]
  );

  const handleSavePresentation = useCallback(() => {
    if (!newPresentation.title?.trim()) {
      toast({
        title: "Error",
        description: "Presentation title cannot be empty.",
        variant: "destructive",
      });
      return;
    }

    const now = new Date();
    const presentationData: PresentationContentItem = {
      id: selectedPresentation?.id || uuidv4(),
      title: newPresentation.title,
      description: newPresentation.description || "",
      slides: newPresentation.slides || [],
      createdAt: selectedPresentation?.createdAt || now,
      updatedAt: now,
      type: "presentation" as const,
      content: newPresentation.description || "",
      category: newPresentation.category || "Uncategorized",
      tags: newPresentation.tags || [],
      template: newPresentation.template,
      settings: {
        autoAdvance: false,
        defaultSlideDuration: 5,
        theme: "default",
        transition: "fade",
        loopPresentation: false,
        showSlideNumbers: false,
        showProgressBar: false,
        allowRemoteControl: false,
        backgroundColor: "#000000",
        defaultTransition: {
          type: "fade",
          duration: 500,
          direction: "right",
          easing: "ease-in-out",
        },
        aspectRatio: "16:9",
        resolution: { width: 1920, height: 1080 },
      },
      metadata: {
        version: "1.0",
        totalSlides: (newPresentation.slides || []).length,
        estimatedDuration: (newPresentation.slides || []).reduce(
          (sum, slide) => sum + (slide.duration || 0),
          0
        ),
        isPublic: false,
        isTemplate: false,
      },
    };

    if (selectedPresentation) {
      updatePresentation(selectedPresentation.id, presentationData);
      toast({
        title: "Presentation Updated",
        description: `${presentationData.title} has been updated.`,
      });
    } else {
      addPresentation(presentationData);
      toast({
        title: "Presentation Created",
        description: `${presentationData.title} has been created.`,
      });
    }

    setIsEditorOpen(false);
    setSelectedPresentation(null);
    setNewPresentation({
      title: "",
      description: "",
      type: "presentation",
      content: "",
      createdAt: new Date(),
      updatedAt: new Date(),
      template: "default",
      slides: [],
      category: "Worship",
      tags: [],
      settings: {
        autoAdvance: false,
        defaultSlideDuration: 5,
        theme: "church",
        transition: "fade",
        loopPresentation: false,
        showSlideNumbers: true,
        showProgressBar: true,
        allowRemoteControl: true,
        backgroundColor: "#000000",
        defaultTransition: {
          type: "fade",
          duration: 500,
          direction: "right",
          easing: "ease-in-out",
        },
        aspectRatio: "16:9",
        resolution: { width: 1920, height: 1080 },
      },
      metadata: {
        version: "1.0",
        totalSlides: 0,
        estimatedDuration: 0,
        isPublic: false,
        isTemplate: false,
      },
    });
  }, [
    newPresentation,
    selectedPresentation,
    updatePresentation,
    addPresentation,
    toast,
  ]);

  const handleSharePresentation = useCallback(
    (presentation: PresentationContentItem) => {
      // Implement share logic here
    },
    []
  );

  const categories = useMemo(() => {
    const uniqueCategories = new Set(
      presentations.map((p) => p.category || "Uncategorized")
    );
    return ["All", ...Array.from(uniqueCategories)];
  }, [presentations]);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Presentations</h1>
          <button
            onClick={() => setIsTemplateSelectorOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Plus className="h-5 w-5 mr-2" />
            New Presentation
          </button>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <input
                type="text"
                placeholder="Search presentations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <select
              value={selectedCategory || ""}
              onChange={(e) => setSelectedCategory(e.target.value || null)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">All Categories</option>
              <option value="Worship">Worship</option>
              <option value="Bible Study">Bible Study</option>
              <option value="Youth Group">Youth Group</option>
              <option value="Community Outreach">Community Outreach</option>
            </select>
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [newSortBy, newSortOrder] = e.target.value.split("-");
                setSortBy(newSortBy as "date" | "name");
                setSortOrder(newSortOrder as "asc" | "desc");
              }}
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
            </select>
          </div>
        </div>

        {/* Presentations Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-700">{error}</p>
          </div>
        ) : filteredPresentations.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No presentations found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPresentations.map((presentation) => (
              <div
                key={presentation.id}
                className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow duration-200"
              >
                <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                  {presentation.slides[0]?.thumbnail ? (
                    <img
                      src={presentation.slides[0].thumbnail}
                      alt={presentation.title}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <FileText className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {presentation.title}
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">
                    {presentation.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {(presentation.tags || []).map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      {new Date(presentation.createdAt).toLocaleDateString()}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditPresentation(presentation)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() =>
                          handleDeletePresentation(presentation.id)
                        }
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Template Selector Modal */}
      {isTemplateSelectorOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Choose a Template
                </h2>
                <button
                  onClick={() => setIsTemplateSelectorOpen(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {presentationTemplates.map((template) => (
                  <div
                    key={template.id}
                    onClick={() => handleTemplateSelect(template)}
                    className="cursor-pointer group"
                  >
                    <div className="aspect-w-16 aspect-h-9 bg-gray-200 rounded-lg overflow-hidden">
                      {template.thumbnail ? (
                        <img
                          src={template.thumbnail}
                          alt={template.name}
                          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-200"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <FileText className="h-12 w-12 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="mt-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {template.name}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {template.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Presentation Editor Modal */}
      {isEditorOpen && selectedPresentation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-2xl font-bold text-gray-900">
                {selectedPresentation.id
                  ? "Edit Presentation"
                  : "New Presentation"}
              </h2>
              <button
                onClick={() => setIsEditorOpen(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              <PresentationEditor
                presentation={selectedPresentation}
                onSave={handleSavePresentation}
                onCancel={() => setIsEditorOpen(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PresentationsPage;
