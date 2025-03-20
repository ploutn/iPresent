// components/ScreenControl.tsx
import React, { useState } from 'react';
import { Monitor, Play, Moon, Power } from 'lucide-react';
import { Button } from './ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { useContentStore } from '../stores/useContentStore';
import { ScreenState } from '../types/screenControl';

export function ScreenControl() {
  const { liveQueue } = useContentStore();
  const [screenState, setScreenState] = useState<ScreenState>({
    isMainScreenActive: false,
    isOutputActive: false,
    isBlackout: false,
  });

  const toggleMainScreen = () => setScreenState(prev => ({ ...prev, isMainScreenActive: !prev.isMainScreenActive }));
  const toggleOutputDisplay = () => setScreenState(prev => ({ ...prev, isOutputActive: !prev.isOutputActive }));
  const toggleBlackout = () => setScreenState(prev => ({ ...prev, isBlackout: !prev.isBlackout }));

  return (
    <div className="p-4 bg-slate-900 rounded-lg">
      <h2 className="text-xl font-semibold mb-4 text-slate-200">Screen Control</h2>
      
      <div className="space-y-4">
        <div className="bg-slate-800 p-4 rounded-lg">
          <p className="text-sm text-slate-400">Current Status:</p>
          <p className="text-slate-200">Nothing is live</p>
        </div>

        <button className="w-full p-3 bg-slate-800 text-slate-300 rounded flex items-center gap-2 hover:bg-slate-700">
          <Monitor className="h-4 w-4" /> Main Screen (Inactive)
        </button>

        <button className="w-full p-3 bg-slate-800 text-slate-300 rounded flex items-center gap-2 hover:bg-slate-700">
          <Play className="h-4 w-4" /> Output Display (Inactive)
        </button>

        <button className="w-full p-3 bg-slate-800 text-slate-300 rounded flex items-center gap-2 hover:bg-slate-700">
          <Moon className="h-4 w-4" /> Screen Blackout (Inactive)
        </button>

        <div className="flex items-center justify-between mt-4">
          <span className="text-slate-400">Outputs</span>
          <span className="px-2 py-1 bg-red-900/50 text-red-400 rounded text-sm">DISABLED</span>
        </div>
      </div>
    </div>
  );
}