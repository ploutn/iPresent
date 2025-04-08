// components/Preview.tsx
import React from "react";
import { useContentStore } from "../stores/useContentStore";
import { Song } from "../types";

export function Preview() {
  const { selectedItem } = useContentStore();

  if (!selectedItem) {
    return (
      <div className="flex flex-col h-full">
        <div className="p-6 border-b border-[#2D2D2D]">
          <h2 className="text-lg font-semibold">PREVIEW</h2>
        </div>
        <div className="flex-1 flex items-center justify-center text-slate-400">
          <p>No output selected</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-[#2D2D2D]">
        <h2 className="text-lg font-semibold">PREVIEW</h2>
      </div>
      <div className="flex-1 p-6">
        {(selectedItem as Song).type === "song" && (
          <pre className="whitespace-pre-wrap font-sans">
            {(selectedItem as Song).lyrics}
          </pre>
        )}
      </div>
    </div>
  );
}
