import React from "react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "../ui/dropdown-menu";
import { useTheme, ThemeMode, ThemeVariant, ThemeSize } from "./ThemeProvider";
import {
  Sun,
  Moon,
  Monitor,
  Palette,
  Settings,
  Smartphone,
  Tablet,
  Monitor as MonitorIcon,
  Zap,
  Eye,
  Check,
} from "lucide-react";
import { Badge } from "../ui/badge";

interface ThemeToggleProps {
  variant?: "icon" | "button" | "compact";
  showLabel?: boolean;
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

const themeSizes: { value: ThemeSize; label: string; icon: React.ReactNode }[] =
  [
    {
      value: "compact",
      label: "Compact",
      icon: <Smartphone className="h-4 w-4" />,
    },
    {
      value: "default",
      label: "Default",
      icon: <Tablet className="h-4 w-4" />,
    },
    {
      value: "comfortable",
      label: "Comfortable",
      icon: <MonitorIcon className="h-4 w-4" />,
    },
  ];

export function ThemeToggle({
  variant = "icon",
  showLabel = false,
  className,
}: ThemeToggleProps) {
  const {
    config,
    setMode,
    setVariant,
    setSize,
    toggleAnimations,
    toggleReducedMotion,
  } = useTheme();

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

  const getCurrentModeLabel = () => {
    switch (config.mode) {
      case "light":
        return "Light";
      case "dark":
        return "Dark";
      case "system":
        return "System";
    }
  };

  const getVariantColor = (variantValue: ThemeVariant) => {
    return (
      themeVariants.find((v) => v.value === variantValue)?.color ||
      themeVariants[0].color
    );
  };

  const getVariantLabel = (variantValue: ThemeVariant) => {
    return (
      themeVariants.find((v) => v.value === variantValue)?.label || "Default"
    );
  };

  const getSizeLabel = (sizeValue: ThemeSize) => {
    return themeSizes.find((s) => s.value === sizeValue)?.label || "Default";
  };

  const getSizeIcon = (sizeValue: ThemeSize) => {
    return (
      themeSizes.find((s) => s.value === sizeValue)?.icon || (
        <Tablet className="h-4 w-4" />
      )
    );
  };

  if (variant === "compact") {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className={className}>
            {getCurrentModeIcon()}
            {showLabel && <span className="ml-2">{getCurrentModeLabel()}</span>}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel>Theme Mode</DropdownMenuLabel>
          <DropdownMenuRadioGroup
            value={config.mode}
            onValueChange={(value: string) => setMode(value as ThemeMode)}
          >
            <DropdownMenuRadioItem value="light">
              <Sun className="h-4 w-4 mr-2" />
              Light
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="dark">
              <Moon className="h-4 w-4 mr-2" />
              Dark
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="system">
              <Monitor className="h-4 w-4 mr-2" />
              System
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={variant === "button" ? "outline" : "ghost"}
          size={variant === "button" ? "default" : "icon"}
          className={className}
        >
          {getCurrentModeIcon()}
          {variant === "button" && (
            <span className="ml-2">
              {showLabel ? getCurrentModeLabel() : "Theme"}
            </span>
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel className="flex items-center gap-2">
          <Palette className="h-4 w-4" />
          Theme Settings
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        {/* Theme Mode */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <div className="flex items-center gap-2">
              {getCurrentModeIcon()}
              <span>Mode: {getCurrentModeLabel()}</span>
            </div>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuRadioGroup
              value={config.mode}
              onValueChange={(value: string) => setMode(value as ThemeMode)}
            >
              <DropdownMenuRadioItem value="light">
                <Sun className="h-4 w-4 mr-2" />
                Light
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="dark">
                <Moon className="h-4 w-4 mr-2" />
                Dark
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="system">
                <Monitor className="h-4 w-4 mr-2" />
                System
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        {/* Color Scheme */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <div className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded-full border"
                style={{ backgroundColor: getVariantColor(config.variant) }}
              />
              <span>Color: {getVariantLabel(config.variant)}</span>
            </div>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuRadioGroup
              value={config.variant}
              onValueChange={(value: string) =>
                setVariant(value as ThemeVariant)
              }
            >
              {themeVariants.map((variant) => (
                <DropdownMenuRadioItem
                  key={variant.value}
                  value={variant.value}
                >
                  <div
                    className="w-4 h-4 rounded-full border mr-2"
                    style={{ backgroundColor: variant.color }}
                  />
                  {variant.label}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        {/* Interface Size */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <div className="flex items-center gap-2">
              {getSizeIcon(config.size)}
              <span>Size: {getSizeLabel(config.size)}</span>
            </div>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuRadioGroup
              value={config.size}
              onValueChange={(value: string) => setSize(value as ThemeSize)}
            >
              {themeSizes.map((size) => (
                <DropdownMenuRadioItem key={size.value} value={size.value}>
                  <div className="flex items-center gap-2">
                    {size.icon}
                    {size.label}
                  </div>
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSeparator />

        {/* Animation Settings */}
        <DropdownMenuItem onClick={toggleAnimations}>
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              <span>Animations</span>
            </div>
            {config.animations && <Check className="h-4 w-4" />}
          </div>
        </DropdownMenuItem>

        <DropdownMenuItem onClick={toggleReducedMotion}>
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              <span>Reduced Motion</span>
            </div>
            {config.reducedMotion && <Check className="h-4 w-4" />}
          </div>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Current Status */}
        <div className="px-2 py-1.5">
          <div className="text-xs text-muted-foreground mb-1">
            Current Theme
          </div>
          <div className="flex flex-wrap gap-1">
            <Badge variant="secondary" className="text-xs">
              {config.mode}
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {config.variant}
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {config.size}
            </Badge>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Quick theme mode toggle (legacy compatibility)
export function QuickThemeToggle({ className }: { className?: string }) {
  const { config, setMode } = useTheme();

  const toggleMode = () => {
    const modes: ThemeMode[] = ["light", "dark", "system"];
    const currentIndex = modes.indexOf(config.mode);
    const nextIndex = (currentIndex + 1) % modes.length;
    setMode(modes[nextIndex]);
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleMode}
      className={className}
    >
      {config.mode === "dark" ? (
        <Sun className="h-5 w-5" />
      ) : config.mode === "light" ? (
        <Moon className="h-5 w-5" />
      ) : (
        <Monitor className="h-5 w-5" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
