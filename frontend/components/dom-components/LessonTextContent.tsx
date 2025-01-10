"use dom";
import "./styles.css";

import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";

import ExampleTheme from "./ExampleTheme";
import ToolbarPlugin from "./plugins/ToolbarPlugin";
import TreeViewPlugin from "./plugins/TreeViewPlugin";
import { $getRoot, EditorState, LexicalEditor } from "lexical";
import LoadState from "./LoadState";
import { HeadingNode } from "@lexical/rich-text";
import ReadOnlyPlugin from "./plugins/ReadOnlyPlugin";
// DO NOT ADD ANY MORE IMPORTS (like react)
const placeholder = "Enter lesson content here...";

const editorConfig = {
  namespace: "React.js Demo",
  nodes: [],
  // Handling of errors during update
  onError(error: Error) {
    throw error;
  },
  // The editor theme
  theme: ExampleTheme,
  // nodes: [HeadingNode],
};
export default function Editor({ initialState }: { initialState: string }) {
  return (
    <>
      <LexicalComposer initialConfig={editorConfig}>
        <div className="editor-container">
          <LoadState initialState={initialState} />
          <div className="editor-inner">
            <RichTextPlugin
              contentEditable={
                <ContentEditable
                  className="editor-input"
                  aria-placeholder={placeholder}
                />
              }
              ErrorBoundary={LexicalErrorBoundary}
            />
            <ReadOnlyPlugin />
            {/* <TreeViewPlugin /> */}
          </div>
        </div>
      </LexicalComposer>
    </>
  );
}
