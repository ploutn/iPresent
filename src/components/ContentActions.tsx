// src/components/ContentActions.tsx
import React from 'react'; // Import React
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { usePresentationStore } from '../store/presentationStore'; // Correct relative import
import { Slide } from '../types'; // Correct relative import

interface ContentActionsProps {
  content: string;
  title: string;
  type: Slide['type'];
}

export function ContentActions({ content, title, type }: ContentActionsProps) {
  const addSlide = usePresentationStore((state) => state.addSlide);

  const handleAdd = () => {
    addSlide({
      id: Date.now(), // Using Date.now() as a simple ID for now
      title,
      content,
      type,
    });
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleAdd}
      className="opacity-0 group-hover:opacity-100 transition-opacity"
    >
      <Plus className="h-4 w-4 mr-1" />
      Add to Presentation
    </Button>
  );
}