import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useContentStore } from '../stores/useContentStore';
import { ContentType, ContentItem } from '../types';

interface ContentListProps {
  type?: ContentItem['type'];
}

export function ContentList({ type }: ContentListProps) {
  const { items, searchQuery, setSelectedItem } = useContentStore();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredItems = items.filter(item => {
    const matchesType = !type || item.type === type;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="space-y-3 p-4">
      {filteredItems.map((item) => (
        <div 
          key={item.id}
          className="bg-slate-800/50 rounded-lg overflow-hidden border border-slate-700/50 shadow-md hover:shadow-lg transition-all duration-200"
        >
          <div 
            className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-700/50 transition-colors duration-200"
            onClick={() => toggleExpand(item.id)}
          >
            <div>
              <h3 className="font-medium text-slate-200">{item.title}</h3>
              <p className="text-sm text-slate-400 mt-0.5">{item.type}</p>
            </div>
            <button className="p-1">
              {expandedId === item.id ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>
          </div>

          {expandedId === item.id && (
            <div className="p-4 border-t border-slate-700/50 bg-slate-800/30">
              <p className="text-sm text-slate-300 leading-relaxed">{item.content}</p>
              <button
                onClick={() => setSelectedItem(item)}
                className="mt-3 px-4 py-1.5 text-sm bg-slate-700/50 rounded-md hover:bg-slate-600 transition-colors duration-200 border border-slate-600/50 hover:border-slate-500"
              >
                Preview
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}