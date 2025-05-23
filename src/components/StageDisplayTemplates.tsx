// src/components/StageDisplayTemplates.tsx
import React from "react";
import { StageDisplayTemplate } from "../types/stageDisplay";
import { Button } from "./ui/button";

interface StageDisplayTemplatesProps {
  templates: StageDisplayTemplate[];
  onSelectTemplate: (templateId: string) => void;
  activeTemplateId: string;
}

// Default templates that will be available to users
export const defaultTemplates: StageDisplayTemplate[] = [
  {
    id: "default-basic",
    name: "Basic Layout",
    isDefault: true,
    elements: [
      {
        id: "current-slide",
        type: "currentSlide",
        x: 5,
        y: 5,
        width: 60,
        height: 70,
        backgroundColor: "#000000",
        fontColor: "#ffffff",
        borderRadius: 4,
        zIndex: 0,
        isVisible: true, // Added
      },
      {
        id: "next-slide",
        type: "nextSlide",
        x: 70,
        y: 5,
        width: 25,
        height: 30,
        backgroundColor: "#000000",
        fontColor: "#ffffff",
        borderRadius: 4,
        zIndex: 0,
        isVisible: true, // Added
      },
      {
        id: "clock",
        type: "clock",
        x: 70,
        y: 40,
        width: 25,
        height: 15,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        fontColor: "#ffffff",
        fontSize: 24,
        borderRadius: 4,
        zIndex: 0,
        isVisible: true, // Added
      },
      {
        id: "timer",
        type: "timer",
        x: 70,
        y: 60,
        width: 25,
        height: 15,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        fontColor: "#ffffff",
        fontSize: 24,
        borderRadius: 4,
        zIndex: 0,
        isVisible: true, // Added
      },
    ],
  },
  {
    id: "default-wide",
    name: "Widescreen",
    isDefault: true,
    elements: [
      {
        id: "current-slide",
        type: "currentSlide",
        x: 5,
        y: 10,
        width: 70,
        height: 50,
        backgroundColor: "#000000",
        fontColor: "#ffffff",
        borderRadius: 4,
        zIndex: 0,
        isVisible: true, // Added
      },
      {
        id: "next-slide",
        type: "nextSlide",
        x: 5,
        y: 65,
        width: 30,
        height: 25,
        backgroundColor: "#000000",
        fontColor: "#ffffff",
        borderRadius: 4,
        zIndex: 0,
        isVisible: true, // Added
      },
      {
        id: "clock",
        type: "clock",
        x: 40,
        y: 65,
        width: 15,
        height: 10,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        fontColor: "#ffffff",
        fontSize: 20,
        borderRadius: 4,
        zIndex: 0,
        isVisible: true, // Added
      },
      {
        id: "timer",
        type: "timer",
        x: 60,
        y: 65,
        width: 15,
        height: 10,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        fontColor: "#ffffff",
        fontSize: 20,
        borderRadius: 4,
        zIndex: 0,
        isVisible: true, // Added
      },
      {
        id: "custom-text",
        type: "customText",
        x: 80,
        y: 10,
        width: 15,
        height: 80,
        content: "Notes area for additional information",
        backgroundColor: "rgba(0, 0, 0, 0.3)",
        fontColor: "#ffffff",
        fontSize: 14,
        borderRadius: 4,
        zIndex: 0,
        isVisible: true, // Added
      },
    ],
  },
  {
    id: "default-minimal",
    name: "Minimal",
    isDefault: true,
    elements: [
      {
        id: "current-slide",
        type: "currentSlide",
        x: 10,
        y: 10,
        width: 80,
        height: 60,
        backgroundColor: "#000000",
        fontColor: "#ffffff",
        borderRadius: 4,
        zIndex: 0,
        isVisible: true, // Added
      },
      {
        id: "clock",
        type: "clock",
        x: 10,
        y: 75,
        width: 20,
        height: 15,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        fontColor: "#ffffff",
        fontSize: 24,
        borderRadius: 4,
        zIndex: 0,
        isVisible: true, // Added
      },
    ],
  },
  {
    id: "default-split",
    name: "Split Screen",
    isDefault: true,
    elements: [
      {
        id: "current-slide",
        type: "currentSlide",
        x: 5,
        y: 5,
        width: 45,
        height: 90,
        backgroundColor: "#000000",
        fontColor: "#ffffff",
        borderRadius: 4,
        zIndex: 0,
        isVisible: true, // Added
      },
      {
        id: "next-slide",
        type: "nextSlide",
        x: 55,
        y: 5,
        width: 40,
        height: 60,
        backgroundColor: "#000000",
        fontColor: "#ffffff",
        borderRadius: 4,
        zIndex: 0,
        isVisible: true, // Added
      },
      {
        id: "clock",
        type: "clock",
        x: 55,
        y: 70,
        width: 18,
        height: 12,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        fontColor: "#ffffff",
        fontSize: 20,
        borderRadius: 4,
        zIndex: 0,
        isVisible: true, // Added
      },
      {
        id: "timer",
        type: "timer",
        x: 77,
        y: 70,
        width: 18,
        height: 12,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        fontColor: "#ffffff",
        fontSize: 20,
        borderRadius: 4,
        zIndex: 0,
        isVisible: true, // Added
      },
      {
        id: "custom-text",
        type: "customText",
        x: 55,
        y: 85,
        width: 40,
        height: 10,
        content: "Announcements",
        backgroundColor: "rgba(0, 0, 0, 0.3)",
        fontColor: "#ffffff",
        fontSize: 16,
        borderRadius: 4,
        zIndex: 0,
        isVisible: true, // Added
      },
    ],
  },
];

export function StageDisplayTemplates({
  templates,
  onSelectTemplate,
  activeTemplateId,
}: StageDisplayTemplatesProps) {
  // Combine default templates with user templates
  const allTemplates = [...templates];

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Stage Display Templates</h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        Choose from our pre-built templates or select one of your custom
        templates.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {allTemplates.map((template) => (
          <div
            key={template.id}
            className="border rounded-md overflow-hidden bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="aspect-video bg-gray-100 dark:bg-gray-700 relative">
              {/* Template preview - in a real app, this would be an actual preview image */}
              <div className="absolute inset-0 flex items-center justify-center">
                {template.previewImage ? (
                  <img
                    src={template.previewImage}
                    alt={template.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full p-2 flex items-center justify-center bg-black">
                    {/* Simple representation of the template layout */}
                    <div className="w-full h-full relative">
                      {template.elements.map((element) => (
                        <div
                          key={element.id}
                          className="absolute"
                          style={{
                            left: `${element.x}%`,
                            top: `${element.y}%`,
                            width: `${element.width}%`,
                            height: `${element.height}%`,
                            backgroundColor:
                              element.backgroundColor || "rgba(0, 0, 0, 0.5)",
                            borderRadius: `${element.borderRadius || 0}px`,
                            border: "1px solid rgba(255, 255, 255, 0.2)",
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="p-3">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">{template.name}</h3>
                {template.isDefault && (
                  <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-1.5 py-0.5 rounded-full">
                    Default
                  </span>
                )}
              </div>

              <div className="mt-3">
                <Button
                  variant={
                    template.id === activeTemplateId ? "default" : "outline"
                  }
                  className="w-full"
                  onClick={() => onSelectTemplate(template.id)}
                >
                  {template.id === activeTemplateId
                    ? "Selected"
                    : "Use Template"}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
