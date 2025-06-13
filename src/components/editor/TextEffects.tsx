// src/components/editor/TextEffects.tsx
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
import { Slider } from "../ui/slider";
import { Switch } from "../ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Badge } from "../ui/badge";
import {
  Sparkles,
  Palette,
  Droplets,
  Type,
  Zap,
  RotateCcw,
  Copy,
  Save,
  Trash2,
} from "lucide-react";
import { cn } from "../../lib/utils";

interface TextEffect {
  id: string;
  name: string;
  category: "shadow" | "outline" | "gradient" | "transform" | "animation";
  properties: Record<string, any>;
  cssProperties: Record<string, string>;
  previewText?: string;
}

interface TextEffectsProps {
  onEffectApply?: (effect: TextEffect) => void;
  currentEffect?: TextEffect;
  trigger?: React.ReactNode;
}

// Predefined text effects
const PRESET_EFFECTS: TextEffect[] = [
  {
    id: "drop-shadow",
    name: "Drop Shadow",
    category: "shadow",
    properties: {
      offsetX: 2,
      offsetY: 2,
      blur: 4,
      color: "#000000",
      opacity: 0.5,
    },
    cssProperties: {
      textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
    },
  },
  {
    id: "glow",
    name: "Glow Effect",
    category: "shadow",
    properties: {
      blur: 10,
      color: "#00ff00",
      opacity: 0.8,
    },
    cssProperties: {
      textShadow: "0 0 10px rgba(0, 255, 0, 0.8)",
    },
  },
  {
    id: "outline",
    name: "Text Outline",
    category: "outline",
    properties: {
      width: 2,
      color: "#000000",
      style: "solid",
    },
    cssProperties: {
      WebkitTextStroke: "2px #000000",
    },
  },
  {
    id: "gradient-rainbow",
    name: "Rainbow Gradient",
    category: "gradient",
    properties: {
      colors: [
        "#ff0000",
        "#ff7f00",
        "#ffff00",
        "#00ff00",
        "#0000ff",
        "#4b0082",
        "#9400d3",
      ],
      direction: "linear",
      angle: 45,
    },
    cssProperties: {
      background:
        "linear-gradient(45deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #9400d3)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      backgroundClip: "text",
    },
  },
  {
    id: "gradient-sunset",
    name: "Sunset Gradient",
    category: "gradient",
    properties: {
      colors: ["#ff6b6b", "#ffa500", "#ffff00"],
      direction: "linear",
      angle: 90,
    },
    cssProperties: {
      background: "linear-gradient(90deg, #ff6b6b, #ffa500, #ffff00)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      backgroundClip: "text",
    },
  },
  {
    id: "scale-hover",
    name: "Scale on Hover",
    category: "transform",
    properties: {
      scale: 1.1,
      duration: 0.3,
      easing: "ease-in-out",
    },
    cssProperties: {
      transition: "transform 0.3s ease-in-out",
      ":hover": {
        transform: "scale(1.1)",
      },
    },
  },
  {
    id: "rotate",
    name: "Rotation",
    category: "transform",
    properties: {
      angle: 5,
      duration: 0.3,
      easing: "ease-in-out",
    },
    cssProperties: {
      transform: "rotate(5deg)",
      transition: "transform 0.3s ease-in-out",
    },
  },
  {
    id: "pulse",
    name: "Pulse Animation",
    category: "animation",
    properties: {
      duration: 2,
      iterations: "infinite",
      easing: "ease-in-out",
    },
    cssProperties: {
      animation: "pulse 2s ease-in-out infinite",
    },
  },
  {
    id: "typewriter",
    name: "Typewriter Effect",
    category: "animation",
    properties: {
      duration: 3,
      steps: 20,
    },
    cssProperties: {
      overflow: "hidden",
      borderRight: "2px solid",
      whiteSpace: "nowrap",
      animation: "typewriter 3s steps(20) forwards, blink 1s infinite",
    },
  },
];

export function TextEffects({
  onEffectApply,
  currentEffect,
  trigger,
}: TextEffectsProps) {
  const [effects, setEffects] = useState<TextEffect[]>(PRESET_EFFECTS);
  const [selectedEffect, setSelectedEffect] = useState<TextEffect | null>(
    currentEffect || null
  );
  const [customEffect, setCustomEffect] = useState<Partial<TextEffect>>({
    name: "",
    category: "shadow",
    properties: {},
    cssProperties: {},
  });
  const [previewText, setPreviewText] = useState("Sample Text");
  const [activeTab, setActiveTab] = useState("presets");

  // Load custom effects from localStorage
  useEffect(() => {
    const savedEffects = localStorage.getItem("ipresent-text-effects");
    if (savedEffects) {
      try {
        const customEffects = JSON.parse(savedEffects);
        setEffects((prev) => [...prev, ...customEffects]);
      } catch (error) {
        console.error("Error loading custom effects:", error);
      }
    }
  }, []);

  // Generate CSS from effect properties
  // Replace the generateCSS function:
  const generateCSS = (effect: TextEffect): string => {
    const styles: string[] = [];

    Object.entries(effect.cssProperties).forEach(([property, value]) => {
      if (property.startsWith(":")) {
        // Pseudo-selector
        if (typeof value === "object" && value !== null) {
          styles.push(
            `${property} { ${Object.entries(value)
              .map(([p, v]) => `${p}: ${v}`)
              .join("; ")} }`
          );
        }
      } else {
        styles.push(`${property}: ${value}`);
      }
    });

    return styles.join("; ");
  };

  // Apply effect
  const applyEffect = (effect: TextEffect) => {
    setSelectedEffect(effect);
    onEffectApply?.(effect);
  };

  // Save custom effect
  const saveCustomEffect = () => {
    if (!customEffect.name) return;

    const newEffect: TextEffect = {
      id: `custom-${Date.now()}`,
      name: customEffect.name,
      category: customEffect.category || "shadow",
      properties: customEffect.properties || {},
      cssProperties: customEffect.cssProperties || {},
    };

    const updatedEffects = [...effects, newEffect];
    setEffects(updatedEffects);

    // Save custom effects to localStorage
    const customEffects = updatedEffects.filter((e) =>
      e.id.startsWith("custom-")
    );
    localStorage.setItem(
      "ipresent-text-effects",
      JSON.stringify(customEffects)
    );

    // Reset form
    setCustomEffect({
      name: "",
      category: "shadow",
      properties: {},
      cssProperties: {},
    });
  };

  // Remove custom effect
  const removeCustomEffect = (effectId: string) => {
    const updatedEffects = effects.filter((e) => e.id !== effectId);
    setEffects(updatedEffects);

    // Update localStorage
    const customEffects = updatedEffects.filter((e) =>
      e.id.startsWith("custom-")
    );
    localStorage.setItem(
      "ipresent-text-effects",
      JSON.stringify(customEffects)
    );
  };

  // Shadow effect controls
  const ShadowControls = ({
    effect,
    onChange,
  }: {
    effect: TextEffect;
    onChange: (properties: any) => void;
  }) => {
    const props = effect.properties;

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Offset X</Label>
            <Slider
              value={[props.offsetX || 0]}
              onValueChange={([value]) =>
                onChange({ ...props, offsetX: value })
              }
              min={-20}
              max={20}
              step={1}
            />
            <span className="text-xs text-slate-400">
              {props.offsetX || 0}px
            </span>
          </div>
          <div>
            <Label>Offset Y</Label>
            <Slider
              value={[props.offsetY || 0]}
              onValueChange={([value]) =>
                onChange({ ...props, offsetY: value })
              }
              min={-20}
              max={20}
              step={1}
            />
            <span className="text-xs text-slate-400">
              {props.offsetY || 0}px
            </span>
          </div>
        </div>
        <div>
          <Label>Blur</Label>
          <Slider
            value={[props.blur || 0]}
            onValueChange={([value]) => onChange({ ...props, blur: value })}
            min={0}
            max={50}
            step={1}
          />
          <span className="text-xs text-slate-400">{props.blur || 0}px</span>
        </div>
        <div>
          <Label>Color</Label>
          <Input
            type="color"
            value={props.color || "#000000"}
            onChange={(e) => onChange({ ...props, color: e.target.value })}
          />
        </div>
        <div>
          <Label>Opacity</Label>
          <Slider
            value={[props.opacity || 1]}
            onValueChange={([value]) => onChange({ ...props, opacity: value })}
            min={0}
            max={1}
            step={0.1}
          />
          <span className="text-xs text-slate-400">{props.opacity || 1}</span>
        </div>
      </div>
    );
  };

  // Outline effect controls
  const OutlineControls = ({
    effect,
    onChange,
  }: {
    effect: TextEffect;
    onChange: (properties: any) => void;
  }) => {
    const props = effect.properties;

    return (
      <div className="space-y-4">
        <div>
          <Label>Width</Label>
          <Slider
            value={[props.width || 1]}
            onValueChange={([value]) => onChange({ ...props, width: value })}
            min={0}
            max={10}
            step={0.5}
          />
          <span className="text-xs text-slate-400">{props.width || 1}px</span>
        </div>
        <div>
          <Label>Color</Label>
          <Input
            type="color"
            value={props.color || "#000000"}
            onChange={(e) => onChange({ ...props, color: e.target.value })}
          />
        </div>
        <div>
          <Label>Style</Label>
          <Select
            value={props.style || "solid"}
            onValueChange={(value) => onChange({ ...props, style: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="solid">Solid</SelectItem>
              <SelectItem value="dashed">Dashed</SelectItem>
              <SelectItem value="dotted">Dotted</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    );
  };

  // Gradient effect controls
  const GradientControls = ({
    effect,
    onChange,
  }: {
    effect: TextEffect;
    onChange: (properties: any) => void;
  }) => {
    const props = effect.properties;

    return (
      <div className="space-y-4">
        <div>
          <Label>Direction</Label>
          <Select
            value={props.direction || "linear"}
            onValueChange={(value) => onChange({ ...props, direction: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="linear">Linear</SelectItem>
              <SelectItem value="radial">Radial</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {props.direction === "linear" && (
          <div>
            <Label>Angle</Label>
            <Slider
              value={[props.angle || 0]}
              onValueChange={([value]) => onChange({ ...props, angle: value })}
              min={0}
              max={360}
              step={15}
            />
            <span className="text-xs text-slate-400">{props.angle || 0}°</span>
          </div>
        )}
        <div>
          <Label>Colors</Label>
          <div className="space-y-2">
            {(props.colors || ["#000000", "#ffffff"]).map(
              (color: string, index: number) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    type="color"
                    value={color}
                    onChange={(e) => {
                      const newColors = [...(props.colors || [])];
                      newColors[index] = e.target.value;
                      onChange({ ...props, colors: newColors });
                    }}
                    className="w-16"
                  />
                  <Input
                    value={color}
                    onChange={(e) => {
                      const newColors = [...(props.colors || [])];
                      newColors[index] = e.target.value;
                      onChange({ ...props, colors: newColors });
                    }}
                    className="flex-1"
                  />
                  {(props.colors || []).length > 2 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const newColors = (props.colors || []).filter(
                          (_: any, i: number) => i !== index
                        );
                        onChange({ ...props, colors: newColors });
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              )
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const newColors = [...(props.colors || []), "#000000"];
                onChange({ ...props, colors: newColors });
              }}
            >
              Add Color
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const EffectPreview = ({ effect }: { effect: TextEffect }) => {
    const style = effect.cssProperties;

    return (
      <div
        className={cn(
          "p-4 border border-slate-700 rounded-lg cursor-pointer transition-all",
          "hover:border-blue-500 hover:bg-slate-800/50",
          selectedEffect?.id === effect.id && "border-blue-500 bg-blue-500/10"
        )}
        onClick={() => applyEffect(effect)}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-white">{effect.name}</h3>
            <Badge variant="secondary" className="text-xs capitalize">
              {effect.category}
            </Badge>
          </div>
          {effect.id.startsWith("custom-") && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                removeCustomEffect(effect.id);
              }}
              className="h-6 w-6 p-0 text-red-400 hover:text-red-300"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          )}
        </div>
        <div className="text-white text-2xl font-bold" style={style}>
          {previewText}
        </div>
      </div>
    );
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <Sparkles className="h-4 w-4 mr-2" />
            Text Effects
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Text Effects</DialogTitle>
        </DialogHeader>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="flex-1 flex flex-col"
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="presets">Presets</TabsTrigger>
            <TabsTrigger value="custom">Custom</TabsTrigger>
            <TabsTrigger value="editor">Editor</TabsTrigger>
          </TabsList>

          <TabsContent
            value="presets"
            className="flex-1 flex flex-col space-y-4"
          >
            {/* Preview Text Input */}
            <div>
              <Label htmlFor="preview-text">Preview Text</Label>
              <Input
                id="preview-text"
                value={previewText}
                onChange={(e) => setPreviewText(e.target.value)}
                placeholder="Enter text to preview effects"
              />
            </div>

            {/* Effects Grid */}
            <div className="flex-1 overflow-y-auto">
              <div className="grid gap-4">
                {effects.map((effect) => (
                  <EffectPreview key={effect.id} effect={effect} />
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="custom" className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="effect-name">Effect Name</Label>
                <Input
                  id="effect-name"
                  value={customEffect.name || ""}
                  onChange={(e) =>
                    setCustomEffect((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  placeholder="Enter effect name"
                />
              </div>

              <div>
                <Label>Category</Label>
                <Select
                  value={customEffect.category || "shadow"}
                  onValueChange={(value) =>
                    setCustomEffect((prev) => ({
                      ...prev,
                      category: value as any,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="shadow">Shadow</SelectItem>
                    <SelectItem value="outline">Outline</SelectItem>
                    <SelectItem value="gradient">Gradient</SelectItem>
                    <SelectItem value="transform">Transform</SelectItem>
                    <SelectItem value="animation">Animation</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="css-properties">CSS Properties</Label>
                <textarea
                  id="css-properties"
                  className="w-full h-32 p-2 bg-slate-800 border border-slate-700 rounded text-sm font-mono"
                  value={JSON.stringify(
                    customEffect.cssProperties || {},
                    null,
                    2
                  )}
                  onChange={(e) => {
                    try {
                      const cssProperties = JSON.parse(e.target.value);
                      setCustomEffect((prev) => ({ ...prev, cssProperties }));
                    } catch (error) {
                      // Invalid JSON, ignore
                    }
                  }}
                  placeholder='{ "textShadow": "2px 2px 4px rgba(0,0,0,0.5)" }'
                />
              </div>

              <Button onClick={saveCustomEffect} disabled={!customEffect.name}>
                <Save className="h-4 w-4 mr-2" />
                Save Effect
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="editor" className="space-y-4">
            {selectedEffect && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">
                    Editing: {selectedEffect.name}
                  </h3>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newEffect = {
                          ...selectedEffect,
                          id: `custom-${Date.now()}`,
                          name: `${selectedEffect.name} Copy`,
                        };
                        setEffects((prev) => [...prev, newEffect]);
                      }}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Duplicate
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedEffect(null)}
                    >
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Reset
                    </Button>
                  </div>
                </div>

                {/* Dynamic controls based on effect category */}
                {selectedEffect.category === "shadow" && (
                  <ShadowControls
                    effect={selectedEffect}
                    onChange={(properties) => {
                      const updatedEffect = {
                        ...selectedEffect,
                        properties,
                        cssProperties: {
                          textShadow: `${properties.offsetX || 0}px ${
                            properties.offsetY || 0
                          }px ${properties.blur || 0}px rgba(${parseInt(
                            properties.color?.slice(1, 3) || "00",
                            16
                          )}, ${parseInt(
                            properties.color?.slice(3, 5) || "00",
                            16
                          )}, ${parseInt(
                            properties.color?.slice(5, 7) || "00",
                            16
                          )}, ${properties.opacity || 1})`,
                        },
                      };
                      setSelectedEffect(updatedEffect);
                    }}
                  />
                )}

                {selectedEffect.category === "outline" && (
                  <OutlineControls
                    effect={selectedEffect}
                    onChange={(properties) => {
                      const updatedEffect = {
                        ...selectedEffect,
                        properties,
                        cssProperties: {
                          WebkitTextStroke: `${properties.width || 1}px ${
                            properties.color || "#000000"
                          }`,
                        },
                      };
                      setSelectedEffect(updatedEffect);
                    }}
                  />
                )}

                {selectedEffect.category === "gradient" && (
                  <GradientControls
                    effect={selectedEffect}
                    onChange={(properties) => {
                      const colors = properties.colors || [
                        "#000000",
                        "#ffffff",
                      ];
                      const gradient =
                        properties.direction === "radial"
                          ? `radial-gradient(circle, ${colors.join(", ")})`
                          : `linear-gradient(${
                              properties.angle || 0
                            }deg, ${colors.join(", ")})`;

                      const updatedEffect = {
                        ...selectedEffect,
                        properties,
                        cssProperties: {
                          background: gradient,
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          backgroundClip: "text",
                        },
                      };
                      setSelectedEffect(updatedEffect);
                    }}
                  />
                )}

                {/* Preview */}
                <div className="border border-slate-700 rounded-lg p-4">
                  <Label>Preview</Label>
                  <div
                    className="text-white text-3xl font-bold mt-2"
                    style={selectedEffect.cssProperties}
                  >
                    {previewText}
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
