// src/components/Editor.tsx
import React, { useState, useEffect, useCallback } from "react";
import { Book, Music, Image, Video, Plus, Edit2, Trash2 } from "lucide-react";
import { ResizablePanelGroup, ResizablePanel } from "@/components/ui/resizable";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { BibleSearch } from "./BibleSearch";
import { SongLibrary } from "./SongLibrary";
import { MediaLibrary } from "./MediaLibrary";
import { SlideEditor } from "./SlideEditor";
import { Slide, Media } from "../types";
import { ScreenControl } from './ScreenControl';
import { usePresentationStore } from '../store/presentationStore';

type TabId = "bible" | "songs" | "media";

interface TabProps {
  id: TabId;
  icon: React.ReactNode;
  label: string;
  activeTab: TabId;
  setActiveTab: React.Dispatch<React.SetStateAction<TabId>>;
}

const Tab = ({ id, icon, label, activeTab, setActiveTab }: TabProps) => (
  <Button
    variant="ghost"
    className={cn(
      "flex-1 justify-center rounded-none border-b-2 border-b-transparent data-[state=active]:border-b-accent",
      "hover:bg-accent-foreground/5",
      "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
      "transition-colors duration-200",
      "data-[state=active]:bg-accent data-[state=active]:text-accent-foreground",
      id === "bible" && "rounded-tl-lg",
      id === "media" && "rounded-tr-lg"
    )}
    onClick={() => setActiveTab(id)}
  >
    {icon}
    <span className="ml-2">{label}</span>
  </Button>
);

interface EditorProps {
  className?: string;
  slides: Slide[];
  selectedSlide: number | null;
  setSelectedSlide: (id: number | null) => void;
  setPreviewContent: (content: string | null) => void;
  onSlideUpdate: (slide: Slide) => void;
}

export function Editor({
  className,
  slides,
  selectedSlide,
  setSelectedSlide,
  setPreviewContent,
  onSlideUpdate,
}: EditorProps) {
  const [activeTab, setActiveTab] = useState<TabId>("bible");
  const [isSlideEditDialogOpen, setIsSlideEditDialogOpen] = useState(false);
  const [currentEditSlide, setCurrentEditSlide] = useState<Slide | null>(null);
  const { addSlide } = usePresentationStore();

  const deleteSlide = useCallback(
    (id: number, e: React.MouseEvent) => {
      e.stopPropagation();
      if (slides.length > 1) {
        const newSlides = slides.filter((slide) => slide.id !== id);
        //setSlides(newSlides); // No setSlides
        if (selectedSlide === id) {
          setSelectedSlide(newSlides[0]?.id || null);
        }
      }
    },
    [slides,  selectedSlide, setSelectedSlide] // Removed setSlides
  );

  const handleMediaPreview = useCallback((item: Media | null) => {
    if (item) {
      if (item.type === 'video') {
        const video = document.createElement('video');
        video.src = item.url;
        video.controls = true;
        setPreviewContent(item.url);
      } else if (item.type === 'image') {
        const img = document.createElement('img');
        img.src = item.url;
        img.onload = () => setPreviewContent(item.url);
      }
    } else {
      setPreviewContent("Preview Area");
    }
  }, [setPreviewContent]);

  useEffect(() => {
    const slide = slides.find((slide) => slide.id === selectedSlide);
    if (slide) {
      setPreviewContent(slide.content || "Preview Area");
    } else {
      setPreviewContent("Preview Area");
    }
  }, [slides, selectedSlide, setPreviewContent]);

  return (
    <div className={cn("h-full", className)}>
      <div className="h-full grid grid-cols-[1fr,300px] gap-4">
        {/* Content Library */}
        <div className="border-r border-slate-800">
          <div className="flex border-b border-slate-800">
            <Tab
              id="bible"
              icon={<Book className="h-4 w-4" />}
              label="Bible"
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
            <Tab
              id="songs"
              icon={<Music className="h-4 w-4" />}
              label="Songs"
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
            <Tab
              id="media"
              icon={<Image className="h-4 w-4" />}
              label="Media"
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          </div>
          <div className="p-4">
            {activeTab === "bible" && <BibleSearch />}
            {activeTab === "songs" && <SongLibrary />}
            {activeTab === "media" && <MediaLibrary />}
          </div>
        </div>

        {/* Slide List */}
        <div className="h-full flex flex-col">
          <div className="p-2 border-b border-slate-800 flex justify-between items-center">
            <Button variant="ghost" size="sm" className="flex-1" onClick={() => addSlide({ id: Date.now(), type: 'blank', title: 'New Slide', content: '' })}>
              <Plus className="h-4 w-4 mr-2" />
              Add Blank Slide
            </Button>
            <Button variant="ghost" size="sm" className="ml-2" onClick={() => addSlide({ id: Date.now(), type: 'announcement', title: 'Announcement', content: '' })}>
              <Plus className="h-4 w-4 mr-2" />
              Announcement
            </Button>
            <Button variant="ghost" size="sm" className="ml-2" onClick={() => addSlide({ id: Date.now(), type: 'prayer', title: 'Prayer', content: '' })}>
              <Plus className="h-4 w-4 mr-2" />
              Prayer
            </Button>
          </div>
          
          <ScrollArea className="flex-1">
            <div className="space-y-1 p-2">
              {slides.map((slide) => (
                <div
                  key={slide.id}
                  onClick={() => setSelectedSlide(slide.id)}
                  className={cn(
                    "group p-2 rounded-md cursor-pointer transition-colors",
                    "hover:bg-slate-800/50",
                    selectedSlide === slide.id && "bg-slate-800/50"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="font-medium">{slide.title}</span>
                      {slide.type && (
                        <span className="ml-2 px-2 py-1 text-xs rounded-full bg-slate-700 text-slate-300">
                          {slide.type}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentEditSlide(slide);
                          setIsSlideEditDialogOpen(true);
                        }}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      {slides.length > 1 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive"
                          onClick={(e) => deleteSlide(slide.id, e)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* Keep Dialog */}
      <Dialog open={isSlideEditDialogOpen} onOpenChange={setIsSlideEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          {currentEditSlide && (
            <SlideEditor
              slide={currentEditSlide}
              onCancel={() => setIsSlideEditDialogOpen(false)}
              onSave={(updatedSlide) => {
                onSlideUpdate(updatedSlide);
                setIsSlideEditDialogOpen(false);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}