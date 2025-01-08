import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import React, { useEffect } from "react";

export default function LoadState({
  initialState,
}: {
  initialState: string | null;
}) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (initialState) {
      const newState = editor.parseEditorState(initialState); // Parse the passed editorState
      editor.setEditorState(newState); // Set the editor state
      editor.setEditable(true);
    }
  }, [initialState, editor]); // Re-run effect if `initialState` changes

  return <></>;
}
