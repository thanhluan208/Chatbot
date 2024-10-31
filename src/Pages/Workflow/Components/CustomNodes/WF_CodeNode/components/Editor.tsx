import EditorMonaco from "@monaco-editor/react";
import { useRef } from "react";

const Editor = () => {
  const editorRef = useRef<unknown | null>(null);

  function handleEditorDidMount(editor: unknown) {
    editorRef.current = editor;
  }

  return (
    <EditorMonaco
      height="fit-content"
      defaultLanguage="javascript"
      defaultValue="function main({arg1, arg2}) {
    return {
        result: arg1 + arg2
    }
}"
      onMount={handleEditorDidMount}
      theme="vs-dark"
    />
  );
};

export default Editor;
