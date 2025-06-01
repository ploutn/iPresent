import React, { useState, useEffect } from "react";
import { SlideTransition } from "@/types";
import { TransitionPreview } from "./TransitionPreview";
import { transitionPresets } from "./SlideTransitionEngine";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Save,
  RotateCcw,
  Copy,
  Trash2,
  Download,
  Upload,
  Zap,
  Settings,
  Eye,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TransitionEditorProps {
  transition: SlideTransition;
  onTransitionChange: (transition: SlideTransition) => void;
  onSave?: () => void;
  onReset?: () => void;
  className?: string;
}

interface SavedTransition {
  id: string;
  name: string;
  transition: SlideTransition;
  createdAt: Date;
}

const defaultTransition: SlideTransition = {
  type: "fade",
  duration: 500,
  direction: "left",
  easing: "ease-in-out",
};

export function TransitionEditor({
  transition,
  onTransitionChange,
  onSave,
  onReset,
  className,
}: TransitionEditorProps) {
  const [currentTransition, setCurrentTransition] =
    useState<SlideTransition>(transition);
  const [savedTransitions, setSavedTransitions] = useState<SavedTransition[]>(
    []
  );
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [presetName, setPresetName] = useState("");
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  useEffect(() => {
    // Load saved transitions from localStorage
    const saved = localStorage.getItem("ipresent-saved-transitions");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSavedTransitions(
          parsed.map((t: any) => ({
            ...t,
            createdAt: new Date(t.createdAt),
          }))
        );
      } catch (error) {
        console.error("Failed to load saved transitions:", error);
      }
    }
  }, []);

  useEffect(() => {
    setCurrentTransition(transition);
  }, [transition]);

  const handleTransitionChange = (updates: Partial<SlideTransition>) => {
    const newTransition = { ...currentTransition, ...updates };
    setCurrentTransition(newTransition);
    onTransitionChange(newTransition);
  };

  const handlePresetSelect = (preset: SlideTransition) => {
    setCurrentTransition(preset);
    onTransitionChange(preset);
  };

  const handleSaveTransition = () => {
    if (!presetName.trim()) return;

    const newSavedTransition: SavedTransition = {
      id: Date.now().toString(),
      name: presetName.trim(),
      transition: { ...currentTransition },
      createdAt: new Date(),
    };

    const updated = [...savedTransitions, newSavedTransition];
    setSavedTransitions(updated);
    localStorage.setItem("ipresent-saved-transitions", JSON.stringify(updated));
    setPresetName("");
    setShowSaveDialog(false);
  };

  const handleDeleteSavedTransition = (id: string) => {
    const updated = savedTransitions.filter((t) => t.id !== id);
    setSavedTransitions(updated);
    localStorage.setItem("ipresent-saved-transitions", JSON.stringify(updated));
  };

  const handleLoadSavedTransition = (savedTransition: SavedTransition) => {
    setCurrentTransition(savedTransition.transition);
    onTransitionChange(savedTransition.transition);
  };

  const handleReset = () => {
    setCurrentTransition(defaultTransition);
    onTransitionChange(defaultTransition);
    onReset?.();
  };

  const handleExportTransitions = () => {
    const data = {
      transitions: savedTransitions,
      exportedAt: new Date().toISOString(),
      version: "1.0",
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ipresent-transitions.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportTransitions = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (data.transitions && Array.isArray(data.transitions)) {
          const imported = data.transitions.map((t: any) => ({
            ...t,
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            createdAt: new Date(t.createdAt || Date.now()),
          }));

          const updated = [...savedTransitions, ...imported];
          setSavedTransitions(updated);
          localStorage.setItem(
            "ipresent-saved-transitions",
            JSON.stringify(updated)
          );
        }
      } catch (error) {
        console.error("Failed to import transitions:", error);
      }
    };
    reader.readAsText(file);
    event.target.value = "";
  };

  const supportsDirection = ["slide", "flip", "cube", "wipe"].includes(
    currentTransition.type
  );
  const supportsEffect = ["slide", "zoom", "fade"].includes(
    currentTransition.type
  );

  return (
    <div className={cn("space-y-6", className)}>
      <Tabs defaultValue="editor" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="editor" className="flex items-center space-x-2">
            <Settings className="h-4 w-4" />
            <span>Editor</span>
          </TabsTrigger>
          <TabsTrigger value="presets" className="flex items-center space-x-2">
            <Zap className="h-4 w-4" />
            <span>Presets</span>
          </TabsTrigger>
          <TabsTrigger value="preview" className="flex items-center space-x-2">
            <Eye className="h-4 w-4" />
            <span>Preview</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="editor" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Transition Settings</span>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAdvanced(!showAdvanced)}
                  >
                    Advanced
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleReset}>
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Basic Settings */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="transition-type">Transition Type</Label>
                  <Select
                    value={currentTransition.type}
                    onValueChange={(value) =>
                      handleTransitionChange({
                        type: value as SlideTransition["type"],
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="fade">Fade</SelectItem>
                      <SelectItem value="slide">Slide</SelectItem>
                      <SelectItem value="zoom">Zoom</SelectItem>
                      <SelectItem value="flip">Flip</SelectItem>
                      <SelectItem value="cube">Cube</SelectItem>
                      <SelectItem value="dissolve">Dissolve</SelectItem>
                      <SelectItem value="wipe">Wipe</SelectItem>
                      <SelectItem value="iris">Iris</SelectItem>
                      <SelectItem value="curtain">Curtain</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration">
                    Duration ({currentTransition.duration}ms)
                  </Label>
                  <Slider
                    value={[currentTransition.duration]}
                    onValueChange={([value]) =>
                      handleTransitionChange({ duration: value })
                    }
                    min={100}
                    max={3000}
                    step={100}
                    className="w-full"
                  />
                </div>
              </div>

              {supportsDirection && (
                <div className="space-y-2">
                  <Label>Direction</Label>
                  <div className="grid grid-cols-4 gap-2">
                    {(["left", "right", "up", "down"] as const).map((dir) => (
                      <Button
                        key={dir}
                        variant={
                          currentTransition.direction === dir
                            ? "default"
                            : "outline"
                        }
                        size="sm"
                        onClick={() =>
                          handleTransitionChange({ direction: dir })
                        }
                        className="capitalize"
                      >
                        {dir}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="easing">Easing</Label>
                <Select
                  value={currentTransition.easing || "ease-in-out"}
                  onValueChange={(value) =>
                    handleTransitionChange({
                      easing: value as SlideTransition["easing"],
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="linear">Linear</SelectItem>
                    <SelectItem value="ease-in">Ease In</SelectItem>
                    <SelectItem value="ease-out">Ease Out</SelectItem>
                    <SelectItem value="ease-in-out">Ease In Out</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Advanced Settings */}
              {showAdvanced && (
                <>
                  <Separator />
                  <div className="space-y-4">
                    <h4 className="font-medium">Advanced Effects</h4>

                    {supportsEffect && (
                      <div className="space-y-2">
                        <Label>Effect Modifier</Label>
                        <div className="grid grid-cols-3 gap-2">
                          {(
                            [
                              "bounce",
                              "elastic",
                              "rotate",
                              "scale",
                              "perspective",
                            ] as const
                          ).map((effect) => (
                            <Button
                              key={effect}
                              variant={
                                currentTransition.effect === effect
                                  ? "default"
                                  : "outline"
                              }
                              size="sm"
                              onClick={() =>
                                handleTransitionChange({
                                  effect:
                                    currentTransition.effect === effect
                                      ? undefined
                                      : effect,
                                })
                              }
                              className="capitalize text-xs"
                            >
                              {effect}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* Current Transition Summary */}
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Current Transition</h4>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">
                    {currentTransition.type.charAt(0).toUpperCase() +
                      currentTransition.type.slice(1)}
                  </Badge>
                  <Badge variant="outline">
                    {currentTransition.duration}ms
                  </Badge>
                  {currentTransition.direction && (
                    <Badge variant="outline">
                      {currentTransition.direction}
                    </Badge>
                  )}
                  <Badge variant="outline">{currentTransition.easing}</Badge>
                  {currentTransition.effect && (
                    <Badge variant="outline">{currentTransition.effect}</Badge>
                  )}
                </div>
              </div>

              {/* Save Custom Transition */}
              <div className="flex items-center space-x-2">
                <Input
                  placeholder="Enter preset name..."
                  value={presetName}
                  onChange={(e) => setPresetName(e.target.value)}
                  className="flex-1"
                />
                <Button
                  onClick={handleSaveTransition}
                  disabled={!presetName.trim()}
                  size="sm"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="presets" className="space-y-6">
          {/* Built-in Presets */}
          <Card>
            <CardHeader>
              <CardTitle>Built-in Presets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {Object.entries(transitionPresets).map(([name, preset]) => (
                  <Button
                    key={name}
                    variant="outline"
                    size="sm"
                    onClick={() => handlePresetSelect(preset)}
                    className="h-auto p-3 flex flex-col items-center space-y-1"
                  >
                    <span className="font-medium text-xs">
                      {name
                        .replace(/([A-Z])/g, " $1")
                        .replace(/^./, (str) => str.toUpperCase())}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {preset.duration}ms
                    </span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Saved Transitions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Saved Transitions</span>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleExportTransitions}
                    disabled={savedTransitions.length === 0}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <label className="cursor-pointer">
                    <Button variant="outline" size="sm" asChild>
                      <span>
                        <Upload className="h-4 w-4" />
                      </span>
                    </Button>
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleImportTransitions}
                      className="hidden"
                    />
                  </label>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {savedTransitions.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No saved transitions yet. Create and save custom transitions
                  in the Editor tab.
                </p>
              ) : (
                <div className="space-y-2">
                  {savedTransitions.map((saved) => (
                    <div
                      key={saved.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex-1">
                        <h4 className="font-medium">{saved.name}</h4>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="secondary" className="text-xs">
                            {saved.transition.type}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {saved.transition.duration}ms
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleLoadSavedTransition(saved)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteSavedTransition(saved.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview">
          <TransitionPreview
            selectedTransition={currentTransition}
            onTransitionSelect={handlePresetSelect}
          />
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={handleReset}>
          Reset
        </Button>
        {onSave && <Button onClick={onSave}>Apply Transition</Button>}
      </div>
    </div>
  );
}
