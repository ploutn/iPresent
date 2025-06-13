// src/components/templates/PresentationTemplateManager.tsx
import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  Plus,
  Search,
  Filter,
  Grid3X3,
  List,
  MoreVertical,
  Edit,
  Copy,
  Trash2,
  Download,
  Upload,
  Share2,
  Eye,
  Star,
  StarOff,
  Palette,
} from "lucide-react";
import {
  PresentationTemplate,
  Slide,
  PresentationSettings,
  PresentationContentItem,
} from "../../types";
import { usePresentationStore } from "../../store/presentationStore";
import { TemplateCustomizer } from "./TemplateCustomizer";
import {
  TemplateShareManager,
  TemplateShareData,
} from "./TemplateShareManager";

export interface PresentationTemplateManagerProps {
  className?: string;
  onTemplateSelect?: (template: PresentationTemplate) => void;
  onTemplateCreate?: (template: PresentationTemplate) => void;
  onTemplateUpdate?: (template: PresentationTemplate) => void;
  onTemplateDelete?: (templateId: string) => void;
  mode?: "select" | "manage"; // Select mode for choosing templates, manage mode for full management
}

interface TemplateFormData {
  name: string;
  description: string;
  category: string;
  tags: string[];
  thumbnail: string;
}

const TEMPLATE_CATEGORIES = [
  "Business",
  "Education",
  "Creative",
  "Marketing",
  "Technology",
  "Healthcare",
  "Finance",
  "Non-profit",
  "Personal",
  "Other",
];

const DEFAULT_TEMPLATES: PresentationTemplate[] = [
  {
    id: "template-business-pitch",
    name: "Business Pitch",
    description:
      "Professional business presentation template with clean design",
    category: "Business",
    thumbnail: "/templates/business-pitch.svg",
    slides: [
      {
        title: "Company Overview",
        content: "Your company name and tagline",
        type: "presentation",
        backgroundColor: "#1e40af",
        textColor: "#ffffff",
        fontSize: 32,
        fontFamily: "Inter",
        textAlign: "center",
      },
      {
        title: "Problem Statement",
        content: "What problem are you solving?",
        type: "presentation",
        backgroundColor: "#ffffff",
        textColor: "#1e40af",
        fontSize: 24,
        fontFamily: "Inter",
        textAlign: "left",
      },
      {
        title: "Solution",
        content: "How does your product solve this problem?",
        type: "presentation",
        backgroundColor: "#f8fafc",
        textColor: "#1e40af",
        fontSize: 24,
        fontFamily: "Inter",
        textAlign: "left",
      },
      {
        title: "Market Opportunity",
        content: "Size and potential of your target market",
        type: "presentation",
        backgroundColor: "#ffffff",
        textColor: "#1e40af",
        fontSize: 24,
        fontFamily: "Inter",
        textAlign: "left",
      },
      {
        title: "Thank You",
        content: "Questions?",
        type: "presentation",
        backgroundColor: "#1e40af",
        textColor: "#ffffff",
        fontSize: 32,
        fontFamily: "Inter",
        textAlign: "center",
      },
    ],
    settings: {
      autoAdvance: false,
      defaultSlideDuration: 30,
      loopPresentation: false,
      showSlideNumbers: true,
      showProgressBar: true,
      allowRemoteControl: true,
      backgroundColor: "#ffffff",
      defaultTransition: {
        type: "fade",
        duration: 500,
        easing: "ease-in-out",
      },
      aspectRatio: "16:9",
      resolution: { width: 1920, height: 1080 },
    },
    tags: ["business", "pitch", "professional", "corporate"],
    isBuiltIn: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "template-education-lesson",
    name: "Education Lesson",
    description: "Clean educational template perfect for lessons and lectures",
    category: "Education",
    thumbnail: "/templates/education-lesson.svg",
    slides: [
      {
        title: "Lesson Title",
        content: "Today's Topic",
        type: "presentation",
        backgroundColor: "#059669",
        textColor: "#ffffff",
        fontSize: 36,
        fontFamily: "Inter",
        textAlign: "center",
      },
      {
        title: "Learning Objectives",
        content: "What will students learn today?",
        type: "presentation",
        backgroundColor: "#ffffff",
        textColor: "#059669",
        fontSize: 24,
        fontFamily: "Inter",
        textAlign: "left",
      },
      {
        title: "Main Content",
        content: "Core lesson material",
        type: "presentation",
        backgroundColor: "#f0fdf4",
        textColor: "#059669",
        fontSize: 24,
        fontFamily: "Inter",
        textAlign: "left",
      },
      {
        title: "Activity",
        content: "Interactive exercise or discussion",
        type: "presentation",
        backgroundColor: "#ffffff",
        textColor: "#059669",
        fontSize: 24,
        fontFamily: "Inter",
        textAlign: "center",
      },
      {
        title: "Summary",
        content: "Key takeaways from today's lesson",
        type: "presentation",
        backgroundColor: "#059669",
        textColor: "#ffffff",
        fontSize: 28,
        fontFamily: "Inter",
        textAlign: "center",
      },
    ],
    settings: {
      autoAdvance: false,
      defaultSlideDuration: 60,
      loopPresentation: false,
      showSlideNumbers: true,
      showProgressBar: false,
      allowRemoteControl: true,
      backgroundColor: "#ffffff",
      defaultTransition: {
        type: "slide",
        duration: 300,
        direction: "right",
        easing: "ease-out",
      },
      aspectRatio: "16:9",
      resolution: { width: 1920, height: 1080 },
    },
    tags: ["education", "lesson", "teaching", "academic"],
    isBuiltIn: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "template-creative-portfolio",
    name: "Creative Portfolio",
    description:
      "Showcase your creative work with this modern portfolio template",
    category: "Creative",
    thumbnail: "/templates/creative-portfolio.svg",
    slides: [
      {
        title: "Portfolio",
        content: "Your Name\nCreative Professional",
        type: "presentation",
        backgroundColor: "#7c3aed",
        textColor: "#ffffff",
        fontSize: 32,
        fontFamily: "Inter",
        textAlign: "center",
      },
      {
        title: "About Me",
        content: "Brief introduction and background",
        type: "presentation",
        backgroundColor: "#ffffff",
        textColor: "#7c3aed",
        fontSize: 24,
        fontFamily: "Inter",
        textAlign: "left",
      },
      {
        title: "Featured Work",
        content: "Showcase your best projects",
        type: "presentation",
        backgroundColor: "#faf5ff",
        textColor: "#7c3aed",
        fontSize: 24,
        fontFamily: "Inter",
        textAlign: "center",
      },
      {
        title: "Skills & Expertise",
        content: "Your core competencies",
        type: "presentation",
        backgroundColor: "#ffffff",
        textColor: "#7c3aed",
        fontSize: 24,
        fontFamily: "Inter",
        textAlign: "left",
      },
      {
        title: "Contact",
        content: "Let's work together",
        type: "presentation",
        backgroundColor: "#7c3aed",
        textColor: "#ffffff",
        fontSize: 32,
        fontFamily: "Inter",
        textAlign: "center",
      },
    ],
    settings: {
      autoAdvance: false,
      defaultSlideDuration: 45,
      loopPresentation: false,
      showSlideNumbers: false,
      showProgressBar: true,
      allowRemoteControl: true,
      backgroundColor: "#ffffff",
      defaultTransition: {
        type: "zoom",
        duration: 600,
        easing: "ease-in-out",
      },
      aspectRatio: "16:9",
      resolution: { width: 1920, height: 1080 },
    },
    tags: ["creative", "portfolio", "design", "showcase"],
    isBuiltIn: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export function PresentationTemplateManager({
  className = "",
  onTemplateSelect,
  onTemplateCreate,
  onTemplateUpdate,
  onTemplateDelete,
  mode = "manage",
}: PresentationTemplateManagerProps) {
  const { templates, createTemplate, deleteTemplate } = usePresentationStore();
  const [userTemplates, setUserTemplates] =
    useState<PresentationTemplate[]>(templates);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingTemplate, setEditingTemplate] =
    useState<PresentationTemplate | null>(null);
  const [formData, setFormData] = useState<TemplateFormData>({
    name: "",
    description: "",
    category: "Business",
    tags: [],
    thumbnail: "",
  });
  const [showCustomizer, setShowCustomizer] = useState(false);
  const [templateToCustomize, setTemplateToCustomize] =
    useState<PresentationTemplate | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [showShareManager, setShowShareManager] = useState(false);
  const [templateToShare, setTemplateToShare] =
    useState<PresentationTemplate | null>(null);

  // Combine built-in and user templates
  const allTemplates = [...DEFAULT_TEMPLATES, ...userTemplates];

  // Update user templates when store changes
  useEffect(() => {
    setUserTemplates(templates);
  }, [templates]);

  // Filter templates based on search and category
  const filteredTemplates = allTemplates.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );
    const matchesCategory =
      selectedCategory === "all" || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCreateTemplate = () => {
    if (!formData.name.trim()) return;

    // Create a temporary presentation to base the template on
    const tempPresentation: PresentationContentItem = {
      id: `temp-${Date.now()}`,
      title: formData.name,
      description: formData.description,
      content: "",
      type: "presentation",
      tags: formData.tags,
      createdAt: new Date(),
      updatedAt: new Date(),
      isTemplate: false,
      slides: [
        {
          id: `slide-${Date.now()}`,
          title: "Title Slide",
          content: "Your content here",
          type: "presentation",
          order: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
          backgroundColor: "#ffffff",
          textColor: "#000000",
          fontSize: 24,
          fontFamily: "Arial",
          textAlign: "center",
        },
      ],
      settings: {
        autoAdvance: false,
        defaultSlideDuration: 5,
        theme: "default",
        transition: "fade",
      },
      thumbnail: formData.thumbnail || "/templates/default.svg",
    };

    createTemplate(tempPresentation, formData.name, formData.category);

    // The template will be automatically added to the store and userTemplates will update via useEffect
    onTemplateCreate?.(tempPresentation as any); // Type assertion for compatibility
    setShowCreateDialog(false);
    resetForm();
  };

  const handleUpdateTemplate = () => {
    if (!editingTemplate || !formData.name.trim()) return;

    const updatedTemplate: PresentationTemplate = {
      ...editingTemplate,
      name: formData.name,
      description: formData.description,
      category: formData.category,
      tags: formData.tags,
      thumbnail: formData.thumbnail || editingTemplate.thumbnail,
      updatedAt: new Date(),
    };

    // Update the local state
    setUserTemplates((prev) =>
      prev.map((t) => (t.id === updatedTemplate.id ? updatedTemplate : t))
    );
    onTemplateUpdate?.(updatedTemplate);
    setEditingTemplate(null);
    resetForm();
  };

  const handleDeleteTemplate = (templateId: string) => {
    deleteTemplate(templateId);
    onTemplateDelete?.(templateId);
  };

  const handleCustomizeTemplate = (template: PresentationTemplate) => {
    setTemplateToCustomize(template);
    setShowCustomizer(true);
  };

  const handleApplyCustomizedTemplate = (
    customizedTemplate: PresentationTemplate
  ) => {
    onTemplateSelect?.(customizedTemplate);
    setShowCustomizer(false);
    setTemplateToCustomize(null);
  };

  const handleShareTemplate = (template: PresentationTemplate) => {
    setTemplateToShare(template);
    setShowShareManager(true);
  };

  const handleTemplateShared = (shareData: TemplateShareData) => {
    // Handle successful template sharing
    // Could save share data to store or show confirmation
    console.log("Template shared:", shareData);
  };

  const handleTemplateImported = (template: PresentationTemplate) => {
    // Add imported template to user templates
    setUserTemplates((prev) => [...prev, template]);
    onTemplateCreate?.(template);
  };

  const handleEditTemplate = (template: PresentationTemplate) => {
    setEditingTemplate(template);
    setFormData({
      name: template.name,
      description: template.description,
      category: template.category,
      tags: template.tags,
      thumbnail: template.thumbnail,
    });
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      category: "Business",
      tags: [],
      thumbnail: "",
    });
  };

  const toggleFavorite = (templateId: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(templateId)) {
      newFavorites.delete(templateId);
    } else {
      newFavorites.add(templateId);
    }
    setFavorites(newFavorites);
  };

  const renderTemplateCard = (template: PresentationTemplate) => (
    <Card
      key={template.id}
      className="group hover:shadow-lg transition-all duration-200 cursor-pointer"
      onClick={() => mode === "select" && onTemplateSelect?.(template)}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold">
              {template.name}
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground mt-1">
              {template.description}
            </CardDescription>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(template.id);
              }}
            >
              {favorites.has(template.id) ? (
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              ) : (
                <StarOff className="h-4 w-4" />
              )}
            </Button>
            {mode === "manage" && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => onTemplateSelect?.(template)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleCustomizeTemplate(template)}
                  >
                    <Palette className="h-4 w-4 mr-2" />
                    Customize
                  </DropdownMenuItem>
                  {!template.isBuiltIn && (
                    <>
                      <DropdownMenuItem
                        onClick={() => handleEditTemplate(template)}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDeleteTemplate(template.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuItem>
                    <Copy className="h-4 w-4 mr-2" />
                    Duplicate
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleShareTemplate(template)}
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {/* Template thumbnail/preview */}
          <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
            <div className="text-muted-foreground text-sm">
              {template.slides.length} slides
            </div>
          </div>

          {/* Template info */}
          <div className="flex items-center justify-between">
            <Badge variant="secondary">{template.category}</Badge>
            <div className="text-xs text-muted-foreground">
              {template.isBuiltIn ? "Built-in" : "Custom"}
            </div>
          </div>

          {/* Tags */}
          {template.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {template.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {template.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{template.tags.length - 3}
                </Badge>
              )}
            </div>
          )}
        </div>
      </CardContent>
      {mode === "select" && (
        <CardFooter className="flex gap-2">
          <Button
            className="flex-1"
            onClick={() => onTemplateSelect?.(template)}
          >
            Use Template
          </Button>
          <Button
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              handleCustomizeTemplate(template);
            }}
          >
            <Palette className="h-4 w-4 mr-2" />
            Customize
          </Button>
        </CardFooter>
      )}
    </Card>
  );

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">
            {mode === "select" ? "Choose Template" : "Template Manager"}
          </h2>
          <p className="text-muted-foreground">
            {mode === "select"
              ? "Select a template to start your presentation"
              : "Create and manage presentation templates"}
          </p>
        </div>
        {mode === "manage" && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setTemplateToShare(null);
                setShowShareManager(true);
              }}
            >
              <Upload className="h-4 w-4 mr-2" />
              Import Template
            </Button>
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Template
            </Button>
          </div>
        )}
      </div>

      {/* Filters and Search */}
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-48">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {TEMPLATE_CATEGORIES.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex items-center border rounded-lg">
          <Button
            variant={viewMode === "grid" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("grid")}
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("list")}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Templates Grid/List */}
      <div
        className={`${
          viewMode === "grid"
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            : "space-y-4"
        }`}
      >
        {filteredTemplates.map(renderTemplateCard)}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No templates found</p>
          {mode === "manage" && (
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => setShowCreateDialog(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Template
            </Button>
          )}
        </div>
      )}

      {/* Create/Edit Template Dialog */}
      <Dialog
        open={showCreateDialog || editingTemplate !== null}
        onOpenChange={(open) => {
          if (!open) {
            setShowCreateDialog(false);
            setEditingTemplate(null);
            resetForm();
          }
        }}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingTemplate ? "Edit Template" : "Create New Template"}
            </DialogTitle>
            <DialogDescription>
              {editingTemplate
                ? "Update your template details"
                : "Create a new presentation template"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Template Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Enter template name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    setFormData({ ...formData, category: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TEMPLATE_CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Describe your template"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input
                id="tags"
                value={formData.tags.join(", ")}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    tags: e.target.value
                      .split(",")
                      .map((tag) => tag.trim())
                      .filter(Boolean),
                  })
                }
                placeholder="business, professional, modern"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowCreateDialog(false);
                setEditingTemplate(null);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={
                editingTemplate ? handleUpdateTemplate : handleCreateTemplate
              }
            >
              {editingTemplate ? "Update Template" : "Create Template"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Template Customizer */}
      {showCustomizer && templateToCustomize && (
        <TemplateCustomizer
          template={templateToCustomize}
          isOpen={showCustomizer}
          onClose={() => {
            setShowCustomizer(false);
            setTemplateToCustomize(null);
          }}
          onApply={handleApplyCustomizedTemplate}
        />
      )}

      {/* Template Share Manager */}
      {showShareManager && templateToShare && (
        <TemplateShareManager
          template={templateToShare}
          isOpen={showShareManager}
          onClose={() => setShowShareManager(false)}
          onTemplateShared={handleTemplateShared}
        />
      )}
    </div>
  );
}
