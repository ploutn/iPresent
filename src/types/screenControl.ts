// src/types/screenControl.ts

export interface ScreenControlProps {
  className?: string;
}

export interface ScreenState {
  isMainScreenActive: boolean;
  isOutputActive: boolean;
  isBlackout: boolean;
}