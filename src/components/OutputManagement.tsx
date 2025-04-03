// components/OutputManagement.tsx
import React from "react";
import {
  Monitor,
  Maximize2,
  ExternalLink,
  Settings,
  Power,
  Eye,
  EyeOff,
  Tv,
  Clock,
  Play,
} from "lucide-react";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { useContentStore } from "../stores/useContentStore";
import { ScreenState } from "../types/screenControl";
import { DisplayDevice, OutputSettings } from "../types/outputManagement";
import { useOutputManagement } from "../hooks/useOutputManagement";
import { Schedule } from "./Schedule";
import { LivePresentation } from "./LivePresentation";
import { ScheduleView } from "./ScheduleView";

interface OutputManagementProps {
  className?: string;
}

export function OutputManagement({ className }: OutputManagementProps) {
  const { liveQueue } = useContentStore();
  const {
    screenState,
    outputSettings,
    toggleMainScreen,
    toggleOutputDisplay,
    toggleBlackout,
    toggleFullscreen,
    updateDisplayStatus,
    updateDisplayResolution,
    setActiveDisplay,
  } = useOutputManagement();

  // Extract isFullscreen from outputSettings
  const { fullscreen: isFullscreen } = outputSettings;

  // Get displays from outputSettings
  const displays = outputSettings.externalDisplays;

  return (
    <div className={`h-full flex flex-col ${className}`}>
      <div className="space-y-3 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div
              className={`w-2 h-2 rounded-full ${
                screenState.isMainScreenActive ? "bg-green-500" : "bg-gray-500"
              }`}
            ></div>
            <span className="text-xs text-gray-400">Main</span>
          </div>
          <Switch
            checked={screenState.isMainScreenActive}
            onCheckedChange={toggleMainScreen}
            className="scale-75"
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div
              className={`w-2 h-2 rounded-full ${
                screenState.isOutputActive ? "bg-green-500" : "bg-gray-500"
              }`}
            ></div>
            <span className="text-xs text-gray-400">Output</span>
          </div>
          <Switch
            checked={screenState.isOutputActive}
            onCheckedChange={toggleOutputDisplay}
            className="scale-75"
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div
              className={`w-2 h-2 rounded-full ${
                screenState.isBlackout ? "bg-red-500" : "bg-gray-500"
              }`}
            ></div>
            <span className="text-xs text-gray-400">Blackout</span>
          </div>
          <Switch
            checked={screenState.isBlackout}
            onCheckedChange={toggleBlackout}
            className="scale-75"
          />
        </div>

        <div className="pt-2">
          <div className="flex space-x-1">
            <Button
              className="flex-1 h-7 text-xs bg-transparent border border-gray-800 text-gray-400 hover:bg-gray-800"
              onClick={toggleFullscreen}
            >
              <Maximize2 className="h-3 w-3 mr-1" />
              Full
            </Button>
            <Button className="flex-1 h-7 text-xs bg-transparent border border-gray-800 text-gray-400 hover:bg-gray-800">
              <Tv className="h-3 w-3 mr-1" />
              Display
            </Button>
          </div>
        </div>
      </div>

      {/* Schedule Section */}
      <div className="mt-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-medium text-gray-400">Schedule</h3>
          <Button className="h-6 text-xs bg-transparent border border-gray-800 text-gray-400 hover:bg-gray-800">
            <Clock className="h-3 w-3 mr-1" /> Add
          </Button>
        </div>
        <div className="h-32 border border-gray-800 rounded-lg overflow-hidden bg-black">
          <ScheduleView />
        </div>
      </div>

      {/* Live Section */}
      <div className="mt-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-medium text-gray-400">Live</h3>
          <Button className="h-6 text-xs bg-transparent border border-gray-800 text-gray-400 hover:bg-gray-800">
            <Play className="h-3 w-3 mr-1" /> Start
          </Button>
        </div>
        <div className="h-32 border border-gray-800 rounded-lg overflow-hidden bg-black">
          <LivePresentation />
        </div>
      </div>
    </div>
  );
}
