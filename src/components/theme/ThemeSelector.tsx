import React, { useState } from "react";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Switch } from "../ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/seperator";
import { useTheme, ThemeMode, ThemeVariant, ThemeSize } from "./ThemeProvider";
import {
  Palette,
  Monitor,
  Sun,
  Moon,
  Smartphone,
  Tablet,
  Download,
  Upload,
  RotateCcw,
  Zap,
  Eye,
  Settings2,
} from "lucide-react";
import { toast } from "../ui/use-toast";

interface ThemeSelectorProps {
  className?: string;
}

const themeVariants: { value: ThemeVariant; label: string; color: string }[] = [
  { value: "default", label: "Default", color: "hsl(262.1, 83.3%, 57.8%)" },
  { value: "blue", label: "Ocean Blue", color: "hsl(221.2, 83.2%, 53.3%)" },
  { value: "green", label: "Forest Green", color: "hsl(142.1, 76.2%, 36.3%)" },
  { value: "purple", label: "Royal Purple", color: "hsl(262.1, 83.3%, 57.8%)" },
  { value: "orange", label: "Sunset Orange", color: "hsl(24.6, 95%, 53.1%)" },
  { value: "red", label: "Cherry Red", color: "hsl(346.8, 77.2%, 49.8%)" },
];

const themeSizes: { value: ThemeSize; label: string; description: string }[] = [
  {
    value: "compact",
    label: "Compact",
    description: "Smaller spacing and components",
  },
  {
    value: "default",
    label: "Default",
    description: "Standard spacing and components",
  },
  {
    value: "comfortable",
    label: "Comfortable",
    description: "Larger spacing and components",
  },
];

export function ThemeSelector({ className }: ThemeSelectorProps) {
  const {
    config,
    setMode,
    setVariant,
    setSize,
    setCustomColors,
    toggleAnimations,
    toggleReducedMotion,
    resetTheme,
    exportTheme,
    importTheme,
  } = useTheme();

  const [customPrimary, setCustomPrimary] = useState(
    config.customColors?.primary || ""
  );
  const [customSecondary, setCustomSecondary] = useState(
    config.customColors?.secondary || ""
  );
  const [customAccent, setCustomAccent] = useState(
    config.customColors?.accent || ""
  );
  const [importData, setImportData] = useState("");

  const handleExportTheme = () => {
    const themeData = exportTheme();
    navigator.clipboard
      .writeText(themeData)
      .then(() => {
        toast({
          title: "Theme Exported",
          description: "Theme configuration copied to clipboard",
        });
      })
      .catch(() => {
        // Fallback: create a download link
        const blob = new Blob([themeData], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "ipresent-theme.json";
        a.click();
        URL.revokeObjectURL(url);
        toast({
          title: "Theme Exported",
          description: "Theme configuration downloaded as file",
        });
      });
  };

  const handleImportTheme = () => {
    if (importTheme(importData)) {
      toast({
        title: "Theme Imported",
        description: "Theme configuration applied successfully",
      });
      setImportData("");
    } else {
      toast({
        title: "Import Failed",
        description: "Invalid theme configuration data",
        variant: "destructive",
      });
    }
  };

  const handleCustomColorsUpdate = () => {
    setCustomColors({
      primary: customPrimary || undefined,
      secondary: customSecondary || undefined,
      accent: customAccent || undefined,
    });
    toast({
      title: "Custom Colors Applied",
      description: "Your custom color scheme has been updated",
    });
  };

  const getCurrentModeIcon = () => {
    switch (config.mode) {
      case "light":
        return <Sun className="h-4 w-4" />;
      case "dark":
        return <Moon className="h-4 w-4" />;
      case "system":
        return <Monitor className="h-4 w-4" />;
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="h-5 w-5" />
          Theme Customization
        </CardTitle>
        <CardDescription>
          Customize the appearance and behavior of iPresent to match your
          preferences.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="appearance" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="colors">Colors</TabsTrigger>
            <TabsTrigger value="behavior">Behavior</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>

          <TabsContent value="appearance" className="space-y-6">
            {/* Theme Mode */}
            <div className="space-y-3">
              <Label className="text-sm font-medium flex items-center gap-2">
                {getCurrentModeIcon()}
                Theme Mode
              </Label>
              <Select
                value={config.mode}
                onValueChange={(value: ThemeMode) => setMode(value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">
                    <div className="flex items-center gap-2">
                      <Sun className="h-4 w-4" />
                      Light
                    </div>
                  </SelectItem>
                  <SelectItem value="dark">
                    <div className="flex items-center gap-2">
                      <Moon className="h-4 w-4" />
                      Dark
                    </div>
                  </SelectItem>
                  <SelectItem value="system">
                    <div className="flex items-center gap-2">
                      <Monitor className="h-4 w-4" />
                      System
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Theme Variant */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Color Scheme</Label>
              <div className="grid grid-cols-2 gap-3">
                {themeVariants.map((variant) => (
                  <Button
                    key={variant.value}
                    variant={
                      config.variant === variant.value ? "default" : "outline"
                    }
                    className="justify-start h-auto p-3"
                    onClick={() => setVariant(variant.value)}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 rounded-full border"
                        style={{ backgroundColor: variant.color }}
                      />
                      <span>{variant.label}</span>
                    </div>
                  </Button>
                ))}
              </div>
            </div>

            {/* Theme Size */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Interface Size</Label>
              <div className="space-y-2">
                {themeSizes.map((size) => (
                  <Button
                    key={size.value}
                    variant={config.size === size.value ? "default" : "outline"}
                    className="w-full justify-start h-auto p-3"
                    onClick={() => setSize(size.value)}
                  >
                    <div className="text-left">
                      <div className="font-medium">{size.label}</div>
                      <div className="text-xs text-muted-foreground">
                        {size.description}
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="colors" className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="custom-primary">Custom Primary Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="custom-primary"
                    type="color"
                    value={customPrimary}
                    onChange={(e) => setCustomPrimary(e.target.value)}
                    className="w-16 h-10 p-1"
                  />
                  <Input
                    value={customPrimary}
                    onChange={(e) => setCustomPrimary(e.target.value)}
                    placeholder="#000000 or hsl(0, 0%, 0%)"
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="custom-secondary">Custom Secondary Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="custom-secondary"
                    type="color"
                    value={customSecondary}
                    onChange={(e) => setCustomSecondary(e.target.value)}
                    className="w-16 h-10 p-1"
                  />
                  <Input
                    value={customSecondary}
                    onChange={(e) => setCustomSecondary(e.target.value)}
                    placeholder="#000000 or hsl(0, 0%, 0%)"
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="custom-accent">Custom Accent Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="custom-accent"
                    type="color"
                    value={customAccent}
                    onChange={(e) => setCustomAccent(e.target.value)}
                    className="w-16 h-10 p-1"
                  />
                  <Input
                    value={customAccent}
                    onChange={(e) => setCustomAccent(e.target.value)}
                    placeholder="#000000 or hsl(0, 0%, 0%)"
                    className="flex-1"
                  />
                </div>
              </div>

              <Button onClick={handleCustomColorsUpdate} className="w-full">
                Apply Custom Colors
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="behavior" className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    Enable Animations
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Show smooth transitions and animations throughout the
                    interface
                  </p>
                </div>
                <Switch
                  checked={config.animations}
                  onCheckedChange={toggleAnimations}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    Reduced Motion
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Minimize motion for accessibility and performance
                  </p>
                </div>
                <Switch
                  checked={config.reducedMotion}
                  onCheckedChange={toggleReducedMotion}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-6">
            <div className="space-y-4">
              {/* Export Theme */}
              <div className="space-y-2">
                <Label>Export Theme</Label>
                <Button
                  onClick={handleExportTheme}
                  variant="outline"
                  className="w-full"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export Current Theme
                </Button>
              </div>

              <Separator />

              {/* Import Theme */}
              <div className="space-y-2">
                <Label htmlFor="import-theme">Import Theme</Label>
                <div className="space-y-2">
                  <Input
                    id="import-theme"
                    value={importData}
                    onChange={(e) => setImportData(e.target.value)}
                    placeholder="Paste theme configuration JSON here..."
                    className="min-h-[80px]"
                  />
                  <Button
                    onClick={handleImportTheme}
                    variant="outline"
                    className="w-full"
                    disabled={!importData.trim()}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Import Theme
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Reset Theme */}
              <div className="space-y-2">
                <Label>Reset to Default</Label>
                <Button
                  onClick={resetTheme}
                  variant="destructive"
                  className="w-full"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset All Settings
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Current Theme Info */}
        <div className="mt-6 p-4 bg-muted rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Settings2 className="h-4 w-4" />
            <span className="text-sm font-medium">Current Configuration</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">{config.mode}</Badge>
            <Badge variant="secondary">{config.variant}</Badge>
            <Badge variant="secondary">{config.size}</Badge>
            {config.animations && <Badge variant="outline">Animations</Badge>}
            {config.reducedMotion && (
              <Badge variant="outline">Reduced Motion</Badge>
            )}
            {config.customColors && (
              <Badge variant="outline">Custom Colors</Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
