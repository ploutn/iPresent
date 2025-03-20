import React, { useState } from 'react';
import { DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Slide } from '../types';

interface SlideEditorProps {
  slide: Slide;
  onSave: (slide: Slide) => void;
  onCancel: () => void;
}

export function SlideEditor({ slide, onSave, onCancel }: SlideEditorProps) {
  const [editedSlide, setEditedSlide] = useState<Slide>({ ...slide });

  const handleSave = () => {
    if (editedSlide.title.trim() && editedSlide.content.trim()) {
      onSave(editedSlide);
    }
  };

  return (
    <div className="space-y-4">
      <DialogHeader>
        <DialogTitle>Edit Slide</DialogTitle>
      </DialogHeader>

      <div className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="title" className="text-sm font-medium">
            Title
          </label>
          <Input
            id="title"
            value={editedSlide.title}
            onChange={(e) => setEditedSlide({ ...editedSlide, title: e.target.value })}
            placeholder="Enter slide title"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="content" className="text-sm font-medium">
            Content
          </label>
          <Textarea
            id="content"
            value={editedSlide.content}
            onChange={(e) => setEditedSlide({ ...editedSlide, content: e.target.value })}
            placeholder="Enter slide content"
            rows={5}
          />
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSave}>
          Save Changes
        </Button>
      </DialogFooter>
    </div>
  );
}