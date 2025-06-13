// hooks/useOutputManagement.ts
import { useState, useEffect } from "react";
import { DisplayDevice, OutputSettings } from "../types/outputManagement";
import { ScreenState } from "../types/screenControl";

export function useOutputManagement() {
  const [screenState, setScreenState] = useState<ScreenState>({
    isMainScreenActive: true,
    isOutputActive: false,
    isBlackout: false,
  });

  const [outputSettings, setOutputSettings] = useState<OutputSettings>({
    fullscreen: false,
    externalDisplays: [
      {
        id: "main",
        name: "Main Screen",
        isActive: true,
        resolution: "1920x1080",
      },
      {
        id: "external1",
        name: "External Display 1",
        isActive: false,
        resolution: "1280x720",
      },
    ],
    activeDisplay: "main",
  });

  const [availableDisplays, setAvailableDisplays] = useState<DisplayDevice[]>([
    {
      id: "main",
      name: "Main Screen",
      isActive: true,
      resolution: "1920x1080",
    },
    {
      id: "external1",
      name: "External Display 1",
      isActive: false,
      resolution: "1280x720",
    },
  ]);

  const toggleMainScreen = () =>
    setScreenState((prev) => ({
      ...prev,
      isMainScreenActive: !prev.isMainScreenActive,
    }));

  const toggleOutputWindow = () =>
    setScreenState((prev) => ({
      ...prev,
      isOutputActive: !prev.isOutputActive,
    }));

  const toggleBlackout = () =>
    setScreenState((prev) => ({ ...prev, isBlackout: !prev.isBlackout }));

  const toggleFullscreen = () => {
    const presentationElement = document.getElementById(
      "presentation-container"
    );
    if (!document.fullscreenElement && presentationElement) {
      presentationElement
        .requestFullscreen()
        .then(() => {
          setOutputSettings((prev) => ({ ...prev, fullscreen: true }));
        })
        .catch((err) => {
          console.error("Error attempting to enable fullscreen:", err);
        });
    } else if (document.fullscreenElement) {
      document
        .exitFullscreen()
        .then(() => {
          setOutputSettings((prev) => ({ ...prev, fullscreen: false }));
        })
        .catch((err) => {
          console.error("Error attempting to exit fullscreen:", err);
        });
    }
  };

  const updateDisplayStatus = (id: string, isActive: boolean) => {
    setOutputSettings((prev) => ({
      ...prev,
      externalDisplays: prev.externalDisplays.map((display) =>
        display.id === id ? { ...display, isActive } : display
      ),
    }));
  };

  const updateDisplayResolution = (id: string, resolution: string) => {
    setOutputSettings((prev) => ({
      ...prev,
      externalDisplays: prev.externalDisplays.map((display) =>
        display.id === id ? { ...display, resolution } : display
      ),
    }));
  };

  const setActiveDisplay = (displayId: string) => {
    setOutputSettings((prev) => ({
      ...prev,
      activeDisplay: displayId,
    }));
  };

  const updateOutputSettings = (settings: Partial<OutputSettings>) => {
    setOutputSettings((prev) => ({
      ...prev,
      ...settings,
    }));
  };

  const refreshDisplays = async () => {
    try {
      // In a real application, this would query the system for available displays
      // For now, we'll just simulate a refresh
      const displays = await navigator.mediaDevices.enumerateDevices();
      const videoInputs = displays.filter(
        (device) => device.kind === "videoinput"
      );

      const updatedDisplays: DisplayDevice[] = videoInputs.map(
        (device, index) => ({
          id: device.deviceId || `display-${index}`,
          name: device.label || `Display ${index + 1}`,
          isActive: index === 0,
          resolution: "1920x1080", // Default resolution
        })
      );

      setAvailableDisplays(updatedDisplays);
    } catch (error) {
      console.error("Error refreshing displays:", error);
    }
  };

  return {
    screenState,
    outputSettings,
    availableDisplays,
    toggleMainScreen,
    toggleOutputWindow,
    toggleBlackout,
    toggleFullscreen,
    updateDisplayStatus,
    updateDisplayResolution,
    setActiveDisplay,
    updateOutputSettings,
    refreshDisplays,
  };
}
