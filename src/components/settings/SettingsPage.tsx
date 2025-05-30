import React, { useState } from "react";
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion"; // Added Accordion imports
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "../ui/dialog"; // Added Dialog imports
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
import { useUISettingsStore } from "../../stores/useUISettingsStore";
import { Slide } from "../../types";
import { DisplayDevice } from "../../types/outputManagement";
import { MediaCacheStats } from "../media/MediaCacheStats";

export function SettingsPage(): JSX.Element {
  const [isCustomizeModalOpen, setIsCustomizeModalOpen] = useState(false);

  const toggleCustomizeModal = () => {
    setIsCustomizeModalOpen(!isCustomizeModalOpen);
    // Later, this will open/close the actual modal
    console.log("Customize modal state:", !isCustomizeModalOpen);
  };

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
  const { sections, toggleSectionVisibility, resetToDefaults } =
    useUISettingsStore();
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
  const handleCreateTemplate = (name: string): void => {
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

  const [activeSetting, setActiveSetting] = React.useState("display");

  const settingsOptions = [
    { id: "display", label: "Display", icon: <Monitor className="h-5 w-5" /> },
    {
      id: "stage-display",
      label: "Stage Display",
      icon: <Tv2 className="h-5 w-5" />,
    },
    {
      id: "output-mapping",
      label: "Output Mapping",
      icon: <Layers className="h-5 w-5" />,
    },
    {
      id: "appearance",
      label: "Appearance",
      icon: <Palette className="h-5 w-5" />,
    },
    {
      id: "templates",
      label: "Templates",
      icon: <LayoutTemplate className="h-5 w-5" />,
    },
    { id: "users", label: "Users", icon: <Users className="h-5 w-5" /> },
    { id: "data", label: "Data", icon: <Database className="h-5 w-5" /> },
    { id: "cache", label: "Cache", icon: <Database className="h-5 w-5" /> },
  ];

  const renderContent = () => {
    switch (activeSetting) {
      case "display":
        return (
          <div className="space-y-6">
            <Accordion
              type="multiple"
              defaultValue={["item-1", "item-2", "item-3"]}
              className="w-full space-y-4"
            >
              {/* Section 1: Screen Output Controls */}
              <AccordionItem
                value="item-1"
                className="border border-[#4A5568] rounded-lg bg-[#1A202C]"
              >
                <AccordionTrigger className="px-4 py-3 hover:no-underline">
                  <h4 className="text-md font-semibold text-white">
                    Screen Output Controls
                  </h4>
                </AccordionTrigger>
                <AccordionContent className="p-4 pt-0 space-y-4">
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
                </AccordionContent>
              </AccordionItem>

              {/* Section: Schedule Management (Conditionally Rendered) */}
              {sections.isScheduleManagementVisible && (
                <AccordionItem
                  value="item-schedule-management"
                  className="border border-[#4A5568] rounded-lg bg-[#1A202C]"
                >
                  <AccordionTrigger className="px-4 py-3 hover:no-underline">
                    <h4 className="text-md font-semibold text-white">
                      Schedule Management
                    </h4>
                  </AccordionTrigger>
                  <AccordionContent className="p-4 pt-0 space-y-4">
                    <p className="text-xs text-[#A0AEC0]">
                      Manage your presentation schedule.
                    </p>
                    {/* TODO: Add 'Add Schedule' button if needed */}
                    <ScheduleView />
                  </AccordionContent>
                </AccordionItem>
              )}

              {/* Section: Live Presentation Control (Conditionally Rendered) */}
              {sections.isLivePresentationControlVisible && (
                <AccordionItem
                  value="item-live-presentation"
                  className="border border-[#4A5568] rounded-lg bg-[#1A202C]"
                >
                  <AccordionTrigger className="px-4 py-3 hover:no-underline">
                    <h4 className="text-md font-semibold text-white">
                      Live Presentation Control
                    </h4>
                  </AccordionTrigger>
                  <AccordionContent className="p-4 pt-0 space-y-4">
                    <p className="text-xs text-[#A0AEC0]">
                      Control the live presentation flow.
                    </p>
                    {/* TODO: Add 'Start Live' button if needed */}
                    <LivePresentation />
                  </AccordionContent>
                </AccordionItem>
              )}
            </Accordion>
          </div>
        );
      case "templates":
        return (
          <>
            {sections.isTemplatesContentVisible && (
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
            )}
            {!sections.isTemplatesContentVisible && (
              <div className="text-center py-8">
                <p className="text-gray-500">
                  The Templates section is currently hidden. You can enable it
                  in the Appearance settings under Customize Interface.
                </p>
              </div>
            )}
          </>
        );
      case "appearance":
        return (
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

              {/* UI Customization Toggles */}
              <div className="space-y-2 pt-4 border-t border-gray-700 mt-4">
                <h4 className="text-sm font-medium text-white">
                  Customize Interface Sections
                </h4>
                {/* Display Tab Sections */}
                <div className="flex items-center justify-between">
                  <div>
                    <Label
                      htmlFor="show-schedule-management"
                      className="text-white"
                    >
                      Show Schedule Management (Display Tab)
                    </Label>
                    <p className="text-xs text-[#A0AEC0]">
                      Toggle visibility of the Schedule Management section.
                    </p>
                  </div>
                  <Switch
                    id="show-schedule-management"
                    checked={sections.isScheduleManagementVisible}
                    onCheckedChange={() =>
                      toggleSectionVisibility("isScheduleManagementVisible")
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label
                      htmlFor="show-live-presentation"
                      className="text-white"
                    >
                      Show Live Presentation Control (Display Tab)
                    </Label>
                    <p className="text-xs text-[#A0AEC0]">
                      Toggle visibility of the Live Presentation Control
                      section.
                    </p>
                  </div>
                  <Switch
                    id="show-live-presentation"
                    checked={sections.isLivePresentationControlVisible}
                    onCheckedChange={() =>
                      toggleSectionVisibility(
                        "isLivePresentationControlVisible"
                      )
                    }
                  />
                </div>
                {/* Output Mapping Tab Section */}
                <div className="flex items-center justify-between pt-2 mt-2 border-t border-gray-800">
                  <div>
                    <Label
                      htmlFor="show-output-mapping-content"
                      className="text-white"
                    >
                      Show Output Mapping Content
                    </Label>
                    <p className="text-xs text-[#A0AEC0]">
                      Toggle visibility of the Output Mapping tab content.
                    </p>
                  </div>
                  <Switch
                    id="show-output-mapping-content"
                    checked={sections.isOutputMappingContentVisible}
                    onCheckedChange={() =>
                      toggleSectionVisibility("isOutputMappingContentVisible")
                    }
                  />
                </div>
                {/* Templates Tab Section */}
                <div className="flex items-center justify-between pt-2 mt-2 border-t border-gray-800">
                  <div>
                    <Label
                      htmlFor="show-templates-content"
                      className="text-white"
                    >
                      Show Templates Content
                    </Label>
                    <p className="text-xs text-[#A0AEC0]">
                      Toggle visibility of the Templates tab content.
                    </p>
                  </div>
                  <Switch
                    id="show-templates-content"
                    checked={sections.isTemplatesContentVisible}
                    onCheckedChange={() =>
                      toggleSectionVisibility("isTemplatesContentVisible")
                    }
                  />
                </div>
                {/* Reset to Default Button */}
                <div className="flex items-center justify-end pt-4 mt-4 border-t border-gray-700">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (
                        window.confirm(
                          "Are you sure you want to reset all interface visibility settings to their defaults?"
                        )
                      ) {
                        resetToDefaults();
                      }
                    }}
                  >
                    Reset to Default Settings
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );
      case "users":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white flex items-center gap-2">
              <Users className="h-5 w-5" />
              User Management
            </h3>
            <p className="text-xs text-[#A0AEC0] pl-7">
              Manage user accounts and permissions
            </p>
          </div>
        );
      case "data":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white flex items-center gap-2">
              <Database className="h-5 w-5" />
              Data Management
            </h3>
            <p className="text-xs text-[#A0AEC0] pl-7">
              Manage application data and backups
            </p>
          </div>
        );
      case "cache":
        return (
          <div className="space-y-4">
            <MediaCacheStats />
          </div>
        );
      case "stage-display":
        return (
          <div className="space-y-4">
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
                  onSaveTemplate={saveTemplate}
                />
              </div>
              <div className="border border-[#4A5568] rounded-lg overflow-hidden bg-[#1A202C] p-4">
                <h4 className="text-md font-medium text-white mb-2">Preview</h4>
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

              {/* UI Customization Toggles - TO BE MOVED */}
              {/*
              <div className="space-y-2 pt-4 border-t border-gray-700 mt-4">
                <h4 className="text-sm font-medium text-white">
                  Customize Display Tab Sections
                </h4>
                <div className="flex items-center justify-between">
                  <div>
                    <Label
                      htmlFor="show-schedule-management"
                      className="text-white"
                    >
                      Show Schedule Management
                    </Label>
                    <p className="text-xs text-[#A0AEC0]">
                      Toggle visibility of the Schedule Management section in
                      the Display tab.
                    </p>
                  </div>
                  <Switch
                    id="show-schedule-management"
                    checked={sections.isScheduleManagementVisible}
                    onCheckedChange={() =>
                      toggleSectionVisibility(
                        "isScheduleManagementVisible"
                      )
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label
                      htmlFor="show-live-presentation-control"
                      className="text-white"
                    >
                      Show Live Presentation Control
                    </Label>
                    <p className="text-xs text-[#A0AEC0]">
                      Toggle visibility of the Live Presentation Control
                      section in the Display tab.
                    </p>
                  </div>
                  <Switch
                    id="show-live-presentation-control"
                    checked={sections.isLivePresentationControlVisible}
                    onCheckedChange={() =>
                      toggleSectionVisibility(
                        "isLivePresentationControlVisible"
                      )
                    }
                  />
                </div>
              </div>
              */}
            </div>
          </div>
        );
      case "output-mapping":
        return (
          <>
            {sections.isOutputMappingContentVisible && (
              <div className="space-y-4">
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
              </div>
            )}
            {!sections.isOutputMappingContentVisible && (
              <div className="text-center py-8">
                <p className="text-gray-500">
                  The Output Mapping section is currently hidden. You can enable
                  it in the Appearance settings under Customize Interface.
                </p>
              </div>
            )}
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#2D3748]">
      {/* Header */}
      <div className="p-4 border-b border-[#4A5568] bg-[#1A202C]">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">Settings</h2>
          <Button className="bg-[#3182CE] hover:bg-[#2B6CB0]">
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <nav className="w-64 bg-[#1E293B] p-6 space-y-4 border-r border-[#2D2D2D]">
          <div className="p-0 border-b border-[#2D2D2D] flex justify-between items-center mb-6 pb-6">
            <h2 className="text-xl font-bold">SETTINGS</h2>
            <Button
              variant="outline"
              size="icon"
              onClick={toggleCustomizeModal}
              title="Customize Interface"
            >
              <Palette className="h-5 w-5" />
            </Button>
          </div>
          <nav className="space-y-1">
            {settingsOptions.map((option) => (
              <Button
                key={option.id}
                variant="ghost"
                className={`w-full justify-start px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-3 ${
                  activeSetting === option.id
                    ? "bg-[#3182CE] text-white"
                    : "text-gray-300 hover:bg-[#2D3748] hover:text-white"
                }`}
                onClick={() => setActiveSetting(option.id)}
              >
                {option.icon}
                <span>{option.label}</span>
              </Button>
            ))}
          </nav>
        </nav>

        {/* Main Content Area */}

        {/* Main Content Area */}
        <ScrollArea className="flex-1 p-6">{renderContent()}</ScrollArea>

        <Dialog
          open={isCustomizeModalOpen}
          onOpenChange={setIsCustomizeModalOpen}
        >
          <DialogContent className="sm:max-w-[425px] bg-[#1E293B] border-[#2D2D2D] text-white">
            <DialogHeader>
              <DialogTitle className="text-white">
                Customize Interface
              </DialogTitle>
              <DialogDescription className="text-gray-400">
                Toggle visibility of different UI elements to personalize your
                workspace.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-4">
              {/* Moved UI Customization Toggles */}
              <div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label
                      htmlFor="modal-show-schedule-management"
                      className="text-white"
                    >
                      Show Schedule Management
                    </Label>
                    <p className="text-xs text-gray-400">
                      Toggle visibility of the Schedule Management section in
                      the Display tab.
                    </p>
                  </div>
                  <Switch
                    id="modal-show-schedule-management"
                    checked={sections.isScheduleManagementVisible}
                    onCheckedChange={() =>
                      toggleSectionVisibility("isScheduleManagementVisible")
                    }
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label
                      htmlFor="modal-show-live-presentation-control"
                      className="text-white"
                    >
                      Show Live Presentation Control
                    </Label>
                    <p className="text-xs text-gray-400">
                      Toggle visibility of the Live Presentation Control section
                      in the Display tab.
                    </p>
                  </div>
                  <Switch
                    id="modal-show-live-presentation-control"
                    checked={sections.isLivePresentationControlVisible}
                    onCheckedChange={() =>
                      toggleSectionVisibility(
                        "isLivePresentationControlVisible"
                      )
                    }
                  />
                </div>
              </div>
              {/* End of Moved Toggles */}
            </div>
            <DialogFooter className="sm:justify-start">
              <DialogClose asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="text-white border-gray-500 hover:bg-gray-700 hover:text-white"
                >
                  Close
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
