// src/components/OutputManagementPanel.tsx
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { VisualOutputMapping } from "./VisualOutputMapping";
import { StageDisplayEditor } from "./StageDisplayEditor";
import { StageDisplayTemplates } from "./StageDisplayTemplates";
import { useOutputManagement } from "../hooks/useOutputManagement";
import { useStageDisplay } from "../hooks/useStageDisplay";
import { useContentStore } from "../stores/useContentStore";
import { DisplayDevice } from "../types/outputManagement";
import { Button } from "./ui/button";
import {
  Monitor,
  Tv2,
  Layers,
  LayoutTemplate,
  Eye,
  EyeOff,
} from "lucide-react";

interface OutputManagementPanelProps {
  className?: string;
}

export function OutputManagementPanel({
  className = "",
}: OutputManagementPanelProps) {
  const { outputSettings, setActiveDisplay } = useOutputManagement();
  const displayDevices = outputSettings.externalDisplays;
  const activeDevice = outputSettings.activeDisplay;
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
  const [activeTab, setActiveTab] = useState("outputs");

  const handleAssignContent = (displayId: string, contentId: string) => {
    // In a real implementation, this would update the content shown on the display
    console.log(`Assigning content ${contentId} to display ${displayId}`);
  };

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
    <div className={`flex flex-col h-full ${className}`}>
      <div className="p-6 border-b border-[#2D2D2D] flex justify-between items-center">
        <h2 className="text-lg font-semibold">OUTPUT MANAGEMENT</h2>
        <div className="flex items-center space-x-2">
          <Button
            variant={stageDisplayConfig.isActive ? "default" : "outline"}
            size="sm"
            onClick={toggleStageDisplay}
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
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="flex-1 flex flex-col"
      >
        <TabsList className="grid grid-cols-3 mx-6 mt-4">
          <TabsTrigger value="outputs" className="flex items-center">
            <Monitor className="h-4 w-4 mr-2" />
            Outputs
          </TabsTrigger>
          <TabsTrigger value="stage-display" className="flex items-center">
            <Tv2 className="h-4 w-4 mr-2" />
            Stage Display
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex items-center">
            <LayoutTemplate className="h-4 w-4 mr-2" />
            Templates
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-auto">
          <TabsContent value="outputs" className="p-6 h-full">
            <VisualOutputMapping
              displayDevices={displayDevices}
              activeDevice={activeDevice}
              setActiveDevice={setActiveDisplay}
              availableContent={items}
              onAssignContent={handleAssignContent}
            />
          </TabsContent>

          <TabsContent value="stage-display" className="p-6 h-full">
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Target Display
              </label>
              <select
                className="w-full p-2 rounded-md bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
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

            <StageDisplayEditor
              activeTemplate={activeTemplate}
              templates={stageDisplayConfig.templates}
              onSaveTemplate={saveTemplate}
              onSelectTemplate={setActiveTemplate}
              onCreateTemplate={handleCreateTemplate}
              onDeleteTemplate={deleteTemplate}
            />
          </TabsContent>

          <TabsContent value="templates" className="h-full">
            <StageDisplayTemplates
              templates={stageDisplayConfig.templates}
              onSelectTemplate={setActiveTemplate}
              activeTemplateId={stageDisplayConfig.activeTemplateId}
            />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
