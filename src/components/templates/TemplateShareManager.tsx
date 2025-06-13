import React, { useState } from "react";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Switch } from "../ui/switch";
import { useToast } from "../../hooks/use-toast";
import {
  Download,
  Upload,
  Share2,
  Copy,
  Link,
  QrCode,
  FileText,
  Package,
  Globe,
  Users,
  Lock,
  Eye,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { PresentationTemplate } from "../../types";
import { v4 as uuidv4 } from "uuid";
import { powerPointImporter } from "../../utils/powerPointImporter";
import { pdfExporter, PDFExportProgress } from "../../utils/pdfExporter";

export interface TemplateShareManagerProps {
  template: PresentationContentItem;
  isOpen: boolean;
  onClose: () => void;
  onTemplateImported?: (template: PresentationTemplate) => void;
  onTemplateShared?: (shareData: TemplateShareData) => void;
}

export interface TemplateShareData {
  id: string;
  templateId: string;
  shareUrl: string;
  shareCode: string;
  isPublic: boolean;
  allowDownload: boolean;
  allowModification: boolean;
  expiresAt?: Date;
  password?: string;
  description?: string;
  tags: string[];
  createdAt: Date;
}

export interface TemplateExportFormat {
  format: "json" | "zip" | "pptx" | "pdf";
  includeAssets: boolean;
  includeSettings: boolean;
  includeNotes: boolean;
  compression?: "none" | "low" | "medium" | "high";
}

const EXPORT_FORMATS = [
  {
    id: "json",
    name: "JSON Template",
    description: "Native iPresent template format",
    extension: ".json",
    icon: FileText,
  },
  {
    id: "zip",
    name: "Template Package",
    description: "Complete template with assets",
    extension: ".zip",
    icon: Package,
  },
  {
    id: "pptx",
    name: "PowerPoint",
    description: "Microsoft PowerPoint format",
    extension: ".pptx",
    icon: FileText,
  },
  {
    id: "pdf",
    name: "PDF Document",
    description: "Portable document format",
    extension: ".pdf",
    icon: FileText,
  },
];

export function TemplateShareManager({
  template,
  onClose,
  onTemplateImported,
  onTemplateShared,
}: TemplateShareManagerProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("share");
  const [isSharing, setIsSharing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [pdfExportProgress, setPdfExportProgress] =
    useState<PDFExportProgress | null>(null);

  // Share settings
  const [shareSettings, setShareSettings] = useState({
    isPublic: true,
    allowDownload: true,
    allowModification: false,
    requirePassword: false,
    password: "",
    expiresIn: "30", // days
    description: "",
    tags: [] as string[],
  });

  // Export settings
  const [exportSettings, setExportSettings] = useState<TemplateExportFormat>({
    format: "json" as const,
    includeAssets: true,
    includeSettings: true,
    includeNotes: true,
    compression: "medium",
  });

  // Import state
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importPreview, setImportPreview] =
    useState<PresentationTemplate | null>(null);

  // Generated share data
  const [shareData, setShareData] = useState<TemplateShareData | null>(null);

  const handleShare = async () => {
    setIsSharing(true);
    try {
      const shareCode = Math.random()
        .toString(36)
        .substring(2, 8)
        .toUpperCase();
      const shareUrl = `${window.location.origin}/templates/shared/${shareCode}`;

      const newShareData: TemplateShareData = {
        id: uuidv4(),
        templateId: template.id,
        shareUrl,
        shareCode,
        isPublic: shareSettings.isPublic,
        allowDownload: shareSettings.allowDownload,
        allowModification: shareSettings.allowModification,
        password: shareSettings.requirePassword
          ? shareSettings.password
          : undefined,
        expiresAt: shareSettings.expiresIn
          ? new Date(
              Date.now() +
                parseInt(shareSettings.expiresIn) * 24 * 60 * 60 * 1000
            )
          : undefined,
        description: shareSettings.description,
        tags: shareSettings.tags,
        createdAt: new Date(),
      };

      setShareData(newShareData);
      onTemplateShared?.(newShareData);

      toast({
        title: "Template Shared",
        description: "Your template has been shared successfully.",
      });
    } catch (error) {
      toast({
        title: "Share Failed",
        description: "Failed to share template. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSharing(false);
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      let exportData: any;
      let filename: string;
      let mimeType: string;

      const selectedFormat = EXPORT_FORMATS.find(
        (f) => f.id === exportSettings.format
      );

      switch (exportSettings.format) {
        case "json":
          exportData = {
            template: {
              ...template,
              settings: exportSettings.includeSettings
                ? template.settings
                : undefined,
              slides: template.slides.map((slide) => ({
                ...slide,
                notes: exportSettings.includeNotes ? slide.notes : undefined,
              })),
            },
            exportedAt: new Date().toISOString(),
            exportedBy: "iPresent",
            version: "1.0",
          };
          filename = `${template.name
            .replace(/[^a-z0-9]/gi, "_")
            .toLowerCase()}.json`;
          mimeType = "application/json";
          break;

        case "zip":
          // For ZIP format, we would need to implement a proper ZIP creation
          // For now, we'll create a JSON with metadata indicating it should be a ZIP
          exportData = {
            format: "template-package",
            template,
            assets: exportSettings.includeAssets ? [] : undefined, // Would contain actual assets
            metadata: {
              exportedAt: new Date().toISOString(),
              compression: exportSettings.compression,
            },
          };
          filename = `${template.name
            .replace(/[^a-z0-9]/gi, "_")
            .toLowerCase()}.zip`;
          mimeType = "application/zip";
          break;

        case "pptx":
          // PowerPoint export would require a specialized library
          exportData = {
            format: "powerpoint",
            slides: template.slides.map((slide) => ({
              title: slide.title,
              content: slide.content,
              notes: exportSettings.includeNotes ? slide.notes : undefined,
            })),
            metadata: {
              title: template.name,
              description: template.description,
              exportedAt: new Date().toISOString(),
            },
          };
          filename = `${template.name
            .replace(/[^a-z0-9]/gi, "_")
            .toLowerCase()}.pptx`;
          mimeType =
            "application/vnd.openxmlformats-officedocument.presentationml.presentation";
          break;

        case "pdf":
          try {
            setPdfExportProgress({
              currentSlide: 0,
              totalSlides: template.slides.length,
              stage: "preparing",
            });

            const pdfBlob = await pdfExporter.exportToPDF(
              template,
              {
                format: "a4",
                orientation: "landscape",
                quality: 0.8,
                includeNotes: exportSettings.includeNotes,
              },
              (progress) => setPdfExportProgress(progress)
            );

            exportData = pdfBlob;
            filename = `${template.name
              .replace(/[^a-z0-9]/gi, "_")
              .toLowerCase()}.pdf`;
            mimeType = "application/pdf";

            setPdfExportProgress(null);
          } catch (error) {
            console.error("PDF export failed:", error);
            toast({
              title: "Export Failed",
              description:
                "Failed to export presentation as PDF. Please try again.",
              variant: "destructive",
            });
            setPdfExportProgress(null);
            setIsExporting(false);
            return;
          }
          break;

        default:
          throw new Error("Unsupported export format");
      }

      // Create and download the file
      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: mimeType,
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Export Successful",
        description: `Template exported as ${selectedFormat?.name}.`,
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export template. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleImport = async (file: File) => {
    setIsImporting(true);
    try {
      // Handle PowerPoint files
      if (file.name.toLowerCase().endsWith(".pptx")) {
        toast({
          title: "Importing PowerPoint",
          description: "Importing PowerPoint file... This may take a moment.",
        });
        const importedTemplate = await powerPointImporter.importPPTX(file);
        if (importedTemplate) {
          setImportPreview(importedTemplate);
          toast({
            title: "PowerPoint Imported",
            description:
              "PowerPoint file imported successfully! Review and confirm to add to your library.",
          });
        } else {
          throw new Error(
            "Failed to import PowerPoint file. Please check the file format and try again."
          );
        }
        return;
      }

      // Handle JSON/ZIP files (existing logic)
      const text = await file.text();
      let importedData: any;

      try {
        importedData = JSON.parse(text);
      } catch {
        throw new Error("Invalid file format");
      }

      // Validate and extract template data
      let templateData: PresentationTemplate;

      if (importedData.template) {
        // iPresent native format
        templateData = importedData.template;
      } else if (importedData.format === "template-package") {
        // ZIP package format
        templateData = importedData.template;
      } else if (importedData.id && importedData.name && importedData.slides) {
        // Direct template format
        templateData = importedData;
      } else {
        throw new Error("Unrecognized template format");
      }

      // Generate new ID and update timestamps
      const newTemplate: PresentationTemplate = {
        ...templateData,
        id: uuidv4(),
        isBuiltIn: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      setImportPreview(newTemplate);

      toast({
        title: "Template Loaded",
        description:
          "Template preview is ready. Click import to add it to your library.",
      });
    } catch (error) {
      toast({
        title: "Import Failed",
        description:
          error instanceof Error ? error.message : "Failed to import template.",
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
    }
  };

  const confirmImport = () => {
    if (importPreview) {
      onTemplateImported?.(importPreview);
      toast({
        title: "Template Imported",
        description: `"${importPreview.name}" has been added to your template library.`,
      });
      onClose();
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Copied to clipboard.",
    });
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Share & Export Template</DialogTitle>
          <DialogDescription>
            Share your template with others or export it in various formats.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="share">Share</TabsTrigger>
            <TabsTrigger value="export">Export</TabsTrigger>
            <TabsTrigger value="import">Import</TabsTrigger>
          </TabsList>

          <TabsContent value="share" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Share2 className="h-5 w-5" />
                  Share Template
                </CardTitle>
                <CardDescription>
                  Generate a shareable link for "{template.name}"
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Visibility</Label>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={shareSettings.isPublic}
                        onCheckedChange={(checked) =>
                          setShareSettings((prev) => ({
                            ...prev,
                            isPublic: checked,
                          }))
                        }
                      />
                      <Label className="text-sm">
                        {shareSettings.isPublic ? "Public" : "Private"}
                      </Label>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Permissions</Label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={shareSettings.allowDownload}
                          onCheckedChange={(checked) =>
                            setShareSettings((prev) => ({
                              ...prev,
                              allowDownload: checked,
                            }))
                          }
                        />
                        <Label className="text-sm">Allow Download</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={shareSettings.allowModification}
                          onCheckedChange={(checked) =>
                            setShareSettings((prev) => ({
                              ...prev,
                              allowModification: checked,
                            }))
                          }
                        />
                        <Label className="text-sm">Allow Modification</Label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Expires In</Label>
                    <Select
                      value={shareSettings.expiresIn}
                      onValueChange={(value) =>
                        setShareSettings((prev) => ({
                          ...prev,
                          expiresIn: value,
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 Day</SelectItem>
                        <SelectItem value="7">1 Week</SelectItem>
                        <SelectItem value="30">1 Month</SelectItem>
                        <SelectItem value="90">3 Months</SelectItem>
                        <SelectItem value="365">1 Year</SelectItem>
                        <SelectItem value="0">Never</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={shareSettings.requirePassword}
                        onCheckedChange={(checked) =>
                          setShareSettings((prev) => ({
                            ...prev,
                            requirePassword: checked,
                          }))
                        }
                      />
                      <Label>Password Protection</Label>
                    </div>
                    {shareSettings.requirePassword && (
                      <Input
                        type="password"
                        placeholder="Enter password"
                        value={shareSettings.password}
                        onChange={(e) =>
                          setShareSettings((prev) => ({
                            ...prev,
                            password: e.target.value,
                          }))
                        }
                      />
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Description (Optional)</Label>
                  <Textarea
                    placeholder="Add a description for this shared template..."
                    value={shareSettings.description}
                    onChange={(e) =>
                      setShareSettings((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                  />
                </div>

                <Button
                  onClick={handleShare}
                  disabled={isSharing}
                  className="w-full"
                >
                  {isSharing
                    ? "Generating Share Link..."
                    : "Generate Share Link"}
                </Button>

                {shareData && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-green-600">
                        <CheckCircle className="h-5 w-5" />
                        Template Shared Successfully
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="space-y-2">
                        <Label>Share URL</Label>
                        <div className="flex gap-2">
                          <Input value={shareData.shareUrl} readOnly />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyToClipboard(shareData.shareUrl)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Share Code</Label>
                        <div className="flex gap-2">
                          <Input value={shareData.shareCode} readOnly />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyToClipboard(shareData.shareCode)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Badge
                          variant={shareData.isPublic ? "default" : "secondary"}
                        >
                          {shareData.isPublic ? "Public" : "Private"}
                        </Badge>
                        {shareData.allowDownload && (
                          <Badge variant="outline">Downloadable</Badge>
                        )}
                        {shareData.allowModification && (
                          <Badge variant="outline">Editable</Badge>
                        )}
                        {shareData.password && (
                          <Badge variant="outline">Password Protected</Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="export" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="h-5 w-5" />
                  Export Template
                </CardTitle>
                <CardDescription>
                  Export "{template.name}" in your preferred format
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Export Format</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {EXPORT_FORMATS.map((format) => {
                      const Icon = format.icon;
                      return (
                        <Card
                          key={format.id}
                          className={`cursor-pointer transition-colors ${
                            exportSettings.format === format.id
                              ? "ring-2 ring-primary"
                              : "hover:bg-muted"
                          }`}
                          onClick={() =>
                            setExportSettings((prev) => ({
                              ...prev,
                              format: format.id as any,
                            }))
                          }
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                              <Icon className="h-8 w-8 text-muted-foreground" />
                              <div>
                                <div className="font-medium">{format.name}</div>
                                <div className="text-sm text-muted-foreground">
                                  {format.description}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Export Options</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={exportSettings.includeAssets}
                        onCheckedChange={(checked) =>
                          setExportSettings((prev) => ({
                            ...prev,
                            includeAssets: checked,
                          }))
                        }
                      />
                      <Label className="text-sm">Include Media Assets</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={exportSettings.includeSettings}
                        onCheckedChange={(checked) =>
                          setExportSettings((prev) => ({
                            ...prev,
                            includeSettings: checked,
                          }))
                        }
                      />
                      <Label className="text-sm">
                        Include Template Settings
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={exportSettings.includeNotes}
                        onCheckedChange={(checked) =>
                          setExportSettings((prev) => ({
                            ...prev,
                            includeNotes: checked,
                          }))
                        }
                      />
                      <Label className="text-sm">Include Speaker Notes</Label>
                    </div>
                  </div>
                </div>

                {exportSettings.format === "zip" && (
                  <div className="space-y-2">
                    <Label>Compression Level</Label>
                    <Select
                      value={exportSettings.compression}
                      onValueChange={(value) =>
                        setExportSettings((prev) => ({
                          ...prev,
                          compression: value as any,
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No Compression</SelectItem>
                        <SelectItem value="low">Low Compression</SelectItem>
                        <SelectItem value="medium">
                          Medium Compression
                        </SelectItem>
                        <SelectItem value="high">High Compression</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {pdfExportProgress && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Exporting PDF...</span>
                      <span>
                        {pdfExportProgress.currentSlide}/
                        {pdfExportProgress.totalSlides}
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${
                            (pdfExportProgress.currentSlide /
                              pdfExportProgress.totalSlides) *
                            100
                          }%`,
                        }}
                      />
                    </div>
                    <div className="text-xs text-muted-foreground capitalize">
                      {pdfExportProgress.stage}
                    </div>
                  </div>
                )}

                <Button
                  onClick={handleExport}
                  disabled={isExporting || !!pdfExportProgress}
                  className="w-full"
                >
                  {isExporting || pdfExportProgress
                    ? "Exporting..."
                    : `Export as ${
                        EXPORT_FORMATS.find(
                          (f) => f.id === exportSettings.format
                        )?.name
                      }`}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="import" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Import Template
                </CardTitle>
                <CardDescription>
                  Import a template from a file or shared link
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Import from File</Label>
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                    <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <div className="space-y-2">
                      <div className="text-sm font-medium">
                        Drop template file here
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Supports .json, .zip, .pptx files
                      </div>
                      <Input
                        type="file"
                        accept=".json,.zip,.pptx"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setImportFile(file);
                            handleImport(file);
                          }
                        }}
                        className="max-w-xs mx-auto"
                      />
                    </div>
                  </div>
                </div>

                {importPreview && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Eye className="h-5 w-5" />
                        Template Preview
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium">Name</Label>
                          <div className="text-sm">{importPreview.name}</div>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">
                            Category
                          </Label>
                          <div className="text-sm">
                            {importPreview.category}
                          </div>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Slides</Label>
                          <div className="text-sm">
                            {importPreview.slides.length} slides
                          </div>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Tags</Label>
                          <div className="flex flex-wrap gap-1">
                            {importPreview.tags.map((tag) => (
                              <Badge
                                key={tag}
                                variant="outline"
                                className="text-xs"
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm font-medium">
                          Description
                        </Label>
                        <div className="text-sm text-muted-foreground">
                          {importPreview.description}
                        </div>
                      </div>

                      <Button onClick={confirmImport} className="w-full">
                        Import Template
                      </Button>
                    </CardContent>
                  </Card>
                )}

                <div className="space-y-2">
                  <Label>Import from Share Code</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter 6-digit share code"
                      maxLength={6}
                    />
                    <Button variant="outline">Import</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
