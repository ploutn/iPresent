import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { usePresentationStore } from '@/store/presentationStore';
import { useContentStore } from '../stores/useContentStore';
import { Media, Song } from '../types';

export function PresentationView() {
  const { selectedItem } = useContentStore();

  if (!selectedItem) {
    return (
      <div className="h-full flex items-center justify-center bg-background text-muted-foreground">
        <p className="text-2xl font-medium">No Output Selected</p>
      </div>
    );
  }

  const renderContent = () => {
    switch (selectedItem.type) {
      case 'image': {
        const mediaItem = selectedItem as Media;
        return (
          <img 
            src={mediaItem.url} 
            alt={mediaItem.title}
            className="max-h-full max-w-full object-contain"
          />
        );
      }
      
      case 'video': {
        const mediaItem = selectedItem as Media;
        return (
          <video 
            src={mediaItem.url}
            controls
            className="max-h-full max-w-full"
          />
        );
      }
      
      case 'song': {
        const songItem = selectedItem as Song;
        return (
          <div className="p-8 max-h-full overflow-auto">
            <h2 className="text-3xl font-semibold mb-4">{songItem.title}</h2>
            <p className="text-xl text-muted-foreground mb-6">By {songItem.author}</p>
            <pre className="whitespace-pre-wrap font-sans text-2xl leading-relaxed">{songItem.lyrics}</pre>
          </div>
        );
      }
      
      default:
        return (
          <div className="p-8 max-h-full overflow-auto">
            <h2 className="text-3xl font-semibold mb-6">{selectedItem.title}</h2>
            <div className="whitespace-pre-wrap text-2xl leading-relaxed">{selectedItem.content}</div>
          </div>
        );
    }
  };

  return (
    <div className="h-full flex items-center justify-center bg-background">
      {renderContent()}
    </div>
  );
}