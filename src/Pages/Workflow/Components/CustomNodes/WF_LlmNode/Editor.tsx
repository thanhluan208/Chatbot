import PromptEditor from "@/Components/CommonStyles/EditorPlugin";
import { NodeOutPutVar } from "@/Components/CommonStyles/EditorPlugin/type";
import { Box } from "@mui/material";
import { Node } from "@xyflow/react";
import { useBoolean } from "ahooks";
import { memo } from "react";

interface EditorProps {
  controlPromptEditorRerenderKey: string;
  nodeId: string;
  readOnly?: boolean;
  parentNodes?: string[];
  initValue?: string;
  varList: NodeOutPutVar[];
  workflowNodesMap: Record<string, Pick<Node["data"], "title" | "type">>;
  handleChangeEditor?: (value: string) => void;
}

const Editor = ({
  controlPromptEditorRerenderKey,
  nodeId,
  readOnly,
  initValue,
  varList,
  workflowNodesMap,
  handleChangeEditor
}: EditorProps) => {
  const onChange = (value: string) => {
    console.log(value);
    handleChangeEditor && handleChangeEditor(value)
  };

  // const parentNodeInputInfos = useMemo(() => {
  //   const varList: NodeOutPutVar[] = [];
  //   const workflowNodesMap: Record<
  //     string,
  //     Pick<Node["data"], "title" | "type">
  //   > = {};

  //   if (!parentNodes) return;

  //   parentNodes.forEach((nodeId) => {
  //     const node = getNode(nodeId);

  //     if (!node) return;

  //     varList.push({
  //       nodeId: nodeId,
  //       title: node.data.label as string,
  //       vars: (node.data.variables as Variable[])?.map((elm) => {
  //         return {
  //           type: elm.type,
  //           variable: elm.variable || "",
  //         };
  //       }),
  //     });

  //     workflowNodesMap[nodeId] = {
  //       title: node.data.label as string,
  //       type: BlockEnum.Start,
  //     };
  //   });

  //   console.log(varList, workflowNodesMap);

  //   return {
  //     variables: varList,
  //     workflowNodesMap,
  //   };
  // }, [parentNodes]);

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
        className="min-h-[64px] px-3 py-2 rounded-md"
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
      />
    </Box>
  );
};

export default memo(Editor);
