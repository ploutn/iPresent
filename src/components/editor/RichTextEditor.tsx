// src/components/editor/RichTextEditor.tsx
import React, { useEffect } from "react";
import { $getRoot, $getSelection } from "lexical";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { PlainTextPlugin } from "@lexical/react/LexicalPlainTextPlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $generateHtmlFromNodes, $generateNodesFromDOM } from "@lexical/html";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table";
import { ListItemNode, ListNode } from "@lexical/list";
import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { cn } from "../../lib/utils";
import { RichTextToolbar } from "./RichTextToolbar";

const theme = {
  ltr: "ltr",
  rtl: "rtl",
  placeholder: "editor-placeholder",
  paragraph: "editor-paragraph",
  quote: "editor-quote",
  heading: {
    h1: "editor-heading-h1",
    h2: "editor-heading-h2",
    h3: "editor-heading-h3",
    h4: "editor-heading-h4",
    h5: "editor-heading-h5",
    h6: "editor-heading-h6",
  },
  list: {
    nested: {
      listitem: "editor-nested-listitem",
    },
    ol: "editor-list-ol",
    ul: "editor-list-ul",
    listitem: "editor-listitem",
  },
  image: "editor-image",
  link: "editor-link",
  text: {
    bold: "editor-text-bold",
    italic: "editor-text-italic",
    overflowed: "editor-text-overflowed",
    hashtag: "editor-text-hashtag",
    underline: "editor-text-underline",
    strikethrough: "editor-text-strikethrough",
    underlineStrikethrough: "editor-text-underlineStrikethrough",
    code: "editor-text-code",
  },
  code: "editor-code",
  codeHighlight: {
    atrule: "editor-tokenAttr",
    attr: "editor-tokenAttr",
    boolean: "editor-tokenProperty",
    builtin: "editor-tokenSelector",
    cdata: "editor-tokenComment",
    char: "editor-tokenSelector",
    class: "editor-tokenFunction",
    "class-name": "editor-tokenFunction",
    comment: "editor-tokenComment",
    constant: "editor-tokenProperty",
    deleted: "editor-tokenProperty",
    doctype: "editor-tokenComment",
    entity: "editor-tokenOperator",
    function: "editor-tokenFunction",
    important: "editor-tokenVariable",
    inserted: "editor-tokenSelector",
    keyword: "editor-tokenAttr",
    namespace: "editor-tokenVariable",
    number: "editor-tokenProperty",
    operator: "editor-tokenOperator",
    prolog: "editor-tokenComment",
    property: "editor-tokenProperty",
    punctuation: "editor-tokenPunctuation",
    regex: "editor-tokenVariable",
    selector: "editor-tokenSelector",
    string: "editor-tokenSelector",
    symbol: "editor-tokenProperty",
    tag: "editor-tokenProperty",
    url: "editor-tokenOperator",
    variable: "editor-tokenVariable",
  },
};

function onError(error: Error) {
  console.error(error);
}

interface RichTextEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  readOnly?: boolean;
  showToolbar?: boolean;
  minHeight?: string;
}

// Plugin to sync content with parent component
function OnChangeContentPlugin({
  onChange,
}: {
  onChange?: (value: string) => void;
}) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const htmlString = $generateHtmlFromNodes(editor, null);
        onChange?.(htmlString);
      });
    });
  }, [editor, onChange]);

  return null;
}

// Plugin to set initial content
function InitialContentPlugin({ value }: { value?: string }) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (value && value.trim()) {
      editor.update(() => {
        const parser = new DOMParser();
        const dom = parser.parseFromString(value, "text/html");
        const nodes = $generateNodesFromDOM(editor, dom);
        const root = $getRoot();
        root.clear();
        root.append(...nodes);
      });
    }
  }, [editor, value]);

  return null;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Enter your text...",
  className,
  readOnly = false,
  showToolbar = true,
  minHeight = "200px",
}: RichTextEditorProps) {
  const initialConfig = {
    namespace: "RichTextEditor",
    theme,
    onError,
    nodes: [
      HeadingNode,
      ListNode,
      ListItemNode,
      QuoteNode,
      CodeNode,
      CodeHighlightNode,
      TableNode,
      TableCellNode,
      TableRowNode,
      AutoLinkNode,
      LinkNode,
    ],
    editable: !readOnly,
  };

  return (
    <div className={cn("rich-text-editor", className)}>
      <LexicalComposer initialConfig={initialConfig}>
        {showToolbar && !readOnly && <RichTextToolbar />}
        <div className="editor-container">
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                className={cn(
                  "editor-input",
                  "w-full p-3 border border-slate-700 rounded-md",
                  "bg-slate-800/50 text-white placeholder:text-slate-400",
                  "focus:border-blue-500 focus:ring-1 focus:ring-blue-500",
                  "transition-all duration-200 resize-none outline-none",
                  "prose prose-invert max-w-none"
                )}
                style={{ minHeight }}
              />
            }
            placeholder={
              <div className="editor-placeholder absolute top-3 left-3 text-slate-400 pointer-events-none">
                {placeholder}
              </div>
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
          <OnChangeContentPlugin onChange={onChange} />
          <InitialContentPlugin value={value} />
          <HistoryPlugin />
        </div>
      </LexicalComposer>
    </div>
  );
}

export default RichTextEditor;
