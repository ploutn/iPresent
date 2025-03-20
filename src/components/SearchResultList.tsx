// src/components/SearchResultsList.tsx
import React from 'react';
import { usePresentationStore } from '../store/presentationStore';
import SearchResultItem from './SearchResultItem';
import { ScrollArea } from './ui/scroll-area';

const SearchResultsList: React.FC = () => {
  const { searchResults } = usePresentationStore();

  return (
    <ScrollArea className="h-72 w-full rounded-md border">
      <div className="p-4">
      {searchResults.length === 0 ? (
        <p>No results found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {searchResults.map((item) => (
            <SearchResultItem key={item.id} item={item} />
          ))}
        </div>
      )}
      </div>
    </ScrollArea>
  );
};

export default SearchResultsList;