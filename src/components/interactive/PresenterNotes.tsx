import React, { useState } from "react";
import { Clipboard, Check, Square } from "lucide-react";
import { ChecklistItem as ChecklistItemType } from "../../types/interactive";
import { cn } from "../../lib/utils";

interface PresenterNotesProps {
  id: string;
  title: string;
  notes: string;
  checklist: ChecklistItemType[];
  isVisible: boolean;
}

export function PresenterNotes({
  id,
  title,
  notes,
  checklist: initialChecklist,
  isVisible,
}: PresenterNotesProps) {
  const [checklist, setChecklist] =
    useState<ChecklistItemType[]>(initialChecklist);

  if (!isVisible) return null;

  const toggleChecklistItem = (itemId: string) => {
    setChecklist(
      checklist.map((item) =>
        item.id === itemId ? { ...item, checked: !item.checked } : item
      )
    );
  };

  return (
    <div
      className="p-4 rounded-lg bg-slate-800/50 w-full max-w-md"
      data-interactive-id={id}
    >
      <div className="flex items-center gap-2 mb-4">
        <Clipboard className="h-5 w-5 text-yellow-400" />
        <h3 className="font-medium text-white">{title}</h3>
      </div>

      {notes && (
        <div className="mb-4 text-sm text-slate-200 whitespace-pre-wrap">
          {notes}
        </div>
      )}

      {checklist.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-slate-300">Checklist</h4>
          <ul className="space-y-1">
            {checklist.map((item) => (
              <li
                key={item.id}
                className="flex items-start gap-2 text-sm"
                onClick={() => toggleChecklistItem(item.id)}
              >
                <div className="flex-shrink-0 mt-0.5 cursor-pointer">
                  {item.checked ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Square className="h-4 w-4 text-slate-500" />
                  )}
                </div>
                <span
                  className={cn(
                    "cursor-pointer",
                    item.checked && "line-through text-slate-500"
                  )}
                >
                  {item.text}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export type { ChecklistItemType as ChecklistItem };
