import React, { useState, useEffect } from "react";
import {
  Plus,
  Save,
  X,
  FileText,
  BookOpen,
  Music,
  Type,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Settings,
  Image,
  Eye,
} from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { Slide, SlideElement, PresentationContentItem } from "../../types";

interface PresentationEditorProps {
  presentation: PresentationContentItem;
  onSave: (presentation: PresentationContentItem) => void;
  onCancel: () => void;
}

const PresentationEditor: React.FC<PresentationEditorProps> = React.memo(
  ({
    presentation,
    onSave,
    onCancel,
  }) => {
    const [currentSlide, setCurrentSlide] = useState<Slide>(
      presentation.slides[0] || {
        id: uuidv4(),
        title: "New Slide",
        content: "",
        type: "presentation",
        order: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        backgroundColor: "#000000",
        textColor: "#ffffff",
        fontSize: 24,
        fontFamily: "Arial",
        textAlign: "center",
        elements: [],
      }
    );
    const [text, setText] = useState(currentSlide.content || "");
    const [textColor, setTextColor] = useState(currentSlide.textColor || "#ffffff");
    const [fontSize, setFontSize] = useState(currentSlide.fontSize?.toString() || "24");
      const [alignment, setAlignment] = useState<"left" | "center" | "right" | "justify">(currentSlide.textAlign || "center");
    const [backgroundColor, setBackgroundColor] = useState(currentSlide.backgroundColor || "#000000");
    const [slideTitle, setSlideTitle] = useState(currentSlide.title || "New Slide");
    const [autoSave, setAutoSave] = useState(true);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);
    const [selectedElement, setSelectedElement] = useState<SlideElement | null>(null);
    const [showSettings, setShowSettings] = useState(false);
    const [showBibleVerseSearch, setShowBibleVerseSearch] = useState(false);
    const [showSongSearch, setShowSongSearch] = useState(false);
    const [showMediaUpload, setShowMediaUpload] = useState(false);
    const [showMediaLibrary, setShowMediaLibrary] = useState(false);
    const [showTemplates, setShowTemplates] = useState(false);
    const [showPresenterNotes, setShowPresenterNotes] = useState(false);
    const [showAudienceNotes, setShowAudienceNotes] = useState(false);
    const [showTimer, setShowTimer] = useState(false);
    const [showCountdown, setShowCountdown] = useState(false);
    const [showRemoteControl, setShowRemoteControl] = useState(false);
    const [showLivePreview, setShowLivePreview] = useState(false);

    // Auto-save functionality
    useEffect(() => {
      if (autoSave) {
        const timer = setTimeout(() => {
          handleSave();
        }, 1000);
        return () => clearTimeout(timer);
      }
    }, [text, textColor, fontSize, alignment, backgroundColor, slideTitle, autoSave]);

    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setText(e.target.value);
    };

    const handleElementChange = (property: string, value: any) => {
      if (!selectedElement) return;

      const updatedElement = {
        ...selectedElement,
        [property]: value,
      };

      const updatedSlide = {
        ...currentSlide,
        elements: currentSlide.elements.map((element) =>
          element.id === selectedElement.id ? updatedElement : element
        ),
      };

      setCurrentSlide(updatedSlide);
      setSelectedElement(updatedElement);

      const updatedPresentation = {
        ...presentation,
        slides: presentation.slides.map((slide) =>
          slide.id === currentSlide.id ? updatedSlide : slide
        ),
      };

      onSave(updatedPresentation);
    };

    const handleSave = () => {
      const updatedSlide = {
        ...currentSlide,
        title: slideTitle,
        content: text,
        textColor: textColor,
        fontSize: parseInt(fontSize),
        textAlign: alignment as "left" | "center" | "right" | "justify",
        backgroundColor: backgroundColor,
        updatedAt: new Date(),
      };

      const updatedPresentation = {
        ...presentation,
        slides: presentation.slides.length > 0 
          ? presentation.slides.map(slide => 
              slide.id === currentSlide.id ? updatedSlide : slide
            )
          : [updatedSlide],
        updatedAt: new Date(),
      };

      onSave(updatedPresentation);
      setLastSaved(new Date());
    };

    const handleAddSlide = () => {
      const newSlide: Slide = {
        id: uuidv4(),
        title: `Slide ${presentation.slides.length + 1}`,
        content: "",
        type: "presentation",
        order: presentation.slides.length,
        createdAt: new Date(),
        updatedAt: new Date(),
        backgroundColor: "#000000",
        textColor: "#ffffff",
        fontSize: 24,
        fontFamily: "Arial",
        textAlign: "center",
        elements: [],
      };
      const updatedPresentation = {
        ...presentation,
        slides: [...presentation.slides, newSlide],
      };
      onSave(updatedPresentation);
      setCurrentSlide(newSlide);
      setText("");
      setTextColor("#ffffff");
      setFontSize("24");
      setAlignment("center");
      setBackgroundColor("#000000");
      setSlideTitle(newSlide.title);
    };

    const handleDeleteSlide = (slideId: string) => {
      const updatedSlides = presentation.slides.filter((slide) => slide.id !== slideId);
      const updatedPresentation = {
        ...presentation,
        slides: updatedSlides,
      };
      onSave(updatedPresentation);
      if (currentSlide.id === slideId) {
        setCurrentSlide(updatedSlides[0] || null);
        setText(updatedSlides[0]?.content || "");
        setTextColor(updatedSlides[0]?.textColor || "#ffffff");
        setFontSize(updatedSlides[0]?.fontSize?.toString() || "24");
        setAlignment(updatedSlides[0]?.textAlign || "center");
        setBackgroundColor(updatedSlides[0]?.backgroundColor || "#000000");
        setSlideTitle(updatedSlides[0]?.title || "New Slide");
      }
    };

    const handleAddMedia = (type: 'image' | 'video', src: string) => {
      const newElement: SlideElement = {
        id: uuidv4(),
        type: type,
        src: src,
        x: 50,
        y: 50,
        width: 200,
        height: 150,
      };
      const updatedSlide = {
        ...currentSlide,
        elements: [...currentSlide.elements, newElement],
      };
      setCurrentSlide(updatedSlide);
      const updatedPresentation = {
        ...presentation,
        slides: presentation.slides.map((slide) =>
          slide.id === currentSlide.id ? updatedSlide : slide
        ),
      };
      onSave(updatedPresentation);
    };

    const handleExportPresentation = () => {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(presentation));
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute("href",     dataStr);
      downloadAnchorNode.setAttribute("download", `${presentation.title || 'presentation'}.json`);
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
    };

    const handleImportPresentation = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const importedPresentation: PresentationContentItem = JSON.parse(e.target?.result as string);
            // Here you would typically integrate the imported presentation into your state
            // For now, let's just log it and perhaps replace the current one for demonstration
            console.log("Imported Presentation:", importedPresentation);
            onSave(importedPresentation); // Assuming onSave can handle replacing the entire presentation
          } catch (error) {
            console.error("Error parsing imported presentation JSON:", error);
            alert("Failed to import presentation. Invalid file format.");
          }
        };
        reader.readAsText(file);
      }
    };

    const handleAddElement = (type: 'text' | 'image' | 'video' | 'shape') => {
      const newElement: SlideElement = {
        id: uuidv4(),
        type: type,
        x: 100,
        y: 100,
        width: 100,
        height: 50,
        content: type === 'text' ? 'New Text' : undefined,
        src: (type === 'image' || type === 'video') ? 'placeholder.png' : undefined, // Placeholder for media
        backgroundColor: type === 'shape' ? '#cccccc' : undefined,
        fontSize: type === 'text' ? 24 : undefined,
        textColor: type === 'text' ? '#ffffff' : undefined,
      };
      const updatedSlide = {
        ...currentSlide,
        elements: [...currentSlide.elements, newElement],
      };
      setCurrentSlide(updatedSlide);
      const updatedPresentation = {
        ...presentation,
        slides: presentation.slides.map((slide) =>
          slide.id === currentSlide.id ? updatedSlide : slide
        ),
      };
      onSave(updatedPresentation);
    };

    return (
      <div className="flex flex-col h-full bg-gray-100">
        {/* Header */}
        <div className="flex justify-between items-center p-4 bg-white border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-800">Church Presentation Editor</h1>
            <input
              type="text"
              value={slideTitle}
              onChange={(e) => setSlideTitle(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Slide Title"
            />
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleSave}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <Save className="h-4 w-4 mr-2" />
              Save
            </button>
            <button
              onClick={onCancel}
              className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </button>
          </div>
        </div>

        <div className="flex flex-1">
          {/* Left Sidebar - Slides */}
          <div className="w-64 bg-white border-r border-gray-200 overflow-y-auto">
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Slides</h3>
                <button
                  onClick={handleAddSlide}
                  className="flex items-center px-2 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </button>
              </div>
              <div className="space-y-2">
                {presentation.slides.map((slide, index) => (
                  <div
                    key={slide.id}
                    className={`p-3 rounded-md cursor-pointer border ${
                      currentSlide.id === slide.id
                        ? "bg-blue-100 border-blue-300"
                        : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                    }`}




                    onClick={() => {
                      setCurrentSlide(slide);
                      setText(slide.content || "");
                      setTextColor(slide.textColor || "#ffffff");
                      setFontSize(slide.fontSize?.toString() || "24");
                      setAlignment(slide.textAlign || "center");
                      setBackgroundColor(slide.backgroundColor || "#000000");
                      setSlideTitle(slide.title || "New Slide");
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 mr-2 text-gray-500" />
                        <span className="text-sm font-medium text-gray-900 truncate">
                          {slide.title || `Slide ${index + 1}`}
                        </span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteSlide(slide.id);
                        }}
                        className="text-red-500 hover:text-red-700 ml-2"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Church Tools */}
            <div className="p-4 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Church Tools</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setShowBibleVerseSearch(true)}
                  className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  Add Bible Verse
                </button>
                <button
                  onClick={() => setShowSongSearch(true)}
                  className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
                >
                  <Music className="h-4 w-4 mr-2" />
                  Add Song Lyrics
                </button>
              </div>
            </div>

            {/* File Operations */}
            <div className="p-4 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">File Operations</h3>
              <div className="space-y-2">
                <button
                  onClick={handleExportPresentation}
                  className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Export Presentation
                </button>
                <label htmlFor="import-presentation-file"
                  className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md cursor-pointer"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Import Presentation
                  <input
                    id="import-presentation-file"
                    type="file"
                    accept=".json"
                    onChange={handleImportPresentation}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Main Editor Area */}
          <div className="flex-1 p-6">
            <div className="max-w-4xl mx-auto">
              {/* Formatting Controls */}
              <div className="bg-white rounded-lg p-4 shadow-md mb-6">
                <div className="flex flex-wrap gap-4 items-center">
                  <div className="flex items-center">
                    <label htmlFor="textColor" className="mr-2 text-gray-700 font-medium">Text Color:</label>
                    <input
                      type="color"
                      id="textColor"
                      value={textColor}
                      onChange={(e) => setTextColor(e.target.value)}
                      className="w-12 h-8 border border-gray-300 rounded cursor-pointer"
                    />
                  </div>
                  
                  <div className="flex items-center">
                    <label htmlFor="backgroundColor" className="mr-2 text-gray-700 font-medium">Background:</label>
                    <input
                      type="color"
                      id="backgroundColor"
                      value={backgroundColor}
                      onChange={(e) => setBackgroundColor(e.target.value)}
                      className="w-12 h-8 border border-gray-300 rounded cursor-pointer"
                    />
                  </div>
                  
                  <div className="flex items-center">
                    <label htmlFor="fontSize" className="mr-2 text-gray-700 font-medium">Size:</label>
                    <select
                      id="fontSize"
                      value={fontSize}
                      onChange={(e) => setFontSize(e.target.value)}
                      className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="16">Small (16px)</option>
                      <option value="20">Medium (20px)</option>
                      <option value="24">Large (24px)</option>
                      <option value="32">X-Large (32px)</option>
                      <option value="48">XX-Large (48px)</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center">
                    <label className="mr-2 text-gray-700 font-medium">Align:</label>
                    <div className="flex border border-gray-300 rounded-md overflow-hidden">
                      <button
                        onClick={() => setAlignment("left")}
                        className={`p-2 ${
                          alignment === "left" ? "bg-blue-500 text-white" : "bg-white text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        <AlignLeft className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setAlignment("center")}
                        className={`p-2 border-l border-gray-300 ${
                          alignment === "center" ? "bg-blue-500 text-white" : "bg-white text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        <AlignCenter className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setAlignment("right")}
                        className={`p-2 border-l border-gray-300 ${
                          alignment === "right" ? "bg-blue-500 text-white" : "bg-white text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        <AlignRight className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setAlignment("justify")}
                        className={`p-2 border-l border-gray-300 ${
                          alignment === "justify" ? "bg-blue-500 text-white" : "bg-white text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        <AlignJustify className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Text Editor */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">Slide Content</h2>
                    <div className="flex items-center space-x-2">
                      <Type className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-500">{text.length} characters</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-4">
                  <textarea
                    className="w-full h-96 p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    style={{
                      backgroundColor: backgroundColor,
                      color: textColor,
                      fontSize: `${fontSize}px`,
                      textAlign: alignment as any,
                      fontFamily: "Arial, sans-serif",
                    }}
                    value={text}
                    onChange={handleTextChange}
                  />
                </div>
              </div>

              {/* Auto-save Status */}
              <div className="mt-4 text-center">
                <div className="flex items-center justify-center space-x-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={autoSave}
                      onChange={(e) => setAutoSave(e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-600">Auto-save</span>
                  </label>
                  {lastSaved && (
                    <span className="text-sm text-gray-500">
                      Last saved: {lastSaved.toLocaleTimeString()}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  );
};

export default PresentationEditor;
