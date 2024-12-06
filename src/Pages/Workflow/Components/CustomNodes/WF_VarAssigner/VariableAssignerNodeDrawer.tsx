import CommonStyles from "@/Components/CommonStyles";
import EditLabelNode from "@/Components/CommonStyles/EditLabelNode";
import { useTheme } from "@mui/material";
import { NodeProps } from "@xyflow/react";
import { Equal, X } from "lucide-react";
import { useParams } from "react-router-dom";
import cachedKeys from "@/Constants/cachedKeys";
import { useSave } from "@/Stores/useStore";
import useWorkflowMutate from "@/Hooks/workflow/useWorkflowMutate";
import DescriptionInput from "../../DescriptionInput";
import { NodeDataVariable } from "./type";
import { useCallback, useMemo, useRef, useState } from "react";
import EditorPrompt from "../../misc/EditorPromtpt";
import VarOutList from "../../misc/VarOutList";
import { cloneDeep } from "lodash";

interface VarAggNodeDrawerProps {
  node?: NodeProps;
}
const VariableAssignerNodeDrawer = ({ node }: VarAggNodeDrawerProps) => {
  if (!node) return null;

  const nodeData = node?.data as unknown as NodeDataVariable;

  const [errorValue, setErrorValue] = useState(false);
  const [errorVariable, setErrorVariable] = useState(false);

  const theme = useTheme();
  const { workflowId } = useParams();
  const save = useSave();
  const { handleUpdateNodeDataVariable } = useWorkflowMutate();

  const valueRef = useRef(nodeData?.value);
  const variableRef = useRef(nodeData?.variable);
  const debounceRef = useRef<number | null>(null);

  const nodeDataWithVariableOut = useMemo(() => {
    if (!nodeData) return;
    return {
      ...nodeData,
      variable_out: cloneDeep(nodeData?.variable_out).map((elm) => {
        return {
          ...elm,
          variable: nodeData?.variable,
        };
      }),
    };
  }, [nodeData]);

  const handleUpdate = (payload: Partial<NodeDataVariable>) => {
    handleUpdateNodeDataVariable(node?.id, payload);
  };

  const handleUpdateValueVariable = useCallback(
    (id: string, value: string) => {
      if (valueRef.current && !value) {
        setErrorValue(true);
        return;
      }
      if (value) setErrorValue(false);
      if (
        !variableRef.current ||
        !valueRef.current ||
        valueRef.current === value
      ) {
        return;
      }

      valueRef.current = value.trim();

      handleUpdateNodeDataVariable(id, {
        value: value.trim(),
        variable: variableRef.current,
      });
    },
    [handleUpdateNodeDataVariable]
  );


  const handleChangeVarName = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = event.target.value.trim();
      if (valueRef.current && !value) {
        setErrorVariable(true);
        return;
      }
      if (value) setErrorVariable(false);
      if (
        !variableRef.current ||
        !valueRef.current ||
        variableRef.current === value
      ) {
        return;
      }

      variableRef.current = value;

      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        handleUpdateNodeDataVariable(node?.id, {
          variable: value,
          value: valueRef.current,
        });
      }, 300);
    },
    [handleUpdateValueVariable, node?.id]
  );

  return (
    <div
      className="py-4"
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <div className="flex flex-col  sticky top-0 px-6 py-4 z-50 backdrop-blur-3xl">
        <div className="flex justify-between">
          <div className="flex items-center gap-2 ">
            <div
              className="w-6 h-6 flex items-center justify-center rounded-md"
              style={{
                background: theme.palette.primary.main,
              }}
            >
              <Equal className="w-3.5 h-3.5" color="#fff" />
            </div>
            <EditLabelNode nodeId={node.id} workflowId={workflowId} />
          </div>

          <CommonStyles.Button
            isIcon
            sx={{
              position: "absolute",
              top: 16,
              right: 16,
            }}
            onClick={() => {
              save(cachedKeys.NODE_EDITING, null);
            }}
          >
            <X size={24} />
          </CommonStyles.Button>
        </div>
        <DescriptionInput value={nodeData.desc} handleUpdate={handleUpdate} />
      </div>

      <div className="px-4">
        <div className="px-3 py-3">
          <div>
            <CommonStyles.Input
              label="Variable name"
              placeholder="Enter variable name"
              afterOnchange={handleChangeVarName}
              initValue={nodeData?.variable}
              error={errorVariable}
              helperText={
                errorVariable ? "Variable name can not be empty" : undefined
              }
            />
          </div>
          <EditorPrompt
            id={node?.id}
            nodeId={node?.id}
            value={nodeData?.value}
            handleChangeEditor={handleUpdateValueVariable}
            error={errorValue}
          />
          {errorValue && (
            <CommonStyles.Typography color="error" className="text-destructive">
              Variable value can not be empty
            </CommonStyles.Typography>
          )}
        </div>

        <hr className="my-2 mx-4 opacity-20" />

        {nodeDataWithVariableOut && (
          <VarOutList nodeData={nodeDataWithVariableOut} />
        )}
      </div>
    </div>
  );
};

export default VariableAssignerNodeDrawer;
