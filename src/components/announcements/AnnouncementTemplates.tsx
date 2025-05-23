// src/components/AnnouncementTemplates.tsx
import React from "react";
import { v4 as uuidv4 } from "uuid";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { LayoutTemplate, FileText, Plus } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";

export interface AnnouncementTemplate {
  id: string;
  name: string;
  category: string;
  title: string;
  content: string;
}

// Default announcement templates
export const defaultAnnouncementTemplates: AnnouncementTemplate[] = [
  {
    id: "event-announcement",
    name: "Event Announcement",
    category: "Events",
    title: "Event Title",
    content:
      "Join us for this special event. Details include time, location, and what to expect.",
  },
  {
    id: "ministry-update",
    name: "Ministry Update",
    category: "Ministry",
    title: "Ministry Update",
    content:
      "Here's the latest update from our ministry team. Recent accomplishments and upcoming plans.",
  },
  {
    id: "volunteer-request",
    name: "Volunteer Request",
    category: "Volunteers",
    title: "Volunteers Needed",
    content:
      "We're looking for volunteers to help with an upcoming project. Here's what we need and how you can get involved.",
  },
  {
    id: "general-announcement",
    name: "General Announcement",
    category: "General",
    title: "Important Announcement",
    content:
      "We have an important announcement to share with everyone in our community.",
  },
];

interface AnnouncementTemplatesProps {
  onSelectTemplate: (template: AnnouncementTemplate) => void;
  onCreateNew: () => void;
}

export function AnnouncementTemplates({
  onSelectTemplate,
  onCreateNew,
}: AnnouncementTemplatesProps) {
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-white flex items-center gap-2">
          <LayoutTemplate className="h-5 w-5" />
          Announcement Templates
        </h3>
      </div>

      <p className="text-xs text-[#A0AEC0] mb-4">
        Choose a template or create a new announcement from scratch
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <Card
          className="bg-[#1A202C] border-[#4A5568] hover:border-[#3182CE] transition-all duration-200 ease-in-out hover:shadow-lg transform hover:scale-105 cursor-pointer flex flex-col items-center justify-center p-6 rounded-lg"
          onClick={onCreateNew}
        >
          <Plus className="h-12 w-12 text-[#A0AEC0] group-hover:text-[#3182CE] mb-2 transition-colors" />
          <p className="text-white font-medium">Create New</p>
          <p className="text-xs text-[#A0AEC0] text-center mt-1">
            Start with a blank announcement
          </p>
        </Card>

        {defaultAnnouncementTemplates.map((template) => (
          <Card
            key={template.id}
            className="bg-[#1A202C] border-[#4A5568] hover:border-[#3182CE] transition-all duration-200 ease-in-out hover:shadow-lg transform hover:scale-105 cursor-pointer rounded-lg flex flex-col justify-between"
            onClick={() => onSelectTemplate(template)}
          >
            <CardContent className="p-4 flex flex-col h-full">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="h-5 w-5 text-[#3182CE]" />
                <h4 className="font-medium text-white">{template.name}</h4>
              </div>
              <p className="text-xs text-[#A0AEC0] mb-2">{template.category}</p>
              <div className="border border-[#4A5568] rounded p-3 bg-[#111827] mt-auto">
                <p className="text-sm font-medium text-white mb-1">
                  {template.title}
                </p>
                <p className="text-xs text-[#A0AEC0] line-clamp-2">
                  {template.content}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
