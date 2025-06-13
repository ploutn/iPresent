// src/pages/PresentationViewPage.tsx
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { PresentationView } from "../components/presentation/PresentationView";
import { usePresentationStore } from "../store/presentationStore";
import { Button } from "../components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function PresentationViewPage() {
  const { id } = useParams<{ id: string }>();
  const {
    presentations,
    setCurrentPresentation,
    nextSlide,
    previousSlide,
    currentSlideIndex,
    currentPresentation,
  } = usePresentationStore();

  useEffect(() => {
    if (id) {
      const presentation = presentations.find((p) => p.id === id);
      setCurrentPresentation(presentation || null);
    }
  }, [id, presentations, setCurrentPresentation]);

  if (!id) {
    return <div>Error: Presentation ID not found.</div>;
  }

  if (!currentPresentation) {
    return <div>Loading presentation...</div>;
  }

  return (
    <div className="relative h-screen w-screen bg-black flex items-center justify-center">
      <PresentationView className="h-full w-full" />

      {/* Navigation Controls */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-4">
        <Button
          onClick={previousSlide}
          disabled={currentSlideIndex === 0}
          className="p-2 rounded-full bg-gray-800 text-white hover:bg-gray-700"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <Button
          onClick={nextSlide}
          disabled={
            currentSlideIndex === (currentPresentation.slides?.length || 0) - 1
          }
          className="p-2 rounded-full bg-gray-800 text-white hover:bg-gray-700"
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
}
