import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { ThemeSelector } from "../theme/ThemeSelector";
import { ThemeToggle } from "../theme/ThemeToggle";
import { Button } from "../ui/button";
import { Separator } from "../ui/seperator";
import { Badge } from "../ui/badge";
import { useTheme } from "../theme/ThemeProvider";
import {
  Palette,
  Zap,
  Eye,
  Monitor,
  Smartphone,
  Settings,
  Info,
} from "lucide-react";

export function ThemeSettings() {
  const { config } = useTheme();

  const getThemeInfo = () => {
    const features = [];
    if (config.animations) features.push("Animations Enabled");
    if (config.reducedMotion) features.push("Reduced Motion");
    if (config.customColors) features.push("Custom Colors");
    return features;
  };

  return (
    <div className="space-y-6">
      {/* Quick Theme Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Quick Theme Controls
          </CardTitle>
          <CardDescription>
            Fast access to common theme settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="font-medium">Theme Mode</div>
              <div className="text-sm text-muted-foreground">
                Current: {config.mode} mode
              </div>
            </div>
            <ThemeToggle variant="button" showLabel />
          </div>

          <Separator className="my-4" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-3 border rounded-lg">
              <Monitor className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
              <div className="font-medium text-sm">Mode</div>
              <Badge variant="secondary" className="mt-1">
                {config.mode}
              </Badge>
            </div>

            <div className="text-center p-3 border rounded-lg">
              <Palette className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
              <div className="font-medium text-sm">Color</div>
              <Badge variant="secondary" className="mt-1">
                {config.variant}
              </Badge>
            </div>

            <div className="text-center p-3 border rounded-lg">
              <Smartphone className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
              <div className="font-medium text-sm">Size</div>
              <Badge variant="secondary" className="mt-1">
                {config.size}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Comprehensive Theme Selector */}
      <ThemeSelector />

      {/* Theme Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Theme Information
          </CardTitle>
          <CardDescription>
            Current theme configuration and features
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="font-medium mb-2">Active Features</div>
              <div className="flex flex-wrap gap-2">
                {getThemeInfo().map((feature, index) => (
                  <Badge key={index} variant="outline">
                    {feature}
                  </Badge>
                ))}
                {getThemeInfo().length === 0 && (
                  <span className="text-sm text-muted-foreground">
                    No special features enabled
                  </span>
                )}
              </div>
            </div>

            <Separator />

            <div>
              <div className="font-medium mb-2">Accessibility</div>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  <span>
                    Animations: {config.animations ? "Enabled" : "Disabled"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  <span>
                    Reduced Motion:{" "}
                    {config.reducedMotion ? "Enabled" : "Disabled"}
                  </span>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <div className="font-medium mb-2">Theme Tips</div>
              <div className="space-y-1 text-sm text-muted-foreground">
                <div>
                  • Use 'System' mode to automatically match your OS theme
                </div>
                <div>• 'Compact' size is great for smaller screens</div>
                <div>• Enable 'Reduced Motion' for better accessibility</div>
                <div>
                  • Custom colors can be exported and shared with others
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
