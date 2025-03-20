// src/components/ContentSearch.tsx
import React, { useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, XCircle } from "lucide-react";
import { usePresentationStore } from '../store/presentationStore';
import SearchResultsList from './SearchResultList';

const ContentSearch: React.FC = () => {
    const { searchQuery, setSearchQuery, search,  searchError } = usePresentationStore();

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
    };

    useEffect(() => {
        const handleSearch = () => {
          if (searchQuery.trim() !== '') {
            search();
          }
        };

        const timer = setTimeout(handleSearch, 300); // Debounce

        return () => clearTimeout(timer);
    }, [searchQuery, search]);


    const handleClear = () => {
      setSearchQuery('');
    }

    return (
        <>
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <Input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={handleInputChange}
                className="w-full bg-gray-700 text-white px-4 py-2 pl-10 rounded-lg"
                />
                {searchQuery && (
                    <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-gray-500"
                    onClick={handleClear}
                    >
                    <XCircle className="h-4 w-4" />
                    </Button>
                )}
            </div>
            {searchError && <p className="text-red-500">{searchError}</p>}
            <SearchResultsList/>
        </>
    );
};

export default ContentSearch;