import CommonStyles from "@/Components/CommonStyles";
import EditLabelNode from "@/Components/CommonStyles/EditLabelNode";
import cachedKeys from "@/Constants/cachedKeys";
import useDebounce from "@/Hooks/useDebounce";
import useGetVariableSelectors from "@/Hooks/workflow/useGetVariableSelectors";
import useWorkflowMutate from "@/Hooks/workflow/useWorkflowMutate";
import { useSave } from "@/Stores/useStore";
import { useTheme } from "@mui/material";
import { NodeProps, useReactFlow } from "@xyflow/react";
import { cloneDeep, isEmpty } from "lodash";
import { Goal, Plus, Trash, X } from "lucide-react";
import { useMemo } from "react";
import { useParams } from "react-router-dom";
import DescriptionInput from "../../DescriptionInput";
import {
  Vars,
  VarSelectorOptionInterface,
} from "../WF_VariableAggregator/ListAssignVars";
import VarSelectorSelect from "../WF_VariableAggregator/VarSelectorSelect";
import { NodeDataEnd } from "./type";

interface AnswerNodeDrawerProps {
  node?: NodeProps;
}
const EndNodeDrawer = ({ node }: AnswerNodeDrawerProps) => {
  const theme = useTheme();
  const { workflowId } = useParams();
  const save = useSave();
  const { handleUpdateNodeDataEnd } = useWorkflowMutate();
  const { updateNode } = useReactFlow();

  if (!node) return null;

  const nodeData = node?.data as unknown as NodeDataEnd;
  const { data: varSelectors } = useGetVariableSelectors(node?.id);

  const varSelectorOptions = useMemo(() => {
    if (!varSelectors) return [];

    const options: VarSelectorOptionInterface[] = [];

    varSelectors.variable_selectors?.forEach((vars) => {
      const index = options.findIndex((elm) => elm.node === vars.value?.[0]);

      if (index !== -1) {
        options[index]?.vars.push({
          value: `${vars.value?.[0]}-${vars.value?.[1]}`,
          type: vars.type,
          name: vars.value?.[1],
        });
      } else {
        options.push({
          node: vars.value?.[0],
          vars: [
            {
              value: `${vars.value?.[0]}-${vars.value?.[1]}`,
              type: vars.type,
              name: vars.value?.[1],
            },
          ],
        });
      }
    });

    return options;
  }, [varSelectors]);

  const handleUpdate = (payload: Partial<NodeDataEnd>) => {
    handleUpdateNodeDataEnd(node?.id, payload);
  };

  const handleSelectVar = (variable: string, vars: Vars) => {
    const newOutputs = cloneDeep(nodeData?.outputs)?.map((elm) => {
      if (elm.variable === variable) {
        return {
          ...elm,
          value_selector: [vars.node || "", vars.name],
        };
      }
      return elm;
    });

    handleUpdateNodeDataEnd(node?.id, {
      outputs: newOutputs,
    });
  };

  const handleAddVariable = () => {
    const newOutputs = cloneDeep(nodeData?.outputs);
    newOutputs?.push({
      variable: "",
      value_selector: [],
      save_to_memory: false,
    });

    updateNode(node.id, {
      data: {
        ...nodeData,
        outputs: newOutputs,
      },
    });
  };

  const handleRemoveVariable = (variable: string, isAdded: boolean) => {
    const newOutputs = cloneDeep(nodeData?.outputs)?.filter(
      (elm) => elm.variable !== variable
    );

    if (!isAdded) {
      updateNode(node.id, {
        data: {
          ...nodeData,
          outputs: newOutputs,
        },
      });
    } else {
      handleUpdateNodeDataEnd(node?.id, {
        outputs: newOutputs,
      });
    }
  };

  const handleChangeVariableName = (value: string, variable: string) => {
    const newOutputs = cloneDeep(nodeData?.outputs)?.map((elm) => {
      if (elm.variable === variable) {
        return {
          ...elm,
          variable: value,
        };
      }
      return elm;
    });

    handleUpdateNodeDataEnd(node?.id, {
      outputs: newOutputs,
    });
  };

  const handleInputChange = useDebounce(handleChangeVariableName);

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
              <Goal className="w-3.5 h-3.5" color="#fff" />
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

      <CommonStyles.Typography type="semiBold16" className="px-4">
        Output Variables
      </CommonStyles.Typography>

      <div className="flex flex-col gap-2 mt-5">
        {nodeData?.outputs?.map((output, index) => {
          return (
            <div className="flex gap-2 px-3 py-1" key={index}>
              <CommonStyles.Input
                initValue={output.variable}
                placeholder="Variable name..."
                afterOnchange={(e) =>
                  handleInputChange(e.target.value, output.variable)
                }
              />
              <VarSelectorSelect
                handleSelectVar={(vars) =>
                  handleSelectVar(output.variable, vars)
                }
                varSelectorOptions={varSelectorOptions}
                variables={
                  !isEmpty(output.value_selector) ? [output.value_selector] : []
                }
                value={
                  !isEmpty(output?.value_selector)
                    ? `${output?.value_selector?.[0]}-${output?.value_selector?.[1]}`
                    : undefined
                }
              />
              <CommonStyles.Button
                isIcon
                hasBorder={false}
                color="error"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveVariable(
                    output.variable,
                    !isEmpty(output.value_selector) || !!output.variable
                  );
                }}
              >
                <Trash size={16} />
              </CommonStyles.Button>
            </div>
          );
        })}
      </div>

      <div className="px-3 my-3">
        <CommonStyles.Button variant="contained" onClick={handleAddVariable}>
          <Plus size={16} />
          Add output variable
        </CommonStyles.Button>
      </div>

    </div>
  );
};

export default EndNodeDrawer;
