import React from 'react';
import { ScrollArea } from '../ui/scroll-area';
import { Button } from '../ui/button';
import { Image, Video, Plus, Search, Upload } from 'lucide-react';
import { Input } from '../ui/input';
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs';

export function MediaPage() {
  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-[#4A5568]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">Media Library</h2>
          <Button className="bg-[#3182CE] hover:bg-[#2B6CB0]">
            <Upload className="h-4 w-4 mr-2" />
            Upload Media
          </Button>
        </div>
        
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#A0AEC0]" />
          <Input 
            placeholder="Search media..." 
            className="pl-9 bg-[#1A202C] border-[#4A5568]"
          />
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-[#1A202C]">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="images">Images</TabsTrigger>
            <TabsTrigger value="videos">Videos</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="grid grid-cols-2 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="group relative aspect-video bg-[#2D3748] rounded-lg overflow-hidden hover:ring-2 hover:ring-[#3182CE] transition-all cursor-pointer"
            >
              <div className="absolute inset-0 flex items-center justify-center">
                {i % 2 === 0 ? (
                  <Image className="h-8 w-8 text-[#A0AEC0]" />
                ) : (
                  <Video className="h-8 w-8 text-[#A0AEC0]" />
                )}
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-sm text-white">Media {i + 1}</p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}