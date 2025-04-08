// src/types/interactive.ts

export type InteractiveElementType = "button" | "poll" | "timer" | "notes";

interface BaseInteractiveElement {
  id: string;
  type: InteractiveElementType;
  isVisible: boolean;
}

export type ButtonAction =
  | { type: "link"; url: string }
  | { type: "next" }
  | { type: "previous" };

export interface ButtonElement extends BaseInteractiveElement {
  type: "button";
  label: string;
  action: ButtonAction;
  variant: "default" | "outline" | "ghost";
}

export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

export interface PollElement extends BaseInteractiveElement {
  type: "poll";
  question: string;
  options: PollOption[];
  showResults: boolean;
}

export interface TimerElement extends BaseInteractiveElement {
  type: "timer";
  initialMinutes: number;
  initialSeconds: number;
  autoStart: boolean;
  showControls: boolean;
}

export interface ChecklistItem {
  id: string;
  text: string;
  checked: boolean;
}

export interface NotesElement extends BaseInteractiveElement {
  type: "notes";
  title: string;
  notes: string;
  checklist: ChecklistItem[];
}

export type AnyInteractiveElement =
  | ButtonElement
  | PollElement
  | TimerElement
  | NotesElement;
