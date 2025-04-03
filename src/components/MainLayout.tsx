import React from "react";
import { ResizablePanel, ResizablePanelGroup } from "./ui/resizable";
import { Sidebar } from "./Sidebar";
import { Preview } from "./Preview";
import { ScheduleView } from "./ScheduleView";
import { SlideEditor } from "./SlideEditor";
import { ContentItem } from "../types";
import { useContentStore } from "../stores/useContentStore";
import { OutputManagement } from "./OutputManagement";
import { LivePresentation } from "./LivePresentation";

export function MainLayout() {
  const { setSelectedItem } = useContentStore();

  const handleSelectItem = (item: ContentItem) => {
    setSelectedItem(item);
  };

  return (
    <div className="h-screen flex flex-col bg-black text-white">
      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel
            defaultSize={15}
            minSize={10}
            className="bg-black border-r border-gray-800"
          >
            <Sidebar onSelectItem={handleSelectItem} />
          </ResizablePanel>

          <ResizablePanel defaultSize={60} minSize={40}>
            <div className="h-full flex flex-col">
              <div className="border-b border-gray-800 p-2 flex justify-between items-center">
                <h2 className="text-sm font-medium">Preview</h2>
              </div>
              <div className="flex-1 p-2">
                <div className="h-full rounded-lg overflow-hidden border border-gray-800">
                  <Preview />
                </div>
              </div>
              <div className="border-t border-gray-800 p-2 flex justify-between items-center">
                <h2 className="text-sm font-medium">Schedule</h2>
                <h2 className="text-sm font-medium">Live</h2>
                <button className="text-xs bg-transparent text-gray-400 px-2 py-1 rounded">
                  Blackout
                </button>
              </div>
              <div className="h-48 p-2 flex space-x-2">
                <div className="flex-1 border border-gray-800 rounded-lg overflow-hidden">
                  <ScheduleView />
                </div>
                <div className="flex-1 border border-gray-800 rounded-lg overflow-hidden">
                  <LivePresentation />
                </div>
              </div>
            </div>
          </ResizablePanel>

          <ResizablePanel
            defaultSize={25}
            minSize={20}
            className="bg-black border-l border-gray-800"
          >
            <div className="border-b border-gray-800 p-2 flex justify-between items-center">
              <h2 className="text-sm font-medium">Outputs</h2>
              <div className="flex space-x-1">
                <button className="text-xs bg-transparent hover:bg-gray-800 px-1 rounded">
                  +
                </button>
                <button className="text-xs bg-transparent hover:bg-gray-800 px-1 rounded">
                  ⋮
                </button>
              </div>
            </div>
            <div className="p-2">
              <OutputManagement className="h-full" />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
