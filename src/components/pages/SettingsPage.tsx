import React from 'react';
import { ScrollArea } from '../ui/scroll-area';
import { Button } from '../ui/button';
import { 
  Settings, 
  Monitor, 
  Laptop, 
  Palette, 
  Moon, 
  Sun, 
  Users, 
  Database,
  Save
} from 'lucide-react';
import { Input } from '../ui/input';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs';

export function SettingsPage() {
  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-[#4A5568]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">Settings</h2>
          <Button className="bg-[#3182CE] hover:bg-[#2B6CB0]">
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
        
        <Tabs defaultValue="display" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-[#1A202C]">
            <TabsTrigger value="display">Display</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="data">Data</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white flex items-center gap-2">
              <Monitor className="h-5 w-5" />
              Display Settings
            </h3>
            
            <div className="space-y-4 pl-7">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="primary-display" className="text-white">Primary Display</Label>
                  <p className="text-xs text-[#A0AEC0]">Select your main presentation screen</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="bg-[#2D3748] border-[#4A5568] text-white">
                    <Monitor className="h-4 w-4 mr-2" />
                    Main Screen
                  </Button>
                  <Button variant="outline" size="sm" className="bg-transparent border-[#4A5568] text-[#A0AEC0]">
                    <Laptop className="h-4 w-4 mr-2" />
                    Secondary
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="black-screen" className="text-white">Black Screen on Start</Label>
                  <p className="text-xs text-[#A0AEC0]">Start with blank screen when launching</p>
                </div>
                <Switch id="black-screen" />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="auto-advance" className="text-white">Auto-advance Slides</Label>
                  <p className="text-xs text-[#A0AEC0]">Automatically move to next slide</p>
                </div>
                <Switch id="auto-advance" />
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Theme Settings
            </h3>
            
            <div className="space-y-4 pl-7">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="dark-mode" className="text-white">Dark Mode</Label>
                  <p className="text-xs text-[#A0AEC0]">Toggle between light and dark theme</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="bg-[#2D3748] border-[#4A5568] text-white">
                    <Moon className="h-4 w-4 mr-2" />
                    Dark
                  </Button>
                  <Button variant="outline" size="sm" className="bg-transparent border-[#4A5568] text-[#A0AEC0]">
                    <Sun className="h-4 w-4 mr-2" />
                    Light
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-5 gap-2">
                <Button className="h-8 w-full bg-[#3182CE] rounded-md" />
                <Button className="h-8 w-full bg-[#38A169] rounded-md" />
                <Button className="h-8 w-full bg-[#D69E2E] rounded-md" />
                <Button className="h-8 w-full bg-[#E53E3E] rounded-md" />
                <Button className="h-8 w-full bg-[#805AD5] rounded-md" />
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}