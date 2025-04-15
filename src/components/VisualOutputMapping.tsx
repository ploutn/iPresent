// src/components/VisualOutputMapping.tsx
import React, { useState } from "react";
import { DisplayDevice } from "../types/outputManagement";
import { ContentItem, Slide } from "../types";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Monitor, Laptop, Tv } from "lucide-react";

interface OutputMappingProps {
  displayDevices: DisplayDevice[];
  activeDevice: string;
  setActiveDevice: (id: string) => void;
  availableContent: (ContentItem | Slide)[];
  onAssignContent: (displayId: string, contentId: string) => void;
}

interface DisplayContentMapping {
  displayId: string;
  contentId: string | null;
}

export function VisualOutputMapping({
  displayDevices,
  activeDevice,
  setActiveDevice,
  availableContent,
  onAssignContent,
}: OutputMappingProps) {
  const [contentMapping, setContentMapping] = useState<DisplayContentMapping[]>(
    displayDevices.map((device) => ({
      displayId: device.id,
      contentId: null,
    }))
  );

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const { source, destination } = result;

    // If dragging from content list to a display
    if (
      source.droppableId === "content-list" &&
      destination.droppableId.startsWith("display-")
    ) {
      const displayId = destination.droppableId.replace("display-", "");
      const contentId = availableContent[source.index].id.toString();

      // Update the mapping
      setContentMapping((prev) =>
        prev.map((mapping) =>
          mapping.displayId === displayId ? { displayId, contentId } : mapping
        )
      );

      // Call the callback to actually assign the content
      onAssignContent(displayId, contentId);
    }
  };

  const getDisplayIcon = (device: DisplayDevice) => {
    if (device.name.toLowerCase().includes("main")) {
      return <Laptop className="h-6 w-6" />;
    } else if (device.name.toLowerCase().includes("projector")) {
      return <Tv className="h-6 w-6" />;
    } else {
      return <Monitor className="h-6 w-6" />;
    }
  };

  return (
    <div className="p-4">
      <h3 className="text-lg font-medium mb-4">Visual Output Mapping</h3>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Available Displays */}
          <div className="space-y-4">
            <h4 className="font-medium">Available Displays</h4>

            {displayDevices.map((device) => {
              const mapping = contentMapping.find(
                (m) => m.displayId === device.id
              );
              const assignedContent = mapping?.contentId
                ? availableContent.find((c) => c.id === mapping.contentId)
                : null;

              return (
                <Droppable key={device.id} droppableId={`display-${device.id}`}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`p-4 rounded-md border-2 ${
                        snapshot.isDraggingOver
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                          : "border-gray-200 dark:border-gray-700"
                      } ${
                        device.id === activeDevice ? "ring-2 ring-blue-500" : ""
                      }`}
                      onClick={() => setActiveDevice(device.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {getDisplayIcon(device)}
                          <div>
                            <h5 className="font-medium">{device.name}</h5>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {device.resolution}
                            </p>
                          </div>
                        </div>

                        <div className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800">
                          {device.isActive ? "Active" : "Inactive"}
                        </div>
                      </div>

                      {assignedContent && (
                        <div className="mt-3 p-2 bg-gray-100 dark:bg-gray-800 rounded">
                          <p className="text-sm font-medium">
                            {assignedContent.title}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                            {assignedContent.type}
                          </p>
                        </div>
                      )}

                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              );
            })}
          </div>

          {/* Available Content */}
          <div>
            <h4 className="font-medium mb-4">Available Content</h4>

            <Droppable droppableId="content-list">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="space-y-2 max-h-[400px] overflow-y-auto p-2 border border-gray-200 dark:border-gray-700 rounded-md"
                >
                  {availableContent.map((item, index) => (
                    <Draggable
                      key={item.id}
                      draggableId={item.id.toString()}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`p-3 rounded-md ${
                            snapshot.isDragging
                              ? "bg-blue-100 dark:bg-blue-900/30"
                              : "bg-white dark:bg-gray-800"
                          } shadow-sm`}
                        >
                          <p className="font-medium">{item.title}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                            {item.type}
                          </p>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        </div>
      </DragDropContext>

      <div className="mt-6 text-sm text-gray-500 dark:text-gray-400">
        <p>
          Drag content items to displays to assign them. Click on a display to
          make it active.
        </p>
      </div>
    </div>
  );
}
