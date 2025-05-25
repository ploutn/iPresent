import React, { useState } from "react";
import { ScrollArea } from "../ui/scroll-area";
import { Button } from "../ui/button";
import { Upload, FolderOpen } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import { MediaUploader } from "./MediaUploader";
import { MediaBrowser } from "./MediaBrowser";
import { useMediaStore } from "../../stores/useMediaStore";

export function MediaPage() {
  const [activeTab, setActiveTab] = useState("browse");
  const { mediaItems } = useMediaStore();

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-[#4A5568]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">Media Library</h2>
          <div className="text-sm text-[#A0AEC0]">
            {mediaItems.length} {mediaItems.length === 1 ? "item" : "items"}
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-[#1A202C]">
            <TabsTrigger value="browse" className="flex items-center gap-2">
              <FolderOpen className="h-4 w-4" />
              Browse
            </TabsTrigger>
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Upload
            </TabsTrigger>
          </TabsList>

          <TabsContent value="browse" className="mt-4">
            <ScrollArea className="h-[calc(100vh-200px)]">
              <MediaBrowser />
            </ScrollArea>
          </TabsContent>

          <TabsContent value="upload" className="mt-4">
            <ScrollArea className="h-[calc(100vh-200px)]">
              <MediaUploader />
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
