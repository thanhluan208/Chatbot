import CommonStyles from "@/Components/CommonStyles";
import CollapseArea from "@/Components/CommonStyles/CollapseArea";
import EditLabelNode from "@/Components/CommonStyles/EditLabelNode";
import { useTheme } from "@mui/material";
import { NodeProps, useReactFlow } from "@xyflow/react";
import { Component, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import cachedKeys from "@/Constants/cachedKeys";
import { useSave } from "@/Stores/useStore";
import PromptArea from "./PromptArea";
import { LlmNodeData } from "./type";
import useWorkflowMutate from "@/Hooks/workflow/useWorkflowMutate";
import { toast } from "react-toastify";
import { useAuth } from "@/Providers/AuthenticationProvider";
import DescriptionInput from "../../DescriptionInput";
import FormModel from "../../misc/FormModel";
import VarOutList from "../../misc/VarOutList";

interface LLMNodeDrawerProps {
  node?: NodeProps;
}
const LLMNodeDrawer = ({ node }: LLMNodeDrawerProps) => {
  const theme = useTheme();
  const { workflowId } = useParams();
  const save = useSave();
  const { userId } = useAuth();
  const { t } = useTranslation("node");
  const { updateNode } = useReactFlow();
  const { handleUpdateNodeData, handleUpdateNodeDataLLM } = useWorkflowMutate();

  if (!node) return null;

  const { data, id } = node;

  const nodeData = node?.data as unknown as LlmNodeData;

  const handleUpdate = (
    payload: Partial<LlmNodeData>,
    onSuccess?: () => void,
    onFailed?: () => void
  ) => {
    if (!workflowId || !userId) return;

    const updatePayload = {
      name: id,
      desc: nodeData.desc,
      memory: nodeData.memory,
      position: nodeData.position,
      prompt_template: nodeData.prompt_template,
      model: nodeData.model,
      ...payload,
    };

    handleUpdateNodeData.mutate(
      {
        workflow_id: workflowId,
        user_id: userId,
        node_id: id,
        node_data: updatePayload,
      },
      {
        onSuccess: (response) => {
          if (response?.status_code !== 200) {
            toast.error(response?.message);
            onFailed && onFailed();
          }
          updateNode(id, {
            data: {
              ...data,
              ...updatePayload,
            },
          });
          onSuccess && onSuccess();
        },
        onError: () => {
          onFailed && onFailed();
        },
      }
    );
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
              <Component className="w-3.5 h-3.5" color="#fff" />
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
        <FormModel
          handleUpdateNodeData={handleUpdateNodeDataLLM}
          model={nodeData?.model}
          nodeId={node?.id}
          memory={nodeData?.memory}
        />

        <hr className="my-2 mx-4 opacity-20" />

        <CollapseArea label={t("WF_Startnode.prompt_configuration")}>
          <PromptArea node={node} handleUpdate={handleUpdate} />
        </CollapseArea>

        <hr className="my-2 mx-4 opacity-20" />

        <div className="px-3">
          <VarOutList nodeData={nodeData} />
        </div>
      </div>
    </div>
  );
};

export default LLMNodeDrawer;
