import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { Dialog, DialogContent } from './ui/dialog';
import { useContentStore } from '../stores/useContentStore';
import { usePresentationStore } from '../store/presentationStore';
import { ContentItem, Slide } from '../types';

export function AnnouncementLibrary() {
  const { items } = useContentStore();
  const { addSlide } = usePresentationStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  interface NewAnnouncement extends ContentItem {
    title: string;
    content: string;
    id: string;
    type: 'announcement';
    createdAt: Date;
    updatedAt: Date;
  }

  const [newAnnouncement, setNewAnnouncement] = useState<NewAnnouncement>({
    id: '',
    title: '',
    content: '',
    type: 'announcement',
    createdAt: new Date(),
    updatedAt: new Date()
  });

  const announcements = items.filter(item => item.type === 'announcement');

  const { addItem } = useContentStore();

  const handleAddAnnouncement = () => {
    const timestamp = Date.now();
    const announcementItem = {
      id: String(timestamp),
      type: 'announcement' as const,
      title: newAnnouncement.title,
      content: newAnnouncement.content
    };

    // Add to content store
    addItem({
      ...newAnnouncement,
      id: String(timestamp),
      type: 'announcement',
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Add to presentation store
    const newSlide: Slide = {
      id: timestamp,
      type: 'announcement',
      title: newAnnouncement.title,
      content: newAnnouncement.content
    };
    addSlide(newSlide);

    setNewAnnouncement({
      id: '',
      title: '',
      content: '',
      type: 'announcement',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    setIsDialogOpen(false);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-slate-800 flex justify-between items-center">
        <h2 className="text-lg font-semibold">Announcements</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsDialogOpen(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          New Announcement
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 grid grid-cols-2 gap-4">
          {announcements.map((announcement) => (
            <div
              key={announcement.id}
              className="p-4 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors cursor-pointer"
            >
              <h3 className="font-medium mb-2">{announcement.title}</h3>
              <p className="text-sm text-slate-400 line-clamp-3">{announcement.content}</p>
            </div>
          ))}
        </div>
      </ScrollArea>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <div className="p-6 bg-slate-900 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">New Announcement</h2>
            <div className="space-y-4">
              <div>
                <input
                  type="text"
                  value={newAnnouncement.title}
                  onChange={(e) => setNewAnnouncement(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Title"
                  className="w-full p-2 bg-slate-800 border border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <textarea
                  value={newAnnouncement.content}
                  onChange={(e) => setNewAnnouncement(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Content"
                  rows={6}
                  className="w-full p-2 bg-slate-800 border border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="ghost" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleAddAnnouncement}>Save</Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}