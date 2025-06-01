import { useState } from "react";
import { DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Slider } from "./ui/slider";
import { Switch } from "./ui/switch";
import {
  Type,
  Image,
  Video,
  Music,
  Palette,
  Layout,
  Settings,
  Save,
  Eye,
  EyeOff,
} from "lucide-react";
import { Slide, MediaElement } from "../types";
import { cn } from "../lib/utils";
import { RichTextEditor } from "./editor/RichTextEditor";
import { FontManager } from "./editor/FontManager";
import { TextEffects } from "./editor/TextEffects";
import { TextAnimations } from "./editor/TextAnimations";

interface SlideEditorProps {
  slide: Slide;
  onSave: (slide: Slide) => void;
  onCancel: () => void;
}

export function SlideEditor({ slide, onSave, onCancel }: SlideEditorProps) {
  const [editedSlide, setEditedSlide] = useState<Slide>({
    ...slide,
    mediaElements: slide.mediaElements || [], // Initialize mediaElements if undefined
  });
  const [activeTab, setActiveTab] = useState("content");

  const handleSave = () => {
    if (editedSlide.title.trim() && editedSlide.content.trim()) {
      onSave(editedSlide);
    }
  };

  const handleContentChange = (content: string) => {
    setEditedSlide({ ...editedSlide, content });
  };

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      <DialogHeader>
        <DialogTitle>Edit Slide</DialogTitle>
      </DialogHeader>

      <div className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="title" className="text-sm font-medium">
            Title
          </label>
          <Input
            id="title"
            value={editedSlide.title}
            onChange={(e) =>
              setEditedSlide({ ...editedSlide, title: e.target.value })
            }
            placeholder="Enter slide title"
          />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="content" className="flex items-center gap-2">
              <Type className="h-4 w-4" />
              Content
            </TabsTrigger>
            <TabsTrigger value="fonts" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Fonts
            </TabsTrigger>
            <TabsTrigger value="effects" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Effects
            </TabsTrigger>
            <TabsTrigger value="animations" className="flex items-center gap-2">
              <Layout className="h-4 w-4" />
              Animations
            </TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Content</label>
              <RichTextEditor
                value={editedSlide.content}
                onChange={handleContentChange}
                placeholder="Enter slide content..."
                className="min-h-[300px]"
                showToolbar={true}
              />
            </div>
          </TabsContent>

          <TabsContent value="fonts" className="space-y-4">
            <FontManager />
          </TabsContent>

          <TabsContent value="effects" className="space-y-4">
            <TextEffects />
          </TabsContent>

          <TabsContent value="animations" className="space-y-4">
            <TextAnimations />
          </TabsContent>
        </Tabs>

        <Card>
          <CardHeader>
            <CardTitle>Media Elements</CardTitle>
            <CardDescription>
              Manage images, videos, and audio for this slide.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {editedSlide.mediaElements.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No media elements added yet.
              </p>
            ) : (
              editedSlide.mediaElements.map((media, index) => (
                <div key={index} className="flex items-center space-x-2">
                  {media.type === "image" && <Image className="h-5 w-5" />}
                  {media.type === "video" && <Video className="h-5 w-5" />}
                  {media.type === "audio" && <Music className="h-5 w-5" />}
                  <Input
                    value={media.src}
                    onChange={(e) => {
                      const newMediaElements = [...editedSlide.mediaElements];
                      newMediaElements[index].src = e.target.value;
                      setEditedSlide({
                        ...editedSlide,
                        mediaElements: newMediaElements,
                      });
                    }}
                    placeholder={`Enter ${media.type} URL`}
                    className="flex-1"
                  />
                  <Label htmlFor={`media-visible-${index}`}>
                    {media.isVisible ? (
                      <Eye className="h-4 w-4" />
                    ) : (
                      <EyeOff className="h-4 w-4" />
                    )}
                  </Label>
                  <Switch
                    id={`media-visible-${index}`}
                    checked={media.isVisible}
                    onCheckedChange={(checked) => {
                      const newMediaElements = [...editedSlide.mediaElements];
                      newMediaElements[index].isVisible = checked;
                      setEditedSlide({
                        ...editedSlide,
                        mediaElements: newMediaElements,
                      });
                    }}
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      const newMediaElements = editedSlide.mediaElements.filter(
                        (_, i) => i !== index
                      );
                      setEditedSlide({
                        ...editedSlide,
                        mediaElements: newMediaElements,
                      });
                    }}
                  >
                    Remove
                  </Button>
                </div>
              ))
            )}
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={() =>
                  setEditedSlide({
                    ...editedSlide,
                    mediaElements: [
                      ...editedSlide.mediaElements,
                      {
                        type: "image",
                        src: "",
                        isVisible: true,
                        position: { x: 0, y: 0, width: 100, height: 100 },
                      },
                    ],
                  })
                }
              >
                <Image className="h-4 w-4 mr-2" /> Add Image
              </Button>
              <Button
                variant="outline"
                onClick={() =>
                  setEditedSlide({
                    ...editedSlide,
                    mediaElements: [
                      ...editedSlide.mediaElements,
                      {
                        type: "video",
                        src: "",
                        isVisible: true,
                        position: { x: 0, y: 0, width: 100, height: 100 },
                      },
                    ],
                  })
                }
              >
                <Video className="h-4 w-4 mr-2" /> Add Video
              </Button>
              <Button
                variant="outline"
                onClick={() =>
                  setEditedSlide({
                    ...editedSlide,
                    mediaElements: [
                      ...editedSlide.mediaElements,
                      {
                        type: "audio",
                        src: "",
                        isVisible: true,
                        position: { x: 0, y: 0, width: 100, height: 100 },
                      },
                    ],
                  })
                }
              >
                <Music className="h-4 w-4 mr-2" /> Add Audio
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSave}>
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </DialogFooter>
    </div>
  );
}
