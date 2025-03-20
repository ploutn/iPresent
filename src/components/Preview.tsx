// components/Preview.tsx
import React, { useState } from 'react';
import { useContentStore } from '../stores/useContentStore';
import { ContentItem, Song, Media } from '../types';
import { Button } from './ui/button';
import { Maximize2, ExternalLink, X } from 'lucide-react';

export function Preview() {
  const { selectedItem, setSelectedItem } = useContentStore();
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    const previewElement = document.getElementById('preview-container');
    if (!document.fullscreenElement && previewElement) {
      previewElement.requestFullscreen().then(() => {
        setIsFullscreen(true);
      });
    } else if (document.fullscreenElement) {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      });
    }
  };

  const openPresentation = () => {
    // Open in a new window for presentation
    const presentationWindow = window.open('', '_blank', 'width=1024,height=768');
    if (presentationWindow) {
      presentationWindow.document.write(`
        <html>
          <head>
            <title>Presentation - ${selectedItem?.title || 'Untitled'}</title>
            <style>
              body { margin: 0; padding: 0; background: black; color: white; font-family: system-ui; overflow: hidden; display: flex; align-items: center; justify-content: center; height: 100vh; }
              img, video { max-width: 100%; max-height: 100vh; object-fit: contain; }
              .content { padding: 2rem; max-width: 80%; }
              h1 { font-size: 2.5rem; margin-bottom: 1rem; }
              pre { white-space: pre-wrap; font-family: inherit; font-size: 1.5rem; line-height: 1.5; }
            </style>
          </head>
          <body>
            <div class="content" id="presentation-content"></div>
          </body>
        </html>
      `);
      
      // Render the content in the new window
      const contentElement = presentationWindow.document.getElementById('presentation-content');
      if (contentElement && selectedItem) {
        if (selectedItem.type === 'image') {
          const img = presentationWindow.document.createElement('img');
          img.src = (selectedItem as Media).url;
          img.alt = selectedItem.title;
          contentElement.appendChild(img);
        } else if (selectedItem.type === 'video') {
          const video = presentationWindow.document.createElement('video');
          video.src = (selectedItem as Media).url;
          video.controls = true;
          video.autoplay = true;
          contentElement.appendChild(video);
        } else if (selectedItem.type === 'song') {
          const title = presentationWindow.document.createElement('h1');
          title.textContent = selectedItem.title;
          
          const lyrics = presentationWindow.document.createElement('pre');
          lyrics.textContent = (selectedItem as Song).lyrics;
          
          contentElement.appendChild(title);
          contentElement.appendChild(lyrics);
        } else {
          const title = presentationWindow.document.createElement('h1');
          title.textContent = selectedItem.title;
          
          const content = presentationWindow.document.createElement('pre');
          content.textContent = selectedItem.content;
          
          contentElement.appendChild(title);
          contentElement.appendChild(content);
        }
      }
    }
  };

  if (!selectedItem) {
    return (
      <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-background rounded-lg shadow-sm border">
        <p className="text-lg font-medium">No Output Selected</p>
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
            className="w-full h-full object-contain rounded-lg"
          />
        ) : (
          <video 
            src={mediaItem.url}
            controls
            className="w-full h-full rounded-lg"
          />
        );
      }
      
      case 'song': {
        const songItem = selectedItem as Song;
        return (
          <div className="w-full h-full p-4 overflow-auto bg-background rounded-lg border">
            <h3 className="text-lg font-semibold mb-2">{songItem.title}</h3>
            <p className="text-sm text-muted-foreground mb-2">By {songItem.author}</p>
            <pre className="whitespace-pre-wrap font-sans text-sm">{songItem.lyrics}</pre>
          </div>
        );
      }
      
      case 'announcement':
        return (
          <div className="w-full h-full p-4 overflow-auto bg-background rounded-lg border">
            <h3 className="text-lg font-semibold mb-2">{selectedItem.title}</h3>
            <p className="whitespace-pre-wrap text-sm">{selectedItem.content}</p>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="relative w-full h-full" id="preview-container">
      <div className="absolute top-2 right-2 flex gap-2 z-10">
        <Button variant="ghost" size="icon" onClick={() => setSelectedItem(null)}>
          <X className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={toggleFullscreen}>
          <Maximize2 className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={openPresentation}>
          <ExternalLink className="h-4 w-4" />
        </Button>
      </div>
      <div className={`w-full h-full flex items-center justify-center ${isFullscreen ? 'bg-black' : ''}`}>
        {renderContent()}
      </div>
    </div>
  );
}