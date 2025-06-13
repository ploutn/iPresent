import React, { useState } from "react";
import {
  StageDisplayTemplate,
  StageDisplayElement,
} from "@/types/stageDisplay";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Grid,
  Layout,
  Monitor,
  Split,
  Columns,
  Rows,
  Maximize2,
} from "lucide-react";

interface StageDisplayLayoutManagerProps {
  template: StageDisplayTemplate;
  onTemplateChange: (template: StageDisplayTemplate) => void;
  availableDisplays: { id: string; name: string; resolution: string }[];
}

const LAYOUT_PRESETS = {
  single: {
    name: "Single Display",
    description: "Full screen layout for single display",
    grid: { rows: 1, columns: 1 },
  },
  split: {
    name: "Split View",
    description: "Two equal sections",
    grid: { rows: 1, columns: 2 },
  },
  triple: {
    name: "Triple View",
    description: "Three equal sections",
    grid: { rows: 1, columns: 3 },
  },
  quad: {
    name: "Quad View",
    description: "Four equal sections",
    grid: { rows: 2, columns: 2 },
  },
  custom: {
    name: "Custom Layout",
    description: "Custom grid layout",
    grid: { rows: 1, columns: 1 },
  },
};

export function StageDisplayLayoutManager({
  template,
  onTemplateChange,
  availableDisplays,
}: StageDisplayLayoutManagerProps) {
  const [selectedPreset, setSelectedPreset] = useState<string>("single");
  const [gridConfig, setGridConfig] = useState({
    rows: 1,
    columns: 1,
    gap: 10,
  });

  const handlePresetChange = (preset: string) => {
    setSelectedPreset(preset);
    if (preset !== "custom") {
      const presetConfig =
        LAYOUT_PRESETS[preset as keyof typeof LAYOUT_PRESETS];
      setGridConfig({
        ...gridConfig,
        rows: presetConfig.grid.rows,
        columns: presetConfig.grid.columns,
      });
      applyLayout(presetConfig.grid.rows, presetConfig.grid.columns);
    }
  };

  const applyLayout = (rows: number, columns: number) => {
    const totalCells = rows * columns;
    const cellWidth = 1920 / columns;
    const cellHeight = 1080 / rows;

    const newElements: StageDisplayElement[] = [];

    // Create default elements for each cell
    for (let i = 0; i < totalCells; i++) {
      const row = Math.floor(i / columns);
      const col = i % columns;

      newElements.push({
        id: `cell-${i}`,
        type: "customText",
        x: col * cellWidth,
        y: row * cellHeight,
        width: cellWidth - gridConfig.gap,
        height: cellHeight - gridConfig.gap,
        isVisible: true,
        text: `Section ${i + 1}`,
        style: {
          backgroundColor: "rgba(0, 0, 0, 0.1)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          borderRadius: "4px",
          padding: "10px",
        },
      });
    }

    onTemplateChange({
      ...template,
      elements: newElements,
    });
  };

  const handleGridConfigChange = (
    key: keyof typeof gridConfig,
    value: number
  ) => {
    const newConfig = { ...gridConfig, [key]: value };
    setGridConfig(newConfig);
    if (selectedPreset === "custom") {
      applyLayout(newConfig.rows, newConfig.columns);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layout className="h-5 w-5" />
            Layout Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {Object.entries(LAYOUT_PRESETS).map(([key, preset]) => (
              <Button
                key={key}
                variant={selectedPreset === key ? "default" : "outline"}
                className="flex flex-col items-center gap-2 h-auto py-4"
                onClick={() => handlePresetChange(key)}
              >
                {key === "single" && <Maximize2 className="h-6 w-6" />}
                {key === "split" && <Split className="h-6 w-6" />}
                {key === "triple" && <Columns className="h-6 w-6" />}
                {key === "quad" && <Grid className="h-6 w-6" />}
                {key === "custom" && <Layout className="h-6 w-6" />}
                <span className="text-sm font-medium">{preset.name}</span>
                <span className="text-xs text-muted-foreground">
                  {preset.description}
                </span>
              </Button>
            ))}
          </div>

          {selectedPreset === "custom" && (
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Rows</Label>
                <Input
                  type="number"
                  min={1}
                  max={4}
                  value={gridConfig.rows}
                  onChange={(e) =>
                    handleGridConfigChange("rows", parseInt(e.target.value))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Columns</Label>
                <Input
                  type="number"
                  min={1}
                  max={4}
                  value={gridConfig.columns}
                  onChange={(e) =>
                    handleGridConfigChange("columns", parseInt(e.target.value))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Gap (px)</Label>
                <Input
                  type="number"
                  min={0}
                  max={50}
                  value={gridConfig.gap}
                  onChange={(e) =>
                    handleGridConfigChange("gap", parseInt(e.target.value))
                  }
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label>Target Display</Label>
            <Select
              value={template.targetDisplayId || "main"}
              onValueChange={(value) =>
                onTemplateChange({
                  ...template,
                  targetDisplayId: value,
                })
              }
            >
              <SelectTrigger>
                <SelectValue />
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
        </CardContent>
      </Card>
    </div>
  );
}
