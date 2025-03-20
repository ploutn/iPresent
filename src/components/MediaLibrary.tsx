import React, { useState } from 'react';
import { Search, Image, Video, Upload, Plus } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { Tabs, TabsList, TabsTrigger } from './ui/tabs';
import { usePresentationStore } from '../store/presentationStore';
import { useContentStore } from '../stores/useContentStore';
import { Media, Slide } from '../types';

export function MediaLibrary() {
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  const [searchQuery, setSearchQuery] = useState('');
  const { items } = useContentStore();
  const { addSlide } = usePresentationStore();

  const mediaItems = items.filter((item): item is Media => 
    (item.type === 'image' || item.type === 'video')
  );

  const handleAddMedia = (item: Media) => {
    const newSlide: Slide = {
      id: Date.now(),
      title: item.title,
      content: item.url,
      type: item.type,
      thumbnail: item.thumbnail,
      duration: item.type === 'video' ? item.duration : undefined
    };
    addSlide(newSlide);
  };

  const handleMediaPreview = (item: Media) => {
    // Preview the media in the preview area
    if (item.type === 'video') {
      // Handle video preview
      const video = document.createElement('video');
      video.src = item.url;
      video.controls = true;
      // Add preview logic here
    } else if (item.type === 'image') {
      // Handle image preview
      const img = document.createElement('img');
      img.src = item.url;
      // Add preview logic here
    }
  };

  const filteredItems = mediaItems.filter(item =>
    item.type === mediaType &&
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-slate-800">
        <div className="flex gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search media..."
              className="pl-9 bg-slate-900"
            />
          </div>
          <Button variant="outline" size="icon">
            <Upload className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <Tabs value={mediaType} onValueChange={(v) => setMediaType(v as 'image' | 'video')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="image" className="flex items-center gap-2">
              <Image className="h-4 w-4" />
              Images
            </TabsTrigger>
            <TabsTrigger value="video" className="flex items-center gap-2">
              <Video className="h-4 w-4" />
              Videos
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 grid grid-cols-2 gap-2">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="group relative aspect-video bg-slate-800 rounded-lg overflow-hidden cursor-pointer"
              onClick={() => handleMediaPreview(item)}
              onDoubleClick={() => handleAddMedia(item)}
            >
              {item.thumbnail ? (
                <img 
                  src={item.thumbnail} 
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  {item.type === 'image' ? (
                    <Image className="h-8 w-8 text-slate-600" />
                  ) : (
                    <Video className="h-8 w-8 text-slate-600" />
                  )}
                </div>
              )}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <p className="text-sm text-white text-center p-2">{item.title}</p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}