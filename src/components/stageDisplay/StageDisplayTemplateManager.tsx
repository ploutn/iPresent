import React, { useEffect, useState } from "react";
import {
  StageDisplayTemplate,
  StageDisplayElement,
  StageDisplayElementType, // Import for type casting/usage
} from "../../types/stageDisplay"; // Adjust path if necessary
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
import { Slider } from "../ui/slider";
// import { Textarea } from "../ui/textarea"; // Not used in provided code, can remove if not needed
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
// Dialog components not used, can remove if not needed
// import {
//   Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger,
// } from "../ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  Layout,
  Plus,
  Edit,
  Copy,
  Trash2,
  Download,
  Upload,
  Eye,
  Settings,
  Move,
  MoreVertical,
  Clock,
  Timer,
  FileText,
  /*Image, Video,*/ Music,
  MessageSquare,
  Calendar,
  Users,
  Mic,
  Volume2,
  /*Palette,*/ Type,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from "lucide-react"; // Removed unused icons like Image, Video, Palette
import { StageDisplayPreview } from "./StageDisplayPreview";

interface StageDisplayTemplateManagerProps {
  templates: StageDisplayTemplate[];
  activeTemplateId: string;
  onTemplateChange: (templateId: string) => void;
  onTemplateCreate: (template: StageDisplayTemplate) => void;
  onTemplateUpdate: (template: StageDisplayTemplate) => void;
  onTemplateDelete: (templateId: string) => void;
}

// Removed local ElementPosition and ElementStyle interfaces as StageDisplayElement.style (React.CSSProperties) is preferred.

const DEFAULT_TEMPLATES: StageDisplayTemplate[] = [
  {
    id: "minimal",
    name: "Minimal",
    description: "Clean and simple layout with current slide and clock",
    elements: [
      {
        id: "current-slide-minimal", // Unique ID
        type: "currentSlide" as StageDisplayElementType,
        x: 50,
        y: 200,
        width: 600,
        height: 400, // Direct properties
        style: { fontSize: "24px", color: "#000000" }, // fontSize as string
        isVisible: true, // Corrected property name
      },
      {
        id: "clock-minimal", // Unique ID
        type: "clock" as StageDisplayElementType,
        x: 700,
        y: 50,
        width: 200,
        height: 60, // Direct properties
        style: { fontSize: "32px", color: "#333333" },
        isVisible: true,
      },
    ],
    backgroundColor: "#ffffff",
    backgroundImage: "",
  },
  {
    id: "presenter",
    name: "Presenter View",
    description: "Comprehensive layout for presenters with notes and timing",
    elements: [
      {
        id: "current-slide-presenter",
        type: "currentSlide" as StageDisplayElementType,
        x: 50,
        y: 50,
        width: 400,
        height: 300,
        style: { fontSize: "18px", color: "#000000" },
        isVisible: true,
      },
      {
        id: "next-slide-presenter",
        type: "nextSlide" as StageDisplayElementType,
        x: 500,
        y: 50,
        width: 300,
        height: 225,
        style: { fontSize: "14px", color: "#666666" },
        isVisible: true,
      },
      {
        id: "speaker-notes-presenter",
        type: "speakerNotes" as StageDisplayElementType,
        x: 50,
        y: 400,
        width: 500,
        height: 150,
        style: { fontSize: "16px", color: "#333333" },
        isVisible: true,
      },
      {
        id: "timer-presenter",
        type: "timer" as StageDisplayElementType,
        x: 600,
        y: 400,
        width: 200,
        height: 80,
        style: { fontSize: "28px", color: "#ff6b35" },
        isVisible: true,
      },
      {
        id: "clock-presenter",
        type: "clock" as StageDisplayElementType,
        x: 600,
        y: 500,
        width: 200,
        height: 50,
        style: { fontSize: "20px", color: "#333333" },
        isVisible: true,
      },
    ],
    backgroundColor: "#f8f9fa",
    backgroundImage: "",
  },
  {
    id: "audience",
    name: "Audience Display",
    description: "Large, clear display optimized for audience viewing",
    elements: [
      {
        id: "current-slide-audience",
        type: "currentSlide" as StageDisplayElementType,
        x: 100,
        y: 100,
        width: 800,
        height: 600,
        style: { fontSize: "32px", color: "#000000" },
        isVisible: true,
      },
      {
        id: "announcement-audience",
        type: "announcementBanner" as StageDisplayElementType, // Corrected type
        x: 100,
        y: 750,
        width: 800,
        height: 80,
        style: {
          fontSize: "24px",
          color: "#ffffff",
          backgroundColor: "#007acc",
        },
        isVisible: false,
      },
    ],
    backgroundColor: "#ffffff",
    backgroundImage: "",
  },
  {
    id: "worship",
    name: "Worship Service",
    description:
      "Designed for worship services with song lyrics and announcements",
    elements: [
      {
        id: "song-lyrics-worship",
        type: "songLyrics" as StageDisplayElementType,
        x: 150,
        y: 200,
        width: 700,
        height: 400,
        style: { fontSize: "36px", color: "#ffffff", textAlign: "center" },
        isVisible: true,
      },
      {
        id: "announcement-worship",
        type: "announcementBanner" as StageDisplayElementType, // Corrected type
        x: 100,
        y: 650,
        width: 800,
        height: 100,
        style: {
          fontSize: "24px",
          color: "#ffffff",
          backgroundColor: "rgba(0,0,0,0.7)",
        },
        isVisible: false,
      },
      {
        id: "service-info-worship",
        type: "customText" as StageDisplayElementType,
        x: 50,
        y: 50,
        width: 300,
        height: 60,
        style: { fontSize: "18px", color: "#ffffff" },
        isVisible: true,
        text: "Sunday Service - 10:00 AM", // Corrected property name
      },
    ],
    backgroundColor: "#1a1a2e",
    backgroundImage: "",
  },
];

function getElementIcon(type: StageDisplayElementType) {
  switch (type) {
    case "currentSlide":
      return <FileText className="h-4 w-4" />;
    case "nextSlide":
      return <FileText className="h-4 w-4" />; // Could use a different icon for next
    case "clock":
      return <Clock className="h-4 w-4" />;
    case "timer":
      return <Timer className="h-4 w-4" />;
    case "speakerNotes":
      return <MessageSquare className="h-4 w-4" />;
    case "announcementBanner":
      return <Volume2 className="h-4 w-4" />; // Matched type
    case "customText":
      return <Type className="h-4 w-4" />;
    case "songLyrics":
      return <Music className="h-4 w-4" />;
    case "countdownTimer":
      return <Calendar className="h-4 w-4" />; // Matched type
    case "participantCount":
      return <Users className="h-4 w-4" />;
    case "microphoneStatus":
      return <Mic className="h-4 w-4" />;
    // case "media": return <Image className="h-4 w-4" />; // Add if you have media type
    default:
      // Exhaustive check for switch (if StageDisplayElementType was an enum)
      // const _exhaustiveCheck: never = type;
      return <Layout className="h-4 w-4" />;
  }
}

const availableElementTypes: StageDisplayElementType[] = [
  "currentSlide",
  "nextSlide",
  "clock",
  "timer",
  "speakerNotes",
  "announcementBanner",
  "customText",
  "songLyrics",
  "countdownTimer",
  "participantCount",
  "microphoneStatus", // "media"
];

export function StageDisplayTemplateManager({
  templates,
  activeTemplateId,
  onTemplateChange,
  onTemplateCreate,
  onTemplateUpdate,
  onTemplateDelete,
}: StageDisplayTemplateManagerProps) {
  const allTemplates = [
    ...DEFAULT_TEMPLATES,
    ...templates.filter(
      (userTemplate) =>
        !DEFAULT_TEMPLATES.find((dt) => dt.id === userTemplate.id)
    ),
  ]; // Prevent duplicates if user saves a template with a default ID

  const activeTemplate = allTemplates.find((t) => t.id === activeTemplateId);

  const [selectedTemplate, setSelectedTemplate] =
    useState<StageDisplayTemplate | null>(() => activeTemplate || null);
  // const [isEditing, setIsEditing] = useState(false); // Seems unused
  const [editingElement, setEditingElement] =
    useState<StageDisplayElement | null>(null);
  const [newTemplateName, setNewTemplateName] = useState("");
  const [newTemplateDescription, setNewTemplateDescription] = useState(""); // For description

  const handleTemplateSelect = (templateId: string) => {
    const foundTemplate = allTemplates.find((t) => t.id === templateId);
    setSelectedTemplate(foundTemplate || null);
    onTemplateChange(templateId);
    setEditingElement(null); // Reset editing element when template changes
  };

  const handleCreateTemplate = () => {
    if (!newTemplateName.trim()) return;
    const newTemplate: StageDisplayTemplate = {
      id: `custom-${Date.now()}`,
      name: newTemplateName,
      description: newTemplateDescription, // Added description
      elements: [],
      backgroundColor: "#ffffff",
      backgroundImage: "",
    };
    onTemplateCreate(newTemplate);
    setNewTemplateName("");
    setNewTemplateDescription("");
    setSelectedTemplate(newTemplate); // Select the newly created template
    onTemplateChange(newTemplate.id); // Make it active
  };

  const handleElementAdd = (type: StageDisplayElementType) => {
    if (!selectedTemplate) return;
    const newElement: StageDisplayElement = {
      id: `element-${Date.now()}`,
      type,
      x: 100,
      y: 100,
      width: 200,
      height: 100, // Direct properties
      style: {
        // Default style, ensure it's React.CSSProperties
        fontSize: "16px", // String for CSS consistency
        color: "#000000",
        fontFamily: "Arial, sans-serif",
        fontWeight: "normal",
        backgroundColor: "transparent",
        borderRadius: "0px",
        padding: "8px",
        textAlign: "left",
        opacity: 1,
      },
      isVisible: true,
    };
    const updatedTemplate = {
      ...selectedTemplate,
      elements: [...selectedTemplate.elements, newElement],
    };
    onTemplateUpdate(updatedTemplate);
    setSelectedTemplate(updatedTemplate);
    setEditingElement(newElement); // Optionally edit the new element
  };

  const handleElementUpdate = (
    updatedElement: Partial<StageDisplayElement>
  ) => {
    if (!selectedTemplate || !editingElement) return;

    const mergedElement = { ...editingElement, ...updatedElement };
    // If style is partially updated, merge it
    if (updatedElement.style && editingElement.style) {
      mergedElement.style = {
        ...editingElement.style,
        ...updatedElement.style,
      };
    }

    const updatedElements = selectedTemplate.elements.map((el) =>
      el.id === mergedElement.id ? mergedElement : el
    );
    const updatedTemplate = { ...selectedTemplate, elements: updatedElements };

    onTemplateUpdate(updatedTemplate);
    setSelectedTemplate(updatedTemplate); // Keep selectedTemplate in sync
    setEditingElement(mergedElement); // Keep editingElement in sync
  };

  const handleElementDelete = (elementId: string) => {
    if (!selectedTemplate) return;
    const updatedTemplate = {
      ...selectedTemplate,
      elements: selectedTemplate.elements.filter((el) => el.id !== elementId),
    };
    onTemplateUpdate(updatedTemplate);
    setSelectedTemplate(updatedTemplate);
    if (editingElement?.id === elementId) {
      setEditingElement(null);
    }
  };

  // Effect to update selectedTemplate if activeTemplateId changes from props
  useEffect(() => {
    const currentActiveTemplate = allTemplates.find(
      (t) => t.id === activeTemplateId
    );
    if (
      currentActiveTemplate &&
      currentActiveTemplate.id !== selectedTemplate?.id
    ) {
      setSelectedTemplate(currentActiveTemplate);
      setEditingElement(null);
    }
  }, [activeTemplateId, allTemplates, selectedTemplate?.id]);

  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-2xl font-bold">Stage Display Templates</h2>
          <p className="text-muted-foreground text-sm">
            Create and manage custom stage display layouts
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={true} // Export functionality removed
          >
            <Download className="h-4 w-4 mr-2" /> Export
          </Button>
          <Button variant="outline" size="sm" disabled={true}>
            {" "}
            {/* Import functionality removed */}
            <Upload className="h-4 w-4 mr-2" /> Import
          </Button>
        </div>
      </div>

      <Tabs defaultValue="templates" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-3">
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="editor">Editor</TabsTrigger>
          <TabsTrigger value="preview" className="hidden md:block">
            Live Preview
          </TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="space-y-6 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {allTemplates.map((template) => (
              <Card
                key={template.id}
                className={`cursor-pointer transition-all ${
                  selectedTemplate?.id === template.id
                    ? "ring-2 ring-primary shadow-lg"
                    : "hover:shadow-md"
                }`}
                onClick={() => handleTemplateSelect(template.id)}
              >
                <CardHeader className="pb-3 flex-row items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <CardDescription className="text-xs h-8 overflow-hidden">
                      {template.description || "No description"}
                    </CardDescription>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 -mt-1 -mr-1"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTemplateSelect(
                            template.id
                          ); /* TODO: Switch to editor tab */
                        }}
                      >
                        <Edit className="h-4 w-4 mr-2" /> Edit
                      </DropdownMenuItem>
                      {/* <DropdownMenuItem> <Copy className="h-4 w-4 mr-2" /> Duplicate </DropdownMenuItem> */}

                      {!DEFAULT_TEMPLATES.find(
                        (dt) => dt.id === template.id
                      ) && (
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            onTemplateDelete(template.id);
                          }}
                          className="text-destructive focus:text-destructive focus:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4 mr-2" /> Delete
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardHeader>
                <CardContent>
                  <div className="text-xs text-muted-foreground mb-2">
                    {template.elements.length} element
                    {template.elements.length !== 1 ? "s" : ""}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {template.elements.slice(0, 5).map((element) => (
                      <div
                        key={element.id}
                        className="flex items-center gap-1 bg-muted px-1.5 py-0.5 rounded text-xs"
                      >
                        {getElementIcon(element.type)}
                        <span className="capitalize">
                          {element.type.replace(/([A-Z])/g, " $1").trim()}
                        </span>
                      </div>
                    ))}
                    {template.elements.length > 5 && (
                      <div className="bg-muted px-1.5 py-0.5 rounded text-xs">
                        +{template.elements.length - 5} more
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Create New Template</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="new-template-name">Template Name</Label>
                <Input
                  id="new-template-name"
                  value={newTemplateName}
                  onChange={(e) => setNewTemplateName(e.target.value)}
                  placeholder="e.g., Main Service Display"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="new-template-desc">
                  Description (Optional)
                </Label>
                <Input
                  id="new-template-desc"
                  value={newTemplateDescription}
                  onChange={(e) => setNewTemplateDescription(e.target.value)}
                  placeholder="A brief description"
                />
              </div>
              <Button
                onClick={handleCreateTemplate}
                disabled={!newTemplateName.trim()}
              >
                <Plus className="h-4 w-4 mr-2" /> Create Template
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="editor" className="space-y-6 mt-4">
          {selectedTemplate ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Canvas: {selectedTemplate.name}</CardTitle>
                    <CardDescription>
                      Click an element to edit its properties. (Size based on
                      1920x1080)
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div
                      className="relative border-2 border-dashed border-muted-foreground/25 rounded-lg overflow-hidden aspect-[16/9]" // Maintain 16:9 aspect ratio
                      style={{
                        backgroundColor:
                          selectedTemplate.backgroundColor || "#333",
                      }}
                    >
                      {selectedTemplate.elements
                        .filter((el) => el.isVisible)
                        .map((element) => (
                          <div
                            key={element.id}
                            className={`absolute border rounded cursor-pointer flex items-center justify-center text-xs p-1 overflow-hidden
                                      ${
                                        editingElement?.id === element.id
                                          ? "border-primary ring-2 ring-primary bg-primary/20"
                                          : "border-muted-foreground/30 bg-muted-foreground/10 hover:bg-muted-foreground/20"
                                      }`}
                            style={{
                              left: `${(element.x / 1920) * 100}%`, // Assuming 1920 logical width
                              top: `${(element.y / 1080) * 100}%`, // Assuming 1080 logical height
                              width: `${(element.width / 1920) * 100}%`,
                              height: `${(element.height / 1080) * 100}%`,
                              color:
                                (element.style?.color as string) || "inherit",
                              fontSize:
                                (element.style?.fontSize as string) || "10px",
                            }}
                            onClick={() => setEditingElement(element)}
                            title={`Edit ${element.type}`}
                          >
                            {getElementIcon(element.type)}
                            <span className="ml-1 truncate">
                              {element.type.replace(/([A-Z])/g, " $1").trim()}
                            </span>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Template Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="template-bg-color">
                        Background Color
                      </Label>
                      <Input
                        type="color"
                        id="template-bg-color"
                        value={selectedTemplate.backgroundColor || "#ffffff"}
                        onChange={(e) =>
                          onTemplateUpdate({
                            ...selectedTemplate,
                            backgroundColor: e.target.value,
                          })
                        }
                      />
                    </div>
                    {/* Add more template-wide settings here if needed, e.g., backgroundImage URL */}
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Add Element</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-2">
                      {availableElementTypes.map((type) => (
                        <Button
                          key={type}
                          variant="outline"
                          size="sm"
                          onClick={() => handleElementAdd(type)}
                          className="flex items-center justify-start gap-1.5 text-xs"
                        >
                          {getElementIcon(type)}
                          <span className="capitalize">
                            {type.replace(/([A-Z])/g, " $1").trim()}
                          </span>
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {editingElement && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-base">
                        {getElementIcon(editingElement.type)}
                        Edit:{" "}
                        <span className="capitalize">
                          {editingElement.type
                            .replace(/([A-Z])/g, " $1")
                            .trim()}
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="space-y-1">
                        <Label className="text-xs">Position & Size</Label>
                        <div className="grid grid-cols-2 gap-2">
                          {(["x", "y", "width", "height"] as const).map(
                            (prop) => (
                              <div key={prop}>
                                <Label
                                  htmlFor={`el-${prop}`}
                                  className="text-xs capitalize"
                                >
                                  {prop}
                                </Label>
                                <Input
                                  id={`el-${prop}`}
                                  type="number"
                                  value={editingElement[prop]}
                                  onChange={(e) =>
                                    handleElementUpdate({
                                      [prop]: parseInt(e.target.value) || 0,
                                    })
                                  }
                                  className="h-8 text-xs"
                                />
                              </div>
                            )
                          )}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="el-fontsize" className="text-xs">
                          Font Size (px)
                        </Label>
                        <Input
                          id="el-fontsize"
                          type="number"
                          min="8"
                          max="200"
                          step="1"
                          value={
                            parseInt(
                              editingElement.style?.fontSize as string
                            ) || 16
                          }
                          onChange={(e) =>
                            handleElementUpdate({
                              style: { fontSize: `${e.target.value}px` },
                            })
                          }
                          className="h-8 text-xs"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="el-color" className="text-xs">
                          Text Color
                        </Label>
                        <Input
                          id="el-color"
                          type="color"
                          value={
                            (editingElement.style?.color as string) || "#000000"
                          }
                          onChange={(e) =>
                            handleElementUpdate({
                              style: { color: e.target.value },
                            })
                          }
                          className="h-8 w-full"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="el-bgcolor" className="text-xs">
                          Background Color
                        </Label>
                        <Input
                          id="el-bgcolor"
                          type="color"
                          value={
                            (editingElement.style?.backgroundColor as string) ||
                            "#ffffff00"
                          } // Default transparent
                          onChange={(e) =>
                            handleElementUpdate({
                              style: { backgroundColor: e.target.value },
                            })
                          }
                          className="h-8 w-full"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Text Alignment</Label>
                        <div className="flex gap-1">
                          {(["left", "center", "right"] as const).map(
                            (align) => (
                              <Button
                                key={align}
                                variant={
                                  editingElement.style?.textAlign === align
                                    ? "default"
                                    : "outline"
                                }
                                size="icon"
                                className="h-8 w-8"
                                onClick={() =>
                                  handleElementUpdate({
                                    style: { textAlign: align },
                                  })
                                }
                              >
                                {align === "left" && (
                                  <AlignLeft className="h-4 w-4" />
                                )}
                                {align === "center" && (
                                  <AlignCenter className="h-4 w-4" />
                                )}
                                {align === "right" && (
                                  <AlignRight className="h-4 w-4" />
                                )}
                              </Button>
                            )
                          )}
                        </div>
                      </div>
                      {editingElement.type === "customText" && (
                        <div className="space-y-1">
                          <Label htmlFor="el-text-content" className="text-xs">
                            Custom Text
                          </Label>
                          <Input
                            id="el-text-content"
                            type="text"
                            value={editingElement.text || ""}
                            onChange={(e) =>
                              handleElementUpdate({ text: e.target.value })
                            }
                            className="h-8 text-xs"
                            placeholder="Enter text for this element"
                          />
                        </div>
                      )}
                      <div className="flex items-center justify-between pt-2">
                        <Label htmlFor="el-visible" className="text-xs">
                          Visible
                        </Label>
                        <Switch
                          id="el-visible"
                          checked={editingElement.isVisible}
                          onCheckedChange={(checked) =>
                            handleElementUpdate({ isVisible: checked })
                          }
                        />
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleElementDelete(editingElement.id)}
                        className="w-full mt-2"
                      >
                        <Trash2 className="h-4 w-4 mr-2" /> Delete Element
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center h-64 text-center">
                <Layout className="h-12 w-12 mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">
                  Select a template from the 'Templates' tab to start editing.
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Or, create a new one.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="preview" className="space-y-6 mt-4 hidden md:block">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" /> Live Preview
              </CardTitle>
              <CardDescription>
                This is a simplified preview. Use the actual stage display for
                accurate rendering.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedTemplate ? (
                <div
                  className="border rounded-lg overflow-hidden aspect-[16/9] relative"
                  style={{
                    backgroundColor: selectedTemplate.backgroundColor || "#333",
                  }}
                >
                  {selectedTemplate.elements
                    .filter((el) => el.isVisible)
                    .map((el) => (
                      <div
                        key={el.id}
                        style={{
                          position: "absolute",
                          left: `${(el.x / 1920) * 100}%`,
                          top: `${(el.y / 1080) * 100}%`,
                          width: `${(el.width / 1920) * 100}%`,
                          height: `${(el.height / 1080) * 100}%`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: el.style?.textAlign || "center",
                          padding: "5px",
                          boxSizing: "border-box",
                          overflow: "hidden",
                          ...(el.style || {}),
                        }}
                        className="border border-dashed border-transparent/20" // For visual aid
                      >
                        <span
                          style={{
                            fontSize: el.style?.fontSize || "1rem",
                            color: el.style?.color || "#fff",
                          }}
                        >
                          {el.type === "customText" && el.text
                            ? el.text
                            : `[${el.type.replace(/([A-Z])/g, " $1").trim()}]`}
                        </span>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-64 border rounded-lg">
                  <p className="text-muted-foreground">
                    Select a template to see a live preview.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
