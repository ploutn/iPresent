import React, { useState } from 'react';
import { useContentStore } from '../stores/useContentStore';
import { ContentType, ContentItem } from '../types';
import { X, Check } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface ContentFormProps {
  onClose: () => void;
}

export function ContentForm({ onClose }: ContentFormProps) {
  const { addItem } = useContentStore();
  const [type, setType] = useState<ContentType>('song');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newItem: ContentItem = {
      id: Date.now().toString(),
      title,
      type,
      content,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...(type === 'song' && { lyrics: content, author }),
      ...(type === 'image' || type === 'video' ? { url } : {}),
    } as ContentItem;

    addItem(newItem);
    setShowConfirmation(true);
    setTimeout(() => {
      setShowConfirmation(false);
      onClose();
    }, 1500);
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center" 
      role="dialog" 
      aria-modal="true"
      aria-labelledby="dialog-title"
    >
      <div className="bg-slate-900 rounded-lg w-[500px] p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold" id="dialog-title">Add New Content</h2>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-slate-800 rounded-full"
            aria-label="Close dialog"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="content-type" className="block text-sm mb-1">Type</label>
            <select
              id="content-type"
              value={type}
              onChange={(e) => setType(e.target.value as ContentType)}
              className="w-full bg-slate-800/50 rounded-md px-3 py-2 border border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200"
              aria-label="Content type"
            >
              <option value="song">Song</option>
              <option value="image">Image</option>
              <option value="video">Video</option>
              <option value="announcement">Announcement</option>
            </select>
          </div>

          <div>
            <label htmlFor="content-title" className="block text-sm mb-1">Title</label>
            <input
              id="content-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-800/50 rounded-md px-3 py-2 border border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200"
              required
              aria-required="true"
            />
          </div>

          {type === 'song' && (
            <div>
              <label htmlFor="content-author" className="block text-sm mb-1">Author</label>
              <input
                id="content-author"
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full bg-slate-800 rounded-md px-3 py-2"
              />
            </div>
          )}

          {(type === 'image' || type === 'video') && (
            <div>
              <label htmlFor="content-url" className="block text-sm mb-1">URL</label>
              <input
                id="content-url"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full bg-slate-800/50 rounded-md px-3 py-2 border border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200"
                required
                aria-required="true"
              />
            </div>
          )}

          <div>
            <label htmlFor="content-text" className="block text-sm mb-1">Content</label>
            <textarea
              id="content-text"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full bg-slate-800 rounded-md px-3 py-2 min-h-[100px]"
              required
              aria-required="true"
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-700 rounded-md hover:bg-slate-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 rounded-md hover:bg-blue-500"
            >
              Add Content
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}