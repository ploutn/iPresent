import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Settings, GripVertical } from "lucide-react";
import { cn } from "../lib/utils";
import { create } from "zustand";

interface QuickAccessSettings {
  items: {
    id: string;
    enabled: boolean;
    order: number;
  }[];
  updateItem: (id: string, enabled: boolean) => void;
  reorderItems: (
    items: { id: string; enabled: boolean; order: number }[]
  ) => void;
}

export const useQuickAccessSettings = create<QuickAccessSettings>((set) => ({
  items: [
    { id: "songs", enabled: true, order: 0 },
    { id: "bible", enabled: true, order: 1 },
    { id: "media", enabled: true, order: 2 },
    { id: "announcements", enabled: true, order: 3 },
  ],
  updateItem: (id, enabled) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, enabled } : item
      ),
    })),
  reorderItems: (items) => set({ items }),
}));

export function QuickAccessCustomize() {
  const { items, updateItem, reorderItems } = useQuickAccessSettings();
  const [draggedItem, setDraggedItem] = React.useState<number | null>(null);

  const handleDragStart = (index: number) => {
    setDraggedItem(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedItem === null) return;

    const newItems = [...items];
    const item = newItems[draggedItem];
    newItems.splice(draggedItem, 1);
    newItems.splice(index, 0, item);

    // Update order numbers
    newItems.forEach((item, idx) => {
      item.order = idx;
    });

    reorderItems(newItems);
    setDraggedItem(index);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-gray-400 hover:text-white"
        >
          <Settings className="h-4 w-4 mr-2" />
          Customize
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Customize Quick Access</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <p className="text-sm text-gray-400">
            Drag and drop items to reorder them, or toggle their visibility.
          </p>
          <div className="space-y-2">
            {items
              .sort((a, b) => a.order - b.order)
              .map((item, index) => (
                <div
                  key={item.id}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-lg border border-gray-800",
                    draggedItem === index && "opacity-50",
                    "cursor-move hover:bg-gray-800/50 transition-colors"
                  )}
                >
                  <GripVertical className="h-5 w-5 text-gray-500" />
                  <span className="flex-1 font-medium capitalize">
                    {item.id}
                  </span>
                  <Button
                    variant={item.enabled ? "default" : "outline"}
                    size="sm"
                    onClick={() => updateItem(item.id, !item.enabled)}
                  >
                    {item.enabled ? "Enabled" : "Disabled"}
                  </Button>
                </div>
              ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
