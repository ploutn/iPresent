import React from 'react';
import { ResizablePanel, ResizablePanelGroup } from './ui/resizable';
import { Sidebar } from './Sidebar';
import { Preview } from './Preview';
import { ScheduleView } from './ScheduleView';
import { SlideEditor } from './SlideEditor';
import { ContentItem } from '../types';
import { useContentStore } from '../stores/useContentStore';

export function MainLayout() {
  const { setSelectedItem } = useContentStore();
  
  const handleSelectItem = (item: ContentItem) => {
    setSelectedItem(item);
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      <header className="border-b px-4 py-2 flex justify-between items-center">
        <h1 className="text-xl font-bold">iPresent 2.0</h1>
        <div className="flex items-center gap-4">
          {/* Theme toggle can be added here later */}
        </div>
      </header>
      
      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={20} minSize={15} className="bg-muted/30">
            <Sidebar onSelectItem={handleSelectItem} />
          </ResizablePanel>

          <ResizablePanel defaultSize={55} minSize={30}>
            <div className="h-full flex flex-col">
              <ResizablePanelGroup direction="vertical">
                <ResizablePanel defaultSize={65} className="p-4">
                  <div className="h-full rounded-lg overflow-hidden border shadow-sm">
                    <Preview />
                  </div>
                </ResizablePanel>

                <ResizablePanel defaultSize={35} className="p-4 pt-0">
                  <ScheduleView />
                </ResizablePanel>
              </ResizablePanelGroup>
            </div>
          </ResizablePanel>

          <ResizablePanel defaultSize={25} minSize={20} className="bg-muted/30">
            <SlideEditor 
              slide={{
                id: 1,
                title: '',
                content: '',
                type: 'announcement'
              }}
              onSave={() => {}}
              onCancel={() => {}}
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}