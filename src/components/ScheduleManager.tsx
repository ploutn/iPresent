// components/ScheduleManager.tsx
import React, { useState } from 'react';
import { useContentStore } from '../stores/useContentStore';
import { Clock, X } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { ContentItem } from '../types';

export function ScheduleManager() {
  const { items, scheduledItems, scheduleItem, unscheduleItem } = useContentStore();
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [selectedContentId, setSelectedContentId] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState(new Date().toISOString().slice(0, 16));
  const [selectedDuration, setSelectedDuration] = useState('5');

  const handleSchedule = () => {
    if (!selectedContentId) return;
    const content = items.find(item => item.id === selectedContentId);
    if (content) {
      const newScheduledItem = {
        id: Date.now().toString(),
        contentId: selectedContentId,
        scheduledFor: new Date(selectedTime),
        duration: parseInt(selectedDuration),
        contentType: content.type as 'song' | 'announcement' | 'image' | 'video',
        order: scheduledItems.length // Add the required 'order' property
      };
      scheduleItem(newScheduledItem);
      setShowScheduleForm(false);
      setSelectedContentId(null);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#2D3748] p-6 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-white mb-4 tracking-tight">Schedule</h1>
      <div className="flex-1 overflow-y-auto space-y-3">
        {scheduledItems.map((item) => {
          const content = items.find(i => i.id === item.contentId);
          if (!content) return null;
          return (
            <Card
              key={item.id}
              className="p-3 bg-[#2D3748] hover:bg-[#3D4A5C] text-white rounded-md shadow-sm border border-[#4A5568] transition-all duration-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-lg">{content.title}</h3>
                  <p className="text-sm text-[#A0AEC0]">
                    {new Date(item.scheduledFor).toLocaleTimeString()} ({item.duration} min)
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => unscheduleItem(item.id)}
                  className="text-[#A0AEC0] hover:text-white"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
      <div className="mt-4">
        {showScheduleForm ? (
          <div className="space-y-3">
            <select
              value={selectedContentId || ''}
              onChange={(e) => setSelectedContentId(e.target.value)}
              className="w-full bg-[#4A5568] text-white px-4 py-2 rounded-md border border-[#4A5568] shadow-sm"
              title="Select content to schedule"
              aria-label="Select content to schedule"
            >
              <option value="">Select a song...</option>
              {items.filter(item => item.type === 'song').map((item) => (
                <option key={item.id} value={item.id}>{item.title}</option>
              ))}
            </select>
            <input
              type="datetime-local"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="w-full bg-[#4A5568] text-white px-4 py-2 rounded-md border border-[#4A5568] shadow-sm"
              title="Schedule date and time"
              aria-label="Schedule date and time"
            />
            <select
              value={selectedDuration}
              onChange={(e) => setSelectedDuration(e.target.value)}
              className="w-full bg-[#4A5568] text-white px-4 py-2 rounded-md border border-[#4A5568] shadow-sm"
              title="Select duration"
              aria-label="Select duration in minutes"
            >
              {[1, 2, 3, 5, 10, 15, 20, 30].map((duration) => (
                <option key={duration} value={duration}>{duration} min</option>
              ))}
            </select>
            <div className="flex gap-2">
              <Button
                onClick={handleSchedule}
                className="flex-1 bg-[#3182CE] hover:bg-[#2B6CB0] text-white shadow-sm font-medium rounded-md px-4 py-2 transition-all duration-200"
              >
                Schedule
              </Button>
              <Button
                onClick={() => setShowScheduleForm(false)}
                className="flex-1 bg-[#4A5568] hover:bg-[#3D4A5C] text-white border border-[#4A5568] shadow-sm font-medium rounded-md px-4 py-2 transition-all duration-200"
                variant="outline"
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <Button
            onClick={() => setShowScheduleForm(true)}
            className="w-full flex items-center justify-center gap-2 bg-[#4A5568] hover:bg-[#3D4A5C] text-white shadow-sm font-medium rounded-md px-4 py-2 transition-all duration-200"
          >
            <Clock className="h-5 w-5" />
            Add to Schedule
          </Button>
        )}
      </div>
    </div>
  );
}