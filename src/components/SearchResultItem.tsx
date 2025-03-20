// src/components/SearchResultItem.tsx
import React from 'react';
import { useContentStore } from '../stores/useContentStore';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from './ui/button';
import { ContentItem, Song, Media } from '../types';

interface Props {
  item: ContentItem;
}

const SearchResultItem: React.FC<Props> = ({ item }) => {
  const { setSelectedItem } = useContentStore();

  const renderContent = () => {
    switch (item.type) {
      case 'song': {
        const songItem = item as Song;
        return <pre>{songItem.lyrics}</pre>;
      }
      case 'image':
      case 'video': {
        const mediaItem = item as Media;
        return (
          <>
            <p>{mediaItem.content}</p>
            <img src={mediaItem.thumbnail} alt="" className="mt-2 h-20 object-cover" />
          </>
        );
      }
      default:
        return <p>{item.content}</p>;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{item.title}</CardTitle>
        <CardDescription>{item.type}</CardDescription>
      </CardHeader>
      <CardContent>
        {renderContent()}
      </CardContent>
      <CardFooter className='flex justify-end'>
        <Button onClick={() => setSelectedItem(item)}>
          Preview
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SearchResultItem;