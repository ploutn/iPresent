import React, { useState } from "react";
import {
  Plus,
  X,
  Timer,
  BarChart,
  Clipboard,
  MousePointer,
} from "lucide-react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { CountdownTimer } from "./CountdownTimer";
import { PollElement } from "./PollElement";
import { PresenterNotes } from "./PresenterNotes";
import { InteractiveButton } from "./InteractiveButton";
import {
  AnyInteractiveElement,
  InteractiveElementType,
  PollOption,
  ButtonAction,
  ChecklistItem,
} from "../../types/interactive";

interface InteractiveElementFormProps {
  onAdd: (element: AnyInteractiveElement) => void;
  onClose: () => void;
  open: boolean;
}

export function InteractiveElementForm({
  onAdd,
  onClose,
  open,
}: InteractiveElementFormProps) {
  const [selectedType, setSelectedType] =
    useState<InteractiveElementType | null>(null);

  // Button state
  const [buttonLabel, setButtonLabel] = useState("");
  const [buttonAction, setButtonAction] = useState<ButtonAction>({
    type: "link",
    url: "",
  });
  const [buttonVariant, setButtonVariant] = useState<
    "default" | "outline" | "ghost"
  >("default");

  // Poll state
  const [pollQuestion, setPollQuestion] = useState("");
  const [pollOptions, setPollOptions] = useState<PollOption[]>([
    { id: "1", text: "", votes: 0 },
    { id: "2", text: "", votes: 0 },
  ]);

  // Timer state
  const [timerMinutes, setTimerMinutes] = useState(5);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerAutoStart, setTimerAutoStart] = useState(false);

  // Notes state
  const [notesTitle, setNotesTitle] = useState("");
  const [notesContent, setNotesContent] = useState("");
  const [notesChecklist, setNotesChecklist] = useState<ChecklistItem[]>([]);

  const resetForm = () => {
    setSelectedType(null);
    setButtonLabel("");
    setButtonAction({ type: "link", url: "" });
    setButtonVariant("default");
    setPollQuestion("");
    setPollOptions([
      { id: "1", text: "", votes: 0 },
      { id: "2", text: "", votes: 0 },
    ]);
    setTimerMinutes(5);
    setTimerSeconds(0);
    setTimerAutoStart(false);
    setNotesTitle("");
    setNotesContent("");
    setNotesChecklist([]);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleAddElement = () => {
    if (!selectedType) return;

    const baseElement = {
      id: Date.now().toString(),
      type: selectedType,
      isVisible: true,
    };

    let element: AnyInteractiveElement;

    switch (selectedType) {
      case "button":
        element = {
          ...baseElement,
          type: "button",
          label: buttonLabel,
          action: buttonAction,
          variant: buttonVariant,
        };
        break;

      case "poll":
        element = {
          ...baseElement,
          type: "poll",
          question: pollQuestion,
          options: pollOptions,
          showResults: false,
        };
        break;

      case "timer":
        element = {
          ...baseElement,
          type: "timer",
          initialMinutes: timerMinutes,
          initialSeconds: timerSeconds,
          autoStart: timerAutoStart,
          showControls: true,
        };
        break;

      case "notes":
        element = {
          ...baseElement,
          type: "notes",
          title: notesTitle,
          notes: notesContent,
          checklist: notesChecklist,
        };
        break;

      default:
        return;
    }

    onAdd(element);
    handleClose();
  };

  const handleAddChecklistItem = () => {
    setNotesChecklist([
      ...notesChecklist,
      { id: Date.now().toString(), text: "", checked: false },
    ]);
  };

  const handleRemoveChecklistItem = (itemId: string) => {
    setNotesChecklist(notesChecklist.filter((item) => item.id !== itemId));
  };

  const handleChecklistItemTextChange = (itemId: string, text: string) => {
    setNotesChecklist(
      notesChecklist.map((item) =>
        item.id === itemId ? { ...item, text } : item
      )
    );
  };

  const handleAddPollOption = () => {
    setPollOptions([
      ...pollOptions,
      { id: Date.now().toString(), text: "", votes: 0 },
    ]);
  };

  const handleRemovePollOption = (optionId: string) => {
    setPollOptions(pollOptions.filter((option) => option.id !== optionId));
  };

  const handlePollOptionTextChange = (optionId: string, text: string) => {
    setPollOptions(
      pollOptions.map((option) =>
        option.id === optionId ? { ...option, text } : option
      )
    );
  };

  const renderTypeSelection = () => (
    <div className="grid grid-cols-2 gap-4">
      <Button
        variant="outline"
        className="flex flex-col items-center justify-center h-24 p-4 border-slate-600 hover:border-blue-500 hover:bg-slate-700/50"
        onClick={() => setSelectedType("button")}
      >
        <MousePointer className="h-8 w-8 mb-2 text-blue-400" />
        <span>Interactive Button</span>
      </Button>

      <Button
        variant="outline"
        className="flex flex-col items-center justify-center h-24 p-4 border-slate-600 hover:border-blue-500 hover:bg-slate-700/50"
        onClick={() => setSelectedType("poll")}
      >
        <BarChart className="h-8 w-8 mb-2 text-purple-400" />
        <span>Poll</span>
      </Button>

      <Button
        variant="outline"
        className="flex flex-col items-center justify-center h-24 p-4 border-slate-600 hover:border-blue-500 hover:bg-slate-700/50"
        onClick={() => setSelectedType("timer")}
      >
        <Timer className="h-8 w-8 mb-2 text-green-400" />
        <span>Countdown Timer</span>
      </Button>

      <Button
        variant="outline"
        className="flex flex-col items-center justify-center h-24 p-4 border-slate-600 hover:border-blue-500 hover:bg-slate-700/50"
        onClick={() => setSelectedType("notes")}
      >
        <Clipboard className="h-8 w-8 mb-2 text-yellow-400" />
        <span>Presenter Notes</span>
      </Button>
    </div>
  );

  const renderButtonForm = () => (
    <div className="space-y-4">
      <div>
        <label htmlFor="button-label" className="block text-sm mb-1">
          Button Label
        </label>
        <input
          id="button-label"
          type="text"
          value={buttonLabel}
          onChange={(e) => setButtonLabel(e.target.value)}
          className="w-full bg-slate-700 border border-slate-600 rounded p-2 text-white"
          placeholder="Click me!"
        />
      </div>

      <div>
        <label className="block text-sm mb-1">Button Action</label>
        <select
          value={buttonAction.type}
          onChange={(e) =>
            setButtonAction({
              ...buttonAction,
              type: e.target.value as ButtonAction["type"],
            })
          }
          className="w-full bg-slate-700 border border-slate-600 rounded p-2 text-white mb-2"
        >
          <option value="link">Open URL</option>
          <option value="next">Next Slide</option>
          <option value="previous">Previous Slide</option>
        </select>

        {buttonAction.type === "link" && (
          <input
            type="url"
            value={buttonAction.url || ""}
            onChange={(e) =>
              setButtonAction({ ...buttonAction, url: e.target.value })
            }
            className="w-full bg-slate-700 border border-slate-600 rounded p-2 text-white"
            placeholder="https://example.com"
          />
        )}
      </div>

      <div>
        <label className="block text-sm mb-1">Button Style</label>
        <select
          value={buttonVariant}
          onChange={(e) =>
            setButtonVariant(e.target.value as "default" | "outline" | "ghost")
          }
          className="w-full bg-slate-700 border border-slate-600 rounded p-2 text-white"
        >
          <option value="default">Filled</option>
          <option value="outline">Outline</option>
          <option value="ghost">Ghost</option>
        </select>
      </div>

      <div className="pt-4 border-t border-slate-700">
        <h4 className="text-sm font-medium mb-2">Preview</h4>
        <div className="flex justify-center p-4 bg-slate-800 rounded">
          <InteractiveButton
            id="preview"
            label={buttonLabel || "Button"}
            action={buttonAction}
            variant={buttonVariant}
            isVisible={true}
          />
        </div>
      </div>
    </div>
  );

  const renderPollForm = () => (
    <div className="space-y-4">
      <div>
        <label htmlFor="poll-question" className="block text-sm mb-1">
          Poll Question
        </label>
        <input
          id="poll-question"
          type="text"
          value={pollQuestion}
          onChange={(e) => setPollQuestion(e.target.value)}
          className="w-full bg-slate-700 border border-slate-600 rounded p-2 text-white"
          placeholder="What do you think?"
        />
      </div>

      <div>
        <label className="block text-sm mb-1">Options</label>
        {pollOptions.map((option, index) => (
          <div key={option.id} className="flex items-center gap-2 mb-2">
            <input
              type="text"
              value={option.text}
              onChange={(e) =>
                handlePollOptionTextChange(option.id, e.target.value)
              }
              className="flex-1 bg-slate-700 border border-slate-600 rounded p-2 text-white"
              placeholder={`Option ${index + 1}`}
            />
            {pollOptions.length > 2 && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleRemovePollOption(option.id)}
                className="h-8 w-8 text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}

        <Button
          variant="outline"
          size="sm"
          onClick={handleAddPollOption}
          className="mt-2 w-full justify-center border-slate-600 hover:bg-slate-700"
        >
          <Plus className="h-4 w-4 mr-2" /> Add Option
        </Button>
      </div>

      <div className="pt-4 border-t border-slate-700">
        <h4 className="text-sm font-medium mb-2">Preview</h4>
        <div className="p-4 bg-slate-800 rounded">
          <PollElement
            id="preview"
            question={pollQuestion || "Sample Question"}
            options={pollOptions.map((opt) => ({
              ...opt,
              text: opt.text || `Option ${opt.id}`,
            }))}
            showResults={false}
            isVisible={true}
          />
        </div>
      </div>
    </div>
  );

  const renderTimerForm = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div>
          <label htmlFor="timer-minutes" className="block text-sm mb-1">
            Minutes
          </label>
          <input
            id="timer-minutes"
            type="number"
            min="0"
            max="60"
            value={timerMinutes}
            onChange={(e) => setTimerMinutes(parseInt(e.target.value) || 0)}
            className="w-full bg-slate-700 border border-slate-600 rounded p-2 text-center text-white"
          />
        </div>

        <div>
          <label htmlFor="timer-seconds" className="block text-sm mb-1">
            Seconds
          </label>
          <input
            id="timer-seconds"
            type="number"
            min="0"
            max="59"
            value={timerSeconds}
            onChange={(e) => setTimerSeconds(parseInt(e.target.value) || 0)}
            className="w-full bg-slate-700 border border-slate-600 rounded p-2 text-center text-white"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          id="timer-autostart"
          type="checkbox"
          checked={timerAutoStart}
          onChange={(e) => setTimerAutoStart(e.target.checked)}
          className="rounded border-slate-600"
        />
        <label htmlFor="timer-autostart" className="text-sm">
          Auto-start timer when slide is shown
        </label>
      </div>

      <div className="pt-4 border-t border-slate-700">
        <h4 className="text-sm font-medium mb-2">Preview</h4>
        <div className="p-4 bg-slate-800 rounded">
          <CountdownTimer
            initialMinutes={timerMinutes}
            initialSeconds={timerSeconds}
            autoStart={false}
            size="sm"
          />
        </div>
      </div>
    </div>
  );

  const renderNotesForm = () => (
    <div className="space-y-4">
      <div>
        <label htmlFor="notes-title" className="block text-sm mb-1">
          Title
        </label>
        <input
          id="notes-title"
          type="text"
          value={notesTitle}
          onChange={(e) => setNotesTitle(e.target.value)}
          className="w-full bg-slate-700 border border-slate-600 rounded p-2 text-white"
          placeholder="Presenter Notes"
        />
      </div>

      <div>
        <label htmlFor="notes-content" className="block text-sm mb-1">
          Notes
        </label>
        <textarea
          id="notes-content"
          value={notesContent}
          onChange={(e) => setNotesContent(e.target.value)}
          className="w-full bg-slate-700 border border-slate-600 rounded p-2 text-white min-h-[100px]"
          placeholder="Add your presenter notes here..."
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm">Checklist</label>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleAddChecklistItem}
            className="h-7 text-xs text-slate-400 hover:text-white"
          >
            <Plus className="h-3 w-3 mr-1" /> Add Item
          </Button>
        </div>

        {notesChecklist.map((item) => (
          <div key={item.id} className="flex items-center gap-2 mb-2">
            <input
              type="text"
              value={item.text}
              onChange={(e) =>
                handleChecklistItemTextChange(item.id, e.target.value)
              }
              className="flex-1 bg-slate-700 border border-slate-600 rounded p-2 text-white"
              placeholder="Checklist item"
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleRemoveChecklistItem(item.id)}
              className="h-8 w-8 text-slate-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      <div className="pt-4 border-t border-slate-700">
        <h4 className="text-sm font-medium mb-2">Preview</h4>
        <div className="p-4 bg-slate-800 rounded">
          <PresenterNotes
            id="preview"
            title={notesTitle || "Notes"}
            notes={notesContent || "Sample presenter notes"}
            checklist={
              notesChecklist.length > 0
                ? notesChecklist
                : [
                    {
                      id: "sample1",
                      text: "Sample checklist item 1",
                      checked: false,
                    },
                    {
                      id: "sample2",
                      text: "Sample checklist item 2",
                      checked: true,
                    },
                  ]
            }
            isVisible={true}
          />
        </div>
      </div>
    </div>
  );

  const renderFormContent = () => {
    switch (selectedType) {
      case "button":
        return renderButtonForm();
      case "poll":
        return renderPollForm();
      case "timer":
        return renderTimerForm();
      case "notes":
        return renderNotesForm();
      default:
        return renderTypeSelection();
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <DialogContent className="sm:max-w-md bg-slate-900 border-slate-700 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {selectedType
              ? `Add ${
                  selectedType.charAt(0).toUpperCase() + selectedType.slice(1)
                }`
              : "Add Interactive Element"}
          </DialogTitle>
        </DialogHeader>

        <div className="py-4">{renderFormContent()}</div>

        <div className="flex justify-end gap-2 pt-4 border-t border-slate-700">
          {selectedType && (
            <Button
              variant="outline"
              onClick={() => setSelectedType(null)}
              className="border-slate-600 hover:bg-slate-700"
            >
              Back
            </Button>
          )}

          <Button
            variant="outline"
            onClick={handleClose}
            className="border-slate-600 hover:bg-slate-700"
          >
            Cancel
          </Button>

          {selectedType && (
            <Button onClick={handleAddElement}>Add Element</Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
