// src/components/CreateItemForm.tsx
import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useContentStore } from '../stores/useContentStore';
import { ContentType, ContentItem, Song, Media, Announcement } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface Props {
  mode: 'create' | 'edit';
  type: ContentType;
  initialData?: ContentItem;
  open: boolean;
  setOpen: (open: boolean) => void;
}

const CreateItemForm: React.FC<Props> = ({ mode, type, initialData, open, setOpen }) => {
  const { addItem } = useContentStore();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [lyrics, setLyrics] = useState('');
  const [url, setUrl] = useState('');
  const [author, setAuthor] = useState('');
  const [ccliNumber, setCcliNumber] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    if (mode === 'edit' && initialData) {
      setTitle(initialData.title);
      setContent(initialData.content);
      
      if (initialData.type === 'song') {
        const songData = initialData as Song;
        setLyrics(songData.lyrics);
        setAuthor(songData.author);
        setCcliNumber(songData.ccliNumber || '');
      }
      
      if (initialData.type === 'image' || initialData.type === 'video') {
        const mediaData = initialData as Media;
        setUrl(mediaData.url);
      }
    }
  }, [mode, initialData]);

  const handleSubmit = () => {
    const now = new Date();
    const id = initialData?.id || uuidv4();
    let newItem: ContentItem = {
      id,
      type: 'announcement',
      title: '',
      content: '',
      createdAt: now,
      updatedAt: now
    };

    switch (type) {
      case 'song':
        newItem = {
          id,
          type: 'song',
          title,
          content,
          lyrics,
          author,
          ccliNumber,
          createdAt: now,
          updatedAt: now,
        } as Song;
        break;

      case 'image':
      case 'video':
        newItem = {
          id,
          type,
          title,
          content,
          url,
          thumbnail: url,
          createdAt: now,
          updatedAt: now,
        } as Media;
        break;

      case 'announcement':
        newItem = {
          id,
          type: 'announcement',
          title,
          content,
          createdAt: now,
          updatedAt: now,
        } as Announcement;
        break;
    }

    addItem(newItem);
    resetForm();
    setOpen(false);
  };

  const resetForm = () => {
    setTitle('');
    setContent('');
    setLyrics('');
    setUrl('');
    setAuthor('');
    setCcliNumber('');
    setTags([]);
    setTagInput('');
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Create New' : 'Edit'} {type.charAt(0).toUpperCase() + type.slice(1)}
          </DialogTitle>
          <DialogDescription>
            Fill in the details below.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="title" className="text-right">Title</label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="col-span-3"
            />
          </div>

          {type === 'song' && (
            <>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="lyrics" className="text-right">Lyrics</label>
                <Textarea
                  id="lyrics"
                  value={lyrics}
                  onChange={(e) => setLyrics(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="author" className="text-right">Author</label>
                <Input
                  id="author"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="ccli" className="text-right">CCLI</label>
                <Input
                  id="ccli"
                  value={ccliNumber}
                  onChange={(e) => setCcliNumber(e.target.value)}
                  className="col-span-3"
                />
              </div>
            </>
          )}

          {type === 'announcement' && (
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="content" className="text-right">Content</label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="col-span-3"
              />
            </div>
          )}

          {(type === 'image' || type === 'video') && (
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="url" className="text-right">URL</label>
              <Input
                id="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="col-span-3"
              />
            </div>
          )}
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSubmit}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateItemForm;