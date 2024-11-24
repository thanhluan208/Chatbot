import { NodeProps } from "@xyflow/react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { useSave } from "@/Stores/useStore";
import useWorkflowMutate from "@/Hooks/workflow/useWorkflowMutate";
import { KnowledgeNodeData } from "./type";
import useGetVariableSelectors from "@/Hooks/workflow/useGetVariableSelectors";
import { useMemo } from "react";
import {
  Vars,
  VarSelectorOptionInterface,
} from "../WF_VariableAggregator/ListAssignVars";
import { cloneDeep } from "lodash";
import { useTheme } from "@mui/material";
import { Book, X } from "lucide-react";
import EditLabelNode from "@/Components/CommonStyles/EditLabelNode";
import CommonStyles from "@/Components/CommonStyles";
import cachedKeys from "@/Constants/cachedKeys";
import DescriptionInput from "../../DescriptionInput";
import VarSelectorSelect from "../WF_VariableAggregator/VarSelectorSelect";
import AddKnowledgeButton from "./AddKnowledgeButton";

interface KnowledgeNodeDrawerProps {
  node: NodeProps;
}
const KnowledgeNodeDrawer = ({ node }: KnowledgeNodeDrawerProps) => {
  const theme = useTheme();
  const { workflowId } = useParams();
  const save = useSave();
  const { t } = useTranslation("node");
  const { handleUpdateNodeDataKnowledge } = useWorkflowMutate();

  const nodeData = node?.data as unknown as KnowledgeNodeData;
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

  const handleSelectVar = (vars: Vars, oldVars?: string) => {
    let hasAdded = false;

    const newVars = cloneDeep(nodeData?.query_variable_selector).map((elm) => {
      if (elm.join("-") === oldVars) {
        hasAdded = true;
        return vars.value.split("-");
      }
      return elm;
    });

    if (!hasAdded) {
      newVars.push(vars.value.split("-"));
    }

    handleUpdateNodeDataKnowledge(node?.id, {
      query_variable_selector: newVars,
    });
  };

  const handleRemoveVar = (vars: string) => {
    const newVars = nodeData?.query_variable_selector.filter(
      (elm) => elm.join("-") !== vars
    );

    const payload = {
      query_variable_selector: newVars,
    };

    handleUpdateNodeDataKnowledge(node?.id, payload);
  };

  const handleUpdate = (payload: Partial<any>) => {
    handleUpdateNodeDataKnowledge(node?.id, payload);
  };

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
              <Book className="w-3.5 h-3.5" color="#fff" />
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

      <div className="px-6">
        <div className="flex items-center space-x-2 mt-4">
          <CommonStyles.Typography type="semiBold16">
            {t("common.query_variable").toUpperCase()}
          </CommonStyles.Typography>
        </div>

        <div className="mt-4 flex flex-col gap-2 mb-2">
          {nodeData?.query_variable_selector?.map((vars) => {
            return (
              <VarSelectorSelect
                key={`${vars?.[0]}-${vars?.[1]}`}
                handleSelectVar={handleSelectVar}
                varSelectorOptions={varSelectorOptions}
                variables={nodeData?.query_variable_selector}
                value={`${vars?.[0]}-${vars?.[1]}`}
                handleRemoveVar={handleRemoveVar}
              />
            );
          })}

          <VarSelectorSelect
            handleSelectVar={handleSelectVar}
            varSelectorOptions={varSelectorOptions}
            variables={nodeData?.query_variable_selector}
          />
        </div>
        <div className="flex items-center space-x-2 mt-4">
          <CommonStyles.Typography type="semiBold16">
            {t("WF_Knowledge.knowledge").toUpperCase()}
          </CommonStyles.Typography>
        </div>
        <div className="mt-4">
          <AddKnowledgeButton
            knowledges={nodeData?.knowledge_storage_ids}
            nodeId={node?.id}
          />
        </div>
      </div>
    </div>
  );
};

export default KnowledgeNodeDrawer;
