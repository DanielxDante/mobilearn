import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect } from "react";

export default function ReadOnlyPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    // Disable editing
    editor.setEditable(false);
  }, [editor]);

  return null;
}
