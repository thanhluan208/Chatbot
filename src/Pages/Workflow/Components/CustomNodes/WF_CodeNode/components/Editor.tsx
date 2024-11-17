import EditorMonaco from "@monaco-editor/react";
import { useRef } from "react";

const Editor = () => {
  const editorRef = useRef<unknown | null>(null);

  function handleEditorDidMount(editor: unknown) {
    editorRef.current = editor;
  }

  return (
    <EditorMonaco className="ml-5 pb-2"
      height="11rem"
      width="95%"
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
