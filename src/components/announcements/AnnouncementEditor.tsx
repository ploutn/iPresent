import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import {
  Plus,
  Trash2,
  ArrowLeft,
  ArrowRight,
  Image as ImageIcon,
  Type,
} from "lucide-react";

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

interface AnnouncementEditorProps {
  onSave: (slides: Slide[]) => void;
  initialSlides?: Slide[];
}

export const AnnouncementEditor: React.FC<AnnouncementEditorProps> = ({
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
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setActiveIndex(Math.max(0, activeIndex - 1))}
            disabled={activeIndex === 0}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <span className="text-white font-medium">
            Slide {activeIndex + 1} / {slides.length}
          </span>
          <Button
            variant="outline"
            onClick={() =>
              setActiveIndex(Math.min(slides.length - 1, activeIndex + 1))
            }
            disabled={activeIndex === slides.length - 1}
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" onClick={addSlide}>
            <Plus className="h-4 w-4" /> Add Slide
          </Button>
          <Button
            variant="destructive"
            onClick={() => removeSlide(activeIndex)}
            disabled={slides.length === 1}
          >
            <Trash2 className="h-4 w-4" /> Remove Slide
          </Button>
        </div>
      </div>
      <Card className="bg-[#23272F] border-[#4A5568] mb-4">
        <CardContent className="relative min-h-[300px] flex flex-col items-center justify-center">
          {activeSlide.elements.map((el, idx) => (
            <div key={el.id} className="mb-4 w-full flex flex-col items-center">
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
                  <Input
                    type="text"
                    placeholder="Image URL"
                    value={el.src}
                    onChange={(e) =>
                      updateElement(activeIndex, idx, { src: e.target.value })
                    }
                    className="mb-2"
                  />
                  {el.src && (
                    <img
                      src={el.src}
                      alt="slide"
                      className="max-h-40 rounded shadow"
                    />
                  )}
                </div>
              ) : null}
              <div className="flex gap-2 mt-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => removeElement(idx)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          <div className="flex gap-4 mt-4">
            <Button variant="outline" onClick={() => addElement("text")}>
              {" "}
              <Type className="h-4 w-4 mr-1" /> Add Text
            </Button>
            <Button variant="outline" onClick={() => addElement("image")}>
              {" "}
              <ImageIcon className="h-4 w-4 mr-1" /> Add Image
            </Button>
          </div>
        </CardContent>
      </Card>
      <div className="flex justify-end">
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
