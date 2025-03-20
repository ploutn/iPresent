import React from 'react';
import { Search } from 'lucide-react';
import { useContentStore } from '../stores/useContentStore';

interface SearchBarProps {
  placeholder?: string;
  className?: string;
}

export function SearchBar({ placeholder = "Search...", className }: SearchBarProps) {
  const { searchQuery, setSearchQuery } = useContentStore();

  return (
    <div className="relative">
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-slate-900/50 rounded-md pl-9 pr-4 py-2 text-sm text-slate-200 placeholder:text-slate-400
                 focus:outline-none focus:ring-2 focus:ring-slate-600"
      />
      <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
    </div>
  );
}