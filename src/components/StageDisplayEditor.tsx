// src/components/StageDisplayEditor.tsx
import React, { useState, useRef, useEffect } from "react";
import {
  StageDisplayElement,
  StageDisplayElementType,
  StageDisplayTemplate,
} from "../types/stageDisplay";
import { v4 as uuidv4 } from "uuid";
import {
  Clock,
  Type,
  FileText,
  ArrowRight,
  Timer,
  Trash2,
  Save,
  Plus,
  Eye,
  EyeOff,
} from "lucide-react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select"; // Added for font selection

interface StageDisplayEditorProps {
  activeTemplate: StageDisplayTemplate;
  // templates, onSelectTemplate, onCreateTemplate, onDeleteTemplate are removed as they are handled by OutputManagementPanel
  onSaveTemplate: (template: StageDisplayTemplate) => void;
}

interface ElementToolbarProps {
  onAddElement: (type: StageDisplayElementType) => void;
}

const ElementToolbar = ({ onAddElement }: ElementToolbarProps) => {
  const elements: {
    type: StageDisplayElementType;
    icon: React.ReactNode;
    label: string;
  }[] = [
    {
      type: "currentSlide",
      icon: <FileText className="h-4 w-4" />,
      label: "Current Slide",
    },
    {
      type: "nextSlide",
      icon: <ArrowRight className="h-4 w-4" />,
      label: "Next Slide",
    },
    { type: "clock", icon: <Clock className="h-4 w-4" />, label: "Clock" },
    { type: "timer", icon: <Timer className="h-4 w-4" />, label: "Timer" }, // This is a generic timer, distinct from Countdown
    {
      type: "customText",
      icon: <Type className="h-4 w-4" />,
      label: "Custom Text",
    },
    {
      type: "countdownTimer",
      icon: <Timer className="h-4 w-4 text-orange-500" />, // Differentiate icon if possible
      label: "Countdown",
    },
    {
      type: "announcementBanner",
      icon: <FileText className="h-4 w-4 text-green-500" />, // Differentiate icon
      label: "Banner",
    },
  ];

  return (
    <div className="flex flex-wrap gap-2 mb-4 p-2 bg-gray-100 dark:bg-gray-800 rounded-md">
      {elements.map((element) => (
        <Button
          key={element.type}
          variant="outline"
          size="sm"
          onClick={() => onAddElement(element.type)}
          className="flex items-center gap-2"
        >
          {element.icon}
          <span>{element.label}</span>
        </Button>
      ))}
    </div>
  );
};

interface ElementPropertiesPanelProps {
  selectedElement: StageDisplayElement | null;
  onUpdateElement: (updatedElement: StageDisplayElement) => void;
  onDeleteElement: (elementId: string) => void;
}

const ElementPropertiesPanel = ({
  selectedElement,
  onUpdateElement,
  onDeleteElement,
}: ElementPropertiesPanelProps) => {
  if (!selectedElement) {
    return (
      <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-md">
        <p className="text-center text-gray-500 dark:text-gray-400">
          Select an element to edit its properties
        </p>
      </div>
    );
  }

  const handleChange = (property: keyof StageDisplayElement, value: any) => {
    onUpdateElement({ ...selectedElement, [property]: value });
  };

  return (
    <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-md space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-medium capitalize">{selectedElement.type}</h3>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => onDeleteElement(selectedElement.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="x-position">X Position (%)</Label>
          <Input
            id="x-position"
            type="number"
            min="0"
            max="100"
            value={selectedElement.x}
            onChange={(e) => handleChange("x", Number(e.target.value))}
          />
        </div>
        <div>
          <Label htmlFor="y-position">Y Position (%)</Label>
          <Input
            id="y-position"
            type="number"
            min="0"
            max="100"
            value={selectedElement.y}
            onChange={(e) => handleChange("y", Number(e.target.value))}
          />
        </div>
        <div>
          <Label htmlFor="width">Width (%)</Label>
          <Input
            id="width"
            type="number"
            min="1"
            max="100"
            value={selectedElement.width}
            onChange={(e) => handleChange("width", Number(e.target.value))}
          />
        </div>
        <div>
          <Label htmlFor="height">Height (%)</Label>
          <Input
            id="height"
            type="number"
            min="1"
            max="100"
            value={selectedElement.height}
            onChange={(e) => handleChange("height", Number(e.target.value))}
          />
        </div>
      </div>

      {/* Font Family Selection for text-based elements */}
      {(selectedElement.type === "customText" ||
        selectedElement.type === "currentSlide" ||
        selectedElement.type === "nextSlide" ||
        selectedElement.type === "countdownTimer" ||
        selectedElement.type === "announcementBanner") && (
        <div>
          <Label htmlFor="font-family">Font Family</Label>
          <Select
            value={selectedElement.fontFamily || "Arial"}
            onValueChange={(value) => handleChange("fontFamily", value)}
          >
            <SelectTrigger id="font-family">
              <SelectValue placeholder="Select font" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Arial">Arial</SelectItem>
              <SelectItem value="Verdana">Verdana</SelectItem>
              <SelectItem value="Times New Roman">Times New Roman</SelectItem>
              <SelectItem value="Courier New">Courier New</SelectItem>
              <SelectItem value="Georgia">Georgia</SelectItem>
              <SelectItem value="Palatino">Palatino</SelectItem>
              <SelectItem value="Garamond">Garamond</SelectItem>
              <SelectItem value="Comic Sans MS">Comic Sans MS</SelectItem>
              <SelectItem value="Impact">Impact</SelectItem>
              <SelectItem value="Lucida Console">Lucida Console</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Text Alignment Controls for text-based elements */}
      {(selectedElement.type === "customText" ||
        selectedElement.type === "currentSlide" ||
        selectedElement.type === "nextSlide" ||
        selectedElement.type === "countdownTimer" ||
        selectedElement.type === "announcementBanner") && (
        <div>
          <Label htmlFor="text-align">Text Alignment</Label>
          <div className="flex gap-1 mt-1">
            {(["left", "center", "right", "justify"] as const).map((align) => (
              <Button
                key={align}
                variant={
                  selectedElement.textAlign === align ? "default" : "outline"
                }
                size="sm"
                onClick={() => handleChange("textAlign", align)}
                className="flex-1"
              >
                {align.charAt(0).toUpperCase() + align.slice(1)}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Advanced Text Styling for text-based elements */}
      {(selectedElement.type === "customText" ||
        selectedElement.type === "currentSlide" ||
        selectedElement.type === "nextSlide" ||
        selectedElement.type === "countdownTimer" ||
        selectedElement.type === "announcementBanner") && (
        <div>
          <Label>Text Styling</Label>
          <div className="flex gap-1 mt-1">
            <Button
              variant={
                selectedElement.fontWeight === "bold" ? "default" : "outline"
              }
              size="sm"
              onClick={() =>
                handleChange(
                  "fontWeight",
                  selectedElement.fontWeight === "bold" ? "normal" : "bold"
                )
              }
              className="flex-1"
            >
              Bold
            </Button>
            <Button
              variant={
                selectedElement.fontStyle === "italic" ? "default" : "outline"
              }
              size="sm"
              onClick={() =>
                handleChange(
                  "fontStyle",
                  selectedElement.fontStyle === "italic" ? "normal" : "italic"
                )
              }
              className="flex-1"
            >
              Italic
            </Button>
            <Button
              variant={
                selectedElement.textDecoration === "underline"
                  ? "default"
                  : "outline"
              }
              size="sm"
              onClick={() =>
                handleChange(
                  "textDecoration",
                  selectedElement.textDecoration === "underline"
                    ? "none"
                    : "underline"
                )
              }
              className="flex-1"
            >
              Underline
            </Button>
          </div>
        </div>
      )}

      {selectedElement.type === "customText" && (
        <div>
          <Label htmlFor="text-content">Text Content</Label>
          <Input
            id="text-content"
            value={selectedElement.text || ""} // Changed from content to text
            onChange={(e) => handleChange("text", e.target.value)}
          />
        </div>
      )}

      {/* Countdown Timer Properties */}
      {selectedElement.type === "countdownTimer" && (
        <>
          <div>
            <Label htmlFor="timer-title">Timer Title</Label>
            <Input
              id="timer-title"
              value={selectedElement.timerTitle || ""}
              onChange={(e) => handleChange("timerTitle", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="duration-seconds">Duration (seconds)</Label>
            <Input
              id="duration-seconds"
              type="number"
              min="1"
              value={selectedElement.durationSeconds || 60}
              onChange={(e) =>
                handleChange("durationSeconds", Number(e.target.value))
              }
            />
          </div>
          <div>
            <Label htmlFor="timer-end-message">End Message</Label>
            <Input
              id="timer-end-message"
              value={selectedElement.timerEndMessage || ""}
              onChange={(e) => handleChange("timerEndMessage", e.target.value)}
            />
          </div>
        </>
      )}

      {/* Announcement Banner Properties */}
      {selectedElement.type === "announcementBanner" && (
        <>
          <div>
            <Label htmlFor="banner-text">Banner Text</Label>
            <Input
              id="banner-text"
              value={selectedElement.bannerText || ""}
              onChange={(e) => handleChange("bannerText", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="scroll-speed">Scroll Speed</Label>
            <select
              id="scroll-speed"
              value={selectedElement.scrollSpeed || "medium"}
              onChange={(e) =>
                handleChange(
                  "scrollSpeed",
                  e.target.value as "slow" | "medium" | "fast"
                )
              }
              className="w-full p-2 border rounded-md bg-white dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="slow">Slow</option>
              <option value="medium">Medium</option>
              <option value="fast">Fast</option>
            </select>
          </div>
          <div>
            <Label htmlFor="banner-direction">Scroll Direction</Label>
            <select
              id="banner-direction"
              value={selectedElement.bannerDirection || "left-to-right"}
              onChange={(e) =>
                handleChange(
                  "bannerDirection",
                  e.target.value as "left-to-right" | "right-to-left"
                )
              }
              className="w-full p-2 border rounded-md bg-white dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="left-to-right">Left to Right</option>
              <option value="right-to-left">Right to Left</option>
            </select>
          </div>
        </>
      )}

      <div>
        <Label htmlFor="bg-color">Background Color</Label>
        <div className="flex gap-2">
          <Input
            id="bg-color"
            type="color"
            value={selectedElement.backgroundColor || "#000000"}
            onChange={(e) => handleChange("backgroundColor", e.target.value)}
            className="w-12 h-8 p-1"
          />
          <Input
            type="text"
            value={selectedElement.backgroundColor || "#000000"}
            onChange={(e) => handleChange("backgroundColor", e.target.value)}
            className="flex-1"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="font-color">Font Color</Label>
        <div className="flex gap-2">
          <Input
            id="font-color"
            type="color"
            value={selectedElement.fontColor || "#ffffff"}
            onChange={(e) => handleChange("fontColor", e.target.value)}
            className="w-12 h-8 p-1"
          />
          <Input
            type="text"
            value={selectedElement.fontColor || "#ffffff"}
            onChange={(e) => handleChange("fontColor", e.target.value)}
            className="flex-1"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="font-size">Font Size (px)</Label>
        <Input
          id="font-size"
          type="number"
          min="8"
          max="72"
          value={selectedElement.fontSize || 16}
          onChange={(e) => handleChange("fontSize", Number(e.target.value))}
        />
      </div>

      <div>
        <Label htmlFor="border-radius">Border Radius (px)</Label>
        <Input
          id="border-radius"
          type="number"
          min="0"
          max="50"
          value={selectedElement.borderRadius || 0}
          onChange={(e) => handleChange("borderRadius", Number(e.target.value))}
        />
      </div>

      <div>
        <Label htmlFor="isVisible" className="flex items-center">
          <Input
            id="isVisible"
            type="checkbox"
            checked={selectedElement.isVisible !== false} // Default to true if undefined
            onChange={(e) => handleChange("isVisible", e.target.checked)}
            className="mr-2 h-4 w-4"
          />
          Visible
        </Label>
      </div>

      <div>
        <Label htmlFor="z-index">Z-Index</Label>
        <Input
          id="z-index"
          type="number"
          min="0"
          max="100"
          value={selectedElement.zIndex || 0}
          onChange={(e) => handleChange("zIndex", Number(e.target.value))}
        />
      </div>
    </div>
  );
};

interface TemplateListProps {
  templates: StageDisplayTemplate[];
  activeTemplateId: string;
  onSelectTemplate: (templateId: string) => void;
  onCreateTemplate: () => void;
}

const TemplateList = ({
  templates,
  activeTemplateId,
  onSelectTemplate,
  onCreateTemplate,
}: TemplateListProps) => {
  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-medium">Templates</h3>
        <Button variant="outline" size="sm" onClick={onCreateTemplate}>
          <Plus className="h-4 w-4 mr-1" /> New Template
        </Button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {templates.map((template) => (
          <div
            key={template.id}
            className={`p-2 border rounded-md cursor-pointer ${
              template.id === activeTemplateId
                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                : "border-gray-200 dark:border-gray-700"
            }`}
            onClick={() => onSelectTemplate(template.id)}
          >
            <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded mb-2 flex items-center justify-center">
              {template.previewImage ? (
                <img
                  src={template.previewImage}
                  alt={template.name}
                  className="w-full h-full object-cover rounded"
                />
              ) : (
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  No Preview
                </span>
              )}
            </div>
            <p className="text-sm font-medium truncate">{template.name}</p>
            {template.isDefault && (
              <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-1.5 py-0.5 rounded-full">
                Default
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export function StageDisplayEditor({
  activeTemplate,
  onSaveTemplate,
}: StageDisplayEditorProps) {
  const [selectedElementId, setSelectedElementId] = useState<string | null>(
    null
  );
  const [isCreatingTemplate, setIsCreatingTemplate] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState("");
  const [elements, setElements] = useState<StageDisplayElement[]>(
    activeTemplate.elements
  );
  const canvasRef = useRef<HTMLDivElement>(null);
  const [draggedElement, setDraggedElement] = useState<{
    id: string;
    startX: number;
    startY: number;
  } | null>(null);

  // Update elements when active template changes
  useEffect(() => {
    setElements(activeTemplate.elements);
    setSelectedElementId(null);
  }, [activeTemplate]);

  const selectedElement =
    elements.find((el) => el.id === selectedElementId) || null;

  const handleAddElement = (type: StageDisplayElementType) => {
    const newElement: StageDisplayElement = {
      id: uuidv4(),
      type,
      x: 10,
      y: 10,
      width: 30,
      height: type === "clock" || type === "timer" ? 10 : 30,
      zIndex: elements.length,
      isVisible: true, // Default to visible
      fontFamily: "Arial", // Default font family
      textAlign: "left", // Default text align
      fontWeight: "normal",
      fontStyle: "normal",
      textDecoration: "none",
    };

    if (type === "customText") {
      newElement.text = "Custom Text"; // Changed from content to text
      newElement.fontSize = 16;
      newElement.fontColor = "#ffffff";
      newElement.fontFamily = "Arial"; // Default font
    }

    if (type === "countdownTimer") {
      newElement.durationSeconds = 300; // Default 5 minutes
      newElement.timerTitle = "Countdown";
      newElement.timerEndMessage = "Time's Up!";
      newElement.fontSize = 24;
      newElement.fontColor = "#ffffff";
      newElement.fontFamily = "Arial"; // Default font
      newElement.backgroundColor = "rgba(0,0,0,0.5)";
      newElement.height = 15;
    }

    if (type === "announcementBanner") {
      newElement.bannerText = "This is an announcement!";
      newElement.scrollSpeed = "medium";
      newElement.bannerDirection = "left-to-right";
      newElement.fontSize = 20;
      newElement.fontColor = "#ffffff";
      newElement.backgroundColor = "rgba(0,0,0,0.7)";
      newElement.height = 10;
      newElement.fontFamily = "Arial"; // Default font
    }

    if (type === "currentSlide" || type === "nextSlide") {
      newElement.backgroundColor = "#000000";
      newElement.fontColor = "#ffffff";
      newElement.fontFamily = "Arial"; // Default font
    }

    setElements([...elements, newElement]);
    setSelectedElementId(newElement.id);
  };

  const handleUpdateElement = (updatedElement: StageDisplayElement) => {
    setElements(
      elements.map((el) => (el.id === updatedElement.id ? updatedElement : el))
    );
  };

  const handleDeleteElement = (elementId: string) => {
    setElements(elements.filter((el) => el.id !== elementId));
    setSelectedElementId(null);
  };

  const handleSaveTemplate = () => {
    onSaveTemplate({
      ...activeTemplate,
      elements,
    });
  };

  // Removed handleCreateNewTemplate as it's now handled by OutputManagementPanel

  const handleMouseDown = (e: React.MouseEvent, elementId: string) => {
    if (!canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setDraggedElement({ id: elementId, startX: x, startY: y });
    setSelectedElementId(elementId);
    e.stopPropagation();
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggedElement || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const deltaX = x - draggedElement.startX;
    const deltaY = y - draggedElement.startY;

    const element = elements.find((el) => el.id === draggedElement.id);
    if (!element) return;

    // Convert pixel movement to percentage of canvas
    const percentX = (deltaX / rect.width) * 100;
    const percentY = (deltaY / rect.height) * 100;

    const updatedElement = {
      ...element,
      x: Math.max(0, Math.min(100 - element.width, element.x + percentX)),
      y: Math.max(0, Math.min(100 - element.height, element.y + percentY)),
    };

    handleUpdateElement(updatedElement);
    setDraggedElement({ id: draggedElement.id, startX: x, startY: y });
  };

  const handleMouseUp = () => {
    setDraggedElement(null);
  };

  const handleCanvasClick = () => {
    setSelectedElementId(null);
  };

  return (
    // The grid layout is now handled by OutputManagementPanel.
    // This component focuses on the editor canvas and properties panel.
    <div className="flex flex-col h-full">
      {" "}
      {/* Outer container for toolbar + (canvas + properties) */}
      <ElementToolbar onAddElement={handleAddElement} />
      <div className="flex flex-1 gap-4 overflow-hidden">
        {" "}
        {/* Container for canvas and properties */}
        {/* Canvas Area */}
        <div className="flex-grow relative h-full">
          {" "}
          {/* Canvas takes remaining space */}
          <div
            ref={canvasRef}
            className="aspect-video bg-black rounded-md relative overflow-hidden"
            onClick={handleCanvasClick}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            style={{ height: "100%", width: "100%" }} // Ensure canvas takes full space
          >
            {elements
              .filter((el) => el.isVisible !== false)
              .map((element) => {
                // Only render visible elements
                const isSelected = element.id === selectedElementId;

                return (
                  <div
                    key={element.id}
                    className={`absolute ${
                      isSelected ? "ring-2 ring-blue-500 shadow-lg" : "" // Added shadow for selected
                    }`}
                    style={{
                      left: `${element.x}%`,
                      top: `${element.y}%`,
                      width: `${element.width}%`,
                      height: `${element.height}%`,
                      backgroundColor:
                        element.backgroundColor || "rgba(0, 0, 0, 0.5)",
                      color: element.fontColor || "#ffffff",
                      fontSize: `${element.fontSize || 16}px`,
                      borderRadius: `${element.borderRadius || 0}px`,
                      zIndex: element.zIndex || 0,
                      cursor: "move",
                      border: isSelected
                        ? "2px solid #3b82f6"
                        : "1px solid rgba(255, 255, 255, 0.2)",
                    }}
                    onMouseDown={(e) => handleMouseDown(e, element.id)}
                  >
                    <div className="w-full h-full flex items-center justify-center p-2 overflow-hidden select-none">
                      {element.type === "currentSlide" && (
                        <div className="text-center">
                          <div className="text-xs mb-1 opacity-70">
                            Current Slide
                          </div>
                          <div>Sample slide content</div>
                        </div>
                      )}
                      {element.type === "nextSlide" && (
                        <div className="text-center">
                          <div className="text-xs mb-1 opacity-70">
                            Next Slide
                          </div>
                          <div>Next slide preview</div>
                        </div>
                      )}
                      {element.type === "clock" && (
                        <div className="text-center font-mono">10:45 AM</div>
                      )}
                      {element.type === "timer" && (
                        <div className="text-center font-mono">05:00</div>
                      )}
                      {element.type === "customText" && element.text}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
        {/* Properties Panel (Right side of the canvas) */}
        <div className="w-[300px] min-w-[250px] max-w-[350px] p-1 overflow-y-auto flex flex-col space-y-4">
          <ElementPropertiesPanel
            selectedElement={selectedElement}
            onUpdateElement={handleUpdateElement}
            onDeleteElement={handleDeleteElement}
          />
          <div className="mt-auto pt-4">
            {" "}
            {/* Push save button to bottom */}
            <Button onClick={handleSaveTemplate} size="lg" className="w-full">
              <Save className="h-4 w-4 mr-2" /> Save Current Layout
            </Button>
          </div>
        </div>
      </div>
      {/* Dialog for creating template is removed as it's handled by OutputManagementPanel */}
      {/* Save button is moved into the properties panel area, original save/delete template buttons removed */}
    </div>
  );
}

// Remove any usage or reference to onCreateTemplate in the file
