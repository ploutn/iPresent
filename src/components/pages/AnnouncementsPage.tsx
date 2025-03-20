// components/pages/AnnouncementsPage.tsx
import React, { useState } from 'react';
import { ScrollArea } from '../ui/scroll-area';
import { Button } from '../ui/button';
import { FileText, Plus, Search, Calendar, Clock, Edit, Trash2, AlignLeft, AlignCenter, AlignRight, Bold, Italic, Underline } from 'lucide-react';
import { Input } from '../ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';

// Define the Announcement type
interface Announcement {
  id: number;
  title: string;
  content: string;
  date: string;
  time: string;
}

// Sample announcement data
const sampleAnnouncements: Announcement[] = [
  { id: 1, title: 'Church Picnic', content: 'Join us for our annual church picnic at Central Park. Bring your family and friends for a day of fun, food, and fellowship.', date: 'June 10, 2023', time: '12:00 PM' },
  { id: 2, title: 'Youth Group Meeting', content: 'Youth group will meet this Friday for games, worship, and Bible study. All teens are welcome!', date: 'June 15, 2023', time: '7:00 PM' },
  { id: 3, title: 'Volunteer Appreciation', content: 'We\'re hosting a special dinner to thank all our volunteers for their dedicated service throughout the year.', date: 'June 20, 2023', time: '6:30 PM' },
  { id: 4, title: 'Bible Study Series', content: 'New Bible study series starting next week on the Book of Romans. Sign up at the welcome desk.', date: 'June 22, 2023', time: '7:00 PM' },
  { id: 5, title: 'Community Outreach', content: 'Help us serve our community by volunteering at the local food bank this Saturday morning.', date: 'June 24, 2023', time: '9:00 AM' },
];

export function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>(sampleAnnouncements);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newAnnouncementTitle, setNewAnnouncementTitle] = useState('');
  const [newAnnouncementContent, setNewAnnouncementContent] = useState('');
  
  // Filter announcements based on search query
  const filteredAnnouncements = announcements.filter(announcement => 
    announcement.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    announcement.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddAnnouncement = () => {
    setShowAddDialog(true);
  };

  const handleSaveAnnouncement = () => {
    if (newAnnouncementTitle.trim() === '') return;
    
    const newAnnouncement: Announcement = {
      id: announcements.length + 1,
      title: newAnnouncementTitle,
      content: newAnnouncementContent || 'No content provided',
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
    };
    
    setAnnouncements([...announcements, newAnnouncement]);
    setNewAnnouncementTitle('');
    setNewAnnouncementContent('');
    setShowAddDialog(false);
  };

  const handleSelectAnnouncement = (announcement: Announcement) => {
    setSelectedAnnouncement(announcement);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-[#4A5568]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">Announcements</h2>
          <Button className="bg-[#3182CE] hover:bg-[#2B6CB0]" onClick={handleAddAnnouncement}>
            <Plus className="h-4 w-4 mr-2" />
            New Announcement
          </Button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#A0AEC0]" />
          <Input 
            placeholder="Search announcements..." 
            className="pl-9 bg-[#1A202C] border-[#4A5568]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <ScrollArea className="flex-1 p-4">
        {/* Announcement list - same as before */}
      </ScrollArea>
      
      {selectedAnnouncement && (
        <div className="border-t border-[#4A5568] p-4 bg-[#1A202C]">
          {/* Selected announcement details - same as before */}
        </div>
      )}

      {/* Add Announcement Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="bg-[#1A202C] border-[#4A5568] text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">New Announcement</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <Input
              placeholder="Announcement Title"
              className="bg-[#2D3748] border-[#4A5568] text-white"
              value={newAnnouncementTitle}
              onChange={(e) => setNewAnnouncementTitle(e.target.value)}
            />
            
            <div className="border border-[#4A5568] rounded-md overflow-hidden">
              {/* Text Editor Toolbar */}
              <div className="flex items-center gap-1 p-2 bg-[#2D3748] border-b border-[#4A5568]">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-[#A0AEC0] hover:text-white">
                  <AlignLeft className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-[#A0AEC0] hover:text-white">
                  <AlignCenter className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-[#A0AEC0] hover:text-white">
                  <AlignRight className="h-4 w-4" />
                </Button>
                <div className="w-px h-6 bg-[#4A5568] mx-1"></div>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-[#A0AEC0] hover:text-white">
                  <Bold className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-[#A0AEC0] hover:text-white">
                  <Italic className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-[#A0AEC0] hover:text-white">
                  <Underline className="h-4 w-4" />
                </Button>
                <div className="flex-1"></div>
                <Button variant="outline" size="sm" className="text-sm bg-transparent border-[#4A5568] text-[#A0AEC0] hover:text-white">
                  reset formatting
                </Button>
              </div>
              
              {/* Text Editor Content */}
              <div className="p-4 min-h-[200px] bg-[#1A202C]">
                <textarea
                  className="w-full h-full min-h-[200px] bg-transparent border-none focus:outline-none text-white resize-none"
                  placeholder="Enter announcement content..."
                  value={newAnnouncementContent}
                  onChange={(e) => setNewAnnouncementContent(e.target.value)}
                ></textarea>
              </div>
            </div>
          </div>
          
          <DialogFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowAddDialog(false)} className="bg-transparent border-[#4A5568] text-white">
              Cancel
            </Button>
            <Button onClick={handleSaveAnnouncement} className="bg-[#3182CE] hover:bg-[#2B6CB0]">
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}