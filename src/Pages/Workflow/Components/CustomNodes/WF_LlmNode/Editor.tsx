import PromptEditor from "@/Components/CommonStyles/EditorPlugin";
import { NodeOutPutVar } from "@/Components/CommonStyles/EditorPlugin/type";
import { cn } from "@/lib/utils";
import { Box } from "@mui/material";
import { Node } from "@xyflow/react";
import { useBoolean } from "ahooks";
import { ComponentPropsWithoutRef, memo } from "react";

interface EditorProps {
  controlPromptEditorRerenderKey: string;
  nodeId: string;
  readOnly?: boolean;
  initValue?: string;
  varList: NodeOutPutVar[];
  workflowNodesMap: Record<string, Pick<Node["data"], "title" | "type">>;
  handleChangeEditor?: (value: string) => void;
  placeholder?: string;
}

const Editor = ({
  controlPromptEditorRerenderKey,
  nodeId,
  readOnly,
  initValue,
  varList,
  workflowNodesMap,
  handleChangeEditor,
  className,
  placeholder
}: EditorProps & ComponentPropsWithoutRef<"div">) => {
  const onChange = (value: string) => {
    handleChangeEditor && handleChangeEditor(value);
  };

  const [_, { setTrue: setFocus, setFalse: setBlur }] = useBoolean(false);

  return (
    <Box
      sx={{
        fontFamily: "SegoeUI",
      }}
    >
      <PromptEditor
        key={controlPromptEditorRerenderKey}
        instanceId={nodeId}
        compact
        className={cn("min-h-[64px] px-3 py-2 rounded-md", className)}
        value={initValue || ""}
        workflowVariableBlock={{
          show: true,
          variables: varList,
          workflowNodesMap: workflowNodesMap,
        }}
        onChange={onChange}
        onBlur={setBlur}
        onFocus={setFocus}
        editable={!readOnly}
        nodeId={nodeId}
        placeholder={placeholder}
      />
    </Box>
  );
};

export default memo(Editor);
