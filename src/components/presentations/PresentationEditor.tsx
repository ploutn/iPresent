import React, { useState, useEffect } from "react";
import {
  Plus,
  Pencil,
  Eye,
  Minimize,
  Maximize,
  FileText,
  Settings,
  Image,
  BookOpen,
  Music,
  Save,
  X,
} from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { Slide, SlideElement, PresentationContentItem } from "../../types";

interface PresentationEditorProps {
  presentation: PresentationContentItem;
  onSave: (presentation: PresentationContentItem) => void;
  onCancel: () => void;
}

const PresentationEditor: React.FC<PresentationEditorProps> = ({
  presentation,
  onSave,
  onCancel,
}) => {
  const [currentSlide, setCurrentSlide] = useState<Slide>(
    presentation.slides[0]
  );
  const [selectedElement, setSelectedElement] = useState<SlideElement | null>(
    null
  );
  const [showSettings, setShowSettings] = useState(false);
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);
  const [showBibleVerseSearch, setShowBibleVerseSearch] = useState(false);
  const [showSongSearch, setShowSongSearch] = useState(false);
  const [showMediaUpload, setShowMediaUpload] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showPresenterNotes, setShowPresenterNotes] = useState(false);
  const [showAudienceNotes, setShowAudienceNotes] = useState(false);
  const [showTimer, setShowTimer] = useState(false);
  const [showCountdown, setShowCountdown] = useState(false);
  const [showRemoteControl, setShowRemoteControl] = useState(false);
  const [showLivePreview, setShowLivePreview] = useState(false);
  const [showTimeline, setShowTimeline] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [autoSave, setAutoSave] = useState(true);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Load presentation from local storage on mount
  useEffect(() => {
    const savedPresentation = localStorage.getItem(
      `presentation_${presentation.id}`
    );
    if (savedPresentation) {
      const parsed = JSON.parse(savedPresentation);
      onSave(parsed);
    }
  }, [presentation.id]);

  // Auto-save to local storage
  useEffect(() => {
    if (autoSave) {
      localStorage.setItem(
        `presentation_${presentation.id}`,
        JSON.stringify(presentation)
      );
      setLastSaved(new Date());
    }
  }, [presentation, autoSave]);

  const handleSlideChange = (property: string, value: any) => {
    const updatedSlide = {
      ...currentSlide,
      [property]: value,
      updatedAt: new Date(),
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

  const handleAddElement = (
    type: "image" | "video" | "audio" | "text" | "bible" | "song"
  ) => {
    const newElement: SlideElement = {
      id: uuidv4(),
      type,
      content: "",
      x: 10,
      y: 10,
      width: 80,
      height: 20,
      fontSize: 24,
      fontFamily: "Arial",
      fontColor: "#ffffff",
      textAlign: "center",
    };

    const updatedSlide = {
      ...currentSlide,
      elements: [...currentSlide.elements, newElement],
    };

    setCurrentSlide(updatedSlide);
    setSelectedElement(newElement);

    const updatedPresentation = {
      ...presentation,
      slides: presentation.slides.map((slide) =>
        slide.id === currentSlide.id ? updatedSlide : slide
      ),
    };

    onSave(updatedPresentation);
  };

  const handleAddSlide = () => {
    const newSlide: Slide = {
      id: uuidv4(),
      title: "New Slide",
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
      transition: {
        type: "fade",
        duration: 500,
        direction: "right",
        easing: "ease-in-out",
      },
      duration: 5,
      thumbnail: "",
      notes: "",
      mediaElements: [],
      overlaySettings: {
        textOverlay: false,
        textBackground: { enabled: false },
      },
    };

    const updatedPresentation = {
      ...presentation,
      slides: [...presentation.slides, newSlide],
    };

    onSave(updatedPresentation);
    setCurrentSlide(newSlide);
  };

  const handleDeleteSlide = (slideId: string) => {
    const updatedPresentation = {
      ...presentation,
      slides: presentation.slides.filter((slide) => slide.id !== slideId),
    };

    onSave(updatedPresentation);
    if (currentSlide.id === slideId) {
      setCurrentSlide(updatedPresentation.slides[0]);
    }
  };

  const handleAddBibleVerse = (verse: string) => {
    const newElement: SlideElement = {
      id: uuidv4(),
      type: "text",
      content: verse,
      x: 10,
      y: 10,
      width: 80,
      height: 20,
      fontSize: 24,
      fontFamily: "Arial",
      fontColor: "#ffffff",
      textAlign: "center",
    };

    const updatedSlide = {
      ...currentSlide,
      elements: [...currentSlide.elements, newElement],
    };

    setCurrentSlide(updatedSlide);
    setShowBibleVerseSearch(false);

    const updatedPresentation = {
      ...presentation,
      slides: presentation.slides.map((slide) =>
        slide.id === currentSlide.id ? updatedSlide : slide
      ),
    };

    onSave(updatedPresentation);
  };

  const handleAddSong = (song: string) => {
    const newElement: SlideElement = {
      id: uuidv4(),
      type: "text",
      content: song,
      x: 10,
      y: 10,
      width: 80,
      height: 20,
      fontSize: 24,
      fontFamily: "Arial",
      fontColor: "#ffffff",
      textAlign: "center",
    };

    const updatedSlide = {
      ...currentSlide,
      elements: [...currentSlide.elements, newElement],
    };

    setCurrentSlide(updatedSlide);
    setShowSongSearch(false);

    const updatedPresentation = {
      ...presentation,
      slides: presentation.slides.map((slide) =>
        slide.id === currentSlide.id ? updatedSlide : slide
      ),
    };

    onSave(updatedPresentation);
  };

  const handleAddMedia = (
    mediaUrl: string,
    type: "image" | "video" | "audio"
  ) => {
    const newElement: SlideElement = {
      id: uuidv4(),
      type,
      content: mediaUrl,
      x: 10,
      y: 10,
      width: 80,
      height: 60,
      fontSize: 24,
      fontFamily: "Arial",
      fontColor: "#ffffff",
      textAlign: "center",
    };

    const updatedSlide = {
      ...currentSlide,
      elements: [...currentSlide.elements, newElement],
    };

    setCurrentSlide(updatedSlide);
    setShowMediaUpload(false);

    const updatedPresentation = {
      ...presentation,
      slides: presentation.slides.map((slide) =>
        slide.id === currentSlide.id ? updatedSlide : slide
      ),
    };

    onSave(updatedPresentation);
  };

  const handleExportPresentation = () => {
    const dataStr = JSON.stringify(presentation);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(
      dataStr
    )}`;
    const exportFileDefaultName = `${presentation.title}.json`;

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  const handleImportPresentation = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedPresentation = JSON.parse(e.target?.result as string);
          onSave(importedPresentation);
        } catch (error) {
          console.error("Error importing presentation:", error);
          alert("Error importing presentation. Please check the file format.");
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="flex h-full">
      {/* Left Sidebar - Tools and Properties */}
      <div className="w-64 bg-gray-100 border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Tools</h3>
          <div className="space-y-2">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded-md"
            >
              <Settings className="h-5 w-5 mr-2" />
              Settings
            </button>
            <button
              onClick={() => setShowMediaLibrary(!showMediaLibrary)}
              className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded-md"
            >
              <Image className="h-5 w-5 mr-2" />
              Media Library
            </button>
            <button
              onClick={() => setShowBibleVerseSearch(!showBibleVerseSearch)}
              className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded-md"
            >
              <BookOpen className="h-5 w-5 mr-2" />
              Bible Verses
            </button>
            <button
              onClick={() => setShowSongSearch(!showSongSearch)}
              className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded-md"
            >
              <Music className="h-5 w-5 mr-2" />
              Songs
            </button>
            <button
              onClick={() => setShowTemplates(!showTemplates)}
              className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded-md"
            >
              <FileText className="h-5 w-5 mr-2" />
              Templates
            </button>
          </div>
        </div>

        {/* Church-specific Tools */}
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Church Tools
          </h3>
          <div className="space-y-2">
            <button
              onClick={() => setShowPresenterNotes(!showPresenterNotes)}
              className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded-md"
            >
              <FileText className="h-5 w-5 mr-2" />
              Presenter Notes
            </button>
            <button
              onClick={() => setShowAudienceNotes(!showAudienceNotes)}
              className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded-md"
            >
              <FileText className="h-5 w-5 mr-2" />
              Audience Notes
            </button>
            <button
              onClick={() => setShowTimer(!showTimer)}
              className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded-md"
            >
              <Settings className="h-5 w-5 mr-2" />
              Timer
            </button>
            <button
              onClick={() => setShowCountdown(!showCountdown)}
              className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded-md"
            >
              <Settings className="h-5 w-5 mr-2" />
              Countdown
            </button>
            <button
              onClick={() => setShowRemoteControl(!showRemoteControl)}
              className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded-md"
            >
              <Settings className="h-5 w-5 mr-2" />
              Remote Control
            </button>
            <button
              onClick={() => setShowLivePreview(!showLivePreview)}
              className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded-md"
            >
              <Eye className="h-5 w-5 mr-2" />
              Live Preview
            </button>
          </div>
        </div>

        {/* File Operations */}
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            File Operations
          </h3>
          <div className="space-y-2">
            <button
              onClick={handleExportPresentation}
              className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded-md"
            >
              <Save className="h-5 w-5 mr-2" />
              Export Presentation
            </button>
            <label className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded-md cursor-pointer">
              <FileText className="h-5 w-5 mr-2" />
              Import Presentation
              <input
                type="file"
                accept=".json"
                onChange={handleImportPresentation}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Auto-save Status */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">Auto-save</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={autoSave}
                onChange={(e) => setAutoSave(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          {lastSaved && (
            <p className="text-xs text-gray-500 mt-2">
              Last saved: {lastSaved.toLocaleTimeString()}
            </p>
          )}
        </div>
      </div>

      {/* Main Editor Area */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleAddSlide}
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Slide
            </button>
            <button
              onClick={() => setShowTimeline(!showTimeline)}
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
            >
              <FileText className="h-5 w-5 mr-2" />
              Timeline
            </button>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
            >
              {isFullscreen ? (
                <Minimize className="h-5 w-5 mr-2" />
              ) : (
                <Maximize className="h-5 w-5 mr-2" />
              )}
              {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            </button>
            <button
              onClick={onCancel}
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
            >
              <X className="h-5 w-5 mr-2" />
              Cancel
            </button>
          </div>
        </div>

        {/* Editor Content */}
        <div className="flex-1 flex">
          {/* Slide Thumbnails */}
          <div className="w-48 bg-gray-50 border-r border-gray-200 overflow-y-auto">
            {presentation.slides.map((slide, index) => (
              <div
                key={slide.id}
                className={`p-2 cursor-pointer ${
                  currentSlide.id === slide.id
                    ? "bg-blue-100"
                    : "hover:bg-gray-100"
                }`}
                onClick={() => setCurrentSlide(slide)}
              >
                <div className="relative">
                  <div className="aspect-video bg-gray-200 rounded flex items-center justify-center">
                    {slide.thumbnail ? (
                      <img
                        src={slide.thumbnail}
                        alt={`Slide ${index + 1}`}
                        className="w-full h-full object-cover rounded"
                      />
                    ) : (
                      <FileText className="h-12 w-12 text-gray-400" />
                    )}
                  </div>
                  <div className="absolute top-2 right-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteSlide(slide.id);
                      }}
                      className="p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-1 truncate">
                  {slide.title || `Slide ${index + 1}`}
                </p>
              </div>
            ))}
          </div>

          {/* Main Editor Canvas */}
          <div className="flex-1 flex flex-col">
            <div className="flex-1 p-8 bg-gray-100 relative">
              <div
                className="w-full h-full bg-white rounded-lg shadow-lg overflow-hidden"
                style={{ backgroundColor: currentSlide.backgroundColor }}
              >
                {currentSlide.elements.map((element) => (
                  <div
                    key={element.id}
                    className={`absolute ${
                      selectedElement?.id === element.id
                        ? "ring-2 ring-blue-500"
                        : ""
                    }`}
                    style={{
                      left: `${element.x}%`,
                      top: `${element.y}%`,
                      width: `${element.width}%`,
                      height: `${element.height}%`,
                      fontSize: `${element.fontSize}px`,
                      fontFamily: element.fontFamily,
                      color: element.fontColor,
                      textAlign: element.textAlign as any,
                    }}
                    onClick={() => setSelectedElement(element)}
                  >
                    {element.type === "text" && element.content}
                    {element.type === "image" && (
                      <img
                        src={element.content}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    )}
                    {element.type === "video" && (
                      <video
                        src={element.content}
                        controls
                        className="w-full h-full"
                      />
                    )}
                    {element.type === "audio" && (
                      <audio
                        src={element.content}
                        controls
                        className="w-full"
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* Church-specific Overlays */}
              {showPresenterNotes && (
                <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Presenter Notes
                  </h3>
                  <textarea
                    value={currentSlide.notes}
                    onChange={(e) => handleSlideChange("notes", e.target.value)}
                    className="w-full h-32 p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Add presenter notes here..."
                  />
                </div>
              )}

              {showAudienceNotes && (
                <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Audience Notes
                  </h3>
                  <textarea
                    value={currentSlide.notes}
                    onChange={(e) => handleSlideChange("notes", e.target.value)}
                    className="w-full h-32 p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Add audience notes here..."
                  />
                </div>
              )}

              {showTimer && (
                <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-4">
                  <div className="text-2xl font-bold text-gray-900">00:00</div>
                </div>
              )}

              {showCountdown && (
                <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-4">
                  <div className="text-2xl font-bold text-gray-900">05:00</div>
                </div>
              )}
            </div>

            {/* Timeline */}
            {showTimeline && (
              <div className="h-32 bg-white border-t border-gray-200 p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Timeline
                </h3>
                <div className="flex items-center space-x-4">
                  {presentation.slides.map((slide, index) => (
                    <div
                      key={slide.id}
                      className="relative"
                      style={{ width: `${(slide.duration || 5) * 100}px` }}
                    >
                      <div className="h-8 bg-gray-200 rounded"></div>
                      <div className="absolute -top-6 left-0 text-xs text-gray-500">
                        Slide {index + 1}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {showBibleVerseSearch && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Search Bible Verses
            </h2>
            <input
              type="text"
              placeholder="Search for a verse..."
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
            <div className="mt-4">
              <button
                onClick={() => handleAddBibleVerse("John 3:16")}
                className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Add Verse
              </button>
            </div>
          </div>
        </div>
      )}

      {showSongSearch && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Search Songs
            </h2>
            <input
              type="text"
              placeholder="Search for a song..."
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
            <div className="mt-4">
              <button
                onClick={() => handleAddSong("Amazing Grace")}
                className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Add Song
              </button>
            </div>
          </div>
        </div>
      )}

      {showMediaUpload && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Upload Media
            </h2>
            <div className="space-y-4">
              <button
                onClick={() => handleAddMedia("image.jpg", "image")}
                className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Upload Image
              </button>
              <button
                onClick={() => handleAddMedia("video.mp4", "video")}
                className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Upload Video
              </button>
              <button
                onClick={() => handleAddMedia("audio.mp3", "audio")}
                className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Upload Audio
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PresentationEditor;
