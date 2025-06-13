// src/components/templates/TemplateLibrary.tsx
import React, { useState, useMemo } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  Search,
  Filter,
  SortAsc,
  SortDesc,
  Grid3X3,
  List,
  Download,
  Upload,
  Plus,
  Star,
  Clock,
  TrendingUp,
  Users,
  Palette,
  Briefcase,
  GraduationCap,
  Megaphone,
  Heart,
  Settings,
} from "lucide-react";
import { PresentationTemplate } from "../../types";
import { PresentationTemplateManager } from "./PresentationTemplateManager";
import { TemplatePreview } from "./TemplatePreview";
import { usePresentationStore } from "../../store/presentationStore";

export interface TemplateLibraryProps {
  className?: string;
  onTemplateSelect?: (template: PresentationTemplate) => void;
  onTemplateCreate?: (template: PresentationTemplate) => void;
  onTemplateUpdate?: (template: PresentationTemplate) => void;
  onTemplateDelete?: (templateId: string) => void;
}

type SortOption = "name" | "category" | "created" | "updated" | "popularity";
type SortDirection = "asc" | "desc";
type ViewMode = "grid" | "list";
type FilterTab = "all" | "built-in" | "custom" | "favorites" | "recent";

const CATEGORY_ICONS: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  Business: Briefcase,
  Education: GraduationCap,
  Creative: Palette,
  Marketing: Megaphone,
  Technology: Settings,
  Healthcare: Heart,
  Finance: TrendingUp,
  "Non-profit": Users,
  Personal: Star,
  Other: Settings,
};

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

const SORT_OPTIONS = [
  { value: "name", label: "Name" },
  { value: "category", label: "Category" },
  { value: "created", label: "Date Created" },
  { value: "updated", label: "Last Updated" },
  { value: "popularity", label: "Popularity" },
];

export function TemplateLibrary({
  className = "",
  onTemplateSelect,
  onTemplateCreate,
  onTemplateUpdate,
  onTemplateDelete,
}: TemplateLibraryProps) {
  const { templates } = usePresentationStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<SortOption>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [previewTemplate, setPreviewTemplate] =
    useState<PresentationTemplate | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [recentTemplates, setRecentTemplates] = useState<Set<string>>(
    new Set()
  );
  const [showImportDialog, setShowImportDialog] = useState(false);

  // Mock built-in templates (in real app, these would come from the store)
  const builtInTemplates: PresentationTemplate[] = [
    {
      id: "template-business-pitch",
      name: "Business Pitch",
      description: "Professional business presentation template",
      category: "Business",
      thumbnail: "/templates/business-pitch.svg",
      slides: [],
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
      tags: ["business", "pitch", "professional"],
      isBuiltIn: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    // Add more built-in templates...
  ];

  const allTemplates = [...builtInTemplates, ...templates];

  // Filter templates based on active tab
  const filteredByTab = useMemo(() => {
    switch (activeTab) {
      case "built-in":
        return allTemplates.filter((t) => t.isBuiltIn);
      case "custom":
        return allTemplates.filter((t) => !t.isBuiltIn);
      case "favorites":
        return allTemplates.filter((t) => favorites.has(t.id));
      case "recent":
        return allTemplates.filter((t) => recentTemplates.has(t.id));
      default:
        return allTemplates;
    }
  }, [allTemplates, activeTab, favorites, recentTemplates]);

  // Apply search and category filters
  const filteredTemplates = useMemo(() => {
    return filteredByTab.filter((template) => {
      const matchesSearch =
        template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.description
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        template.tags.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        );
      const matchesCategory =
        selectedCategory === "all" || template.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [filteredByTab, searchQuery, selectedCategory]);

  // Sort templates
  const sortedTemplates = useMemo(() => {
    const sorted = [...filteredTemplates].sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        case "category":
          comparison = a.category.localeCompare(b.category);
          break;
        case "created":
          comparison = a.createdAt.getTime() - b.createdAt.getTime();
          break;
        case "updated":
          comparison = a.updatedAt.getTime() - b.updatedAt.getTime();
          break;
        case "popularity":
          // Mock popularity based on favorites and recent usage
          const aPopularity =
            (favorites.has(a.id) ? 1 : 0) + (recentTemplates.has(a.id) ? 1 : 0);
          const bPopularity =
            (favorites.has(b.id) ? 1 : 0) + (recentTemplates.has(b.id) ? 1 : 0);
          comparison = aPopularity - bPopularity;
          break;
      }

      return sortDirection === "asc" ? comparison : -comparison;
    });

    return sorted;
  }, [filteredTemplates, sortBy, sortDirection, favorites, recentTemplates]);

  const toggleFavorite = (templateId: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(templateId)) {
      newFavorites.delete(templateId);
    } else {
      newFavorites.add(templateId);
    }
    setFavorites(newFavorites);
  };

  const handleTemplateSelect = (template: PresentationTemplate) => {
    // Add to recent templates
    setRecentTemplates((prev) => new Set([...prev, template.id]));
    onTemplateSelect?.(template);
  };

  const handlePreviewTemplate = (template: PresentationTemplate) => {
    setPreviewTemplate(template);
  };

  const getCategoryIcon = (category: string) => {
    const IconComponent = CATEGORY_ICONS[category] || Settings;
    return <IconComponent className="h-4 w-4" />;
  };

  const getTabCount = (tab: FilterTab) => {
    switch (tab) {
      case "built-in":
        return allTemplates.filter((t) => t.isBuiltIn).length;
      case "custom":
        return allTemplates.filter((t) => !t.isBuiltIn).length;
      case "favorites":
        return favorites.size;
      case "recent":
        return recentTemplates.size;
      default:
        return allTemplates.length;
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Template Library</h1>
          <p className="text-muted-foreground mt-1">
            Discover and manage presentation templates
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setShowImportDialog(true)}>
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Template
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="space-y-4">
        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as FilterTab)}
        >
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all" className="flex items-center gap-2">
              All ({getTabCount("all")})
            </TabsTrigger>
            <TabsTrigger value="built-in" className="flex items-center gap-2">
              <Star className="h-4 w-4" />
              Built-in ({getTabCount("built-in")})
            </TabsTrigger>
            <TabsTrigger value="custom" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Custom ({getTabCount("custom")})
            </TabsTrigger>
            <TabsTrigger value="favorites" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              Favorites ({getTabCount("favorites")})
            </TabsTrigger>
            <TabsTrigger value="recent" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Recent ({getTabCount("recent")})
            </TabsTrigger>
          </TabsList>
        </Tabs>

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
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {TEMPLATE_CATEGORIES.map((category) => (
                <SelectItem key={category} value={category}>
                  <div className="flex items-center gap-2">
                    {getCategoryIcon(category)}
                    {category}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                {sortDirection === "asc" ? (
                  <SortAsc className="h-4 w-4" />
                ) : (
                  <SortDesc className="h-4 w-4" />
                )}
                Sort
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {SORT_OPTIONS.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => {
                    if (sortBy === option.value) {
                      setSortDirection(
                        sortDirection === "asc" ? "desc" : "asc"
                      );
                    } else {
                      setSortBy(option.value as SortOption);
                      setSortDirection("asc");
                    }
                  }}
                  className={sortBy === option.value ? "bg-accent" : ""}
                >
                  {option.label}
                  {sortBy === option.value && (
                    <span className="ml-auto">
                      {sortDirection === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

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
      </div>

      {/* Templates Display */}
      <div className="min-h-[400px]">
        {sortedTemplates.length > 0 ? (
          <PresentationTemplateManager
            mode="manage"
            onTemplateSelect={handleTemplateSelect}
            onTemplateCreate={onTemplateCreate}
            onTemplateUpdate={onTemplateUpdate}
            onTemplateDelete={onTemplateDelete}
            className="border-0 p-0"
          />
        ) : (
          <div className="text-center py-12">
            <div className="text-muted-foreground mb-4">
              {searchQuery || selectedCategory !== "all" ? (
                <div>
                  <p className="text-lg mb-2">No templates found</p>
                  <p>Try adjusting your search or filters</p>
                </div>
              ) : (
                <div>
                  <p className="text-lg mb-2">No templates in this category</p>
                  <p>Create your first template to get started</p>
                </div>
              )}
            </div>
            <Button
              onClick={() => onTemplateCreate?.({} as PresentationTemplate)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Template
            </Button>
          </div>
        )}
      </div>

      {/* Template Preview */}
      <TemplatePreview
        template={previewTemplate}
        isOpen={previewTemplate !== null}
        onClose={() => setPreviewTemplate(null)}
        onUseTemplate={handleTemplateSelect}
      />
    </div>
  );
}
