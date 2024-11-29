import EditorMonaco from "@monaco-editor/react";
import { useRef } from "react";

interface EditorProps {
  nodeId: string;
  value?: string;
  language?: string;
  handleUpdateNodeData: (nodeId: string, payload: any) => void;
}

const Editor = ({
  nodeId,
  value,
  language,
  handleUpdateNodeData,
}: EditorProps) => {
  const editorRef = useRef<unknown | null>(null);
  const timeoutRef = useRef<number | null>(null);
  //!Function
  const handleChange = (
    value: string | undefined, ev: unknown
  ) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    const payload: any = {
      code: value, 
      code_language: language
    };

    timeoutRef.current = window.setTimeout(() => {
      handleUpdateNodeData(nodeId, payload);
    }, 2000);
  };

  function handleEditorDidMount(editor: unknown) {
    editorRef.current = editor;
  }

  return (
    <EditorMonaco
      className="rounded-xl overflow-hidden"
      height="250px"
      defaultLanguage="javascript"
      defaultValue="function main({arg1, arg2}) {
                      return {
                          result: arg1 + arg2
                      }
                    }"

      value={value}
      language={language}
      onMount={handleEditorDidMount}
      theme="vs-dark"
      onChange={handleChange}
    />
  );
};

export default Editor;
