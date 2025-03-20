import React, { useState } from 'react';
import { useContentStore } from '../stores/useContentStore';
import { ScrollArea } from './ui/scroll-area';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { GripVertical, X, Play, List, MoreHorizontal } from 'lucide-react';
import { ScheduledItem } from '../types';

export function ScheduleView() {
  const { scheduledItems, unscheduleItem } = useContentStore();
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);

  return (
    <div className="h-full flex flex-col rounded-lg border shadow-sm overflow-hidden">
      <div className="p-3 border-b bg-muted/30 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <List className="h-4 w-4" />
          <h2 className="text-sm font-medium">Presentation Queue</h2>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="h-7 px-2">Clear</Button>
          <Button size="sm" className="h-7 px-2">Present All</Button>
        </div>
      </div>

      {scheduledItems.length > 0 ? (
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-2">
            {scheduledItems.map((item, index) => (
              <Card key={item.id} className={`
                ${currentIndex === index ? 'ring-2 ring-primary' : ''}
              `}>
                <CardContent className="p-2 flex items-center gap-2">
                  <div className="p-1 cursor-grab">
                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate font-medium text-sm">{item.contentId}</p>
                    <p className="text-xs text-muted-foreground">Order: {item.order}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => setCurrentIndex(index)}
                    >
                      <Play className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-destructive"
                      onClick={() => unscheduleItem(item.id)}
                    >
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      ) : (
        <div className="flex-1 flex items-center justify-center text-muted-foreground p-4">
          <p className="text-center">
            Your presentation queue is empty.<br />
            Add items from the library to get started.
          </p>
        </div>
      )}
    </div>
  );
}