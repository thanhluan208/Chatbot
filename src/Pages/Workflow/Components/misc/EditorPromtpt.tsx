import { NodeOutPutVar } from "@/Components/CommonStyles/EditorPlugin/type";
import { Node } from "@xyflow/react";
import { useMemo, useRef } from "react";
import Editor from "../CustomNodes/WF_LlmNode/Editor";
import useGetVariableSelectors from "@/Hooks/workflow/useGetVariableSelectors";
import { useTheme } from "@mui/material";

interface EditorPromtptProps {
  nodeId: string;
  value: string;
  handleChangeEditor: (nodeId: string, payload: string) => void;
  id: string;
}

const EditorPrompt = ({
  id,
  nodeId,
  value,
  handleChangeEditor,
}: EditorPromtptProps) => {
  const theme = useTheme();
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const { data: varSelectors } = useGetVariableSelectors(nodeId);

  const variable_selectors = useMemo(() => {
    if (!varSelectors) return [];
    return varSelectors?.variable_selectors;
  }, [varSelectors]);

  const varList = useMemo(() => {
    if (!variable_selectors) return [];

    const list: NodeOutPutVar[] = [];

    variable_selectors?.forEach((item) => {
      const index = list.findIndex((elm) => elm.nodeId === item.value[0]);
      if (index !== -1) {
        list[index].vars.push({
          type: item.type,
          variable: item.value[1],
        });
      } else {
        list.push({
          nodeId: item.value[0],
          title: item.value[0],
          vars: [
            {
              type: item.type,
              variable: item.value[1],
            },
          ],
        });
      }
    });

    return list;
  }, [variable_selectors]);

  const workflowNodesMap = useMemo(() => {
    const map: Record<string, Pick<Node["data"], "title" | "type">> = {};

    if (!variable_selectors) return map;

    variable_selectors?.forEach((item) => {
      map[item.value[0]] = {
        title: item.value[0],
        type: item.type,
      };
    });

    return map;
  }, [variable_selectors]);

  const onChangeEditor = (promptValue: string) => {
    if (promptValue === value) return;

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      value = promptValue;
      handleChangeEditor(nodeId, promptValue);
    }, 1500);
  };

  return (
    <div
      className="px-2 py-1 mt-3 rounded-lg"
      style={{
        border: `1px solid ${theme.colors.custom.borderColor}`,
        background: theme.colors.custom.backgroundCard,
      }}
    >
      <Editor
        controlPromptEditorRerenderKey={id}
        nodeId={nodeId}
        initValue={value}
        varList={varList}
        workflowNodesMap={workflowNodesMap}
        handleChangeEditor={onChangeEditor}
      />
    </div>
  );
};

export default EditorPrompt;
