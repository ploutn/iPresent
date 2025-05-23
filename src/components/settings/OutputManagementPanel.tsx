// src/components/OutputManagementPanel.tsx
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { VisualOutputMapping } from "../VisualOutputMapping";
import { StageDisplayEditor } from "../StageDisplayEditor";
import { StageDisplayTemplates } from "../StageDisplayTemplates";
import { StageDisplayPreview } from "../StageDisplayPreview"; // Added for live preview
import { useOutputManagement } from "../../hooks/useOutputManagement";
import { useStageDisplay } from "../../hooks/useStageDisplay";
import { useContentStore } from "../../stores/useContentStore";
import { DisplayDevice } from "../../types/outputManagement";
import { Button } from "../ui/button";
import {
  Monitor,
  Tv2,
  // Layers, // Removed as 'Templates' tab is removed from main TabsList
  LayoutTemplate, // Used by StageDisplayTemplates and potentially for a preview icon
  Eye,
  EyeOff,
  Pencil, // For Rename
  Copy, // For Duplicate
  Trash2, // For Delete
  PlusCircle, // For Create New
  Save, // For Save Template
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
    renameTemplate, // Added
    duplicateTemplate, // Added
    toggleStageDisplay,
    setTargetDisplay,
  } = useStageDisplay();
  const { items } = useContentStore(); // Removed currentItem and nextItem for preview
  const [activeTab, setActiveTab] = useState("outputs");

  // Handler for renaming a template
  const handleRenameTemplate = () => {
    if (!activeTemplate) return;
    const newName = prompt("Enter new template name:", activeTemplate.name);
    if (newName && newName.trim() !== "") {
      renameTemplate(activeTemplate.id, newName.trim());
    }
  };

  // Handler for duplicating a template
  const handleDuplicateTemplate = () => {
    if (!activeTemplate) return;
    duplicateTemplate(activeTemplate.id); // This hook function should handle making the new duplicate active
  };

  // Handler for creating a new template (prompts for name)
  const handleCreateNewTemplate = () => {
    const name = prompt("Enter new template name:", "New Template");
    if (name && name.trim() !== "") {
      const sourceTemplateForCloning = activeTemplate; // Capture current active template before creating a new one
      const newTemplateId = createTemplate(name.trim()); // Creates new, and hook should make it active

      // If a previous template was active and had elements, clone them to the new template
      if (
        sourceTemplateForCloning &&
        sourceTemplateForCloning.elements &&
        sourceTemplateForCloning.elements.length > 0
      ) {
        const newClonedTemplate = {
          id: newTemplateId, // ID of the template created by the hook
          name: name.trim(),
          elements: JSON.parse(
            JSON.stringify(sourceTemplateForCloning.elements)
          ).map((el: any) => ({ ...el, isVisible: el.isVisible !== false })), // Deep copy and ensure isVisible
          isDefault: false,
        };
        saveTemplate(newClonedTemplate); // Update the new template with cloned elements
      }
      // setActiveTemplate(newTemplateId); // Hook's createTemplate should ideally handle this, but ensure it's active
    }
  };

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
    // setActiveTemplate(newTemplateId); // The createTemplate hook should manage making the new template active
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
        <TabsList className="grid grid-cols-2 mx-6 mt-4">
          <TabsTrigger value="outputs" className="flex items-center">
            <Monitor className="h-4 w-4 mr-2" />
            Outputs
          </TabsTrigger>
          <TabsTrigger value="stage-display" className="flex items-center">
            <Tv2 className="h-4 w-4 mr-2" />
            Stage Display
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

          <TabsContent value="stage-display" className="h-full flex flex-col">
            <div className="flex flex-1 overflow-hidden">
              {/* Main Content Area (Left) */}
              <div className="flex-grow p-6 flex flex-col space-y-4 overflow-y-auto">
                {/* Target Display */}
                <div className="mb-2">
                  <label className="block text-sm font-medium mb-1">
                    Target Display for Stage View
                  </label>
                  <select
                    className="w-full p-2 rounded-md bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                    value={stageDisplayConfig.targetDisplayId || ""}
                    onChange={(e) => setTargetDisplay(e.target.value)}
                    disabled={!stageDisplayConfig.isActive}
                  >
                    <option value="">
                      {stageDisplayConfig.isActive
                        ? "Select a display"
                        : "Enable Stage Display first"}
                    </option>
                    {displayDevices.map((device: DisplayDevice) => (
                      <option key={device.id} value={device.id}>
                        {device.name}
                      </option>
                    ))}
                  </select>
                </div>

                {activeTemplate && (
                  <>
                    {/* Active Template Info & Actions */}
                    <div className="border-b border-t border-[#2D2D2D] py-3">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-md font-semibold">
                          Editing: {activeTemplate.name}
                        </h3>
                        <div className="flex items-center space-x-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleCreateNewTemplate}
                            title="Create New Template"
                          >
                            <PlusCircle className="h-4 w-4" />
                          </Button>
                          {/* Save button in StageDisplayEditor is primary for element changes. This global save might be for template metadata if any. */}
                          {/* <Button variant="outline" size="sm" onClick={() => saveTemplate(activeTemplate)} title="Save Current Template (metadata)">
                            <Save className="h-4 w-4" />
                          </Button> */}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleRenameTemplate}
                            title="Rename Template"
                            disabled={activeTemplate.isDefault}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleDuplicateTemplate}
                            title="Duplicate Template"
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                              if (
                                window.confirm(
                                  `Are you sure you want to delete template "${activeTemplate.name}"?`
                                )
                              ) {
                                deleteTemplate(activeTemplate.id);
                              }
                            }}
                            title="Delete Template"
                            disabled={
                              activeTemplate.isDefault ||
                              stageDisplayConfig.templates.length <= 1
                            }
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* StageDisplayEditor */}
                    <div className="flex-grow min-h-[400px]">
                      {" "}
                      {/* Added min-h for better layout */}
                      <StageDisplayEditor
                        key={activeTemplate.id} // Ensure re-render on template change
                        activeTemplate={activeTemplate}
                        onSaveTemplate={saveTemplate} // Editor handles element changes and calls this
                      />
                    </div>
                  </>
                )}
                {!activeTemplate && (
                  <div className="flex-grow flex items-center justify-center">
                    <p className="text-gray-500 dark:text-gray-400">
                      No template selected. Create or select one to begin.
                    </p>
                  </div>
                )}
              </div>

              {/* Right Sidebar */}
              <div className="w-1/3 min-w-[300px] max-w-[400px] p-6 border-l border-[#2D2D2D] flex flex-col space-y-4 overflow-y-auto">
                <h3 className="text-md font-semibold">Live Preview</h3>
                {activeTemplate ? (
                  <StageDisplayPreview
                    template={activeTemplate}
                    currentSlide={items[0]}
                    nextSlide={items[1]}
                    className="border border-gray-600 dark:border-gray-700"
                  />
                ) : (
                  <div className="aspect-video bg-gray-800/50 rounded-md flex items-center justify-center text-gray-400 border border-gray-600 dark:border-gray-700">
                    <p>No active template selected.</p>
                  </div>
                )}

                <h3 className="text-md font-semibold pt-4">Templates</h3>
                <StageDisplayTemplates
                  templates={stageDisplayConfig.templates}
                  onSelectTemplate={setActiveTemplate}
                  activeTemplateId={stageDisplayConfig.activeTemplateId}
                />
              </div>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
