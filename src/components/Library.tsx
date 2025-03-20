import React, { useState } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import { ContentItem, ContentType } from '../types';
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ScrollArea } from './ui/scroll-area';
import { useContentStore } from '../stores/useContentStore';
import { Dialog, DialogTrigger } from './ui/dialog';
import CreateItemForm from './CreateItemForm';

interface LibraryProps {
  onAddToQueue: (item: ContentItem) => void;
}

export function Library({ onAddToQueue }: LibraryProps) {
  const { items, setSearchQuery, searchQuery } = useContentStore();
  const [activeTab, setActiveTab] = useState<ContentType | 'all'>('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [createItemType, setCreateItemType] = useState<ContentType>('song');

  const filteredItems = items.filter(item => 
    (activeTab === 'all' || item.type === activeTab)
  );

  const handleCreateItem = (type: ContentType) => {
    setCreateItemType(type);
    setIsCreateDialogOpen(true);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Library</h2>
          <Button variant="ghost" size="icon">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="relative mb-4">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Tabs defaultValue="all" value={activeTab} onValueChange={(v) => setActiveTab(v as ContentType | 'all')}>
          <TabsList className="w-full">
            <TabsTrigger value="all" className="flex-1">All</TabsTrigger>
            <TabsTrigger value="song" className="flex-1">Songs</TabsTrigger>
            <TabsTrigger value="announcement" className="flex-1">Announcements</TabsTrigger>
            <TabsTrigger value="image" className="flex-1">Images</TabsTrigger>
            <TabsTrigger value="video" className="flex-1">Videos</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-2">
          {filteredItems.map(item => (
            <div 
              key={item.id}
              className="p-3 rounded-md bg-card hover:bg-accent cursor-pointer transition-colors"
              onClick={() => onAddToQueue(item)}
            >
              <h3 className="font-medium truncate">{item.title}</h3>
              <p className="text-xs text-muted-foreground">{item.type}</p>
            </div>
          ))}
          
          {filteredItems.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <p>No items found</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2"
                onClick={() => handleCreateItem(activeTab as ContentType)}
              >
                Create New
              </Button>
            </div>
          )}
        </div>
      </ScrollArea>
      
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogTrigger asChild>
          <Button className="m-4" onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add New Item
          </Button>
        </DialogTrigger>
        <CreateItemForm 
          mode="create"
          type={createItemType}
          open={isCreateDialogOpen}
          setOpen={setIsCreateDialogOpen}
        />
      </Dialog>
    </div>
  );
}