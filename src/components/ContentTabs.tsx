// src/components/ContentTabs.tsx
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { useContentStore } from '../stores/useContentStore';
import { ContentType } from '../types';

export function ContentTabs() {
  const { items } = useContentStore();
  const [currentTab, setCurrentTab] = useState<ContentType>('song');

  const filteredItems = items.filter(item => item.type === currentTab);

  return (
    <Tabs value={currentTab} onValueChange={(value) => setCurrentTab(value as ContentType)}>
      <TabsList>
        <TabsTrigger value="song">Songs</TabsTrigger>
        <TabsTrigger value="announcement">Announcements</TabsTrigger>
        <TabsTrigger value="image">Images</TabsTrigger>
        <TabsTrigger value="video">Videos</TabsTrigger>
      </TabsList>
      {/* ... rest of the component */}
    </Tabs>
  );
}