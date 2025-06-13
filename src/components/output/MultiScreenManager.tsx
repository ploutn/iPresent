import React, { useState, useEffect } from "react";
import { DisplayDevice, OutputSettings } from "../../types/outputManagement";
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
import { Badge } from "../ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Monitor,
  MonitorSpeaker,
  Tv,
  Smartphone,
  Tablet,
  Settings,
  RefreshCw,
  Eye,
  EyeOff,
  Maximize,
  Minimize,
  RotateCcw,
  Zap,
  Wifi,
  Cable,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from "lucide-react";

interface MultiScreenManagerProps {
  availableDisplays: DisplayDevice[];
  outputSettings: OutputSettings;
  updateOutputSettings: (settings: Partial<OutputSettings>) => void;
  refreshDisplays: () => void;
}

interface DisplayProfile {
  id: string;
  name: string;
  displays: string[];
  description: string;
}

interface DisplayCalibration {
  displayId: string;
  brightness: number;
  contrast: number;
  gamma: number;
  colorTemperature: number;
  rotation: number;
}

const DISPLAY_PROFILES: DisplayProfile[] = [
  {
    id: "single",
    name: "Single Display",
    displays: ["primary"],
    description: "Use only the primary display",
  },
  {
    id: "dual-extended",
    name: "Dual Extended",
    displays: ["primary", "secondary"],
    description: "Extend desktop across two displays",
  },
  {
    id: "dual-mirrored",
    name: "Dual Mirrored",
    displays: ["primary", "secondary"],
    description: "Mirror content on both displays",
  },
  {
    id: "triple-setup",
    name: "Triple Setup",
    displays: ["primary", "secondary", "tertiary"],
    description: "Three display configuration",
  },
  {
    id: "presentation-mode",
    name: "Presentation Mode",
    displays: ["primary", "projector"],
    description: "Optimized for presentations",
  },
];

function getDisplayIcon(display: DisplayDevice) {
  if (display.name.toLowerCase().includes("projector")) {
    return <MonitorSpeaker className="h-5 w-5" />;
  }
  if (display.name.toLowerCase().includes("tv")) {
    return <Tv className="h-5 w-5" />;
  }
  if (display.name.toLowerCase().includes("phone")) {
    return <Smartphone className="h-5 w-5" />;
  }
  if (display.name.toLowerCase().includes("tablet")) {
    return <Tablet className="h-5 w-5" />;
  }
  return <Monitor className="h-5 w-5" />;
}

function getConnectionIcon(display: DisplayDevice) {
  // Simulate connection type detection
  const isWireless =
    display.name.toLowerCase().includes("wireless") ||
    display.name.toLowerCase().includes("airplay") ||
    display.name.toLowerCase().includes("chromecast");

  return isWireless ? (
    <Wifi className="h-4 w-4" />
  ) : (
    <Cable className="h-4 w-4" />
  );
}

function getDisplayStatus(display: DisplayDevice) {
  if (display.isActive) {
    return {
      icon: <CheckCircle className="h-4 w-4 text-green-500" />,
      text: "Active",
      variant: "default" as const,
    };
  }

  // Simulate different status conditions
  const hasIssue = Math.random() > 0.8;
  if (hasIssue) {
    return {
      icon: <AlertTriangle className="h-4 w-4 text-yellow-500" />,
      text: "Warning",
      variant: "secondary" as const,
    };
  }

  return {
    icon: <XCircle className="h-4 w-4 text-gray-400" />,
    text: "Inactive",
    variant: "outline" as const,
  };
}

export function MultiScreenManager({
  availableDisplays,
  outputSettings,
  updateOutputSettings,
  refreshDisplays,
}: MultiScreenManagerProps) {
  const [selectedProfile, setSelectedProfile] = useState<string>("single");
  const [calibrationSettings, setCalibrationSettings] = useState<
    DisplayCalibration[]
  >([]);
  const [isCalibrating, setIsCalibrating] = useState(false);
  const [selectedDisplayForCalibration, setSelectedDisplayForCalibration] =
    useState<string>("");

  useEffect(() => {
    // Initialize calibration settings for all displays
    const initialCalibration = availableDisplays.map((display) => ({
      displayId: display.id,
      brightness: 100,
      contrast: 100,
      gamma: 2.2,
      colorTemperature: 6500,
      rotation: 0,
    }));
    setCalibrationSettings(initialCalibration);
  }, [availableDisplays]);

  const handleProfileChange = (profileId: string) => {
    setSelectedProfile(profileId);
    const profile = DISPLAY_PROFILES.find((p) => p.id === profileId);
    if (profile) {
      // Apply profile settings
      updateOutputSettings({
        ...outputSettings,
        // Update settings based on profile
      });
    }
  };

  const handleDisplayChange = (displayId: string) => {
    updateOutputSettings({ activeDisplay: displayId });
  };

  const handleResolutionChange = (displayId: string, resolution: string) => {
    updateOutputSettings({
      externalDisplays: outputSettings.externalDisplays.map((display) =>
        display.id === displayId ? { ...display, resolution } : display
      ),
    });
  };

  const handleDisplayToggle = (displayId: string, isActive: boolean) => {
    updateOutputSettings({
      externalDisplays: outputSettings.externalDisplays.map((display) =>
        display.id === displayId ? { ...display, isActive } : display
      ),
    });
  };

  const handleCalibrationChange = (
    displayId: string,
    setting: keyof DisplayCalibration,
    value: number
  ) => {
    setCalibrationSettings((prev) =>
      prev.map((cal) =>
        cal.displayId === displayId ? { ...cal, [setting]: value } : cal
      )
    );
  };

  const applyCalibration = (displayId: string) => {
    const calibration = calibrationSettings.find(
      (cal) => cal.displayId === displayId
    );
    if (calibration) {
      // Apply calibration settings to the display
      console.log(`Applying calibration to display ${displayId}:`, calibration);
    }
  };

  const testDisplay = (displayId: string) => {
    // Show test pattern on the selected display
    console.log(`Testing display ${displayId}`);
  };

  const handleFullscreenToggle = () => {
    const presentationElement = document.getElementById(
      "presentation-container"
    );
    if (!document.fullscreenElement && presentationElement) {
      presentationElement
        .requestFullscreen()
        .then(() => {
          updateOutputSettings({ fullscreen: true });
        })
        .catch((err) => {
          console.error("Error attempting to enable fullscreen:", err);
        });
    } else if (document.fullscreenElement) {
      document
        .exitFullscreen()
        .then(() => {
          updateOutputSettings({ fullscreen: false });
        })
        .catch((err) => {
          console.error("Error attempting to exit fullscreen:", err);
        });
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Multi-Screen Manager</h2>
          <p className="text-muted-foreground">
            Manage and configure multiple display outputs
          </p>
        </div>
        <Button onClick={refreshDisplays} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh Displays
        </Button>
      </div>

      <Tabs defaultValue="displays" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="displays">Display Management</TabsTrigger>
          <TabsTrigger value="profiles">Display Profiles</TabsTrigger>
          <TabsTrigger value="calibration">Calibration</TabsTrigger>
        </TabsList>

        {/* Display Management Tab */}
        <TabsContent value="displays" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableDisplays.map((display) => {
              const status = getDisplayStatus(display);
              return (
                <Card key={display.id} className="relative">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getDisplayIcon(display)}
                        <CardTitle className="text-lg">
                          {display.name}
                        </CardTitle>
                      </div>
                      <Badge
                        variant={status.variant}
                        className="flex items-center gap-1"
                      >
                        {status.icon}
                        {status.text}
                      </Badge>
                    </div>
                    <CardDescription className="flex items-center gap-2">
                      {getConnectionIcon(display)}
                      {display.resolution}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Enable Display</Label>
                      <Switch
                        checked={display.isActive}
                        onCheckedChange={(checked) =>
                          handleDisplayToggle(display.id, checked)
                        }
                      />
                    </div>

                    {display.isActive && (
                      <div className="space-y-3">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => testDisplay(display.id)}
                            className="flex-1"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Test
                          </Button>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="outline"
                                className="flex-1"
                              >
                                <Settings className="h-4 w-4 mr-1" />
                                Configure
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>
                                  Configure {display.name}
                                </DialogTitle>
                                <DialogDescription>
                                  Adjust display-specific settings
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="space-y-2">
                                  <Label>Resolution</Label>
                                  <Select
                                    value={display.resolution}
                                    onValueChange={(value) =>
                                      handleResolutionChange(display.id, value)
                                    }
                                  >
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="1920x1080">
                                        1920x1080
                                      </SelectItem>
                                      <SelectItem value="2560x1440">
                                        2560x1440
                                      </SelectItem>
                                      <SelectItem value="3840x2160">
                                        3840x2160
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="space-y-2">
                                  <Label>Refresh Rate</Label>
                                  <Select defaultValue="60">
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="30">30 Hz</SelectItem>
                                      <SelectItem value="60">60 Hz</SelectItem>
                                      <SelectItem value="120">
                                        120 Hz
                                      </SelectItem>
                                      <SelectItem value="144">
                                        144 Hz
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="space-y-2">
                                  <Label>Orientation</Label>
                                  <Select defaultValue="landscape">
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="landscape">
                                        Landscape
                                      </SelectItem>
                                      <SelectItem value="portrait">
                                        Portrait
                                      </SelectItem>
                                      <SelectItem value="landscape-flipped">
                                        Landscape (Flipped)
                                      </SelectItem>
                                      <SelectItem value="portrait-flipped">
                                        Portrait (Flipped)
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Common display management actions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm">
                  <Maximize className="h-4 w-4 mr-2" />
                  Extend All
                </Button>
                <Button variant="outline" size="sm">
                  <Minimize className="h-4 w-4 mr-2" />
                  Mirror All
                </Button>
                <Button variant="outline" size="sm">
                  <EyeOff className="h-4 w-4 mr-2" />
                  Disable All External
                </Button>
                <Button variant="outline" size="sm">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset Positions
                </Button>
                <Button variant="outline" size="sm">
                  <Zap className="h-4 w-4 mr-2" />
                  Auto-Configure
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Display Profiles Tab */}
        <TabsContent value="profiles" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {DISPLAY_PROFILES.map((profile) => (
              <Card
                key={profile.id}
                className={`cursor-pointer transition-colors ${
                  selectedProfile === profile.id
                    ? "ring-2 ring-primary bg-primary/5"
                    : "hover:bg-muted/50"
                }`}
                onClick={() => handleProfileChange(profile.id)}
              >
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {profile.name}
                    {selectedProfile === profile.id && (
                      <CheckCircle className="h-5 w-5 text-primary" />
                    )}
                  </CardTitle>
                  <CardDescription>{profile.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-1">
                    <span className="text-sm text-muted-foreground">
                      Displays:
                    </span>
                    <div className="flex gap-1">
                      {profile.displays.map((display, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="text-xs"
                        >
                          {display}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Custom Profile</CardTitle>
              <CardDescription>
                Create a custom display configuration
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Profile Name</Label>
                <Input placeholder="Enter profile name" />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Input placeholder="Enter profile description" />
              </div>
              <Button>Save Custom Profile</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Calibration Tab */}
        <TabsContent value="calibration" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Display Calibration</CardTitle>
              <CardDescription>
                Fine-tune display settings for optimal presentation quality
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Select Display for Calibration</Label>
                <Select
                  value={selectedDisplayForCalibration}
                  onValueChange={setSelectedDisplayForCalibration}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a display to calibrate" />
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

              {selectedDisplayForCalibration && (
                <div className="space-y-6 pt-4 border-t">
                  {calibrationSettings
                    .filter(
                      (cal) => cal.displayId === selectedDisplayForCalibration
                    )
                    .map((calibration) => (
                      <div key={calibration.displayId} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Brightness: {calibration.brightness}%</Label>
                            <input
                              type="range"
                              min="10"
                              max="100"
                              value={calibration.brightness}
                              onChange={(e) =>
                                handleCalibrationChange(
                                  calibration.displayId,
                                  "brightness",
                                  parseInt(e.target.value)
                                )
                              }
                              className="w-full"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Contrast: {calibration.contrast}%</Label>
                            <input
                              type="range"
                              min="50"
                              max="150"
                              value={calibration.contrast}
                              onChange={(e) =>
                                handleCalibrationChange(
                                  calibration.displayId,
                                  "contrast",
                                  parseInt(e.target.value)
                                )
                              }
                              className="w-full"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Gamma: {calibration.gamma}</Label>
                            <input
                              type="range"
                              min="1.8"
                              max="2.8"
                              step="0.1"
                              value={calibration.gamma}
                              onChange={(e) =>
                                handleCalibrationChange(
                                  calibration.displayId,
                                  "gamma",
                                  parseFloat(e.target.value)
                                )
                              }
                              className="w-full"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>
                              Color Temperature: {calibration.colorTemperature}K
                            </Label>
                            <input
                              type="range"
                              min="3000"
                              max="10000"
                              step="100"
                              value={calibration.colorTemperature}
                              onChange={(e) =>
                                handleCalibrationChange(
                                  calibration.displayId,
                                  "colorTemperature",
                                  parseInt(e.target.value)
                                )
                              }
                              className="w-full"
                            />
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            onClick={() =>
                              applyCalibration(calibration.displayId)
                            }
                            className="flex-1"
                          >
                            Apply Calibration
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => testDisplay(calibration.displayId)}
                            className="flex-1"
                          >
                            Test Pattern
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex items-center justify-between">
        <Label htmlFor="fullscreen">Fullscreen Mode</Label>
        <Button
          variant="outline"
          onClick={handleFullscreenToggle}
          className="flex items-center gap-2"
        >
          {outputSettings.fullscreen ? (
            <>
              <Minimize className="h-4 w-4" />
              Exit Fullscreen
            </>
          ) : (
            <>
              <Maximize className="h-4 w-4" />
              Enter Fullscreen
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
