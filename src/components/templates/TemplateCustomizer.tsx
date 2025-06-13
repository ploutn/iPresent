import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Slider } from "../ui/slider";
import { Switch } from "../ui/switch";
import { Textarea } from "../ui/textarea";
import {
  Palette,
  Type,
  Layout,
  Image,
  Settings,
  Eye,
  Save,
  RotateCcw,
  Download,
} from "lucide-react";
import { PresentationTemplate, Slide } from "../../types";
import { v4 as uuidv4 } from "uuid";

export interface TemplateCustomizerProps {
  template: PresentationTemplate | null;
  isOpen: boolean;
  onClose: () => void;
  onApplyTemplate: (customizedTemplate: PresentationTemplate) => void;
  className?: string;
}

interface ColorScheme {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  background: string;
  text: string;
  accent: string;
}

interface FontScheme {
  id: string;
  name: string;
  heading: string;
  body: string;
  accent: string;
}

interface LayoutOption {
  id: string;
  name: string;
  description: string;
  slideRatio: string;
  contentLayout: string;
}

const COLOR_SCHEMES: ColorScheme[] = [
  {
    id: "default",
    name: "Default",
    primary: "#1e3a8a",
    secondary: "#3b82f6",
    background: "#ffffff",
    text: "#1f2937",
    accent: "#f59e0b",
  },
  {
    id: "dark",
    name: "Dark Professional",
    primary: "#1f2937",
    secondary: "#374151",
    background: "#111827",
    text: "#f9fafb",
    accent: "#10b981",
  },
  {
    id: "warm",
    name: "Warm Sunset",
    primary: "#dc2626",
    secondary: "#f97316",
    background: "#fef7ed",
    text: "#7c2d12",
    accent: "#fbbf24",
  },
  {
    id: "cool",
    name: "Cool Ocean",
    primary: "#0891b2",
    secondary: "#06b6d4",
    background: "#f0f9ff",
    text: "#0c4a6e",
    accent: "#8b5cf6",
  },
  {
    id: "nature",
    name: "Nature Green",
    primary: "#166534",
    secondary: "#22c55e",
    background: "#f0fdf4",
    text: "#14532d",
    accent: "#eab308",
  },
  {
    id: "elegant",
    name: "Elegant Purple",
    primary: "#7c3aed",
    secondary: "#a855f7",
    background: "#faf5ff",
    text: "#581c87",
    accent: "#f59e0b",
  },
];

const FONT_SCHEMES: FontScheme[] = [
  {
    id: "modern",
    name: "Modern Sans",
    heading: "Inter",
    body: "Inter",
    accent: "Inter",
  },
  {
    id: "classic",
    name: "Classic Serif",
    heading: "Playfair Display",
    body: "Source Serif Pro",
    accent: "Playfair Display",
  },
  {
    id: "minimal",
    name: "Minimal Clean",
    heading: "Roboto",
    body: "Roboto",
    accent: "Roboto Condensed",
  },
  {
    id: "creative",
    name: "Creative Mix",
    heading: "Montserrat",
    body: "Open Sans",
    accent: "Montserrat",
  },
  {
    id: "corporate",
    name: "Corporate",
    heading: "Lato",
    body: "Lato",
    accent: "Lato",
  },
];

const LAYOUT_OPTIONS: LayoutOption[] = [
  {
    id: "standard",
    name: "Standard (16:9)",
    description: "Most common presentation format",
    slideRatio: "16:9",
    contentLayout: "standard",
  },
  {
    id: "widescreen",
    name: "Widescreen (16:10)",
    description: "Wider format for detailed content",
    slideRatio: "16:10",
    contentLayout: "widescreen",
  },
  {
    id: "square",
    name: "Square (1:1)",
    description: "Perfect for social media",
    slideRatio: "1:1",
    contentLayout: "square",
  },
  {
    id: "portrait",
    name: "Portrait (9:16)",
    description: "Mobile-first vertical layout",
    slideRatio: "9:16",
    contentLayout: "portrait",
  },
];

export function TemplateCustomizer({
  template,
  isOpen,
  onClose,
  onApplyTemplate,
  className,
}: TemplateCustomizerProps) {
  const [customizedTemplate, setCustomizedTemplate] =
    useState<PresentationTemplate | null>(null);
  const [selectedColorScheme, setSelectedColorScheme] = useState("default");
  const [selectedFontScheme, setSelectedFontScheme] = useState("modern");
  const [selectedLayout, setSelectedLayout] = useState("standard");
  const [customColors, setCustomColors] = useState({
    primary: "#1e3a8a",
    secondary: "#3b82f6",
    background: "#ffffff",
    text: "#1f2937",
    accent: "#f59e0b",
  });
  const [customFonts, setCustomFonts] = useState({
    heading: "Inter",
    body: "Inter",
    accent: "Inter",
  });
  const [templateSettings, setTemplateSettings] = useState({
    includeAnimations: true,
    includeTransitions: true,
    autoAdvance: false,
    loopPresentation: false,
    showSlideNumbers: true,
    showProgressBar: true,
  });
  const [contentCustomization, setContentCustomization] = useState({
    companyName: "",
    presenterName: "",
    presentationTitle: "",
    customLogo: "",
    contactInfo: "",
  });

  useEffect(() => {
    if (template) {
      setCustomizedTemplate({ ...template });
      // Initialize with template's existing colors if available
      if (template.slides.length > 0) {
        const firstSlide = template.slides[0];
        setCustomColors({
          primary: firstSlide.backgroundColor || "#1e3a8a",
          secondary: "#3b82f6",
          background: firstSlide.backgroundColor || "#ffffff",
          text: firstSlide.textColor || "#1f2937",
          accent: "#f59e0b",
        });
        setCustomFonts({
          heading: firstSlide.fontFamily || "Inter",
          body: firstSlide.fontFamily || "Inter",
          accent: firstSlide.fontFamily || "Inter",
        });
      }
    }
  }, [template]);

  const handleColorSchemeChange = (schemeId: string) => {
    setSelectedColorScheme(schemeId);
    const scheme = COLOR_SCHEMES.find((s) => s.id === schemeId);
    if (scheme) {
      setCustomColors({
        primary: scheme.primary,
        secondary: scheme.secondary,
        background: scheme.background,
        text: scheme.text,
        accent: scheme.accent,
      });
    }
  };

  const handleFontSchemeChange = (schemeId: string) => {
    setSelectedFontScheme(schemeId);
    const scheme = FONT_SCHEMES.find((s) => s.id === schemeId);
    if (scheme) {
      setCustomFonts({
        heading: scheme.heading,
        body: scheme.body,
        accent: scheme.accent,
      });
    }
  };

  const applyCustomizations = () => {
    if (!customizedTemplate) return;

    const updatedSlides: Slide[] = customizedTemplate.slides.map((slide) => ({
      ...slide,
      backgroundColor: customColors.background,
      textColor: customColors.text,
      fontFamily: customFonts.body,
      // Apply content customizations
      content: slideContent
        .replace(
          /\[Company Name\]/g,
          contentCustomization.companyName || "[Company Name]"
        )
        .replace(
          /\[Presenter Name\]/g,
          contentCustomization.presenterName || "[Presenter Name]"
        )
        .replace(
          /\[Presentation Title\]/g,
          contentCustomization.presentationTitle || "[Presentation Title]"
        )
        .replace(
          /\[Contact Info\]/g,
          contentCustomization.contactInfo || "[Contact Info]"
        ),
      title: slide.title
        .replace(
          /\[Company Name\]/g,
          contentCustomization.companyName || "[Company Name]"
        )
        .replace(
          /\[Presentation Title\]/g,
          contentCustomization.presentationTitle || "[Presentation Title]"
        ),
    }));

    const finalTemplate: PresentationTemplate = {
      ...customizedTemplate,
      id: uuidv4(), // Generate new ID for customized template
      name: `${customizedTemplate.name} (Customized)`,
      slides: updatedSlides,
      settings: {
        ...customizedTemplate.settings,
        slideRatio:
          LAYOUT_OPTIONS.find((l) => l.id === selectedLayout)?.slideRatio ||
          "16:9",
        animations: templateSettings.includeAnimations,
        transitions: templateSettings.includeTransitions,
        autoAdvance: templateSettings.autoAdvance,
        loop: templateSettings.loopPresentation,
        showSlideNumbers: templateSettings.showSlideNumbers,
        showProgressBar: templateSettings.showProgressBar,
      },
      customization: {
        colorScheme: selectedColorScheme,
        fontScheme: selectedFontScheme,
        layout: selectedLayout,
        colors: customColors,
        fonts: customFonts,
        content: contentCustomization,
      },
    };

    onApplyTemplate(finalTemplate);
    onClose();
  };

  const resetToDefaults = () => {
    if (template) {
      setCustomizedTemplate({ ...template });
      setSelectedColorScheme("default");
      setSelectedFontScheme("modern");
      setSelectedLayout("standard");
      handleColorSchemeChange("default");
      handleFontSchemeChange("modern");
      setContentCustomization({
        companyName: "",
        presenterName: "",
        presentationTitle: "",
        customLogo: "",
        contactInfo: "",
      });
    }
  };

  if (!template || !customizedTemplate) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className={`max-w-6xl max-h-[90vh] overflow-hidden ${className}`}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Customize Template: {template.name}
          </DialogTitle>
          <DialogDescription>
            Personalize this template with your colors, fonts, and content
            before applying it to your presentation.
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-6 h-[calc(90vh-200px)]">
          {/* Customization Panel */}
          <div className="w-1/2 overflow-y-auto">
            <Tabs defaultValue="colors" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="colors" className="flex items-center gap-1">
                  <Palette className="h-4 w-4" />
                  Colors
                </TabsTrigger>
                <TabsTrigger value="fonts" className="flex items-center gap-1">
                  <Type className="h-4 w-4" />
                  Fonts
                </TabsTrigger>
                <TabsTrigger value="layout" className="flex items-center gap-1">
                  <Layout className="h-4 w-4" />
                  Layout
                </TabsTrigger>
                <TabsTrigger
                  value="content"
                  className="flex items-center gap-1"
                >
                  <Image className="h-4 w-4" />
                  Content
                </TabsTrigger>
              </TabsList>

              <TabsContent value="colors" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Color Schemes</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      {COLOR_SCHEMES.map((scheme) => (
                        <div
                          key={scheme.id}
                          className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                            selectedColorScheme === scheme.id
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-primary/50"
                          }`}
                          onClick={() => handleColorSchemeChange(scheme.id)}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <div className="flex gap-1">
                              <div
                                className="w-4 h-4 rounded-full"
                                style={{ backgroundColor: scheme.primary }}
                              />
                              <div
                                className="w-4 h-4 rounded-full"
                                style={{ backgroundColor: scheme.secondary }}
                              />
                              <div
                                className="w-4 h-4 rounded-full"
                                style={{ backgroundColor: scheme.accent }}
                              />
                            </div>
                          </div>
                          <p className="font-medium text-sm">{scheme.name}</p>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-3">
                      <Label>Custom Colors</Label>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label className="text-xs">Primary</Label>
                          <div className="flex gap-2">
                            <Input
                              type="color"
                              value={customColors.primary}
                              onChange={(e) =>
                                setCustomColors({
                                  ...customColors,
                                  primary: e.target.value,
                                })
                              }
                              className="w-12 h-8 p-1"
                            />
                            <Input
                              value={customColors.primary}
                              onChange={(e) =>
                                setCustomColors({
                                  ...customColors,
                                  primary: e.target.value,
                                })
                              }
                              className="flex-1 text-xs"
                            />
                          </div>
                        </div>
                        <div>
                          <Label className="text-xs">Background</Label>
                          <div className="flex gap-2">
                            <Input
                              type="color"
                              value={customColors.background}
                              onChange={(e) =>
                                setCustomColors({
                                  ...customColors,
                                  background: e.target.value,
                                })
                              }
                              className="w-12 h-8 p-1"
                            />
                            <Input
                              value={customColors.background}
                              onChange={(e) =>
                                setCustomColors({
                                  ...customColors,
                                  background: e.target.value,
                                })
                              }
                              className="flex-1 text-xs"
                            />
                          </div>
                        </div>
                        <div>
                          <Label className="text-xs">Text</Label>
                          <div className="flex gap-2">
                            <Input
                              type="color"
                              value={customColors.text}
                              onChange={(e) =>
                                setCustomColors({
                                  ...customColors,
                                  text: e.target.value,
                                })
                              }
                              className="w-12 h-8 p-1"
                            />
                            <Input
                              value={customColors.text}
                              onChange={(e) =>
                                setCustomColors({
                                  ...customColors,
                                  text: e.target.value,
                                })
                              }
                              className="flex-1 text-xs"
                            />
                          </div>
                        </div>
                        <div>
                          <Label className="text-xs">Accent</Label>
                          <div className="flex gap-2">
                            <Input
                              type="color"
                              value={customColors.accent}
                              onChange={(e) =>
                                setCustomColors({
                                  ...customColors,
                                  accent: e.target.value,
                                })
                              }
                              className="w-12 h-8 p-1"
                            />
                            <Input
                              value={customColors.accent}
                              onChange={(e) =>
                                setCustomColors({
                                  ...customColors,
                                  accent: e.target.value,
                                })
                              }
                              className="flex-1 text-xs"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="fonts" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Font Schemes</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      {FONT_SCHEMES.map((scheme) => (
                        <div
                          key={scheme.id}
                          className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                            selectedFontScheme === scheme.id
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-primary/50"
                          }`}
                          onClick={() => handleFontSchemeChange(scheme.id)}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">{scheme.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {scheme.heading} • {scheme.body}
                              </p>
                            </div>
                            <div className="text-right">
                              <p
                                style={{ fontFamily: scheme.heading }}
                                className="font-bold"
                              >
                                Heading
                              </p>
                              <p
                                style={{ fontFamily: scheme.body }}
                                className="text-sm"
                              >
                                Body text
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-3">
                      <Label>Custom Fonts</Label>
                      <div className="space-y-2">
                        <div>
                          <Label className="text-xs">Heading Font</Label>
                          <Select
                            value={customFonts.heading}
                            onValueChange={(value) =>
                              setCustomFonts({ ...customFonts, heading: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Inter">Inter</SelectItem>
                              <SelectItem value="Roboto">Roboto</SelectItem>
                              <SelectItem value="Montserrat">
                                Montserrat
                              </SelectItem>
                              <SelectItem value="Playfair Display">
                                Playfair Display
                              </SelectItem>
                              <SelectItem value="Lato">Lato</SelectItem>
                              <SelectItem value="Open Sans">
                                Open Sans
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className="text-xs">Body Font</Label>
                          <Select
                            value={customFonts.body}
                            onValueChange={(value) =>
                              setCustomFonts({ ...customFonts, body: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Inter">Inter</SelectItem>
                              <SelectItem value="Roboto">Roboto</SelectItem>
                              <SelectItem value="Open Sans">
                                Open Sans
                              </SelectItem>
                              <SelectItem value="Source Serif Pro">
                                Source Serif Pro
                              </SelectItem>
                              <SelectItem value="Lato">Lato</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="layout" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Layout Options</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      {LAYOUT_OPTIONS.map((layout) => (
                        <div
                          key={layout.id}
                          className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                            selectedLayout === layout.id
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-primary/50"
                          }`}
                          onClick={() => setSelectedLayout(layout.id)}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">{layout.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {layout.description}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-mono">
                                {layout.slideRatio}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-4">
                      <Label>Presentation Settings</Label>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label className="text-sm">Include Animations</Label>
                          <Switch
                            checked={templateSettings.includeAnimations}
                            onCheckedChange={(checked) =>
                              setTemplateSettings({
                                ...templateSettings,
                                includeAnimations: checked,
                              })
                            }
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label className="text-sm">Include Transitions</Label>
                          <Switch
                            checked={templateSettings.includeTransitions}
                            onCheckedChange={(checked) =>
                              setTemplateSettings({
                                ...templateSettings,
                                includeTransitions: checked,
                              })
                            }
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label className="text-sm">Show Slide Numbers</Label>
                          <Switch
                            checked={templateSettings.showSlideNumbers}
                            onCheckedChange={(checked) =>
                              setTemplateSettings({
                                ...templateSettings,
                                showSlideNumbers: checked,
                              })
                            }
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label className="text-sm">Show Progress Bar</Label>
                          <Switch
                            checked={templateSettings.showProgressBar}
                            onCheckedChange={(checked) =>
                              setTemplateSettings({
                                ...templateSettings,
                                showProgressBar: checked,
                              })
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="content" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Content Customization
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div>
                        <Label>Company/Organization Name</Label>
                        <Input
                          value={contentCustomization.companyName}
                          onChange={(e) =>
                            setContentCustomization({
                              ...contentCustomization,
                              companyName: e.target.value,
                            })
                          }
                          placeholder="Enter your company name"
                        />
                      </div>
                      <div>
                        <Label>Presenter Name</Label>
                        <Input
                          value={contentCustomization.presenterName}
                          onChange={(e) =>
                            setContentCustomization({
                              ...contentCustomization,
                              presenterName: e.target.value,
                            })
                          }
                          placeholder="Enter presenter name"
                        />
                      </div>
                      <div>
                        <Label>Presentation Title</Label>
                        <Input
                          value={contentCustomization.presentationTitle}
                          onChange={(e) =>
                            setContentCustomization({
                              ...contentCustomization,
                              presentationTitle: e.target.value,
                            })
                          }
                          placeholder="Enter presentation title"
                        />
                      </div>
                      <div>
                        <Label>Contact Information</Label>
                        <Textarea
                          value={contentCustomization.contactInfo}
                          onChange={(e) =>
                            setContentCustomization({
                              ...contentCustomization,
                              contactInfo: e.target.value,
                            })
                          }
                          placeholder="Enter contact information (email, phone, website)"
                          rows={3}
                        />
                      </div>
                      <div>
                        <Label>Custom Logo URL</Label>
                        <Input
                          value={contentCustomization.customLogo}
                          onChange={(e) =>
                            setContentCustomization({
                              ...contentCustomization,
                              customLogo: e.target.value,
                            })
                          }
                          placeholder="Enter logo image URL"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Preview Panel */}
          <div className="w-1/2 border-l pl-6">
            <div className="sticky top-0">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Live Preview
                </h3>
                <Button variant="outline" size="sm" onClick={resetToDefaults}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset
                </Button>
              </div>

              <div className="bg-muted/30 rounded-lg p-4 aspect-video">
                <div
                  className="w-full h-full rounded border-2 border-dashed border-muted-foreground/20 flex items-center justify-center"
                  style={{
                    backgroundColor: customColors.background,
                    color: customColors.text,
                    fontFamily: customFonts.body,
                  }}
                >
                  <div className="text-center space-y-2">
                    <h4
                      className="text-xl font-bold"
                      style={{
                        color: customColors.primary,
                        fontFamily: customFonts.heading,
                      }}
                    >
                      {contentCustomization.presentationTitle || template.name}
                    </h4>
                    <p className="text-sm opacity-75">
                      {contentCustomization.companyName || "[Company Name]"}
                    </p>
                    <div
                      className="w-16 h-1 mx-auto rounded"
                      style={{ backgroundColor: customColors.accent }}
                    />
                    <p className="text-xs">
                      {contentCustomization.presenterName || "[Presenter Name]"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 text-sm text-muted-foreground">
                <p>Preview shows how your customizations will look.</p>
                <p>
                  Actual slides will include all template content with your
                  customizations applied.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            Customizing: {template.name} • {template.slides.length} slides
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={resetToDefaults} variant="outline">
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            <Button onClick={applyCustomizations}>
              <Save className="h-4 w-4 mr-2" />
              Apply Template
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
