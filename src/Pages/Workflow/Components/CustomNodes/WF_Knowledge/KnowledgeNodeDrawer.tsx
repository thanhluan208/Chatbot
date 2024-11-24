import { NodeProps } from "@xyflow/react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { useSave } from "@/Stores/useStore";
import useWorkflowMutate from "@/Hooks/workflow/useWorkflowMutate";
import { KnowledgeNodeData } from "./type";
import useGetVariableSelectors from "@/Hooks/workflow/useGetVariableSelectors";
import { useCallback, useMemo } from "react";
import {
  Vars,
  VarSelectorOptionInterface,
} from "../WF_VariableAggregator/ListAssignVars";
import { capitalize, cloneDeep } from "lodash";
import { useTheme } from "@mui/material";
import { Book, Trash, X } from "lucide-react";
import EditLabelNode from "@/Components/CommonStyles/EditLabelNode";
import CommonStyles from "@/Components/CommonStyles";
import cachedKeys from "@/Constants/cachedKeys";
import DescriptionInput from "../../DescriptionInput";
import VarSelectorSelect from "../WF_VariableAggregator/VarSelectorSelect";
import AddKnowledgeButton from "./AddKnowledgeButton";
import VarOutList from "../../misc/VarOutList";
import CollapseArea from "@/Components/CommonStyles/CollapseArea";
import { KnowledgeFilter } from "@/Pages/ChatbotConfigure/components/Configure/Knowledge/KnowledgeListDialog";
import useGetListFolderKnowledge from "@/Hooks/Knowledges/useGetListFolderKnowledge";

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

  const filters = useMemo(() => {
    return {
      visual_option: KnowledgeFilter.Owned,
      search_input: "",
    };
  }, []);

  const { data: listKnowledgeFolders } = useGetListFolderKnowledge(filters);

  const addedFolders = useMemo(() => {
    if (!listKnowledgeFolders || !nodeData?.knowledge_storage_ids) return [];

    return listKnowledgeFolders.filter((folder) =>
      nodeData?.knowledge_storage_ids?.includes(folder.id)
    );
  }, [listKnowledgeFolders, nodeData?.knowledge_storage_ids]);

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

  const handleRemoveFolder = useCallback(
    (folderId: string) => {
      const newFolders = nodeData?.knowledge_storage_ids.filter(
        (item) => item !== folderId
      );

      handleUpdateNodeDataKnowledge(node?.id, {
        knowledge_storage_ids: newFolders,
      });
    },
    [nodeData?.knowledge_storage_ids, handleUpdateNodeDataKnowledge, node?.id]
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

      <div className="px-3">
        <CollapseArea
          label={
            <CommonStyles.Typography type="semiBold16">
              {t("common.query_variable")}
            </CommonStyles.Typography>
          }
        >
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
        </CollapseArea>

        <hr className="my-2 mx-4 opacity-20" />

        <CollapseArea
          label={
            <CommonStyles.Typography type="semiBold16">
              {capitalize(t("WF_Knowledge.knowledge"))}
            </CommonStyles.Typography>
          }
        >
          <div className="mb-3 flex flex-col gap-2">
            {addedFolders?.map((item) => {
              return (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-2 rounded-lg"
                  style={{
                    background: theme.colors.custom.background,
                    border: `1px solid ${theme.colors.custom.borderColor}`,
                  }}
                >
                  <div className="flex gap-3 items-center">
                    <img
                      src={item.avatar}
                      alt={item.title}
                      className="w-6 h-6 rounded-lg"
                    />
                    <div>
                      <CommonStyles.Typography
                        type="semiBold16"
                        className="truncate max-w-[300px]"
                      >
                        {item.title}
                      </CommonStyles.Typography>
                      <CommonStyles.Typography className="opacity-50">
                        {item.description}
                      </CommonStyles.Typography>
                    </div>
                  </div>
                  <CommonStyles.Button
                    isIcon
                    color="error"
                    hasBorder={false}
                    onClick={() => !!item.id && handleRemoveFolder(item.id)}
                  >
                    <Trash size={16} />
                  </CommonStyles.Button>
                </div>
              );
            })}
          </div>

          <AddKnowledgeButton
            knowledges={nodeData?.knowledge_storage_ids}
            nodeId={node?.id}
          />
        </CollapseArea>

        <hr className="my-2 mx-4 opacity-20" />

        <div className="px-3">
          <VarOutList nodeData={nodeData} />
        </div>
      </div>
    </div>
  );
};

export default KnowledgeNodeDrawer;
