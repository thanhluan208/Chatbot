import { NodeOutPutVar } from "@/Components/CommonStyles/EditorPlugin/type";
import useGetVariableSelectors from "@/Hooks/workflow/useGetVariableSelectors";
import { Node } from "@xyflow/react";
import { useMemo, useRef } from "react";
import Editor from "../../WF_LlmNode/Editor";
import { useTheme } from "@mui/material";
import { Condition } from "../type";

interface PromptProps {
  nodeId: string;
  value: string;
  handleUpdateCondition: (payload: Partial<Condition>) => void;
}

const Prompt = ({ nodeId, value, handleUpdateCondition }: PromptProps) => {
  const debounceRef = useRef<number | null>(null);

  const { data: varSelectors } = useGetVariableSelectors(nodeId);
  const theme = useTheme();

  const varList = useMemo(() => {
    if (!varSelectors?.variable_selectors) return [];

    const list: NodeOutPutVar[] = [];

    varSelectors?.variable_selectors?.forEach((item) => {
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
  }, [varSelectors?.variable_selectors]);

  const workflowNodesMap = useMemo(() => {
    const map: Record<string, Pick<Node["data"], "title" | "type">> = {};

    if (!varSelectors?.variable_selectors) return map;

    varSelectors?.variable_selectors?.forEach((item) => {
      map[item.value[0]] = {
        title: item.value[0],
        type: item.type,
      };
    });

    return map;
  }, [varSelectors?.variable_selectors]);

  const handleChangeEditor = (editorValue: string) => {
    if (editorValue === value) return;

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      handleUpdateCondition({
        value: editorValue,
      });
    }, 1500);
  };

  return (
    <div
      className="rounded-lg"
      style={{
        border: `1px solid ${theme.colors.custom.borderColor}`,
      }}
    >
      <Editor
        controlPromptEditorRerenderKey={nodeId}
        nodeId={nodeId}
        initValue={value}
        varList={varList}
        workflowNodesMap={workflowNodesMap}
        handleChangeEditor={handleChangeEditor}
      />
    </div>
  );
};

export default Prompt;
