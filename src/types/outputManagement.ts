// src/types/outputManagement.ts

export interface DisplayDevice {
  id: string;
  name: string;
  isActive: boolean;
  resolution: string;
}

export interface OutputSettings {
  fullscreen: boolean;
  externalDisplays: DisplayDevice[];
  activeDisplay: string;
}
