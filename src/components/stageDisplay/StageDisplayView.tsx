import React, { useState } from "react";
import { useStageDisplay } from "@/hooks/useStageDisplay";
import { useOutputManagement } from "@/hooks/useOutputManagement";
import { StageDisplayConfigPanel } from "./StageDisplayConfigPanel";
import { StageDisplayPreview } from "./StageDisplayPreview";
import { StageDisplayLayoutManager } from "./StageDisplayLayoutManager";
import { MultiScreenManager } from "./MultiScreenManager";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Settings, Layout, Monitor } from "lucide-react";
import { StageDisplayTemplate, StageDisplayConfig } from "@/types/stageDisplay";
import { Slide } from "@/types/slide";

export function StageDisplayView() {
  const {
    stageDisplayConfig,
    activeTemplate,
    setActiveTemplate,
    updateStageDisplayConfig,
    exportTemplate,
    importTemplate,
    setTargetDisplayId,
    createTemplate,
    saveTemplate,
    deleteTemplate,
    renameTemplate,
    duplicateTemplate,
    toggleStageDisplay,
  } = useStageDisplay();

  const {
    screenState,
    outputSettings,
    availableDisplays,
    toggleMainScreen,
    toggleOutputWindow,
    toggleBlackout,
    toggleFullscreen,
    updateDisplayStatus,
    updateDisplayResolution,
    setActiveDisplay,
    updateOutputSettings,
    refreshDisplays,
  } = useOutputManagement();

  const [activeTab, setActiveTab] = useState("preview");

  const handleTemplateChange = (template: StageDisplayTemplate) => {
    saveTemplate(template);
  };

  const handleDisplayChange = (displayId: string, templateId: string) => {
    const template = stageDisplayConfig.templates.find(
      (t) => t.id === templateId
    );
    if (template) {
      saveTemplate({
        ...template,
        targetDisplayId: displayId,
      });
    }
  };

  const handleExportConfig = () => {
    const blob = new Blob([JSON.stringify(stageDisplayConfig, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "stage-display-config.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportConfig = async (file: File) => {
    try {
      const text = await file.text();
      const config = JSON.parse(text) as StageDisplayConfig;
      updateStageDisplayConfig(config);
    } catch (error) {
      console.error("Error importing config:", error);
    }
  };

  const handleConfigChange = (config: Partial<StageDisplayConfig>) => {
    updateStageDisplayConfig({
      ...stageDisplayConfig,
      ...config,
    });
  };

  const handlePreviewConfigChange = (template: StageDisplayTemplate) => {
    if (activeTemplate) {
      saveTemplate({
        ...activeTemplate,
        ...template,
      });
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Stage Display</h1>
        <div className="flex items-center gap-2">
          <Button
            variant={stageDisplayConfig.isActive ? "default" : "outline"}
            onClick={toggleStageDisplay}
          >
            {stageDisplayConfig.isActive ? "Stop Display" : "Start Display"}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="preview" className="flex items-center gap-2">
            <Monitor className="h-4 w-4" />
            Preview
          </TabsTrigger>
          <TabsTrigger value="layout" className="flex items-center gap-2">
            <Layout className="h-4 w-4" />
            Layout
          </TabsTrigger>
          <TabsTrigger value="config" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Configuration
          </TabsTrigger>
        </TabsList>

        <TabsContent value="preview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Stage Display Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <StageDisplayPreview
                template={activeTemplate}
                currentSlide={activeTemplate?.currentSlide}
                nextSlide={activeTemplate?.nextSlide}
                speakerNotes={activeTemplate?.speakerNotes}
                isPresenting={stageDisplayConfig.isActive}
                presentationTime={0}
                onConfigChange={handlePreviewConfigChange}
                className="w-full"
              />
            </CardContent>
          </Card>

          <MultiScreenManager
            templates={stageDisplayConfig.templates}
            availableDisplays={availableDisplays}
            onTemplateChange={handleTemplateChange}
            onDisplayChange={handleDisplayChange}
            onRefreshDisplays={refreshDisplays}
          />
        </TabsContent>

        <TabsContent value="layout" className="space-y-6">
          <StageDisplayLayoutManager
            template={activeTemplate}
            onTemplateChange={handleTemplateChange}
            availableDisplays={availableDisplays}
          />
        </TabsContent>

        <TabsContent value="config" className="space-y-6">
          <StageDisplayConfigPanel
            config={stageDisplayConfig}
            onConfigChange={handleConfigChange}
            exportTemplate={exportTemplate}
            importTemplate={importTemplate}
            availableDisplays={availableDisplays}
            onExportConfig={handleExportConfig}
            onImportConfig={handleImportConfig}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
