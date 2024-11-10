import PromptEditor from "@/Components/CommonStyles/EditorPlugin";
import {
  BlockEnum,
  NodeOutPutVar,
} from "@/Components/CommonStyles/EditorPlugin/type";
import { Variable } from "@/Types/workflow";
import { Box, useTheme } from "@mui/material";
import { Node, useReactFlow } from "@xyflow/react";
import { useBoolean } from "ahooks";
import { memo, useMemo } from "react";

interface EditorProps {
  controlPromptEditorRerenderKey: string;
  nodeId: string;
  readOnly?: boolean;
  parentNodes?: string[];
  initValue?: string;
}

const Editor = ({
  controlPromptEditorRerenderKey,
  nodeId,
  readOnly,
  parentNodes,
  initValue,
}: EditorProps) => {
  const theme = useTheme();
  const { getNode } = useReactFlow();
  const onChange = (value: string) => {
    console.log(value);
  };

  const parentNodeInputInfos = useMemo(() => {
    const varList: NodeOutPutVar[] = [];
    const workflowNodesMap: Record<
      string,
      Pick<Node["data"], "title" | "type">
    > = {};

    if (!parentNodes) return;

    parentNodes.forEach((nodeId) => {
      const node = getNode(nodeId);

      if (!node) return;

      varList.push({
        nodeId: nodeId,
        title: node.data.label as string,
        vars: (node.data.variables as Variable[])?.map((elm) => {
          return {
            type: elm.type,
            variable: elm.variable || "",
          };
        }),
      });

      workflowNodesMap[nodeId] = {
        title: node.data.label as string,
        type: BlockEnum.Start,
      };
    });

    return {
      variables: varList,
      workflowNodesMap,
    };
  }, [parentNodes]);

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
        className="min-h-[128px] px-3 py-2 rounded-md"
        style={{
          background: theme.colors.custom.backgroundCard,
          border: `1px solid ${theme.colors.custom.borderColor}`,
        }}
        value={initValue || ""}
        workflowVariableBlock={{
          show: true,
          variables: parentNodeInputInfos
            ? parentNodeInputInfos?.variables
            : [],
          workflowNodesMap: parentNodeInputInfos
            ? parentNodeInputInfos?.workflowNodesMap
            : {},
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
