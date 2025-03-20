import React, { useState } from 'react';
import { Sidebar } from "./components/Sidebar";
import { SongsPage } from "./components/pages/SongsPage";
import { MediaPage } from "./components/pages/MediaPage";
import { SettingsPage } from "./components/pages/SettingsPage";
import { BiblePage } from "./components/pages/BiblePage";
import { AnnouncementsPage } from "./components/pages/AnnouncementsPage";
import { useSidebar } from "./components/hooks/useSidebar";
import { ScheduleManager } from "./components/ScheduleManager";
import { LivePresentation } from "./components/LivePresentation";
import { Preview } from "./components/Preview";
import { ScreenControl } from './components/ScreenControl';
import { ContentForm } from "./components/ContentForm";
import { useContentStore } from './stores/useContentStore';

function App() {
  const { activeTab, setActiveTab } = useSidebar();
  const [showContentForm, setShowContentForm] = useState(false);
  const { setSelectedItem } = useContentStore();

  // Set a default active tab if none is selected
  if (!activeTab) {
    setActiveTab('songs');
  }

  return (
    <div className="flex h-screen bg-[#1A202C] text-white font-sans overflow-hidden">
      <Sidebar onSelectItem={(item) => setSelectedItem(item)} />
      
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 border-b border-[#4A5568] px-6 flex items-center justify-between bg-[#2D3748]">
          <h1 className="text-2xl font-bold tracking-tight">iPresent 2.0</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium px-3 py-1 rounded-full bg-green-500/20 text-green-400">
              Connected
            </span>
          </div>
        </header>
        
        <div className="flex-1 flex overflow-hidden">
          {/* Content Area - now using 100% */}
          <div className="w-full flex flex-col bg-[#2D3748]">
            {activeTab === 'songs' && <SongsPage />}
            {activeTab === 'bible' && <BiblePage />}
            {activeTab === 'media' && <MediaPage />}
            {activeTab === 'announcements' && <AnnouncementsPage />}
            {activeTab === 'settings' && <SettingsPage />}
          </div>
        </div>
      </div>

      {showContentForm && (
        <ContentForm onClose={() => setShowContentForm(false)} />
      )}
    </div>
  );
}

export default App;