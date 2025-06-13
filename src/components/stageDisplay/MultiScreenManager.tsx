import React, { useState } from "react";
import { StageDisplayTemplate } from "@/types/stageDisplay";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Label } from "../ui/label";
import { Monitor, Plus, Trash2, RefreshCw } from "lucide-react";
import { StageDisplayPreview } from "./StageDisplayPreview";

interface MultiScreenManagerProps {
  templates: StageDisplayTemplate[];
  availableDisplays: { id: string; name: string; resolution: string }[];
  onTemplateChange: (template: StageDisplayTemplate) => void;
  onDisplayChange: (displayId: string, templateId: string) => void;
  onRefreshDisplays: () => void;
}

export function MultiScreenManager({
  templates,
  availableDisplays,
  onTemplateChange,
  onDisplayChange,
  onRefreshDisplays,
}: MultiScreenManagerProps) {
  const [selectedDisplay, setSelectedDisplay] = useState<string>(
    availableDisplays[0]?.id || ""
  );

  const handleDisplayChange = (displayId: string) => {
    setSelectedDisplay(displayId);
  };

  const handleTemplateAssignment = (templateId: string) => {
    onDisplayChange(selectedDisplay, templateId);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Monitor className="h-5 w-5" />
              Multi-Screen Management
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={onRefreshDisplays}
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh Displays
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Display Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableDisplays.map((display) => (
              <Card
                key={display.id}
                className={cn(
                  "cursor-pointer transition-colors",
                  selectedDisplay === display.id
                    ? "border-primary"
                    : "hover:border-muted-foreground"
                )}
                onClick={() => handleDisplayChange(display.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Monitor className="h-5 w-5" />
                    <div>
                      <h3 className="font-medium">{display.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {display.resolution}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Template Assignment */}
          {selectedDisplay && (
            <div className="space-y-4">
              <Label>Assign Template</Label>
              <Select
                value={
                  templates.find((t) => t.targetDisplayId === selectedDisplay)
                    ?.id || ""
                }
                onValueChange={handleTemplateAssignment}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a template" />
                </SelectTrigger>
                <SelectContent>
                  {templates.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Preview */}
          {selectedDisplay && (
            <div className="space-y-2">
              <Label>Preview</Label>
              <div className="border rounded-lg overflow-hidden">
                <StageDisplayPreview
                  template={
                    templates.find(
                      (t) => t.targetDisplayId === selectedDisplay
                    ) || templates[0]
                  }
                  className="w-full"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}
