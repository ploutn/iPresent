// src/pages/LibraryPage.tsx
import React, { useEffect } from 'react';
import { Library } from '../Library';
import { useContentStore } from '../../stores/useContentStore';
import { ContentItem } from '../../types';

export function LibraryPage() {
  const { loadItems } = useContentStore();

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const handleAddToQueue = (item: ContentItem) => {
    // Handle adding item to queue
    console.log('Adding to queue:', item);
  };

  return <Library onAddToQueue={handleAddToQueue} />;
}