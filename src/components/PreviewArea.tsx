// components/Preview.tsx
import React from 'react';
import { useContentStore } from '../stores/useContentStore';
import { ContentItem, Song, Media } from '../types';

export function PreviewArea() {
  const { selectedItem } = useContentStore();

  if (!selectedItem) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground bg-background rounded-lg p-6 shadow-sm border">
        <p className="text-2xl font-medium">No Output Selected</p>
      </div>
    );
  }

  const renderContent = () => {
    switch (selectedItem.type) {
      case 'image':
      case 'video': {
        const mediaItem = selectedItem as Media;
        return mediaItem.type === 'image' ? (
          <img 
            src={mediaItem.url} 
            alt={mediaItem.title}
            className="max-h-full max-w-full object-contain rounded-lg shadow-sm"
          />
        ) : (
          <video 
            src={mediaItem.url}
            controls
            className="max-h-full max-w-full rounded-lg shadow-sm"
          />
        );
      }
      
      case 'song': {
        const songItem = selectedItem as Song;
        return (
          <div className="p-6 max-h-full overflow-auto bg-background rounded-lg shadow-sm border">
            <h3 className="text-2xl font-semibold mb-4">{songItem.title}</h3>
            <p className="text-lg text-muted-foreground mb-4">By {songItem.author}</p>
            <pre className="whitespace-pre-wrap font-sans text-lg">{songItem.lyrics}</pre>
          </div>
        );
      }
      
      case 'announcement':
        return (
          <div className="p-6 max-h-full overflow-auto bg-background rounded-lg shadow-sm border">
            <h3 className="text-2xl font-semibold mb-4">{selectedItem.title}</h3>
            <p className="whitespace-pre-wrap text-lg">{selectedItem.content}</p>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="h-full flex items-center justify-center bg-background">
      {renderContent()}
    </div>
  );
}