// src/components/editor/RichTextToolbar.tsx
import React, { useCallback, useEffect, useState } from "react";
import {
  $getSelection,
  $isRangeSelection,
  $createParagraphNode,
  FORMAT_TEXT_COMMAND,
  SELECTION_CHANGE_COMMAND,
  CAN_UNDO_COMMAND,
  CAN_REDO_COMMAND,
  UNDO_COMMAND,
  REDO_COMMAND,
} from "lexical";
import {
  $isHeadingNode,
  $createHeadingNode,
  HeadingTagType,
} from "@lexical/rich-text";
import {
  $isListNode,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
} from "@lexical/list";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $setBlocksType } from "@lexical/selection";
import { $findMatchingParent, mergeRegister } from "@lexical/utils";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Type,
  Palette,
} from "lucide-react";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "../../lib/utils";

const blockTypeToBlockName = {
  bullet: "Bulleted List",
  check: "Check List",
  code: "Code Block",
  h1: "Heading 1",
  h2: "Heading 2",
  h3: "Heading 3",
  h4: "Heading 4",
  h5: "Heading 5",
  h6: "Heading 6",
  number: "Numbered List",
  paragraph: "Normal",
  quote: "Quote",
};

type BlockType = keyof typeof blockTypeToBlockName;

const FONT_FAMILY_OPTIONS: [string, string][] = [
  ["Arial", "Arial"],
  ["Courier New", "CourierNew"],
  ["Georgia", "Georgia"],
  ["Times New Roman", "TimesNewRoman"],
  ["Trebuchet MS", "TrebuchetMS"],
  ["Verdana", "Verdana"],
  ["Inter", "Inter"],
  ["Roboto", "Roboto"],
  ["Open Sans", "OpenSans"],
  ["Lato", "Lato"],
  ["Montserrat", "Montserrat"],
  ["Poppins", "Poppins"],
];

const FONT_SIZE_OPTIONS: [string, string][] = [
  ["10px", "10px"],
  ["11px", "11px"],
  ["12px", "12px"],
  ["13px", "13px"],
  ["14px", "14px"],
  ["15px", "15px"],
  ["16px", "16px"],
  ["17px", "17px"],
  ["18px", "18px"],
  ["19px", "19px"],
  ["20px", "20px"],
  ["24px", "24px"],
  ["28px", "28px"],
  ["32px", "32px"],
  ["36px", "36px"],
  ["48px", "48px"],
  ["64px", "64px"],
  ["72px", "72px"],
];

const COLOR_OPTIONS = [
  "#000000",
  "#FFFFFF",
  "#FF0000",
  "#00FF00",
  "#0000FF",
  "#FFFF00",
  "#FF00FF",
  "#00FFFF",
  "#FFA500",
  "#800080",
  "#FFC0CB",
  "#A52A2A",
  "#808080",
  "#000080",
  "#008000",
  "#800000",
  "#808000",
  "#C0C0C0",
  "#FF6347",
  "#4682B4",
];

export function RichTextToolbar() {
  const [editor] = useLexicalComposerContext();
  const [blockType, setBlockType] = useState<BlockType>("paragraph");
  const [selectedElementKey, setSelectedElementKey] = useState<string | null>(
    null
  );
  const [fontSize, setFontSize] = useState<string>("16px");
  const [fontFamily, setFontFamily] = useState<string>("Arial");
  const [fontColor, setFontColor] = useState<string>("#FFFFFF");
  const [bgColor, setBgColor] = useState<string>("#000000");
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const anchorNode = selection.anchor.getNode();
      let element =
        anchorNode.getKey() === "root"
          ? anchorNode
          : $findMatchingParent(anchorNode, (e) => {
              const parent = e.getParent();
              return parent !== null && parent.getKey() === "root";
            });

      if (element === null) {
        element = anchorNode.getTopLevelElementOrThrow();
      }

      const elementKey = element.getKey();
      const elementDOM = editor.getElementByKey(elementKey);

      setSelectedElementKey(elementKey);

      // Update block type
      if ($isListNode(element)) {
        const parentList = $findMatchingParent(anchorNode, (parent) =>
          $isListNode(parent)
        );
        const type = parentList
          ? parentList.getListType()
          : element.getListType();
        setBlockType(type);
      } else {
        const type = $isHeadingNode(element)
          ? element.getTag()
          : element.getType();
        if (type in blockTypeToBlockName) {
          setBlockType(type as BlockType);
        }
      }

      // Update text format
      setIsBold(selection.hasFormat("bold"));
      setIsItalic(selection.hasFormat("italic"));
      setIsUnderline(selection.hasFormat("underline"));
      setIsStrikethrough(selection.hasFormat("strikethrough"));

      // Update font properties from DOM
      if (elementDOM !== null) {
        const computedStyle = getComputedStyle(elementDOM);
        setFontSize(computedStyle.fontSize);
        setFontFamily(
          computedStyle.fontFamily.split(",")[0].replace(/["']/g, "")
        );
        setFontColor(rgbToHex(computedStyle.color));
        setBgColor(rgbToHex(computedStyle.backgroundColor));
      }
    }
  }, [editor]);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateToolbar();
        });
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        (_payload, _newEditor) => {
          updateToolbar();
          return false;
        },
        1
      ),
      editor.registerCommand(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload);
          return false;
        },
        1
      ),
      editor.registerCommand(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload);
          return false;
        },
        1
      )
    );
  }, [editor, updateToolbar]);

  const formatParagraph = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createParagraphNode());
      }
    });
  };

  const formatHeading = (headingSize: HeadingTagType) => {
    if (blockType !== headingSize) {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createHeadingNode(headingSize));
        }
      });
    }
  };

  const formatBulletList = () => {
    if (blockType !== "bullet") {
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    }
  };

  const formatNumberedList = () => {
    if (blockType !== "number") {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    }
  };

  const applyStyleText = useCallback(
    (styles: Record<string, string>) => {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          const nodes = selection.getNodes();
          nodes.forEach((node) => {
            const element = node.getParent();
            if (element) {
              Object.entries(styles).forEach(([property, value]) => {
                element.setStyle(property);
              });
            }
          });
        }
      });
    },
    [editor]
  );

  // Helper function to convert RGB to Hex
  function rgbToHex(rgb: string): string {
    if (rgb.startsWith("#")) return rgb;
    const result = rgb.match(/\d+/g);
    if (result && result.length >= 3) {
      const r = parseInt(result[0]);
      const g = parseInt(result[1]);
      const b = parseInt(result[2]);
      return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
    }
    return "#000000";
  }

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 border-b border-slate-700 bg-slate-800/30">
      {/* Undo/Redo */}
      <div className="flex items-center gap-1 mr-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}
          disabled={!canUndo}
          className="h-8 w-8 p-0"
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}
          disabled={!canRedo}
          className="h-8 w-8 p-0"
        >
          <Redo className="h-4 w-4" />
        </Button>
      </div>

      {/* Block Type */}
      <Select
        value={blockType}
        onValueChange={(value: BlockType) => {
          if (value === "paragraph") {
            formatParagraph();
          } else if (value.startsWith("h")) {
            formatHeading(value as HeadingTagType);
          } else if (value === "bullet") {
            formatBulletList();
          } else if (value === "number") {
            formatNumberedList();
          }
        }}
      >
        <SelectTrigger className="w-32 h-8 text-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="paragraph">Normal</SelectItem>
          <SelectItem value="h1">Heading 1</SelectItem>
          <SelectItem value="h2">Heading 2</SelectItem>
          <SelectItem value="h3">Heading 3</SelectItem>
          <SelectItem value="h4">Heading 4</SelectItem>
          <SelectItem value="h5">Heading 5</SelectItem>
          <SelectItem value="h6">Heading 6</SelectItem>
          <SelectItem value="bullet">Bullet List</SelectItem>
          <SelectItem value="number">Number List</SelectItem>
          <SelectItem value="quote">Quote</SelectItem>
        </SelectContent>
      </Select>

      {/* Font Family */}
      <Select
        value={fontFamily}
        onValueChange={(value) => {
          setFontFamily(value);
          applyStyleText({ "font-family": value });
        }}
      >
        <SelectTrigger className="w-32 h-8 text-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {FONT_FAMILY_OPTIONS.map(([option, value]) => (
            <SelectItem key={value} value={value}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Font Size */}
      <Select
        value={fontSize}
        onValueChange={(value) => {
          setFontSize(value);
          applyStyleText({ "font-size": value });
        }}
      >
        <SelectTrigger className="w-20 h-8 text-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {FONT_SIZE_OPTIONS.map(([option, value]) => (
            <SelectItem key={value} value={value}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Text Formatting */}
      <div className="flex items-center gap-1 mx-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")}
          className={cn("h-8 w-8 p-0", isBold && "bg-blue-600")}
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")}
          className={cn("h-8 w-8 p-0", isItalic && "bg-blue-600")}
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() =>
            editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline")
          }
          className={cn("h-8 w-8 p-0", isUnderline && "bg-blue-600")}
        >
          <Underline className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() =>
            editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough")
          }
          className={cn("h-8 w-8 p-0", isStrikethrough && "bg-blue-600")}
        >
          <Strikethrough className="h-4 w-4" />
        </Button>
      </div>

      {/* Lists */}
      <div className="flex items-center gap-1 mx-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={formatBulletList}
          className={cn("h-8 w-8 p-0", blockType === "bullet" && "bg-blue-600")}
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={formatNumberedList}
          className={cn("h-8 w-8 p-0", blockType === "number" && "bg-blue-600")}
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
      </div>

      {/* Colors */}
      <div className="flex items-center gap-1">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Type className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-3">
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Text Color
                </label>
                <div className="grid grid-cols-10 gap-1">
                  {COLOR_OPTIONS.map((color) => (
                    <button
                      key={color}
                      className="w-6 h-6 rounded border border-gray-300"
                      style={{ backgroundColor: color }}
                      onClick={() => {
                        setFontColor(color);
                        applyStyleText({ color });
                      }}
                    />
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Background Color
                </label>
                <div className="grid grid-cols-10 gap-1">
                  {COLOR_OPTIONS.map((color) => (
                    <button
                      key={color}
                      className="w-6 h-6 rounded border border-gray-300"
                      style={{ backgroundColor: color }}
                      onClick={() => {
                        setBgColor(color);
                        applyStyleText({ "background-color": color });
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
