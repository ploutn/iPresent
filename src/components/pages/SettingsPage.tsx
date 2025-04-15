import React from "react";
import { ScrollArea } from "../ui/scroll-area";
import { Button } from "../ui/button";
import {
  Settings,
  Monitor,
  Laptop,
  Palette,
  Moon,
  Sun,
  Users,
  Database,
  Save,
  Maximize2,
  Tv,
  Clock,
  Play,
  LayoutTemplate,
  Tv2,
  Eye,
  EyeOff,
  Layers,
} from "lucide-react";
import { Input } from "../ui/input";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import { useOutputManagement } from "../../hooks/useOutputManagement";
import { useStageDisplay } from "../../hooks/useStageDisplay";
import { LivePresentation } from "../LivePresentation";
import { ScheduleView } from "../ScheduleView";
import { SlideEditorPanel } from "../SlideEditorPanel";
import { StageDisplayEditor } from "../StageDisplayEditor";
import { StageDisplayTemplates } from "../StageDisplayTemplates";
import { StageDisplayPreview } from "../StageDisplayPreview";
import { VisualOutputMapping } from "../VisualOutputMapping";
import { useContentStore } from "../../stores/useContentStore";
import { Slide } from "../../types";
import { DisplayDevice } from "../../types/outputManagement";

export function SettingsPage() {
  const {
    screenState,
    toggleMainScreen,
    toggleOutputDisplay,
    toggleBlackout,
    toggleFullscreen,
    outputSettings,
    setActiveDisplay,
  } = useOutputManagement();

  const {
    stageDisplayConfig,
    activeTemplate,
    setActiveTemplate,
    createTemplate,
    saveTemplate,
    deleteTemplate,
    toggleStageDisplay,
    setTargetDisplay,
  } = useStageDisplay();

  const { items } = useContentStore();
  const displayDevices = outputSettings.externalDisplays;
  const activeDevice = outputSettings.activeDisplay;

  // Add state for slide templates
  const [currentSlide, setCurrentSlide] = React.useState<Slide | undefined>();

  // Handle saving slide templates
  const handleSaveSlide = (slide: Slide) => {
    console.log("Saving slide template:", slide);
    // Here you would typically save to your store
  };

  // Handle assigning content to displays
  const handleAssignContent = (displayId: string, contentId: string) => {
    console.log(`Assigning content ${contentId} to display ${displayId}`);
    // In a real implementation, this would update the content shown on the display
  };

  // Handle creating a new stage display template
  const handleCreateTemplate = (name: string) => {
    const newTemplateId = createTemplate(name);
    // Clone elements from active template to new template
    const newTemplate = {
      ...activeTemplate,
      id: newTemplateId,
      name,
      isDefault: false,
    };
    saveTemplate(newTemplate);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-[#4A5568]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">Settings</h2>
          <Button className="bg-[#3182CE] hover:bg-[#2B6CB0]">
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>

        <Tabs defaultValue="display" className="w-full">
          <TabsList className="grid w-full grid-cols-7 bg-[#1A202C]">
            <TabsTrigger value="display">Display</TabsTrigger>
            <TabsTrigger value="stage-display">Stage Display</TabsTrigger>
            <TabsTrigger value="output-mapping">Output Mapping</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="data">Data</TabsTrigger>
          </TabsList>

          <ScrollArea className="flex-1 p-4">
            <TabsContent value="display" className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-white flex items-center gap-2">
                  <Monitor className="h-5 w-5" />
                  Display Settings
                </h3>

                <div className="space-y-4 pl-7">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="main-screen" className="text-white">
                        Main Screen
                      </Label>
                      <p className="text-xs text-[#A0AEC0]">
                        Control main display output
                      </p>
                    </div>
                    <Switch
                      id="main-screen"
                      checked={screenState.isMainScreenActive}
                      onCheckedChange={toggleMainScreen}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="output-display" className="text-white">
                        Output Display
                      </Label>
                      <p className="text-xs text-[#A0AEC0]">
                        Control secondary display output
                      </p>
                    </div>
                    <Switch
                      id="output-display"
                      checked={screenState.isOutputActive}
                      onCheckedChange={toggleOutputDisplay}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="blackout" className="text-white">
                        Blackout
                      </Label>
                      <p className="text-xs text-[#A0AEC0]">
                        Enable screen blackout
                      </p>
                    </div>
                    <Switch
                      id="blackout"
                      checked={screenState.isBlackout}
                      onCheckedChange={toggleBlackout}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="black-screen" className="text-white">
                        Black Screen on Start
                      </Label>
                      <p className="text-xs text-[#A0AEC0]">
                        Start with blank screen when launching
                      </p>
                    </div>
                    <Switch id="black-screen" />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="auto-advance" className="text-white">
                        Auto-advance Slides
                      </Label>
                      <p className="text-xs text-[#A0AEC0]">
                        Automatically move to next slide
                      </p>
                    </div>
                    <Switch id="auto-advance" />
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      className="flex-1 h-9 bg-transparent border border-[#4A5568] text-[#A0AEC0] hover:bg-[#2D3748]"
                      onClick={toggleFullscreen}
                    >
                      <Maximize2 className="h-4 w-4 mr-2" />
                      Fullscreen
                    </Button>
                    <Button className="flex-1 h-9 bg-transparent border border-[#4A5568] text-[#A0AEC0] hover:bg-[#2D3748]">
                      <Tv className="h-4 w-4 mr-2" />
                      Display Settings
                    </Button>
                  </div>
                </div>

                {/* Schedule Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-white flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Schedule
                  </h3>

                  <div className="pl-7">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs text-[#A0AEC0]">
                        Manage scheduled presentations
                      </p>
                      <Button className="h-8 text-xs bg-transparent border border-[#4A5568] text-[#A0AEC0] hover:bg-[#2D3748]">
                        <Clock className="h-3 w-3 mr-1" /> Add Schedule
                      </Button>
                    </div>
                    <div className="h-32 border border-[#4A5568] rounded-lg overflow-hidden bg-[#1A202C]">
                      <ScheduleView />
                    </div>
                  </div>
                </div>

                {/* Live Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-white flex items-center gap-2">
                    <Play className="h-5 w-5" />
                    Live Presentation
                  </h3>

                  <div className="pl-7">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs text-[#A0AEC0]">
                        Control live presentation
                      </p>
                      <Button className="h-8 text-xs bg-transparent border border-[#4A5568] text-[#A0AEC0] hover:bg-[#2D3748]">
                        <Play className="h-3 w-3 mr-1" /> Start Live
                      </Button>
                    </div>
                    <div className="h-32 border border-[#4A5568] rounded-lg overflow-hidden bg-[#1A202C]">
                      <LivePresentation />
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="templates" className="space-y-4">
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-white flex items-center gap-2">
                  <LayoutTemplate className="h-5 w-5" />
                  Slide Templates
                </h3>
                <p className="text-xs text-[#A0AEC0] pl-7">
                  Templates have been moved to their respective content
                  sections. You can now find announcement templates in the
                  Announcements page.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="appearance" className="space-y-4">
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-white flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Appearance
                </h3>

                <div className="space-y-4 pl-7">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="dark-mode" className="text-white">
                        Dark Mode
                      </Label>
                      <p className="text-xs text-[#A0AEC0]">
                        Toggle between light and dark themes
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Sun className="h-4 w-4 text-[#A0AEC0]" />
                      <Switch id="dark-mode" />
                      <Moon className="h-4 w-4 text-[#A0AEC0]" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="accent-color" className="text-white">
                      Accent Color
                    </Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="accent-color"
                        type="color"
                        value="#3182CE"
                        className="w-10 h-10 p-1"
                      />
                      <div className="grid grid-cols-6 gap-2">
                        {[
                          "#3182CE",
                          "#38A169",
                          "#DD6B20",
                          "#E53E3E",
                          "#805AD5",
                          "#D53F8C",
                        ].map((color) => (
                          <div
                            key={color}
                            className="w-6 h-6 rounded-full cursor-pointer"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="users" className="space-y-4">
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-white flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  User Management
                </h3>
                <p className="text-xs text-[#A0AEC0] pl-7">
                  Manage user accounts and permissions
                </p>
              </div>
            </TabsContent>

            <TabsContent value="data" className="space-y-4">
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-white flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Data Management
                </h3>
                <p className="text-xs text-[#A0AEC0] pl-7">
                  Manage application data and backups
                </p>
              </div>
            </TabsContent>

            <TabsContent value="stage-display" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-white flex items-center gap-2">
                  <Tv2 className="h-5 w-5" />
                  Stage Display
                </h3>
                <Button
                  variant={stageDisplayConfig.isActive ? "default" : "outline"}
                  size="sm"
                  onClick={toggleStageDisplay}
                  className="bg-[#3182CE] hover:bg-[#2B6CB0]"
                >
                  {stageDisplayConfig.isActive ? (
                    <>
                      <Eye className="h-4 w-4 mr-2" />
                      Stage Display On
                    </>
                  ) : (
                    <>
                      <EyeOff className="h-4 w-4 mr-2" />
                      Stage Display Off
                    </>
                  )}
                </Button>
              </div>

              <p className="text-xs text-[#A0AEC0] mb-4">
                Configure your stage display for presenters
              </p>

              <div className="mb-4">
                <Label className="text-white">Target Display</Label>
                <select
                  className="w-full p-2 mt-1 rounded-md bg-[#1A202C] border border-[#4A5568] text-white"
                  value={stageDisplayConfig.targetDisplayId || ""}
                  onChange={(e) => setTargetDisplay(e.target.value)}
                >
                  <option value="">Select a display</option>
                  {displayDevices.map((device: DisplayDevice) => (
                    <option key={device.id} value={device.id}>
                      {device.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2 border border-[#4A5568] rounded-lg overflow-hidden bg-[#1A202C] h-[500px]">
                  <StageDisplayEditor
                    activeTemplate={activeTemplate}
                    templates={stageDisplayConfig.templates}
                    onSaveTemplate={saveTemplate}
                    onSelectTemplate={setActiveTemplate}
                    onCreateTemplate={handleCreateTemplate}
                    onDeleteTemplate={deleteTemplate}
                  />
                </div>
                <div className="border border-[#4A5568] rounded-lg overflow-hidden bg-[#1A202C] p-4">
                  <h4 className="text-md font-medium text-white mb-2">
                    Preview
                  </h4>
                  <StageDisplayPreview
                    template={activeTemplate}
                    currentSlide={items[0]}
                    nextSlide={items[1]}
                    className="w-full"
                  />
                  <div className="mt-4">
                    <h4 className="text-md font-medium text-white mb-2">
                      Templates
                    </h4>
                    <div className="h-[200px] overflow-y-auto">
                      <StageDisplayTemplates
                        templates={stageDisplayConfig.templates}
                        onSelectTemplate={setActiveTemplate}
                        activeTemplateId={stageDisplayConfig.activeTemplateId}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="output-mapping" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-white flex items-center gap-2">
                  <Layers className="h-5 w-5" />
                  Output Mapping
                </h3>
              </div>

              <p className="text-xs text-[#A0AEC0] mb-4">
                Map content to different output displays
              </p>

              <div className="border border-[#4A5568] rounded-lg overflow-hidden bg-[#1A202C] p-4">
                <VisualOutputMapping
                  displayDevices={displayDevices}
                  activeDevice={activeDevice}
                  setActiveDevice={setActiveDisplay}
                  availableContent={items}
                  onAssignContent={handleAssignContent}
                />
              </div>
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </div>
    </div>
  );
}
