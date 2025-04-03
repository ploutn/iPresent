import React, { useEffect, useState } from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/RichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/HistoryPlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { ListPlugin } from "@lexical/react/ListPlugin";
import { ListItemNode, ListNode } from "@lexical/list";
import { HeadingNode } from "@lexical/rich-text";
import {
  $getSelection,
  $isRangeSelection,
  FORMAT_TEXT_COMMAND,
  TextNode,
  $getRoot,
} from "lexical";
import { $setBlocksType } from "@lexical/selection";
import { $createParagraphNode } from "lexical";
import { $createHeadingNode } from "@lexical/rich-text";
import { $generateHtmlFromNodes } from "@lexical/html";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";

interface ToolbarProps {
  resetFormatting: () => void;
}

function Toolbar({ resetFormatting }: ToolbarProps) {
  const [editor] = useLexicalComposerContext();

  const formatText = (format: "bold" | "italic" | "underline") => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
  };

  const alignText = (alignment: "left" | "center" | "right") => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        selection.getNodes().forEach((node) => {
          if (node.getType() === "paragraph" || node.getType() === "heading") {
            (node as TextNode).setFormat(
              alignment === "left" ? 0 : alignment === "center" ? 1 : 2
            );
          }
        });
      }
    });
  };

  return (
    <div className="flex items-center gap-1 p-2 bg-[#2D3748] border-b border-[#4A5568]">
      <button
        onClick={() => alignText("left")}
        className="h-8 w-8 text-[#A0AEC0] hover:text-white flex items-center justify-center rounded hover:bg-[#4A5568]"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="21" x2="3" y1="6" y2="6" />
          <line x1="15" x2="3" y1="12" y2="12" />
          <line x1="17" x2="3" y1="18" y2="18" />
        </svg>
      </button>
      <button
        onClick={() => alignText("center")}
        className="h-8 w-8 text-[#A0AEC0] hover:text-white flex items-center justify-center rounded hover:bg-[#4A5568]"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="21" x2="3" y1="6" y2="6" />
          <line x1="18" x2="6" y1="12" y2="12" />
          <line x1="19" x2="5" y1="18" y2="18" />
        </svg>
      </button>
      <button
        onClick={() => alignText("right")}
        className="h-8 w-8 text-[#A0AEC0] hover:text-white flex items-center justify-center rounded hover:bg-[#4A5568]"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="21" x2="3" y1="6" y2="6" />
          <line x1="21" x2="9" y1="12" y2="12" />
          <line x1="21" x2="7" y1="18" y2="18" />
        </svg>
      </button>
      <div className="w-px h-6 bg-[#4A5568] mx-1"></div>
      <button
        onClick={() => formatText("bold")}
        className="h-8 w-8 text-[#A0AEC0] hover:text-white flex items-center justify-center rounded hover:bg-[#4A5568]"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M14 12a4 4 0 0 0 0-8H6v8" />
          <path d="M15 20a4 4 0 0 0 0-8H6v8Z" />
        </svg>
      </button>
      <button
        onClick={() => formatText("italic")}
        className="h-8 w-8 text-[#A0AEC0] hover:text-white flex items-center justify-center rounded hover:bg-[#4A5568]"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="19" x2="10" y1="4" y2="4" />
          <line x1="14" x2="5" y1="20" y2="20" />
          <line x1="15" x2="9" y1="4" y2="20" />
        </svg>
      </button>
      <button
        onClick={() => formatText("underline")}
        className="h-8 w-8 text-[#A0AEC0] hover:text-white flex items-center justify-center rounded hover:bg-[#4A5568]"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 4v6a6 6 0 0 0 12 0V4" />
          <line x1="4" x2="20" y1="20" y2="20" />
        </svg>
      </button>
      <div className="flex-1"></div>
      <button
        onClick={resetFormatting}
        className="text-sm bg-transparent border border-[#4A5568] text-[#A0AEC0] hover:text-white px-2 py-1 rounded"
      >
        reset formatting
      </button>
    </div>
  );
}

interface LexicalEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export function LexicalEditor({
  content,
  onChange,
  placeholder = "Enter content...",
}: LexicalEditorProps) {
  // Initial editor configuration
  const initialConfig = {
    namespace: "AnnouncementEditor",
    theme: {
      paragraph: "mb-2",
      heading: {
        h1: "text-2xl font-bold mb-2",
        h2: "text-xl font-bold mb-2",
        h3: "text-lg font-bold mb-2",
      },
      list: {
        ul: "list-disc ml-5 mb-2",
        ol: "list-decimal ml-5 mb-2",
      },
      text: {
        bold: "font-bold",
        italic: "italic",
        underline: "underline",
      },
    },
    onError: (error: Error) => {
      console.error(error);
    },
    nodes: [HeadingNode, ListNode, ListItemNode],
    editorState: content || undefined,
  };

  const resetFormatting = () => {
    const [editor] = useLexicalComposerContext();
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        selection.getNodes().forEach((node) => {
          // Remove all formatting
          if (
            (node as TextNode).hasFormat("bold") ||
            (node as TextNode).hasFormat("italic") ||
            (node as TextNode).hasFormat("underline")
          ) {
            (node as TextNode).setFormat(0);
          }
          // Reset alignment
          if (node.getType() === "paragraph" || node.getType() === "heading") {
            (node as TextNode).setFormat(0); // Left alignment
          }
        });
      }
    });
  };

  // Create a function to handle editor changes
  const handleEditorChange = (editorState: any, editor: any) => {
    editor.update(() => {
      const html = $generateHtmlFromNodes(editor, null);
      onChange(html);
    });
  };

  return (
    <div className="border border-[#4A5568] rounded-md overflow-hidden">
      <LexicalComposer initialConfig={initialConfig}>
        <Toolbar resetFormatting={resetFormatting} />
        <div className="p-4 min-h-[200px] bg-[#1A202C]">
          <RichTextPlugin
            contentEditable={
              <ContentEditable className="w-full h-full min-h-[200px] bg-transparent border-none focus:outline-none text-white resize-none" />
            }
            placeholder={
              <div className="absolute top-4 left-4 text-gray-500 pointer-events-none">
                {placeholder}
              </div>
            }
          />
          <OnChangePlugin onChange={handleEditorChange} />
          <HistoryPlugin />
          <ListPlugin />
        </div>
      </LexicalComposer>
    </div>
  );
}
