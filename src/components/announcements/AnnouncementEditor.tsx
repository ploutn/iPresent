import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import {
  Plus,
  Trash2,
  ArrowLeft,
  ArrowRight,
  Image as ImageIcon,
  Type,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export interface Slide {
  id: string;
  elements: SlideElement[];
}

interface SlideElement {
  id: string;
  type: "text" | "image";
  content?: string;
  src?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fontSize?: number;
  fontFamily?: string;
  fontColor?: string;
  textAlign?: "left" | "center" | "right";
}

// Form-based editor interface
interface AnnouncementFormEditorProps {
  title: string;
  content: string;
  category: string;
  status: "draft" | "published";
  onTitleChange: (title: string) => void;
  onContentChange: (content: string) => void;
  onCategoryChange: (category: string) => void;
  onStatusChange: (status: "draft" | "published") => void;
}

// Slide-based editor interface
interface AnnouncementSlideEditorProps {
  onSave: (slides: Slide[]) => void;
  initialSlides?: Slide[];
}

type AnnouncementEditorProps = AnnouncementFormEditorProps | AnnouncementSlideEditorProps;

// Type guard to check if props are for form editor
function isFormEditorProps(props: AnnouncementEditorProps): props is AnnouncementFormEditorProps {
  return 'title' in props;
}

// Form-based editor component
const AnnouncementFormEditor: React.FC<AnnouncementFormEditorProps> = ({
  title,
  content,
  category,
  status,
  onTitleChange,
  onContentChange,
  onCategoryChange,
  onStatusChange,
}) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title" className="text-white">
          Title
        </Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Enter announcement title"
          className="bg-[#2D3748] border-[#4A5568] text-white placeholder-[#A0AEC0]"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="content" className="text-white">
          Content
        </Label>
        <Textarea
          id="content"
          value={content}
          onChange={(e) => onContentChange(e.target.value)}
          placeholder="Enter announcement content"
          rows={4}
          className="bg-[#2D3748] border-[#4A5568] text-white placeholder-[#A0AEC0] resize-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="category" className="text-white">
            Category
          </Label>
          <Select value={category} onValueChange={onCategoryChange}>
            <SelectTrigger className="bg-[#2D3748] border-[#4A5568] text-white">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent className="bg-[#2D3748] border-[#4A5568] text-white">
              <SelectItem value="Events">Events</SelectItem>
              <SelectItem value="Announcements">Announcements</SelectItem>
              <SelectItem value="News">News</SelectItem>
              <SelectItem value="Updates">Updates</SelectItem>
              <SelectItem value="Community">Community</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="status" className="text-white">
            Status
          </Label>
          <Select value={status} onValueChange={onStatusChange}>
            <SelectTrigger className="bg-[#2D3748] border-[#4A5568] text-white">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent className="bg-[#2D3748] border-[#4A5568] text-white">
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="published">Published</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

// Slide-based editor component
const AnnouncementSlideEditor: React.FC<AnnouncementSlideEditorProps> = ({
  onSave,
  initialSlides = [],
}) => {
  const [slides, setSlides] = useState<Slide[]>(
    initialSlides.length ? initialSlides : [createBlankSlide()]
  );
  const [activeIndex, setActiveIndex] = useState(0);

  function createBlankSlide(): Slide {
    return {
      id: uuidv4(),
      elements: [
        {
          id: uuidv4(),
          type: "text",
          content: "Announcement Title",
          x: 10,
          y: 10,
          width: 80,
          height: 20,
          fontSize: 36,
          fontFamily: "Arial",
          fontColor: "#ffffff",
          textAlign: "center",
        },
        {
          id: uuidv4(),
          type: "text",
          content: "Subtitle or details go here...",
          x: 10,
          y: 40,
          width: 80,
          height: 20,
          fontSize: 20,
          fontFamily: "Arial",
          fontColor: "#cccccc",
          textAlign: "center",
        },
      ],
    };
  }

  function addSlide() {
    setSlides([...slides, createBlankSlide()]);
    setActiveIndex(slides.length);
  }

  function removeSlide(index: number) {
    if (slides.length === 1) return;
    const newSlides = slides.filter((_, i) => i !== index);
    setSlides(newSlides);
    setActiveIndex(Math.max(0, index - 1));
  }

  function updateElement(
    slideIdx: number,
    elementIdx: number,
    updates: Partial<SlideElement>
  ) {
    const newSlides = slides.map((slide, sIdx) =>
      sIdx === slideIdx
        ? {
            ...slide,
            elements: slide.elements.map((el, eIdx) =>
              eIdx === elementIdx ? { ...el, ...updates } : el
            ),
          }
        : slide
    );
    setSlides(newSlides);
  }

  function addElement(type: "text" | "image") {
    const newElement: SlideElement = {
      id: uuidv4(),
      type,
      content: type === "text" ? "New Text" : undefined,
      src: type === "image" ? "" : undefined,
      x: 10,
      y: 10,
      width: 60,
      height: 20,
      fontSize: 20,
      fontFamily: "Arial",
      fontColor: "#ffffff",
      textAlign: "left",
    };
    const newSlides = slides.map((slide, idx) =>
      idx === activeIndex
        ? { ...slide, elements: [...slide.elements, newElement] }
        : slide
    );
    setSlides(newSlides);
  }

  function removeElement(elementIdx: number) {
    const newSlides = slides.map((slide, idx) =>
      idx === activeIndex
        ? {
            ...slide,
            elements: slide.elements.filter((_, i) => i !== elementIdx),
          }
        : slide
    );
    setSlides(newSlides);
  }

  const activeSlide = slides[activeIndex];

  return (
    <div className="w-full max-w-3xl mx-auto bg-[#181C23] rounded-lg shadow-lg p-6 mt-8">
      {" "}
      <div className="flex items-center justify-between mb-4">
        {" "}
        <div className="flex gap-2">
          {" "}
          <Button
            variant="outline"
            onClick={() => setActiveIndex(Math.max(0, activeIndex - 1))}
            disabled={activeIndex === 0}
          >
            {" "}
            <ArrowLeft className="h-4 w-4" />{" "}
          </Button>{" "}
          <span className="text-white font-medium">
            {" "}
            Slide {activeIndex + 1} / {slides.length}{" "}
          </span>{" "}
          <Button
            variant="outline"
            onClick={() =>
              setActiveIndex(Math.min(slides.length - 1, activeIndex + 1))
            }
            disabled={activeIndex === slides.length - 1}
          >
            {" "}
            <ArrowRight className="h-4 w-4" />{" "}
          </Button>{" "}
        </div>{" "}
        <div className="flex gap-2">
          {" "}
          <Button variant="ghost" onClick={addSlide}>
            {" "}
            <Plus className="h-4 w-4" /> Add Slide{" "}
          </Button>{" "}
          <Button
            variant="destructive"
            onClick={() => removeSlide(activeIndex)}
            disabled={slides.length === 1}
          >
            {" "}
            <Trash2 className="h-4 w-4" /> Remove Slide{" "}
          </Button>{" "}
        </div>{" "}
      </div>{" "}
      <Card className="bg-[#23272F] border-[#4A5568] mb-4">
        {" "}
        <CardContent className="relative min-h-[300px] flex flex-col items-center justify-center">
          {" "}
          {(activeSlide?.elements || []).map((el, idx) => (
            <div key={el.id} className="mb-4 w-full flex flex-col items-center">
              {" "}
              {el.type === "text" ? (
                <Textarea
                  className="text-white bg-transparent border-none text-center text-lg font-semibold resize-none focus:ring-2 focus:ring-[#3182CE]"
                  value={el.content}
                  style={{
                    fontSize: el.fontSize,
                    color: el.fontColor,
                    fontFamily: el.fontFamily,
                    textAlign: el.textAlign,
                  }}
                  onChange={(e) =>
                    updateElement(activeIndex, idx, { content: e.target.value })
                  }
                  rows={2}
                />
              ) : el.type === "image" ? (
                <div className="flex flex-col items-center">
                  {" "}
                  <Input
                    type="text"
                    placeholder="Image URL"
                    value={el.src}
                    onChange={(e) =>
                      updateElement(activeIndex, idx, { src: e.target.value })
                    }
                    className="mb-2"
                  />{" "}
                  {el.src && (
                    <img
                      src={el.src}
                      alt="slide"
                      className="max-h-40 rounded shadow"
                    />
                  )}{" "}
                </div>
              ) : null}{" "}
              <div className="flex gap-2 mt-2">
                {" "}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => removeElement(idx)}
                >
                  {" "}
                  <Trash2 className="h-4 w-4" />{" "}
                </Button>{" "}
              </div>{" "}
            </div>
          ))}{" "}
          <div className="flex gap-4 mt-4">
            {" "}
            <Button variant="outline" onClick={() => addElement("text")}>
              {" "}
              <Type className="h-4 w-4 mr-1" /> Add Text{" "}
            </Button>{" "}
            <Button variant="outline" onClick={() => addElement("image")}>
              {" "}
              <ImageIcon className="h-4 w-4 mr-1" /> Add Image{" "}
            </Button>{" "}
          </div>{" "}
        </CardContent>{" "}
      </Card>{" "}
      <div className="flex justify-end">
        {" "}
        <Button
          onClick={() => onSave(slides)}
          className="bg-[#3182CE] text-white hover:bg-[#2563EB]"
        >
          Save Announcement
        </Button>
      </div>
    </div>
  );
};

// Main AnnouncementEditor component that handles both interfaces
export const AnnouncementEditor: React.FC<AnnouncementEditorProps> = (props) => {
  if (isFormEditorProps(props)) {
    return <AnnouncementFormEditor {...props} />;
  } else {
    return <AnnouncementSlideEditor {...props} />;
  }
};
