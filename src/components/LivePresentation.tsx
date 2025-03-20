// components/LivePresentation.tsx
import React from "react";
import { Plus, Play } from 'lucide-react';
import { Button } from './ui/button';

export function LivePresentation() {
  return (
    <div className="flex flex-col h-full bg-[#2D3748] p-6 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-white mb-4 tracking-tight">Live</h1>
      <div className="flex-1">
        <div className="bg-[#1A202C] p-4 rounded-md mb-4 shadow-sm">
          <p className="text-lg text-[#A0AEC0] font-medium">Current Status:</p>
          <p className="text-xl text-white font-semibold mt-1">Nothing is live</p>
        </div>
        <div className="space-y-3">
          <Button
            variant="outline"
            className="w-full bg-[#4A5568] text-[#A0AEC0] hover:text-white hover:bg-[#3D4A5C] border-[#4A5568] shadow-sm font-medium rounded-md px-4 py-2 transition-all duration-200"
          >
            <Plus className="h-5 w-5 mr-2" /> Add items from Songs, Bible, Media by double-clicking or using this
          </Button>
          <Button
            variant="outline"
            className="w-full bg-[#4A5568] text-[#A0AEC0] hover:text-white hover:bg-[#3D4A5C] border-[#4A5568] shadow-sm font-medium rounded-md px-4 py-2 transition-all duration-200"
          >
            <Play className="h-5 w-5 mr-2" /> Start streaming by double-clicking on Schedule items
          </Button>
        </div>
      </div>
    </div>
  );
}