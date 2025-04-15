// src/components/SlideEditorPanel.tsx
import React, { useState, useRef, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Image as ImageIcon,
  Square,
  Circle,
  Triangle,
  Type,
  ChevronDown,
  Move,
  Copy,
  Trash2,
  ArrowUp,
  ArrowDown,
  Grid,
  Palette,
  Sliders,
  LayoutTemplate,
} from "lucide-react";
import { Slide, ContentItem } from "../types";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Slider } from "./ui/slider";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ScrollArea } from "./ui/scroll-area";

// Add these imports
import {
  Lock,
  Unlock,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  RotateCw,
  Layers,
  Save,
  FileText,
} from "lucide-react";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Define types for slide elements
interface SlideElement {
  id: string;
  type: "text" | "image" | "shape";
  x: number; // Position X (percentage of canvas width)
  y: number; // Position Y (percentage of canvas height)
  width: number; // Width (percentage of canvas width)
  height: number; // Height (percentage of canvas height)
  content?: string; // For text elements
  src?: string; // For image elements
  shapeType?: "rectangle" | "circle" | "triangle" | "line"; // For shape elements
  fontSize?: number;
  fontFamily?: string;
  fontColor?: string;
  fontWeight?: "normal" | "bold";
  fontStyle?: "normal" | "italic";
  textDecoration?: "none" | "underline";
  textAlign?: "left" | "center" | "right";
  backgroundColor?: string;
  borderRadius?: number;
  strokeColor?: string;
  strokeWidth?: number;
  zIndex?: number;
  rotation?: number;
}

interface SlideTemplate {
  id: string;
  name: string;
  category: string;
  elements: SlideElement[];
  previewImage?: string;
}

interface SlideEditorPanelProps {
  slide?: Slide;
  onSave?: (slide: Slide) => void;
  className?: string;
}

// Default templates
const defaultTemplates: SlideTemplate[] = [
  {
    id: "title-slide",
    name: "Title Slide",
    category: "Title Slides",
    elements: [
      {
        id: uuidv4(),
        type: "text",
        x: 10,
        y: 40,
        width: 80,
        height: 20,
        content: "Presentation Title",
        fontSize: 48,
        fontFamily: "Arial",
        fontColor: "#ffffff",
        textAlign: "center",
        backgroundColor: "transparent",
        zIndex: 1,
      },
      {
        id: uuidv4(),
        type: "text",
        x: 10,
        y: 65,
        width: 80,
        height: 10,
        content: "Subtitle or Author",
        fontSize: 24,
        fontFamily: "Arial",
        fontColor: "#cccccc",
        textAlign: "center",
        backgroundColor: "transparent",
        zIndex: 1,
      },
    ],
  },
  {
    id: "song-slide",
    name: "Song Slide",
    category: "Song Slides",
    elements: [
      {
        id: uuidv4(),
        type: "text",
        x: 10,
        y: 10,
        width: 80,
        height: 10,
        content: "Song Title",
        fontSize: 24,
        fontFamily: "Arial",
        fontColor: "#ffffff",
        textAlign: "center",
        backgroundColor: "transparent",
        zIndex: 1,
      },
      {
        id: uuidv4(),
        type: "text",
        x: 10,
        y: 30,
        width: 80,
        height: 60,
        content: "Song lyrics go here...",
        fontSize: 36,
        fontFamily: "Arial",
        fontColor: "#ffffff",
        textAlign: "center",
        backgroundColor: "transparent",
        zIndex: 1,
      },
    ],
  },
  {
    id: "announcement-slide",
    name: "Announcement",
    category: "Announcement Slides",
    elements: [
      {
        id: uuidv4(),
        type: "text",
        x: 10,
        y: 10,
        width: 80,
        height: 15,
        content: "Announcement Title",
        fontSize: 36,
        fontFamily: "Arial",
        fontColor: "#ffffff",
        textAlign: "center",
        backgroundColor: "transparent",
        zIndex: 1,
      },
      {
        id: uuidv4(),
        type: "text",
        x: 10,
        y: 30,
        width: 80,
        height: 40,
        content: "Announcement details go here...",
        fontSize: 24,
        fontFamily: "Arial",
        fontColor: "#ffffff",
        textAlign: "center",
        backgroundColor: "transparent",
        zIndex: 1,
      },
      {
        id: uuidv4(),
        type: "text",
        x: 10,
        y: 75,
        width: 80,
        height: 10,
        content: "Date & Time",
        fontSize: 20,
        fontFamily: "Arial",
        fontColor: "#cccccc",
        textAlign: "center",
        backgroundColor: "transparent",
        zIndex: 1,
      },
    ],
  },
];

export function SlideEditorPanel({
  slide,
  onSave,
  className = "",
}: SlideEditorPanelProps) {
  // State for the slide elements
  const [elements, setElements] = useState<SlideElement[]>([]);
  const [selectedElement, setSelectedElement] = useState<SlideElement | null>(
    null
  );
  const [draggedElement, setDraggedElement] = useState<{
    id: string;
    startX: number;
    startY: number;
  } | null>(null);
  const [showTemplateLibrary, setShowTemplateLibrary] = useState(false);
  const [slideBackground, setSlideBackground] = useState("#000000");
  const [slideTitle, setSlideTitle] = useState(
    slide?.title || "Untitled Slide"
  );
  const [zoomLevel, setZoomLevel] = useState(100);
  const [gridEnabled, setGridEnabled] = useState(false);
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({
    x: 0,
    y: 0,
  });
  const [activeTab, setActiveTab] = useState("edit");

  const canvasRef = useRef<HTMLDivElement>(null);

  // Initialize with slide data if provided
  useEffect(() => {
    if (slide) {
      setSlideTitle(slide.title);
      // If we had slide elements in the slide object, we would set them here
      // For now, we'll just create a default text element if the slide is empty
      if (elements.length === 0) {
        // Try to parse slide content as JSON if it contains elements data
        try {
          const parsedContent = JSON.parse(slide.content);
          if (Array.isArray(parsedContent) && parsedContent.length > 0) {
            setElements(parsedContent);
          } else {
            createDefaultTextElement(slide.content);
          }
        } catch (e) {
          // If parsing fails, create a default text element
          createDefaultTextElement(slide.content);
        }
      }
    }
  }, [slide]);

  // Create a default text element with the given content
  const createDefaultTextElement = (content: string) => {
    setElements([
      {
        id: uuidv4(),
        type: "text",
        x: 10,
        y: 40,
        width: 80,
        height: 20,
        content: content,
        fontSize: 36,
        fontFamily: "Arial",
        fontColor: "#ffffff",
        textAlign: "center",
        backgroundColor: "transparent",
        zIndex: 1,
        rotation: 0,
      },
    ]);
  };

  // Handle element selection
  const handleElementClick = (e: React.MouseEvent, elementId: string) => {
    e.stopPropagation();
    const element = elements.find((el) => el.id === elementId);
    if (element) {
      setSelectedElement(element);
    }
  };

  // Handle canvas click (deselect elements)
  const handleCanvasClick = (e: React.MouseEvent) => {
    // Only deselect if it's a direct click on the canvas, not on an element
    if (e.target === e.currentTarget) {
      setSelectedElement(null);
    }
  };

  // Handle canvas right-click for context menu
  const handleCanvasContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    // Only show context menu if clicking directly on canvas
    if (e.target === e.currentTarget) {
      setContextMenuPosition({ x: e.clientX, y: e.clientY });
      setShowContextMenu(true);
    }
  };

  // Handle zoom in/out
  const handleZoom = (direction: "in" | "out") => {
    setZoomLevel((prev) => {
      if (direction === "in" && prev < 200) return prev + 10;
      if (direction === "out" && prev > 50) return prev - 10;
      return prev;
    });
  };

  // Toggle grid display
  const toggleGrid = () => {
    setGridEnabled((prev) => !prev);
  };

  // Handle element drag start
  const handleDragStart = (e: React.MouseEvent, elementId: string) => {
    e.stopPropagation();
    if (!canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setDraggedElement({ id: elementId, startX: x, startY: y });
  };

  // Handle element drag
  const handleDrag = (e: React.MouseEvent) => {
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

    setElements(
      elements.map((el) =>
        el.id === draggedElement.id
          ? { ...el, x: el.x + percentX, y: el.y + percentY }
          : el
      )
    );

    setDraggedElement({ id: draggedElement.id, startX: x, startY: y });
  };

  // Handle element drag end
  const handleDragEnd = () => {
    setDraggedElement(null);
  };

  // Add a new text element
  const handleAddText = () => {
    const newElement: SlideElement = {
      id: uuidv4(),
      type: "text",
      x: 10,
      y: 40,
      width: 80,
      height: 20,
      content: "New Text",
      fontSize: 36,
      fontFamily: "Arial",
      fontColor: "#ffffff",
      textAlign: "center",
      backgroundColor: "transparent",
      zIndex: elements.length + 1,
      rotation: 0,
    };

    setElements([...elements, newElement]);
    setSelectedElement(newElement);
  };

  // Add a new image element
  const handleAddImage = () => {
    // In a real implementation, this would open a file browser
    // For now, we'll just add a placeholder image element
    const newElement: SlideElement = {
      id: uuidv4(),
      type: "image",
      x: 25,
      y: 25,
      width: 50,
      height: 50,
      src: "https://via.placeholder.com/400", // Placeholder image
      zIndex: elements.length + 1,
    };

    setElements([...elements, newElement]);
    setSelectedElement(newElement);
  };

  // Add a new shape element
  const handleAddShape = (
    shapeType: "rectangle" | "circle" | "triangle" | "line"
  ) => {
    const newElement: SlideElement = {
      id: uuidv4(),
      type: "shape",
      x: 25,
      y: 25,
      width: 50,
      height: 50,
      shapeType,
      backgroundColor: "#3182CE",
      strokeColor: "#ffffff",
      strokeWidth: 2,
      zIndex: elements.length + 1,
    };

    setElements([...elements, newElement]);
    setSelectedElement(newElement);
  };

  // Update element properties
  const handleUpdateElement = (updatedElement: SlideElement) => {
    setElements(
      elements.map((el) => (el.id === updatedElement.id ? updatedElement : el))
    );
    setSelectedElement(updatedElement);
  };

  // Delete selected element
  const handleDeleteElement = () => {
    if (!selectedElement) return;

    setElements(elements.filter((el) => el.id !== selectedElement.id));
    setSelectedElement(null);
  };

  // Duplicate selected element
  const handleDuplicateElement = () => {
    if (!selectedElement) return;

    const newElement = {
      ...selectedElement,
      id: uuidv4(),
      x: selectedElement.x + 5,
      y: selectedElement.y + 5,
    };

    setElements([...elements, newElement]);
    setSelectedElement(newElement);
  };

  // Apply template
  const handleApplyTemplate = (template: SlideTemplate) => {
    // Generate new IDs for all elements to avoid conflicts
    const newElements = template.elements.map((el) => ({
      ...el,
      id: uuidv4(),
    }));

    setElements(newElements);
    setSelectedElement(null);
    setShowTemplateLibrary(false);
  };

  // Save slide
  const handleSave = () => {
    if (onSave && slide) {
      // Store the entire elements array as JSON in the slide content
      // This allows us to restore the exact slide layout when editing
      onSave({
        ...slide,
        title: slideTitle,
        content: JSON.stringify(elements),
      });
    }
  };

  // Handle element rotation
  const handleRotateElement = (direction: "clockwise" | "counterclockwise") => {
    if (!selectedElement) return;

    const currentRotation = selectedElement.rotation || 0;
    const rotationChange = direction === "clockwise" ? 15 : -15;

    handleUpdateElement({
      ...selectedElement,
      rotation: currentRotation + rotationChange,
    });
  };

  // Handle element layer position (bring forward/send backward)
  const handleElementLayer = (direction: "forward" | "backward") => {
    if (!selectedElement) return;

    const sortedElements = [...elements].sort(
      (a, b) => (a.zIndex || 0) - (b.zIndex || 0)
    );
    const currentIndex = sortedElements.findIndex(
      (el) => el.id === selectedElement.id
    );

    if (direction === "forward" && currentIndex < sortedElements.length - 1) {
      // Swap zIndex with the element above
      const nextElement = sortedElements[currentIndex + 1];
      const updatedElements = elements.map((el) => {
        if (el.id === selectedElement.id)
          return { ...el, zIndex: nextElement.zIndex || 0 };
        if (el.id === nextElement.id)
          return { ...el, zIndex: selectedElement.zIndex || 0 };
        return el;
      });
      setElements(updatedElements);
    } else if (direction === "backward" && currentIndex > 0) {
      // Swap zIndex with the element below
      const prevElement = sortedElements[currentIndex - 1];
      const updatedElements = elements.map((el) => {
        if (el.id === selectedElement.id)
          return { ...el, zIndex: prevElement.zIndex || 0 };
        if (el.id === prevElement.id)
          return { ...el, zIndex: selectedElement.zIndex || 0 };
        return el;
      });
      setElements(updatedElements);
    }
  };

  // Render element based on its type
  const renderElement = (element: SlideElement) => {
    const isSelected = selectedElement?.id === element.id;
    const elementStyle: React.CSSProperties = {
      position: "absolute",
      left: `${element.x}%`,
      top: `${element.y}%`,
      width: `${element.width}%`,
      height: `${element.height}%`,
      zIndex: element.zIndex || 0,
      border: isSelected ? "2px dashed #3182CE" : "none",
      cursor: "move",
      transform: element.rotation
        ? `rotate(${element.rotation}deg)`
        : undefined,
    };

    // Common props for all elements
    const elementProps = {
      style: elementStyle,
      onClick: (e: React.MouseEvent) => handleElementClick(e, element.id),
      onMouseDown: (e: React.MouseEvent) => handleDragStart(e, element.id),
      onContextMenu: (e: React.MouseEvent) => {
        e.preventDefault();
        handleElementClick(e, element.id);
      },
    };

    if (element.type === "text") {
      const textStyle: React.CSSProperties = {
        fontFamily: element.fontFamily || "Arial",
        fontSize: `${element.fontSize || 16}px`,
        fontWeight: element.fontWeight || "normal",
        fontStyle: element.fontStyle || "normal",
        textDecoration: element.textDecoration || "none",
        textAlign: (element.textAlign as any) || "left",
        color: element.fontColor || "#ffffff",
        backgroundColor: element.backgroundColor || "transparent",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent:
          element.textAlign === "center"
            ? "center"
            : element.textAlign === "right"
            ? "flex-end"
            : "flex-start",
        padding: "8px",
        overflow: "hidden",
        wordBreak: "break-word",
      };

      return (
        <div {...elementProps}>
          <div style={textStyle}>{element.content}</div>
        </div>
      );
    }

    if (element.type === "image") {
      return (
        <div {...elementProps}>
          <img
            src={element.src}
            alt="Slide element"
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
            draggable={false}
          />
        </div>
      );
    }

    if (element.type === "shape") {
      const shapeStyle: React.CSSProperties = {
        width: "100%",
        height: "100%",
        backgroundColor: element.backgroundColor || "#3182CE",
        border: `${element.strokeWidth || 0}px solid ${
          element.strokeColor || "transparent"
        }`,
      };

      if (element.shapeType === "circle") {
        shapeStyle.borderRadius = "50%";
      } else if (element.shapeType === "triangle") {
        // For triangle, we'll use a div with a border trick
        return (
          <div {...elementProps}>
            <div
              style={{
                width: 0,
                height: 0,
                borderLeft: `${element.width / 2}% solid transparent`,
                borderRight: `${element.width / 2}% solid transparent`,
                borderBottom: `${element.height}% solid ${
                  element.backgroundColor || "#3182CE"
                }`,
              }}
            />
          </div>
        );
      }

      return <div {...elementProps}></div>;
    }
  };

  // Render the contextual toolbar based on selected element
  const renderContextualToolbar = () => {
    if (!selectedElement) {
      // Canvas-level controls when no element is selected
      return (
        <div className="flex items-center space-x-2 p-2 bg-gray-800 rounded-md">
          <Label htmlFor="bg-color" className="text-xs text-gray-300">
            Background:
          </Label>
          <div className="flex items-center space-x-1">
            <Input
              id="bg-color"
              type="color"
              value={slideBackground}
              onChange={(e) => setSlideBackground(e.target.value)}
              className="w-8 h-8 p-1 rounded"
            />
            <Input
              type="text"
              value={slideBackground}
              onChange={(e) => setSlideBackground(e.target.value)}
              className="w-20 h-8 text-xs"
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            className="text-xs"
            onClick={() => setShowTemplateLibrary(true)}
          >
            <LayoutTemplate className="h-4 w-4 mr-1" />
            Templates
          </Button>
        </div>
      );
    }

    if (selectedElement && selectedElement.type === "text") {
      // Text controls
      return (
        <div className="flex flex-wrap items-center space-x-2 p-2 bg-gray-800 rounded-md">
          <div className="flex items-center space-x-1">
            <Button
              variant={
                selectedElement.fontWeight === "bold" ? "default" : "outline"
              }
              size="sm"
              className="p-1 h-8 w-8"
              onClick={() => {
                if (selectedElement) {
                  handleUpdateElement({
                    ...selectedElement,
                    id: selectedElement.id,
                    fontWeight:
                      selectedElement.fontWeight === "bold" ? "normal" : "bold",
                  });
                }
              }}
            >
              <Bold className="h-4 w-4" />
            </Button>
            <Button
              variant={
                selectedElement.fontStyle === "italic" ? "default" : "outline"
              }
              size="sm"
              className="p-1 h-8 w-8"
              onClick={() => {
                if (selectedElement) {
                  handleUpdateElement({
                    ...selectedElement,
                    id: selectedElement.id,
                    fontStyle:
                      selectedElement.fontStyle === "italic"
                        ? "normal"
                        : "italic",
                  });
                }
              }}
            >
              <Italic className="h-4 w-4" />
            </Button>
            <Button
              variant={
                selectedElement.textDecoration === "underline"
                  ? "default"
                  : "outline"
              }
              size="sm"
              className="p-1 h-8 w-8"
              onClick={() => {
                if (selectedElement) {
                  handleUpdateElement({
                    ...selectedElement,
                    id: selectedElement.id,
                    textDecoration:
                      selectedElement.textDecoration === "underline"
                        ? "none"
                        : "underline",
                  });
                }
              }}
            >
              <Underline className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center space-x-1">
            <Button
              variant={
                selectedElement.textAlign === "left" ? "default" : "outline"
              }
              size="sm"
              className="p-1 h-8 w-8"
              onClick={() => {
                if (selectedElement) {
                  handleUpdateElement({
                    ...selectedElement,
                    id: selectedElement.id,
                    textAlign: "left",
                  });
                }
              }}
            >
              <AlignLeft className="h-4 w-4" />
            </Button>
            <Button
              variant={
                selectedElement.textAlign === "center" ? "default" : "outline"
              }
              size="sm"
              className="p-1 h-8 w-8"
              onClick={() => {
                if (selectedElement) {
                  handleUpdateElement({
                    ...selectedElement,
                    id: selectedElement.id,
                    textAlign: "center",
                  });
                }
              }}
            >
              <AlignCenter className="h-4 w-4" />
            </Button>
            <Button
              variant={
                selectedElement.textAlign === "right" ? "default" : "outline"
              }
              size="sm"
              className="p-1 h-8 w-8"
              onClick={() =>
                handleUpdateElement({
                  ...selectedElement,
                  textAlign: "right",
                })
              }
            >
              <AlignRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center space-x-1">
            <Label htmlFor="font-size" className="text-xs text-gray-300">
              Size:
            </Label>
            <Input
              id="font-size"
              type="number"
              min="8"
              max="72"
              value={selectedElement.fontSize || 16}
              onChange={(e) =>
                handleUpdateElement({
                  ...selectedElement,
                  fontSize: Number(e.target.value),
                })
              }
              className="w-16 h-8 text-xs"
            />
          </div>

          <div className="flex items-center space-x-1">
            <Label htmlFor="font-color" className="text-xs text-gray-300">
              Color:
            </Label>
            <Input
              id="font-color"
              type="color"
              value={selectedElement.fontColor || "#ffffff"}
              onChange={(e) =>
                handleUpdateElement({
                  ...selectedElement,
                  fontColor: e.target.value,
                })
              }
              className="w-8 h-8 p-1 rounded"
            />
          </div>

          <div className="flex items-center space-x-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleRotateElement("counterclockwise")}
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Rotate Left</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleRotateElement("clockwise")}
                  >
                    <RotateCw className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Rotate Right</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      );
    }

    if (selectedElement.type === "image") {
      // Image controls
      return (
        <div className="flex items-center space-x-2 p-2 bg-gray-800 rounded-md">
          <Button variant="outline" size="sm" className="text-xs">
            <ImageIcon className="h-4 w-4 mr-1" />
            Replace Image
          </Button>
          <Button variant="outline" size="sm" className="text-xs">
            Crop
          </Button>
          <div className="flex items-center space-x-1">
            <Label htmlFor="brightness" className="text-xs text-gray-300">
              Brightness:
            </Label>
            <Slider
              id="brightness"
              min={0}
              max={200}
              step={1}
              defaultValue={[100]}
              className="w-24"
            />
          </div>
          <div className="flex items-center space-x-1">
            <Label htmlFor="contrast" className="text-xs text-gray-300">
              Contrast:
            </Label>
            <Slider
              id="contrast"
              min={0}
              max={200}
              step={1}
              defaultValue={[100]}
              className="w-24"
            />
          </div>

          <div className="flex items-center space-x-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleRotateElement("counterclockwise")}
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Rotate Left</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleRotateElement("clockwise")}
                  >
                    <RotateCw className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Rotate Right</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      );
    }

    if (selectedElement.type === "shape") {
      // Shape controls
      return (
        <div className="flex items-center space-x-2 p-2 bg-gray-800 rounded-md">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="text-xs">
                {selectedElement.shapeType === "rectangle" && (
                  <Square className="h-4 w-4 mr-1" />
                )}
                {selectedElement.shapeType === "circle" && (
                  <Circle className="h-4 w-4 mr-1" />
                )}
                {selectedElement.shapeType === "triangle" && (
                  <Triangle className="h-4 w-4 mr-1" />
                )}
                {selectedElement.shapeType || "Shape"}
                <ChevronDown className="h-4 w-4 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                onClick={() =>
                  handleUpdateElement({
                    ...selectedElement,
                    shapeType: "rectangle",
                  })
                }
              >
                <Square className="h-4 w-4 mr-2" />
                Rectangle
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  handleUpdateElement({
                    ...selectedElement,
                    shapeType: "circle",
                  })
                }
              >
                <Circle className="h-4 w-4 mr-2" />
                Circle
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  handleUpdateElement({
                    ...selectedElement,
                    shapeType: "triangle",
                  })
                }
              >
                <Triangle className="h-4 w-4 mr-2" />
                Triangle
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="flex items-center space-x-1">
            <Label htmlFor="fill-color" className="text-xs text-gray-300">
              Fill:
            </Label>
            <Input
              id="fill-color"
              type="color"
              value={selectedElement.backgroundColor || "#3182CE"}
              onChange={(e) =>
                handleUpdateElement({
                  ...selectedElement,
                  backgroundColor: e.target.value,
                })
              }
              className="w-8 h-8 p-1 rounded"
            />
          </div>

          <div className="flex items-center space-x-1">
            <Label htmlFor="stroke-color" className="text-xs text-gray-300">
              Stroke:
            </Label>
            <Input
              id="stroke-color"
              type="color"
              value={selectedElement.strokeColor || "#ffffff"}
              onChange={(e) =>
                handleUpdateElement({
                  ...selectedElement,
                  strokeColor: e.target.value,
                })
              }
              className="w-8 h-8 p-1 rounded"
            />
          </div>

          <div className="flex items-center space-x-1">
            <Label htmlFor="stroke-width" className="text-xs text-gray-300">
              Width:
            </Label>
            <Input
              id="stroke-width"
              type="number"
              min="0"
              max="20"
              value={selectedElement.strokeWidth || 2}
              onChange={(e) =>
                handleUpdateElement({
                  ...selectedElement,
                  strokeWidth: Number(e.target.value),
                })
              }
              className="w-16 h-8 text-xs"
            />
          </div>

          <div className="flex items-center space-x-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleRotateElement("counterclockwise")}
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Rotate Left</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleRotateElement("clockwise")}
                  >
                    <RotateCw className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Rotate Right</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Top toolbar */}
      <div className="flex justify-between items-center p-2 border-b border-gray-700">
        <div className="flex items-center space-x-2">
          <Input
            value={slideTitle}
            onChange={(e) => setSlideTitle(e.target.value)}
            className="w-48 h-8 text-sm"
            placeholder="Slide Title"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-auto"
          >
            <TabsList className="grid w-auto grid-cols-2">
              <TabsTrigger value="edit" className="px-3 py-1 text-xs">
                Edit
              </TabsTrigger>
              <TabsTrigger value="preview" className="px-3 py-1 text-xs">
                Preview
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleZoom("in")}
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Zoom In</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleZoom("out")}
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Zoom Out</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={toggleGrid}>
                  <Grid
                    className={`h-4 w-4 ${gridEnabled ? "text-primary" : ""}`}
                  />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Toggle Grid</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <Button variant="default" size="sm" onClick={handleSave}>
            <Save className="h-4 w-4 mr-1" />
            Save
          </Button>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 flex">
        {/* Canvas area */}
        <div className="flex-1 p-4 bg-gray-900 overflow-auto">
          <ContextMenu>
            <ContextMenuTrigger>
              <div
                ref={canvasRef}
                className="relative w-full aspect-video bg-black mx-auto shadow-lg"
                style={{
                  backgroundColor: slideBackground,
                  transform: `scale(${zoomLevel / 100})`,
                  transformOrigin: "center center",
                  backgroundImage: gridEnabled
                    ? "linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)"
                    : "none",
                  backgroundSize: gridEnabled ? "20px 20px" : "auto",
                }}
                onClick={handleCanvasClick}
                onContextMenu={handleCanvasContextMenu}
                onMouseMove={(e) => draggedElement && handleDrag(e)}
                onMouseUp={handleDragEnd}
                onMouseLeave={handleDragEnd}
              >
                {/* Render all slide elements */}
                {elements.map((element) => renderElement(element))}
              </div>
            </ContextMenuTrigger>
            <ContextMenuContent>
              <ContextMenuItem onClick={handleAddText}>
                <Type className="h-4 w-4 mr-2" />
                Add Text
              </ContextMenuItem>
              <ContextMenuItem onClick={handleAddImage}>
                <ImageIcon className="h-4 w-4 mr-2" />
                Add Image
              </ContextMenuItem>
              <ContextMenu>
                <ContextMenuTrigger className="flex items-center w-full px-2 py-1.5 text-sm cursor-default">
                  <Square className="h-4 w-4 mr-2" />
                  Add Shape
                </ContextMenuTrigger>
                <ContextMenuContent className="w-48">
                  <ContextMenuItem onClick={() => handleAddShape("rectangle")}>
                    <Square className="h-4 w-4 mr-2" />
                    Rectangle
                  </ContextMenuItem>
                  <ContextMenuItem onClick={() => handleAddShape("circle")}>
                    <Circle className="h-4 w-4 mr-2" />
                    Circle
                  </ContextMenuItem>
                  <ContextMenuItem onClick={() => handleAddShape("triangle")}>
                    <Triangle className="h-4 w-4 mr-2" />
                    Triangle
                  </ContextMenuItem>
                </ContextMenuContent>
              </ContextMenu>
              <ContextMenuSeparator />
              <ContextMenuItem onClick={() => setShowTemplateLibrary(true)}>
                <LayoutTemplate className="h-4 w-4 mr-2" />
                Apply Template
              </ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
        </div>

        {/* Right sidebar */}
        <div className="w-72 border-l border-gray-700 p-2 flex flex-col">
          <Tabs defaultValue="elements" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="elements">Elements</TabsTrigger>
              <TabsTrigger value="properties">Properties</TabsTrigger>
              <TabsTrigger value="templates">Templates</TabsTrigger>
            </TabsList>
            <TabsContent value="elements" className="mt-2">
              <div className="mb-4">
                <h3 className="text-sm font-medium mb-2">Add Elements</h3>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center justify-center"
                    onClick={handleAddText}
                  >
                    <Type className="h-4 w-4 mr-1" />
                    Text
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center justify-center"
                    onClick={handleAddImage}
                  >
                    <ImageIcon className="h-4 w-4 mr-1" />
                    Image
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center justify-center col-span-2"
                      >
                        <Square className="h-4 w-4 mr-1" />
                        Shape
                        <ChevronDown className="h-4 w-4 ml-1" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuGroup>
                        <DropdownMenuItem
                          onClick={() => handleAddShape("rectangle")}
                        >
                          <Square className="h-4 w-4 mr-2" />
                          Rectangle
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleAddShape("circle")}
                        >
                          <Circle className="h-4 w-4 mr-2" />
                          Circle
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleAddShape("triangle")}
                        >
                          <Triangle className="h-4 w-4 mr-2" />
                          Triangle
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Contextual toolbar */}
              <div className="mb-4">{renderContextualToolbar()}</div>
            </TabsContent>

            <TabsContent value="properties" className="mt-2">
              {selectedElement ? (
                <div className="flex-1 overflow-auto">
                  <h3 className="text-sm font-medium mb-2">
                    Element Properties
                  </h3>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label
                          htmlFor="element-x"
                          className="text-xs text-gray-400"
                        >
                          X Position (%)
                        </Label>
                        <Input
                          id="element-x"
                          type="number"
                          min="0"
                          max="100"
                          value={selectedElement.x}
                          onChange={(e) =>
                            handleUpdateElement({
                              ...selectedElement,
                              x: Number(e.target.value),
                            })
                          }
                          className="h-8 text-xs"
                        />
                      </div>
                      <div>
                        <Label
                          htmlFor="element-y"
                          className="text-xs text-gray-400"
                        >
                          Y Position (%)
                        </Label>
                        <Input
                          id="element-y"
                          type="number"
                          min="0"
                          max="100"
                          value={selectedElement.y}
                          onChange={(e) =>
                            handleUpdateElement({
                              ...selectedElement,
                              y: Number(e.target.value),
                            })
                          }
                          className="h-8 text-xs"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label
                          htmlFor="element-width"
                          className="text-xs text-gray-400"
                        >
                          Width (%)
                        </Label>
                        <Input
                          id="element-width"
                          type="number"
                          min="1"
                          max="100"
                          value={selectedElement.width}
                          onChange={(e) =>
                            handleUpdateElement({
                              ...selectedElement,
                              width: Number(e.target.value),
                            })
                          }
                          className="h-8 text-xs"
                        />
                      </div>
                      <div>
                        <Label
                          htmlFor="element-height"
                          className="text-xs text-gray-400"
                        >
                          Height (%)
                        </Label>
                        <Input
                          id="element-height"
                          type="number"
                          min="1"
                          max="100"
                          value={selectedElement.height}
                          onChange={(e) =>
                            handleUpdateElement({
                              ...selectedElement,
                              height: Number(e.target.value),
                            })
                          }
                          className="h-8 text-xs"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label
                          htmlFor="element-rotation"
                          className="text-xs text-gray-400"
                        >
                          Rotation (deg)
                        </Label>
                        <Input
                          id="element-rotation"
                          type="number"
                          min="0"
                          max="360"
                          value={selectedElement.rotation || 0}
                          onChange={(e) =>
                            handleUpdateElement({
                              ...selectedElement,
                              rotation: Number(e.target.value),
                            })
                          }
                          className="h-8 text-xs"
                        />
                      </div>
                      <div>
                        <Label
                          htmlFor="element-zindex"
                          className="text-xs text-gray-400"
                        >
                          Layer (z-index)
                        </Label>
                        <Input
                          id="element-zindex"
                          type="number"
                          min="0"
                          max="100"
                          value={selectedElement.zIndex || 0}
                          onChange={(e) =>
                            handleUpdateElement({
                              ...selectedElement,
                              zIndex: Number(e.target.value),
                            })
                          }
                          className="h-8 text-xs"
                        />
                      </div>
                    </div>

                    <div className="flex justify-between">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleElementLayer("forward")}
                      >
                        <Layers className="h-4 w-4 mr-1" />
                        Bring Forward
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleElementLayer("backward")}
                      >
                        <Layers className="h-4 w-4 mr-1" />
                        Send Backward
                      </Button>
                    </div>

                    <div className="flex justify-between mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleDuplicateElement}
                      >
                        <Copy className="h-4 w-4 mr-1" />
                        Duplicate
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={handleDeleteElement}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 text-center text-gray-500">
                  <p>Select an element to edit its properties</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="templates" className="mt-2">
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Apply Template</h3>
                <div className="grid grid-cols-2 gap-2 overflow-auto max-h-[500px] pr-2">
                  {defaultTemplates.map((template) => (
                    <div
                      key={template.id}
                      className="border border-gray-700 rounded-md p-2 cursor-pointer hover:bg-gray-800 transition-colors"
                      onClick={() => handleApplyTemplate(template)}
                    >
                      <div className="aspect-video bg-black mb-2 rounded overflow-hidden flex items-center justify-center text-xs text-gray-400">
                        {template.name}
                      </div>
                      <div className="text-xs font-medium truncate">
                        {template.name}
                      </div>
                      <div className="text-xs text-gray-500 truncate">
                        {template.category}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Template library dialog */}
      <Dialog open={showTemplateLibrary} onOpenChange={setShowTemplateLibrary}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Template Library</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-3 gap-4 py-4">
            {defaultTemplates.map((template) => (
              <div
                key={template.id}
                className="border border-gray-200 dark:border-gray-700 rounded-md p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => handleApplyTemplate(template)}
              >
                <div className="aspect-video bg-gray-200 dark:bg-gray-700 mb-2 rounded overflow-hidden">
                  {/* Template preview would go here */}
                  <div className="w-full h-full flex items-center justify-center text-sm text-gray-500 dark:text-gray-400">
                    {template.name}
                  </div>
                </div>
                <div className="text-sm font-medium">{template.name}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {template.category}
                </div>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowTemplateLibrary(false)}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Element context menu */}
      {selectedElement && (
        <ContextMenu>
          <ContextMenuTrigger>
            {/* This is just a trigger, actual elements are rendered elsewhere */}
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem onClick={handleDuplicateElement}>
              <Copy className="h-4 w-4 mr-2" />
              Duplicate
            </ContextMenuItem>
            <ContextMenuItem onClick={() => handleRotateElement("clockwise")}>
              <RotateCw className="h-4 w-4 mr-2" />
              Rotate Clockwise
            </ContextMenuItem>
            <ContextMenuItem onClick={() => handleElementLayer("forward")}>
              <ArrowUp className="h-4 w-4 mr-2" />
              Bring Forward
            </ContextMenuItem>
            <ContextMenuItem onClick={() => handleElementLayer("backward")}>
              <ArrowDown className="h-4 w-4 mr-2" />
              Send Backward
            </ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem
              onClick={handleDeleteElement}
              className="text-red-500"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      )}
    </div>
  );
}
