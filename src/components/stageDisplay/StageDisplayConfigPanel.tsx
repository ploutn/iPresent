import React, { useState } from "react";
import {
  StageDisplayConfig,
  StageDisplayTemplate,
  StageDisplayElement,
} from "../../types/stageDisplay";
import { DisplayDevice } from "../../types/outputManagement";
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
import { Switch } from "../ui/switch";
import { Slider } from "../ui/slider";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import {
  Monitor,
  Settings,
  Palette,
  Layout,
  Clock,
  Eye,
  EyeOff,
  RefreshCw,
  Save,
  Download,
  Upload,
} from "lucide-react";

interface StageDisplayConfigPanelProps {
  config: StageDisplayConfig;
  availableDisplays: DisplayDevice[];
  onConfigChange: (config: StageDisplayConfig) => void;
  onExportConfig: () => void;
  onImportConfig: (file: File) => void;
}

interface DisplaySettings {
  resolution: string;
  refreshRate: number;
  colorProfile: string;
  brightness: number;
  contrast: number;
  autoHide: boolean;
  autoHideDelay: number;
}

interface AdvancedSettings {
  enableTransitions: boolean;
  transitionDuration: number;
  enableAnimations: boolean;
  animationSpeed: number;
  enableKeyboardShortcuts: boolean;
  enableRemoteControl: boolean;
  syncWithPresentation: boolean;
  preloadNextSlide: boolean;
}

export function StageDisplayConfigPanel({
  config,
  availableDisplays,
  onConfigChange,
  onExportConfig,
  onImportConfig,
}: StageDisplayConfigPanelProps) {
  const [displaySettings, setDisplaySettings] = useState<DisplaySettings>({
    resolution: "1920x1080",
    refreshRate: 60,
    colorProfile: "sRGB",
    brightness: 100,
    contrast: 100,
    autoHide: false,
    autoHideDelay: 5,
  });

  const [advancedSettings, setAdvancedSettings] = useState<AdvancedSettings>({
    enableTransitions: true,
    transitionDuration: 300,
    enableAnimations: true,
    animationSpeed: 1,
    enableKeyboardShortcuts: true,
    enableRemoteControl: false,
    syncWithPresentation: true,
    preloadNextSlide: true,
  });

  const [activeTab, setActiveTab] = useState("display");

  const handleDisplaySettingChange = (
    key: keyof DisplaySettings,
    value: any
  ) => {
    setDisplaySettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleAdvancedSettingChange = (
    key: keyof AdvancedSettings,
    value: any
  ) => {
    setAdvancedSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleTargetDisplayChange = (displayId: string) => {
    onConfigChange({
      ...config,
      targetDisplayId: displayId,
    });
  };

  const handleStageDisplayToggle = (isActive: boolean) => {
    onConfigChange({
      ...config,
      isActive,
    });
  };

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImportConfig(file);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Stage Display Configuration</h2>
          <p className="text-muted-foreground">
            Configure advanced settings for your stage display output
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={onExportConfig}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" asChild>
            <label>
              <Upload className="h-4 w-4 mr-2" />
              Import
              <input
                type="file"
                accept=".json"
                onChange={handleFileImport}
                className="hidden"
              />
            </label>
          </Button>
        </div>
      </div>

      {/* Main Configuration Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="display" className="flex items-center gap-2">
            <Monitor className="h-4 w-4" />
            Display
          </TabsTrigger>
          <TabsTrigger value="layout" className="flex items-center gap-2">
            <Layout className="h-4 w-4" />
            Layout
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Appearance
          </TabsTrigger>
          <TabsTrigger value="advanced" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Advanced
          </TabsTrigger>
        </TabsList>

        {/* Display Settings Tab */}
        <TabsContent value="display" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Monitor className="h-5 w-5" />
                Display Output Settings
              </CardTitle>
              <CardDescription>
                Configure which display to use for stage output and basic
                display settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Stage Display Toggle */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Enable Stage Display</Label>
                  <p className="text-sm text-muted-foreground">
                    Show stage display on selected output
                  </p>
                </div>
                <Switch
                  checked={config.isActive}
                  onCheckedChange={handleStageDisplayToggle}
                />
              </div>

              {/* Target Display Selection */}
              <div className="space-y-2">
                <Label>Target Display</Label>
                <Select
                  value={config.targetDisplayId || ""}
                  onValueChange={handleTargetDisplayChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select display for stage output" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableDisplays.map((display) => (
                      <SelectItem key={display.id} value={display.id}>
                        {display.name} ({display.resolution})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Display Quality Settings */}
              <Accordion type="single" collapsible>
                <AccordionItem value="quality">
                  <AccordionTrigger>Display Quality Settings</AccordionTrigger>
                  <AccordionContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Resolution</Label>
                        <Select
                          value={displaySettings.resolution}
                          onValueChange={(value) =>
                            handleDisplaySettingChange("resolution", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1920x1080">
                              1920x1080 (Full HD)
                            </SelectItem>
                            <SelectItem value="2560x1440">
                              2560x1440 (2K)
                            </SelectItem>
                            <SelectItem value="3840x2160">
                              3840x2160 (4K)
                            </SelectItem>
                            <SelectItem value="1280x720">
                              1280x720 (HD)
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Refresh Rate</Label>
                        <Select
                          value={displaySettings.refreshRate.toString()}
                          onValueChange={(value) =>
                            handleDisplaySettingChange(
                              "refreshRate",
                              parseInt(value)
                            )
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="30">30 Hz</SelectItem>
                            <SelectItem value="60">60 Hz</SelectItem>
                            <SelectItem value="120">120 Hz</SelectItem>
                            <SelectItem value="144">144 Hz</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Brightness: {displaySettings.brightness}%</Label>
                        <Slider
                          value={[displaySettings.brightness]}
                          onValueChange={([value]) =>
                            handleDisplaySettingChange("brightness", value)
                          }
                          max={100}
                          min={10}
                          step={5}
                          className="w-full"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Contrast: {displaySettings.contrast}%</Label>
                        <Slider
                          value={[displaySettings.contrast]}
                          onValueChange={([value]) =>
                            handleDisplaySettingChange("contrast", value)
                          }
                          max={150}
                          min={50}
                          step={5}
                          className="w-full"
                        />
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Layout Settings Tab */}
        <TabsContent value="layout" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layout className="h-5 w-5" />
                Layout Configuration
              </CardTitle>
              <CardDescription>
                Configure the layout and positioning of stage display elements
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Auto-hide Cursor</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically hide cursor after inactivity
                  </p>
                </div>
                <Switch
                  checked={displaySettings.autoHide}
                  onCheckedChange={(checked) =>
                    handleDisplaySettingChange("autoHide", checked)
                  }
                />
              </div>

              {displaySettings.autoHide && (
                <div className="space-y-2">
                  <Label>
                    Auto-hide Delay: {displaySettings.autoHideDelay}s
                  </Label>
                  <Slider
                    value={[displaySettings.autoHideDelay]}
                    onValueChange={([value]) =>
                      handleDisplaySettingChange("autoHideDelay", value)
                    }
                    max={30}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance Settings Tab */}
        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Visual Appearance
              </CardTitle>
              <CardDescription>
                Customize the visual appearance of your stage display
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Color Profile</Label>
                <Select
                  value={displaySettings.colorProfile}
                  onValueChange={(value) =>
                    handleDisplaySettingChange("colorProfile", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sRGB">sRGB (Standard)</SelectItem>
                    <SelectItem value="adobeRGB">
                      Adobe RGB (Wide Gamut)
                    </SelectItem>
                    <SelectItem value="rec2020">Rec. 2020 (HDR)</SelectItem>
                    <SelectItem value="displayP3">
                      Display P3 (Apple)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Advanced Settings Tab */}
        <TabsContent value="advanced" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Advanced Configuration
              </CardTitle>
              <CardDescription>
                Advanced settings for performance and functionality
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Performance Settings */}
              <Accordion type="single" collapsible>
                <AccordionItem value="performance">
                  <AccordionTrigger>Performance Settings</AccordionTrigger>
                  <AccordionContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Enable Transitions</Label>
                        <p className="text-sm text-muted-foreground">
                          Smooth transitions between slides
                        </p>
                      </div>
                      <Switch
                        checked={advancedSettings.enableTransitions}
                        onCheckedChange={(checked) =>
                          handleAdvancedSettingChange(
                            "enableTransitions",
                            checked
                          )
                        }
                      />
                    </div>

                    {advancedSettings.enableTransitions && (
                      <div className="space-y-2">
                        <Label>
                          Transition Duration:{" "}
                          {advancedSettings.transitionDuration}ms
                        </Label>
                        <Slider
                          value={[advancedSettings.transitionDuration]}
                          onValueChange={([value]) =>
                            handleAdvancedSettingChange(
                              "transitionDuration",
                              value
                            )
                          }
                          max={1000}
                          min={100}
                          step={50}
                          className="w-full"
                        />
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Enable Animations</Label>
                        <p className="text-sm text-muted-foreground">
                          Animated elements and effects
                        </p>
                      </div>
                      <Switch
                        checked={advancedSettings.enableAnimations}
                        onCheckedChange={(checked) =>
                          handleAdvancedSettingChange(
                            "enableAnimations",
                            checked
                          )
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Preload Next Slide</Label>
                        <p className="text-sm text-muted-foreground">
                          Improve performance by preloading content
                        </p>
                      </div>
                      <Switch
                        checked={advancedSettings.preloadNextSlide}
                        onCheckedChange={(checked) =>
                          handleAdvancedSettingChange(
                            "preloadNextSlide",
                            checked
                          )
                        }
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="control">
                  <AccordionTrigger>Control Settings</AccordionTrigger>
                  <AccordionContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Keyboard Shortcuts</Label>
                        <p className="text-sm text-muted-foreground">
                          Enable keyboard control of stage display
                        </p>
                      </div>
                      <Switch
                        checked={advancedSettings.enableKeyboardShortcuts}
                        onCheckedChange={(checked) =>
                          handleAdvancedSettingChange(
                            "enableKeyboardShortcuts",
                            checked
                          )
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Remote Control</Label>
                        <p className="text-sm text-muted-foreground">
                          Allow remote control via network
                        </p>
                      </div>
                      <Switch
                        checked={advancedSettings.enableRemoteControl}
                        onCheckedChange={(checked) =>
                          handleAdvancedSettingChange(
                            "enableRemoteControl",
                            checked
                          )
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">
                          Sync with Presentation
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Automatically sync with main presentation
                        </p>
                      </div>
                      <Switch
                        checked={advancedSettings.syncWithPresentation}
                        onCheckedChange={(checked) =>
                          handleAdvancedSettingChange(
                            "syncWithPresentation",
                            checked
                          )
                        }
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="flex justify-end gap-2">
        <Button variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Reset to Defaults
        </Button>
        <Button>
          <Save className="h-4 w-4 mr-2" />
          Save Configuration
        </Button>
      </div>
    </div>
  );
}
