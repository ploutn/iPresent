import React, { useState, useRef } from "react";
import { useContentStore } from "../stores/useContentStore";
import { ScrollArea } from "./ui/scroll-area";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import {
  GripVertical,
  X,
  Play,
  List,
  MoreHorizontal,
  Clock,
  ChevronUp,
  ChevronDown,
  Trash2,
  Copy,
  Edit2,
} from "lucide-react";
import { ScheduledItem } from "../types";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Slider } from "./ui/slider";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export function ScheduleView() {
  const { scheduledItems, unscheduleItem, reorderItems, updateItemTiming } =
    useContentStore();
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [editingItem, setEditingItem] = useState<ScheduledItem | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [timing, setTiming] = useState({ duration: 0, delay: 0 });

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(scheduledItems);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    reorderItems(items);
  };

  const handleEditItem = (item: ScheduledItem) => {
    setEditingItem(item);
    setTiming({ duration: item.duration || 0, delay: item.delay || 0 });
    setShowEditDialog(true);
  };

  const handleSaveEdit = () => {
    if (editingItem) {
      updateItemTiming(editingItem.id, timing);
      setShowEditDialog(false);
      setEditingItem(null);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="h-full flex flex-col overflow-hidden bg-black text-white">
      <div className="flex-1 overflow-hidden">
        {scheduledItems.length > 0 ? (
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="schedule">
              {(provided) => (
                <ScrollArea
                  className="flex-1"
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  <div className="p-2 space-y-2">
                    {scheduledItems.map((item, index) => (
                      <Draggable
                        key={item.id}
                        draggableId={item.id}
                        index={index}
                      >
                        {(provided) => (
                          <Card
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={`
                              ${
                                currentIndex === index
                                  ? "ring-2 ring-primary"
                                  : ""
                              }
                              bg-[#1a1a1a] border-gray-800
                            `}
                          >
                            <CardContent className="p-2">
                              <div className="flex items-center gap-2">
                                <div
                                  className="p-1 cursor-grab"
                                  {...provided.dragHandleProps}
                                >
                                  <GripVertical className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2">
                                    <p className="truncate font-medium text-sm">
                                      {item.contentId}
                                    </p>
                                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                      <Clock className="h-3 w-3" />
                                      <span>
                                        {formatTime(item.duration || 0)}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2 mt-1">
                                    <span className="text-xs text-muted-foreground">
                                      Order: {item.order}
                                    </span>
                                    {item.delay > 0 && (
                                      <span className="text-xs text-yellow-500">
                                        Delay: {formatTime(item.delay)}
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7"
                                    onClick={() => setCurrentIndex(index)}
                                  >
                                    <Play className="h-3.5 w-3.5" />
                                  </Button>
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-7 w-7"
                                      >
                                        <MoreHorizontal className="h-3.5 w-3.5" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent
                                      align="end"
                                      className="bg-[#1a1a1a] border-gray-800"
                                    >
                                      <DropdownMenuItem
                                        onClick={() => handleEditItem(item)}
                                      >
                                        <Edit2 className="h-4 w-4 mr-2" />
                                        Edit Timing
                                      </DropdownMenuItem>
                                      <DropdownMenuItem>
                                        <Copy className="h-4 w-4 mr-2" />
                                        Duplicate
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        className="text-red-500"
                                        onClick={() => unscheduleItem(item.id)}
                                      >
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        Remove
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                </ScrollArea>
              )}
            </Droppable>
          </DragDropContext>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground p-4">
            <p className="text-center">
              Your presentation queue is empty.
              <br />
              Add items from the library to get started.
            </p>
          </div>
        )}
      </div>

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="bg-[#1a1a1a] border-gray-800">
          <DialogHeader>
            <DialogTitle>Edit Item Timing</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Duration</Label>
              <div className="flex items-center gap-2">
                <Slider
                  value={[timing.duration]}
                  max={3600}
                  step={1}
                  onValueChange={(value) =>
                    setTiming({ ...timing, duration: value[0] })
                  }
                  className="flex-1"
                />
                <span className="text-sm text-muted-foreground min-w-[60px] text-right">
                  {formatTime(timing.duration)}
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Delay</Label>
              <div className="flex items-center gap-2">
                <Slider
                  value={[timing.delay]}
                  max={300}
                  step={1}
                  onValueChange={(value) =>
                    setTiming({ ...timing, delay: value[0] })
                  }
                  className="flex-1"
                />
                <span className="text-sm text-muted-foreground min-w-[60px] text-right">
                  {formatTime(timing.delay)}
                </span>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setShowEditDialog(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleSaveEdit}>Save Changes</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
