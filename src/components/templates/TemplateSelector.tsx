// src/components/templates/TemplateSelector.tsx
import React, { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
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
  Search,
  Filter,
  Eye,
  Plus,
  Sparkles,
  Clock,
  Star,
  Zap,
} from "lucide-react";
import { PresentationTemplate } from "../../types";
import { PresentationTemplateManager } from "./PresentationTemplateManager";
import { TemplatePreview } from "./TemplatePreview";

export interface TemplateSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onTemplateSelect: (template: PresentationTemplate) => void;
  onCreateBlank: () => void;
  className?: string;
}

const QUICK_START_OPTIONS = [
  {
    id: "blank",
    title: "Blank Presentation",
    description: "Start with a clean slate",
    icon: Plus,
    color: "bg-slate-100 hover:bg-slate-200",
    textColor: "text-slate-700",
  },
  {
    id: "ai-generated",
    title: "AI-Generated",
    description: "Let AI create your presentation",
    icon: Sparkles,
    color: "bg-purple-100 hover:bg-purple-200",
    textColor: "text-purple-700",
    badge: "Coming Soon",
  },
  {
    id: "recent",
    title: "Recent Templates",
    description: "Your recently used templates",
    icon: Clock,
    color: "bg-blue-100 hover:bg-blue-200",
    textColor: "text-blue-700",
  },
  {
    id: "favorites",
    title: "Favorites",
    description: "Your starred templates",
    icon: Star,
    color: "bg-yellow-100 hover:bg-yellow-200",
    textColor: "text-yellow-700",
  },
];

const FEATURED_CATEGORIES = [
  {
    id: "business",
    name: "Business",
    description: "Professional presentations for business use",
    icon: "💼",
    count: 12,
  },
  {
    id: "education",
    name: "Education",
    description: "Templates for teaching and learning",
    icon: "🎓",
    count: 8,
  },
  {
    id: "creative",
    name: "Creative",
    description: "Artistic and creative presentations",
    icon: "🎨",
    count: 6,
  },
  {
    id: "marketing",
    name: "Marketing",
    description: "Marketing and promotional materials",
    icon: "📈",
    count: 10,
  },
];

export function TemplateSelector({
  isOpen,
  onClose,
  onTemplateSelect,
  onCreateBlank,
  className = "",
}: TemplateSelectorProps) {
  const [selectedTab, setSelectedTab] = useState("quick-start");
  const [previewTemplate, setPreviewTemplate] =
    useState<PresentationTemplate | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const handleQuickStartAction = (optionId: string) => {
    switch (optionId) {
      case "blank":
        onCreateBlank();
        onClose();
        break;
      case "ai-generated":
        // TODO: Implement AI generation
        break;
      case "recent":
        setSelectedTab("templates");
        setSelectedCategory("recent");
        break;
      case "favorites":
        setSelectedTab("templates");
        setSelectedCategory("favorites");
        break;
    }
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedTab("templates");
    setSelectedCategory(categoryId);
  };

  const handleTemplateSelect = (template: PresentationTemplate) => {
    onTemplateSelect(template);
    onClose();
  };

  const handlePreviewTemplate = (template: PresentationTemplate) => {
    setPreviewTemplate(template);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              Create New Presentation
            </DialogTitle>
            <DialogDescription>
              Choose a template to get started or create a blank presentation
            </DialogDescription>
          </DialogHeader>

          <Tabs
            value={selectedTab}
            onValueChange={setSelectedTab}
            className="flex-1"
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger
                value="quick-start"
                className="flex items-center gap-2"
              >
                <Zap className="h-4 w-4" />
                Quick Start
              </TabsTrigger>
              <TabsTrigger
                value="categories"
                className="flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                Categories
              </TabsTrigger>
              <TabsTrigger
                value="templates"
                className="flex items-center gap-2"
              >
                <Search className="h-4 w-4" />
                All Templates
              </TabsTrigger>
            </TabsList>

            <div className="mt-6 overflow-y-auto max-h-[60vh]">
              <TabsContent value="quick-start" className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">
                    Quick Start Options
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {QUICK_START_OPTIONS.map((option) => {
                      const IconComponent = option.icon;
                      return (
                        <Card
                          key={option.id}
                          className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                            option.id === "ai-generated" ? "opacity-60" : ""
                          }`}
                          onClick={() => handleQuickStartAction(option.id)}
                        >
                          <CardContent className="p-6">
                            <div className="flex items-center gap-4">
                              <div
                                className={`p-3 rounded-lg ${option.color} ${option.textColor}`}
                              >
                                <IconComponent className="h-6 w-6" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <h4 className="font-semibold">
                                    {option.title}
                                  </h4>
                                  {option.badge && (
                                    <Badge
                                      variant="secondary"
                                      className="text-xs"
                                    >
                                      {option.badge}
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground mt-1">
                                  {option.description}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">
                    Popular Templates
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
                    {/* This would show actual popular templates */}
                    <Card className="cursor-pointer hover:shadow-lg transition-all duration-200">
                      <CardContent className="p-4">
                        <div className="aspect-video bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg mb-3 flex items-center justify-center">
                          <div className="text-white text-center">
                            <div className="font-semibold">Business Pitch</div>
                            <div className="text-xs opacity-75">5 slides</div>
                          </div>
                        </div>
                        <h4 className="font-medium text-sm">Business Pitch</h4>
                        <p className="text-xs text-muted-foreground">
                          Professional presentation
                        </p>
                      </CardContent>
                    </Card>
                    <Card className="cursor-pointer hover:shadow-lg transition-all duration-200">
                      <CardContent className="p-4">
                        <div className="aspect-video bg-gradient-to-br from-green-500 to-green-600 rounded-lg mb-3 flex items-center justify-center">
                          <div className="text-white text-center">
                            <div className="font-semibold">Education</div>
                            <div className="text-xs opacity-75">5 slides</div>
                          </div>
                        </div>
                        <h4 className="font-medium text-sm">
                          Education Lesson
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          Teaching template
                        </p>
                      </CardContent>
                    </Card>
                    <Card className="cursor-pointer hover:shadow-lg transition-all duration-200">
                      <CardContent className="p-4">
                        <div className="aspect-video bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg mb-3 flex items-center justify-center">
                          <div className="text-white text-center">
                            <div className="font-semibold">Portfolio</div>
                            <div className="text-xs opacity-75">5 slides</div>
                          </div>
                        </div>
                        <h4 className="font-medium text-sm">
                          Creative Portfolio
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          Showcase your work
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="categories" className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">
                    Browse by Category
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {FEATURED_CATEGORIES.map((category) => (
                      <Card
                        key={category.id}
                        className="cursor-pointer hover:shadow-lg transition-all duration-200"
                        onClick={() => handleCategorySelect(category.id)}
                      >
                        <CardContent className="p-6">
                          <div className="flex items-center gap-4">
                            <div className="text-3xl">{category.icon}</div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <h4 className="font-semibold">
                                  {category.name}
                                </h4>
                                <Badge variant="secondary">
                                  {category.count} templates
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">
                                {category.description}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="templates" className="space-y-4">
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
                  <Select
                    value={selectedCategory}
                    onValueChange={setSelectedCategory}
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="recent">Recently Used</SelectItem>
                      <SelectItem value="favorites">Favorites</SelectItem>
                      {FEATURED_CATEGORIES.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <PresentationTemplateManager
                  mode="select"
                  onTemplateSelect={handleTemplateSelect}
                  className="border-0 p-0"
                />
              </TabsContent>
            </div>
          </Tabs>

          <div className="flex items-center justify-between pt-4 border-t">
            <div className="text-sm text-muted-foreground">
              Need help? Check out our{" "}
              <Button variant="link" className="p-0 h-auto text-sm">
                template guide
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={onCreateBlank}>
                <Plus className="h-4 w-4 mr-2" />
                Start Blank
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Template Preview Dialog */}
      <TemplatePreview
        template={previewTemplate}
        isOpen={previewTemplate !== null}
        onClose={() => setPreviewTemplate(null)}
        onUseTemplate={handleTemplateSelect}
      />
    </>
  );
}
