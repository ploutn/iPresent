import React, { useState } from "react";
import { useContentStore } from "../stores/useContentStore";
import { ContentType, ContentItem } from "../types";
import {
  X,
  Check,
  Plus,
  Timer,
  BarChart,
  Clipboard,
  MousePointer,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { InteractiveElementForm } from "./interactive/InteractiveElementForm";
import { AnyInteractiveElement } from "../types/interactive";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

interface ContentFormProps {
  onClose: () => void;
  onAddInteractiveElements?: (elements: AnyInteractiveElement[]) => void;
  existingInteractiveElements?: AnyInteractiveElement[];
}

export function ContentForm({
  onClose,
  onAddInteractiveElements,
  existingInteractiveElements = [],
}: ContentFormProps) {
  const { addItem } = useContentStore();
  const [type, setType] = useState<ContentType>("song");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [activeTab, setActiveTab] = useState<"content" | "interactive">(
    "content"
  );
  const [showInteractiveForm, setShowInteractiveForm] = useState(false);
  const [interactiveElements, setInteractiveElements] = useState<
    AnyInteractiveElement[]
  >(existingInteractiveElements);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newItem: ContentItem = {
      id: Date.now().toString(),
      title,
      type,
      content,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...(type === "song" && { lyrics: content, author }),
      ...(type === "image" || type === "video" ? { url } : {}),
      interactiveElements,
    } as ContentItem;

    addItem(newItem);

    // Pass interactive elements back to parent component if callback exists
    if (onAddInteractiveElements) {
      onAddInteractiveElements(interactiveElements);
    }

    setShowConfirmation(true);
    setTimeout(() => {
      setShowConfirmation(false);
      onClose();
    }, 1500);
  };

  const handleAddInteractiveElement = (element: AnyInteractiveElement) => {
    setInteractiveElements([...interactiveElements, element]);
    setShowInteractiveForm(false);
  };

  const handleRemoveInteractiveElement = (id: string) => {
    setInteractiveElements(
      interactiveElements.filter((element) => element.id !== id)
    );
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
    >
      <div className="bg-slate-900 rounded-lg w-[600px] p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold" id="dialog-title">
            Add New Content
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-full"
            aria-label="Close dialog"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={(value) =>
            setActiveTab(value as "content" | "interactive")
          }
          className="mb-6"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="interactive">Interactive Elements</TabsTrigger>
          </TabsList>
        </Tabs>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="content-type" className="block text-sm mb-1">
              Type
            </label>
            <select
              id="content-type"
              value={type}
              onChange={(e) => setType(e.target.value as ContentType)}
              className="w-full bg-slate-800/50 rounded-md px-3 py-2 border border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200"
              aria-label="Content type"
            >
              <option value="song">Song</option>
              <option value="image">Image</option>
              <option value="video">Video</option>
              <option value="announcement">Announcement</option>
            </select>
          </div>

          <div>
            <label htmlFor="content-title" className="block text-sm mb-1">
              Title
            </label>
            <input
              id="content-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-800/50 rounded-md px-3 py-2 border border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200"
              required
              aria-required="true"
            />
          </div>

          {type === "song" && (
            <div>
              <label htmlFor="content-author" className="block text-sm mb-1">
                Author
              </label>
              <input
                id="content-author"
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full bg-slate-800 rounded-md px-3 py-2"
              />
            </div>
          )}

          {(type === "image" || type === "video") && (
            <div>
              <label htmlFor="content-url" className="block text-sm mb-1">
                URL
              </label>
              <input
                id="content-url"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full bg-slate-800/50 rounded-md px-3 py-2 border border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200"
                required
                aria-required="true"
              />
            </div>
          )}

          <div>
            <label htmlFor="content-text" className="block text-sm mb-1">
              Content
            </label>
            <textarea
              id="content-text"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full bg-slate-800 rounded-md px-3 py-2 min-h-[100px]"
              required
              aria-required="true"
            />
          </div>

          {activeTab === "interactive" && (
            <div className="border border-slate-700 rounded-lg p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-md font-medium">Interactive Elements</h3>
                <button
                  type="button"
                  onClick={() => setShowInteractiveForm(true)}
                  className="flex items-center gap-1 px-3 py-1 bg-blue-600 rounded-md hover:bg-blue-500 text-sm"
                >
                  <Plus className="h-4 w-4" /> Add Element
                </button>
              </div>

              {interactiveElements.length === 0 ? (
                <div className="text-center py-8 text-slate-400">
                  <p>No interactive elements added yet</p>
                  <p className="text-sm mt-1">
                    Click the button above to add elements
                  </p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[200px] overflow-y-auto">
                  {interactiveElements.map((element) => (
                    <div
                      key={element.id}
                      className="flex items-center justify-between p-3 bg-slate-800 rounded-md"
                    >
                      <div className="flex items-center gap-2">
                        {element.type === "button" && (
                          <MousePointer className="h-4 w-4 text-blue-400" />
                        )}
                        {element.type === "poll" && (
                          <BarChart className="h-4 w-4 text-purple-400" />
                        )}
                        {element.type === "timer" && (
                          <Timer className="h-4 w-4 text-green-400" />
                        )}
                        {element.type === "notes" && (
                          <Clipboard className="h-4 w-4 text-yellow-400" />
                        )}
                        <span>
                          {element.type === "button" &&
                            `Button: ${element.label}`}
                          {element.type === "poll" &&
                            `Poll: ${element.question}`}
                          {element.type === "timer" &&
                            `Timer: ${element.initialMinutes}:${String(
                              element.initialSeconds
                            ).padStart(2, "0")}`}
                          {element.type === "notes" &&
                            `Notes: ${element.title}`}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          handleRemoveInteractiveElement(element.id)
                        }
                        className="p-1 hover:bg-slate-700 rounded-full"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-700 rounded-md hover:bg-slate-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 rounded-md hover:bg-blue-500"
            >
              Add Content
            </button>
          </div>
        </form>

        {/* Interactive Element Form Dialog */}
        {showInteractiveForm && (
          <InteractiveElementForm
            onAdd={handleAddInteractiveElement}
            onClose={() => setShowInteractiveForm(false)}
            open={showInteractiveForm}
          />
        )}
      </div>
    </div>
  );
}
