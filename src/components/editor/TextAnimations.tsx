// src/components/editor/TextAnimations.tsx
import React, { useState, useEffect, useRef } from "react";
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
  Play,
  Pause,
  RotateCcw,
  Settings,
  Zap,
  Timer,
  Repeat,
  Save,
  Trash2,
} from "lucide-react";
import { cn } from "../../lib/utils";

interface TextAnimation {
  id: string;
  name: string;
  category: "entrance" | "emphasis" | "exit" | "continuous";
  keyframes: Record<string, Record<string, string>>;
  properties: {
    duration: number;
    delay: number;
    iterations: number | "infinite";
    direction: "normal" | "reverse" | "alternate" | "alternate-reverse";
    easing: string;
    fillMode: "none" | "forwards" | "backwards" | "both";
  };
  trigger?: "auto" | "click" | "hover" | "scroll";
  previewText?: string;
}

interface TextAnimationsProps {
  onAnimationApply?: (animation: TextAnimation) => void;
  currentAnimation?: TextAnimation;
  trigger?: React.ReactNode;
}

// Predefined animations
const PRESET_ANIMATIONS: TextAnimation[] = [
  {
    id: "fade-in",
    name: "Fade In",
    category: "entrance",
    keyframes: {
      "0%": { opacity: "0" },
      "100%": { opacity: "1" },
    },
    properties: {
      duration: 1,
      delay: 0,
      iterations: 1,
      direction: "normal",
      easing: "ease-in-out",
      fillMode: "forwards",
    },
    trigger: "auto",
  },
  {
    id: "slide-in-left",
    name: "Slide In Left",
    category: "entrance",
    keyframes: {
      "0%": { transform: "translateX(-100%)", opacity: "0" },
      "100%": { transform: "translateX(0)", opacity: "1" },
    },
    properties: {
      duration: 0.8,
      delay: 0,
      iterations: 1,
      direction: "normal",
      easing: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
      fillMode: "forwards",
    },
    trigger: "auto",
  },
  {
    id: "slide-in-right",
    name: "Slide In Right",
    category: "entrance",
    keyframes: {
      "0%": { transform: "translateX(100%)", opacity: "0" },
      "100%": { transform: "translateX(0)", opacity: "1" },
    },
    properties: {
      duration: 0.8,
      delay: 0,
      iterations: 1,
      direction: "normal",
      easing: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
      fillMode: "forwards",
    },
    trigger: "auto",
  },
  {
    id: "slide-in-up",
    name: "Slide In Up",
    category: "entrance",
    keyframes: {
      "0%": { transform: "translateY(100%)", opacity: "0" },
      "100%": { transform: "translateY(0)", opacity: "1" },
    },
    properties: {
      duration: 0.8,
      delay: 0,
      iterations: 1,
      direction: "normal",
      easing: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
      fillMode: "forwards",
    },
    trigger: "auto",
  },
  {
    id: "slide-in-down",
    name: "Slide In Down",
    category: "entrance",
    keyframes: {
      "0%": { transform: "translateY(-100%)", opacity: "0" },
      "100%": { transform: "translateY(0)", opacity: "1" },
    },
    properties: {
      duration: 0.8,
      delay: 0,
      iterations: 1,
      direction: "normal",
      easing: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
      fillMode: "forwards",
    },
    trigger: "auto",
  },
  {
    id: "zoom-in",
    name: "Zoom In",
    category: "entrance",
    keyframes: {
      "0%": { transform: "scale(0)", opacity: "0" },
      "100%": { transform: "scale(1)", opacity: "1" },
    },
    properties: {
      duration: 0.6,
      delay: 0,
      iterations: 1,
      direction: "normal",
      easing: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
      fillMode: "forwards",
    },
    trigger: "auto",
  },
  {
    id: "bounce-in",
    name: "Bounce In",
    category: "entrance",
    keyframes: {
      "0%": { transform: "scale(0.3)", opacity: "0" },
      "50%": { transform: "scale(1.05)", opacity: "1" },
      "70%": { transform: "scale(0.9)" },
      "100%": { transform: "scale(1)" },
    },
    properties: {
      duration: 0.8,
      delay: 0,
      iterations: 1,
      direction: "normal",
      easing: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
      fillMode: "forwards",
    },
    trigger: "auto",
  },
  {
    id: "typewriter",
    name: "Typewriter",
    category: "entrance",
    keyframes: {
      "0%": { width: "0", borderRight: "2px solid" },
      "99%": { borderRight: "2px solid" },
      "100%": { borderRight: "none" },
    },
    properties: {
      duration: 3,
      delay: 0,
      iterations: 1,
      direction: "normal",
      easing: "steps(20, end)",
      fillMode: "forwards",
    },
    trigger: "auto",
  },
  {
    id: "pulse",
    name: "Pulse",
    category: "emphasis",
    keyframes: {
      "0%": { transform: "scale(1)" },
      "50%": { transform: "scale(1.1)" },
      "100%": { transform: "scale(1)" },
    },
    properties: {
      duration: 1,
      delay: 0,
      iterations: "infinite",
      direction: "normal",
      easing: "ease-in-out",
      fillMode: "none",
    },
    trigger: "auto",
  },
  {
    id: "shake",
    name: "Shake",
    category: "emphasis",
    keyframes: {
      "0%, 100%": { transform: "translateX(0)" },
      "10%, 30%, 50%, 70%, 90%": { transform: "translateX(-5px)" },
      "20%, 40%, 60%, 80%": { transform: "translateX(5px)" },
    },
    properties: {
      duration: 0.8,
      delay: 0,
      iterations: 1,
      direction: "normal",
      easing: "ease-in-out",
      fillMode: "none",
    },
    trigger: "hover",
  },
  {
    id: "glow",
    name: "Glow",
    category: "continuous",
    keyframes: {
      "0%, 100%": { textShadow: "0 0 5px currentColor" },
      "50%": { textShadow: "0 0 20px currentColor, 0 0 30px currentColor" },
    },
    properties: {
      duration: 2,
      delay: 0,
      iterations: "infinite",
      direction: "alternate",
      easing: "ease-in-out",
      fillMode: "none",
    },
    trigger: "auto",
  },
  {
    id: "rotate",
    name: "Rotate",
    category: "continuous",
    keyframes: {
      "0%": { transform: "rotate(0deg)" },
      "100%": { transform: "rotate(360deg)" },
    },
    properties: {
      duration: 2,
      delay: 0,
      iterations: "infinite",
      direction: "normal",
      easing: "linear",
      fillMode: "none",
    },
    trigger: "auto",
  },
  {
    id: "fade-out",
    name: "Fade Out",
    category: "exit",
    keyframes: {
      "0%": { opacity: "1" },
      "100%": { opacity: "0" },
    },
    properties: {
      duration: 1,
      delay: 0,
      iterations: 1,
      direction: "normal",
      easing: "ease-in-out",
      fillMode: "forwards",
    },
    trigger: "auto",
  },
  {
    id: "slide-out-left",
    name: "Slide Out Left",
    category: "exit",
    keyframes: {
      "0%": { transform: "translateX(0)", opacity: "1" },
      "100%": { transform: "translateX(-100%)", opacity: "0" },
    },
    properties: {
      duration: 0.8,
      delay: 0,
      iterations: 1,
      direction: "normal",
      easing: "cubic-bezier(0.55, 0.055, 0.675, 0.19)",
      fillMode: "forwards",
    },
    trigger: "auto",
  },
];

export function TextAnimations({
  onAnimationApply,
  currentAnimation,
  trigger,
}: TextAnimationsProps) {
  const [animations, setAnimations] =
    useState<TextAnimation[]>(PRESET_ANIMATIONS);
  const [selectedAnimation, setSelectedAnimation] =
    useState<TextAnimation | null>(currentAnimation || null);
  const [previewText, setPreviewText] = useState("Sample Text");
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTab, setActiveTab] = useState("presets");
  const previewRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<Animation | null>(null);

  // Load custom animations from localStorage
  useEffect(() => {
    const savedAnimations = localStorage.getItem("ipresent-text-animations");
    if (savedAnimations) {
      try {
        const customAnimations = JSON.parse(savedAnimations);
        setAnimations((prev) => [...prev, ...customAnimations]);
      } catch (error) {
        console.error("Error loading custom animations:", error);
      }
    }
  }, []);

  // Generate CSS animation string
  const generateAnimationCSS = (animation: TextAnimation): string => {
    const { duration, delay, iterations, direction, easing, fillMode } =
      animation.properties;
    const iterationsValue =
      iterations === "infinite" ? "infinite" : iterations.toString();

    return `${animation.id} ${duration}s ${easing} ${delay}s ${iterationsValue} ${direction} ${fillMode}`;
  };

  // Generate keyframes CSS
  const generateKeyframesCSS = (animation: TextAnimation): string => {
    const keyframeRules = Object.entries(animation.keyframes)
      .map(([percentage, styles]) => {
        const styleRules = Object.entries(styles)
          .map(([property, value]) => `${property}: ${value}`)
          .join("; ");
        return `${percentage} { ${styleRules} }`;
      })
      .join(" ");

    return `@keyframes ${animation.id} { ${keyframeRules} }`;
  };

  // Apply animation
  const applyAnimation = (animation: TextAnimation) => {
    setSelectedAnimation(animation);
    onAnimationApply?.(animation);
  };

  // Play preview animation
  const playPreview = (animation: TextAnimation) => {
    if (!previewRef.current) return;

    // Stop current animation
    if (animationRef.current) {
      animationRef.current.cancel();
    }

    // Create keyframes
    const keyframes = Object.entries(animation.keyframes).map(
      ([offset, styles]) => ({
        offset: parseFloat(offset.replace("%", "")) / 100,
        ...styles,
      })
    );

    // Create animation
    const { duration, delay, iterations, direction, easing } =
      animation.properties;
    const iterationsValue = iterations === "infinite" ? Infinity : iterations;

    animationRef.current = previewRef.current.animate(keyframes, {
      duration: duration * 1000,
      delay: delay * 1000,
      iterations: iterationsValue,
      direction,
      easing,
      fill: animation.properties.fillMode,
    });

    setIsPlaying(true);

    animationRef.current.addEventListener("finish", () => {
      setIsPlaying(false);
    });
  };

  // Stop preview animation
  const stopPreview = () => {
    if (animationRef.current) {
      animationRef.current.cancel();
      setIsPlaying(false);
    }
  };

  // Reset preview
  const resetPreview = () => {
    stopPreview();
    if (previewRef.current) {
      previewRef.current.style.transform = "";
      previewRef.current.style.opacity = "";
    }
  };

  // Save custom animation
  const saveCustomAnimation = (animation: TextAnimation) => {
    const newAnimation: TextAnimation = {
      ...animation,
      id: `custom-${Date.now()}`,
    };

    const updatedAnimations = [...animations, newAnimation];
    setAnimations(updatedAnimations);

    // Save custom animations to localStorage
    const customAnimations = updatedAnimations.filter((a) =>
      a.id.startsWith("custom-")
    );
    localStorage.setItem(
      "ipresent-text-animations",
      JSON.stringify(customAnimations)
    );
  };

  // Remove custom animation
  const removeCustomAnimation = (animationId: string) => {
    const updatedAnimations = animations.filter((a) => a.id !== animationId);
    setAnimations(updatedAnimations);

    // Update localStorage
    const customAnimations = updatedAnimations.filter((a) =>
      a.id.startsWith("custom-")
    );
    localStorage.setItem(
      "ipresent-text-animations",
      JSON.stringify(customAnimations)
    );
  };

  const AnimationPreview = ({ animation }: { animation: TextAnimation }) => {
    return (
      <div
        className={cn(
          "p-4 border border-slate-700 rounded-lg cursor-pointer transition-all",
          "hover:border-blue-500 hover:bg-slate-800/50",
          selectedAnimation?.id === animation.id &&
            "border-blue-500 bg-blue-500/10"
        )}
        onClick={() => applyAnimation(animation)}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-white">{animation.name}</h3>
            <Badge variant="secondary" className="text-xs capitalize">
              {animation.category}
            </Badge>
            {animation.trigger && (
              <Badge variant="outline" className="text-xs">
                {animation.trigger}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                playPreview(animation);
              }}
              className="h-6 w-6 p-0"
            >
              <Play className="h-3 w-3" />
            </Button>
            {animation.id.startsWith("custom-") && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  removeCustomAnimation(animation.id);
                }}
                className="h-6 w-6 p-0 text-red-400 hover:text-red-300"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
        <div className="text-white text-xl font-bold overflow-hidden">
          {previewText}
        </div>
        <div className="flex items-center gap-2 mt-2 text-xs text-slate-400">
          <span>{animation.properties.duration}s</span>
          <span>•</span>
          <span>
            {animation.properties.iterations === "infinite"
              ? "∞"
              : animation.properties.iterations}
          </span>
          <span>•</span>
          <span>{animation.properties.easing}</span>
        </div>
      </div>
    );
  };

  const AnimationEditor = ({
    animation,
    onChange,
  }: {
    animation: TextAnimation;
    onChange: (animation: TextAnimation) => void;
  }) => {
    return (
      <div className="space-y-4">
        <div>
          <Label>Animation Name</Label>
          <Input
            value={animation.name}
            onChange={(e) => onChange({ ...animation, name: e.target.value })}
          />
        </div>

        <div>
          <Label>Category</Label>
          <Select
            value={animation.category}
            onValueChange={(value) =>
              onChange({ ...animation, category: value as any })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="entrance">Entrance</SelectItem>
              <SelectItem value="emphasis">Emphasis</SelectItem>
              <SelectItem value="exit">Exit</SelectItem>
              <SelectItem value="continuous">Continuous</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Duration (seconds)</Label>
            <Slider
              value={[animation.properties.duration]}
              onValueChange={([value]) =>
                onChange({
                  ...animation,
                  properties: { ...animation.properties, duration: value },
                })
              }
              min={0.1}
              max={10}
              step={0.1}
            />
            <span className="text-xs text-slate-400">
              {animation.properties.duration}s
            </span>
          </div>

          <div>
            <Label>Delay (seconds)</Label>
            <Slider
              value={[animation.properties.delay]}
              onValueChange={([value]) =>
                onChange({
                  ...animation,
                  properties: { ...animation.properties, delay: value },
                })
              }
              min={0}
              max={5}
              step={0.1}
            />
            <span className="text-xs text-slate-400">
              {animation.properties.delay}s
            </span>
          </div>
        </div>

        <div>
          <Label>Iterations</Label>
          <div className="flex items-center gap-2">
            <Switch
              checked={animation.properties.iterations === "infinite"}
              onCheckedChange={(checked) =>
                onChange({
                  ...animation,
                  properties: {
                    ...animation.properties,
                    iterations: checked ? "infinite" : 1,
                  },
                })
              }
            />
            <span className="text-sm">Infinite</span>
            {animation.properties.iterations !== "infinite" && (
              <Slider
                value={[animation.properties.iterations as number]}
                onValueChange={([value]) =>
                  onChange({
                    ...animation,
                    properties: { ...animation.properties, iterations: value },
                  })
                }
                min={1}
                max={10}
                step={1}
                className="flex-1"
              />
            )}
          </div>
        </div>

        <div>
          <Label>Easing</Label>
          <Select
            value={animation.properties.easing}
            onValueChange={(value) =>
              onChange({
                ...animation,
                properties: { ...animation.properties, easing: value },
              })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ease">Ease</SelectItem>
              <SelectItem value="ease-in">Ease In</SelectItem>
              <SelectItem value="ease-out">Ease Out</SelectItem>
              <SelectItem value="ease-in-out">Ease In Out</SelectItem>
              <SelectItem value="linear">Linear</SelectItem>
              <SelectItem value="cubic-bezier(0.25, 0.46, 0.45, 0.94)">
                Ease Out Quart
              </SelectItem>
              <SelectItem value="cubic-bezier(0.55, 0.055, 0.675, 0.19)">
                Ease In Quart
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Direction</Label>
          <Select
            value={animation.properties.direction}
            onValueChange={(value) =>
              onChange({
                ...animation,
                properties: {
                  ...animation.properties,
                  direction: value as any,
                },
              })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="normal">Normal</SelectItem>
              <SelectItem value="reverse">Reverse</SelectItem>
              <SelectItem value="alternate">Alternate</SelectItem>
              <SelectItem value="alternate-reverse">
                Alternate Reverse
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Trigger</Label>
          <Select
            value={animation.trigger || "auto"}
            onValueChange={(value) =>
              onChange({ ...animation, trigger: value as any })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="auto">Auto</SelectItem>
              <SelectItem value="click">Click</SelectItem>
              <SelectItem value="hover">Hover</SelectItem>
              <SelectItem value="scroll">Scroll</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    );
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <Zap className="h-4 w-4 mr-2" />
            Text Animations
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Text Animations</DialogTitle>
        </DialogHeader>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="flex-1 flex flex-col"
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="presets">Presets</TabsTrigger>
            <TabsTrigger value="editor">Editor</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
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
                placeholder="Enter text to preview animations"
              />
            </div>

            {/* Animations Grid */}
            <div className="flex-1 overflow-y-auto">
              <div className="grid gap-4">
                {animations.map((animation) => (
                  <AnimationPreview key={animation.id} animation={animation} />
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="editor" className="space-y-4">
            {selectedAnimation ? (
              <AnimationEditor
                animation={selectedAnimation}
                onChange={setSelectedAnimation}
              />
            ) : (
              <div className="text-center text-slate-400 py-8">
                Select an animation from the presets tab to edit
              </div>
            )}
          </TabsContent>

          <TabsContent value="preview" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">
                {selectedAnimation
                  ? `Previewing: ${selectedAnimation.name}`
                  : "No animation selected"}
              </h3>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    selectedAnimation && playPreview(selectedAnimation)
                  }
                  disabled={!selectedAnimation || isPlaying}
                >
                  <Play className="h-4 w-4 mr-2" />
                  Play
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={stopPreview}
                  disabled={!isPlaying}
                >
                  <Pause className="h-4 w-4 mr-2" />
                  Stop
                </Button>
                <Button variant="outline" size="sm" onClick={resetPreview}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset
                </Button>
              </div>
            </div>

            {/* Preview Area */}
            <div className="border border-slate-700 rounded-lg p-8 min-h-[200px] flex items-center justify-center bg-slate-900">
              <div
                ref={previewRef}
                className="text-white text-4xl font-bold text-center"
                style={{
                  whiteSpace:
                    selectedAnimation?.id === "typewriter"
                      ? "nowrap"
                      : "normal",
                  overflow:
                    selectedAnimation?.id === "typewriter"
                      ? "hidden"
                      : "visible",
                }}
              >
                {previewText}
              </div>
            </div>

            {/* Animation Details */}
            {selectedAnimation && (
              <div className="space-y-2">
                <h4 className="font-medium">Animation Properties</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-400">Duration:</span>{" "}
                    {selectedAnimation.properties.duration}s
                  </div>
                  <div>
                    <span className="text-slate-400">Delay:</span>{" "}
                    {selectedAnimation.properties.delay}s
                  </div>
                  <div>
                    <span className="text-slate-400">Iterations:</span>{" "}
                    {selectedAnimation.properties.iterations}
                  </div>
                  <div>
                    <span className="text-slate-400">Easing:</span>{" "}
                    {selectedAnimation.properties.easing}
                  </div>
                  <div>
                    <span className="text-slate-400">Direction:</span>{" "}
                    {selectedAnimation.properties.direction}
                  </div>
                  <div>
                    <span className="text-slate-400">Trigger:</span>{" "}
                    {selectedAnimation.trigger || "auto"}
                  </div>
                </div>

                <div className="mt-4">
                  <h4 className="font-medium mb-2">CSS Animation</h4>
                  <div className="bg-slate-800 p-3 rounded text-sm font-mono text-slate-300">
                    animation: {generateAnimationCSS(selectedAnimation)};
                  </div>
                </div>

                <div className="mt-4">
                  <h4 className="font-medium mb-2">Keyframes</h4>
                  <div className="bg-slate-800 p-3 rounded text-sm font-mono text-slate-300 max-h-32 overflow-y-auto">
                    {generateKeyframesCSS(selectedAnimation)}
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
