// src/components/editor/FontManager.tsx
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
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
import { Badge } from "../ui/badge";
import {
  Type,
  Download,
  Upload,
  Trash2,
  Eye,
  Plus,
  Search,
  Star,
  StarOff,
} from "lucide-react";
import { cn } from "../../lib/utils";

interface Font {
  id: string;
  name: string;
  family: string;
  category: "serif" | "sans-serif" | "monospace" | "display" | "handwriting";
  variants: string[];
  source: "system" | "google" | "custom";
  url?: string;
  favorite?: boolean;
  previewText?: string;
}

interface FontManagerProps {
  onFontSelect?: (font: Font) => void;
  selectedFont?: Font;
  trigger?: React.ReactNode;
}

// System fonts that are commonly available
const SYSTEM_FONTS: Font[] = [
  {
    id: "arial",
    name: "Arial",
    family: "Arial, sans-serif",
    category: "sans-serif",
    variants: ["400", "700"],
    source: "system",
  },
  {
    id: "helvetica",
    name: "Helvetica",
    family: "Helvetica, Arial, sans-serif",
    category: "sans-serif",
    variants: ["400", "700"],
    source: "system",
  },
  {
    id: "times",
    name: "Times New Roman",
    family: '"Times New Roman", Times, serif',
    category: "serif",
    variants: ["400", "700"],
    source: "system",
  },
  {
    id: "georgia",
    name: "Georgia",
    family: "Georgia, serif",
    category: "serif",
    variants: ["400", "700"],
    source: "system",
  },
  {
    id: "courier",
    name: "Courier New",
    family: '"Courier New", Courier, monospace',
    category: "monospace",
    variants: ["400", "700"],
    source: "system",
  },
  {
    id: "verdana",
    name: "Verdana",
    family: "Verdana, sans-serif",
    category: "sans-serif",
    variants: ["400", "700"],
    source: "system",
  },
];

// Popular Google Fonts
const GOOGLE_FONTS: Font[] = [
  {
    id: "inter",
    name: "Inter",
    family: "Inter, sans-serif",
    category: "sans-serif",
    variants: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
    source: "google",
    url: "https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap",
  },
  {
    id: "roboto",
    name: "Roboto",
    family: "Roboto, sans-serif",
    category: "sans-serif",
    variants: ["100", "300", "400", "500", "700", "900"],
    source: "google",
    url: "https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400;500;700;900&display=swap",
  },
  {
    id: "opensans",
    name: "Open Sans",
    family: '"Open Sans", sans-serif',
    category: "sans-serif",
    variants: ["300", "400", "500", "600", "700", "800"],
    source: "google",
    url: "https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;500;600;700;800&display=swap",
  },
  {
    id: "lato",
    name: "Lato",
    family: "Lato, sans-serif",
    category: "sans-serif",
    variants: ["100", "300", "400", "700", "900"],
    source: "google",
    url: "https://fonts.googleapis.com/css2?family=Lato:wght@100;300;400;700;900&display=swap",
  },
  {
    id: "montserrat",
    name: "Montserrat",
    family: "Montserrat, sans-serif",
    category: "sans-serif",
    variants: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
    source: "google",
    url: "https://fonts.googleapis.com/css2?family=Montserrat:wght@100;200;300;400;500;600;700;800;900&display=swap",
  },
  {
    id: "poppins",
    name: "Poppins",
    family: "Poppins, sans-serif",
    category: "sans-serif",
    variants: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
    source: "google",
    url: "https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;500;600;700;800;900&display=swap",
  },
  {
    id: "playfair",
    name: "Playfair Display",
    family: '"Playfair Display", serif',
    category: "serif",
    variants: ["400", "500", "600", "700", "800", "900"],
    source: "google",
    url: "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800;900&display=swap",
  },
  {
    id: "sourcecodepro",
    name: "Source Code Pro",
    family: '"Source Code Pro", monospace',
    category: "monospace",
    variants: ["200", "300", "400", "500", "600", "700", "800", "900"],
    source: "google",
    url: "https://fonts.googleapis.com/css2?family=Source+Code+Pro:wght@200;300;400;500;600;700;800;900&display=swap",
  },
];

export function FontManager({
  onFontSelect,
  selectedFont,
  trigger,
}: FontManagerProps) {
  const [fonts, setFonts] = useState<Font[]>([
    ...SYSTEM_FONTS,
    ...GOOGLE_FONTS,
  ]);
  const [filteredFonts, setFilteredFonts] = useState<Font[]>(fonts);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [customFontName, setCustomFontName] = useState("");
  const [customFontUrl, setCustomFontUrl] = useState("");
  const [previewText, setPreviewText] = useState(
    "The quick brown fox jumps over the lazy dog"
  );
  const [loadedFonts, setLoadedFonts] = useState<Set<string>>(new Set());

  // Load fonts from localStorage on mount
  useEffect(() => {
    const savedFonts = localStorage.getItem("ipresent-custom-fonts");
    const savedFavorites = localStorage.getItem("ipresent-favorite-fonts");

    if (savedFonts) {
      try {
        const customFonts = JSON.parse(savedFonts);
        setFonts((prev) => [...prev, ...customFonts]);
      } catch (error) {
        console.error("Error loading custom fonts:", error);
      }
    }

    if (savedFavorites) {
      try {
        const favorites = JSON.parse(savedFavorites);
        setFonts((prev) =>
          prev.map((font) => ({
            ...font,
            favorite: favorites.includes(font.id),
          }))
        );
      } catch (error) {
        console.error("Error loading favorite fonts:", error);
      }
    }
  }, []);

  // Filter fonts based on search and category
  useEffect(() => {
    let filtered = fonts;

    if (searchQuery) {
      filtered = filtered.filter((font) =>
        font.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory !== "all") {
      if (selectedCategory === "favorites") {
        filtered = filtered.filter((font) => font.favorite);
      } else {
        filtered = filtered.filter(
          (font) => font.category === selectedCategory
        );
      }
    }

    setFilteredFonts(filtered);
  }, [fonts, searchQuery, selectedCategory]);

  // Load Google Font dynamically
  const loadGoogleFont = (font: Font) => {
    if (font.source === "google" && font.url && !loadedFonts.has(font.id)) {
      const link = document.createElement("link");
      link.href = font.url;
      link.rel = "stylesheet";
      document.head.appendChild(link);
      setLoadedFonts((prev) => new Set([...prev, font.id]));
    }
  };

  // Add custom font
  const addCustomFont = () => {
    if (!customFontName || !customFontUrl) return;

    const newFont: Font = {
      id: `custom-${Date.now()}`,
      name: customFontName,
      family: customFontName,
      category: "display",
      variants: ["400"],
      source: "custom",
      url: customFontUrl,
    };

    const updatedFonts = [...fonts, newFont];
    setFonts(updatedFonts);

    // Save to localStorage
    const customFonts = updatedFonts.filter((f) => f.source === "custom");
    localStorage.setItem("ipresent-custom-fonts", JSON.stringify(customFonts));

    // Load the font
    const link = document.createElement("link");
    link.href = customFontUrl;
    link.rel = "stylesheet";
    document.head.appendChild(link);

    setCustomFontName("");
    setCustomFontUrl("");
  };

  // Toggle favorite
  const toggleFavorite = (fontId: string) => {
    const updatedFonts = fonts.map((font) =>
      font.id === fontId ? { ...font, favorite: !font.favorite } : font
    );
    setFonts(updatedFonts);

    // Save favorites to localStorage
    const favorites = updatedFonts.filter((f) => f.favorite).map((f) => f.id);
    localStorage.setItem("ipresent-favorite-fonts", JSON.stringify(favorites));
  };

  // Remove custom font
  const removeCustomFont = (fontId: string) => {
    const updatedFonts = fonts.filter((f) => f.id !== fontId);
    setFonts(updatedFonts);

    // Update localStorage
    const customFonts = updatedFonts.filter((f) => f.source === "custom");
    localStorage.setItem("ipresent-custom-fonts", JSON.stringify(customFonts));
  };

  const FontPreview = ({ font }: { font: Font }) => {
    useEffect(() => {
      loadGoogleFont(font);
    }, [font]);

    return (
      <div
        className={cn(
          "p-4 border border-slate-700 rounded-lg cursor-pointer transition-all",
          "hover:border-blue-500 hover:bg-slate-800/50",
          selectedFont?.id === font.id && "border-blue-500 bg-blue-500/10"
        )}
        onClick={() => {
          loadGoogleFont(font);
          onFontSelect?.(font);
        }}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-white">{font.name}</h3>
            <Badge variant="secondary" className="text-xs">
              {font.source}
            </Badge>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(font.id);
              }}
              className="h-6 w-6 p-0"
            >
              {font.favorite ? (
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              ) : (
                <StarOff className="h-3 w-3" />
              )}
            </Button>
            {font.source === "custom" && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  removeCustomFont(font.id);
                }}
                className="h-6 w-6 p-0 text-red-400 hover:text-red-300"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
        <div
          className="text-slate-300 text-lg leading-relaxed"
          style={{ fontFamily: font.family }}
        >
          {previewText}
        </div>
        <div className="flex items-center gap-2 mt-2 text-xs text-slate-400">
          <span className="capitalize">{font.category}</span>
          <span>•</span>
          <span>{font.variants.length} variants</span>
        </div>
      </div>
    );
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <Type className="h-4 w-4 mr-2" />
            Font Manager
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Font Manager</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="browse" className="flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="browse">Browse Fonts</TabsTrigger>
            <TabsTrigger value="custom">Add Custom</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent
            value="browse"
            className="flex-1 flex flex-col space-y-4"
          >
            {/* Search and Filter */}
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search fonts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="favorites">Favorites</SelectItem>
                  <SelectItem value="sans-serif">Sans Serif</SelectItem>
                  <SelectItem value="serif">Serif</SelectItem>
                  <SelectItem value="monospace">Monospace</SelectItem>
                  <SelectItem value="display">Display</SelectItem>
                  <SelectItem value="handwriting">Handwriting</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Preview Text Input */}
            <div>
              <Label htmlFor="preview-text">Preview Text</Label>
              <Input
                id="preview-text"
                value={previewText}
                onChange={(e) => setPreviewText(e.target.value)}
                placeholder="Enter text to preview fonts"
              />
            </div>

            {/* Font Grid */}
            <div className="flex-1 overflow-y-auto">
              <div className="grid gap-4">
                {filteredFonts.map((font) => (
                  <FontPreview key={font.id} font={font} />
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="custom" className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="font-name">Font Name</Label>
                <Input
                  id="font-name"
                  value={customFontName}
                  onChange={(e) => setCustomFontName(e.target.value)}
                  placeholder="Enter font name"
                />
              </div>
              <div>
                <Label htmlFor="font-url">Font URL (CSS @import or link)</Label>
                <Input
                  id="font-url"
                  value={customFontUrl}
                  onChange={(e) => setCustomFontUrl(e.target.value)}
                  placeholder="https://fonts.googleapis.com/css2?family=..."
                />
              </div>
              <Button
                onClick={addCustomFont}
                disabled={!customFontName || !customFontUrl}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Font
              </Button>
            </div>

            <div className="border-t border-slate-700 pt-4">
              <h3 className="font-medium mb-2">Custom Fonts</h3>
              <div className="space-y-2">
                {fonts
                  .filter((f) => f.source === "custom")
                  .map((font) => (
                    <div
                      key={font.id}
                      className="flex items-center justify-between p-2 border border-slate-700 rounded"
                    >
                      <span>{font.name}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeCustomFont(font.id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Font Loading</h3>
                <p className="text-sm text-slate-400 mb-4">
                  Google Fonts are loaded automatically when selected. Custom
                  fonts require a valid CSS URL.
                </p>
              </div>

              <div>
                <h3 className="font-medium mb-2">Storage</h3>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      const customFonts = fonts.filter(
                        (f) => f.source === "custom"
                      );
                      const favorites = fonts
                        .filter((f) => f.favorite)
                        .map((f) => f.id);
                      const data = { customFonts, favorites };
                      const blob = new Blob([JSON.stringify(data, null, 2)], {
                        type: "application/json",
                      });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = "ipresent-fonts.json";
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export Fonts
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      const input = document.createElement("input");
                      input.type = "file";
                      input.accept = ".json";
                      input.onchange = (e) => {
                        const file = (e.target as HTMLInputElement).files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (e) => {
                            try {
                              const data = JSON.parse(
                                e.target?.result as string
                              );
                              if (data.customFonts) {
                                setFonts((prev) => [
                                  ...prev.filter((f) => f.source !== "custom"),
                                  ...data.customFonts,
                                ]);
                                localStorage.setItem(
                                  "ipresent-custom-fonts",
                                  JSON.stringify(data.customFonts)
                                );
                              }
                              if (data.favorites) {
                                localStorage.setItem(
                                  "ipresent-favorite-fonts",
                                  JSON.stringify(data.favorites)
                                );
                              }
                            } catch (error) {
                              console.error("Error importing fonts:", error);
                            }
                          };
                          reader.readAsText(file);
                        }
                      };
                      input.click();
                    }}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Import Fonts
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
