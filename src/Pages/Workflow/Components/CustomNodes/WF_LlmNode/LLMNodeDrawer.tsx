import CommonStyles from "@/Components/CommonStyles";
import CollapseArea from "@/Components/CommonStyles/CollapseArea";
import EditLabelNode from "@/Components/CommonStyles/EditLabelNode";
import { modelOptions } from "@/Constants/options";
import { useTheme } from "@mui/material";
import { NodeProps, useReactFlow } from "@xyflow/react";
import { Form, Formik } from "formik";
import { Component, X } from "lucide-react";
import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import cachedKeys from "@/Constants/cachedKeys";
import { useSave } from "@/Stores/useStore";
import PromptArea from "./PromptArea";
import SlideAndNumField from "@/Pages/ChatbotConfigure/components/GenerateDiversity/components/SlideAndNumField";
import { LlmNodeData } from "./type";
import useWorkflowMutate from "@/Hooks/workflow/useWorkflowMutate";
import { toast } from "react-toastify";
import { useAuth } from "@/Providers/AuthenticationProvider";
import ModelConfiguration from "./ModelConfiguration";
import DescriptionInput from "../../DescriptionInput";
import ModelStatsConfig from "./ModelStatsConfig";

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

  const initialValues = useMemo(() => {
    const foundModel = modelOptions.find((elm) => {
      return elm.value === nodeData?.model?.name;
    });
    return {
      model: foundModel ?? modelOptions[0],
      temperature: nodeData?.model?.completion_params?.temperature ?? 1.21,
      top_p: nodeData?.model?.completion_params?.top_p ?? 0.9,
      history_turn: nodeData?.model?.completion_params?.history_turn ?? 3,
      max_tokens: nodeData?.model?.completion_params?.max_tokens ?? 2048,
      frequency_penalty:
        nodeData?.model?.completion_params?.frequency_penalty ?? 0,
      presence_penalty:
        nodeData?.model?.completion_params?.presence_penalty ?? 0,
      memory_history_turn: nodeData?.memory?.history_turn ?? 3,
    };
  }, [nodeData]);

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

  const handleChangeModel = useCallback(
    (value: string) => {
      const modelFound = modelOptions.find((elm) => elm.value === value);
      if (!modelFound) return;
      const payload: Partial<LlmNodeData> = {
        model: {
          ...nodeData?.model,
          name: modelFound.value,
          completion_params: {
            temperature: Number(modelFound.temperature.default),
            top_p: Number(modelFound.top_p?.default),
            history_turn: Number(modelFound.history_turn?.default),
            max_tokens: Number(modelFound.max_tokens?.default),
            frequency_penalty: Number(modelFound.frequency_penalty?.default),
            presence_penalty: Number(modelFound.presence_penalty?.default),
          },
        },
      };

      handleUpdateNodeDataLLM(id, nodeData, payload);
    },
    [nodeData?.model]
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

      <div className="px-6">
        <Formik
          initialValues={initialValues}
          enableReinitialize
          onSubmit={() => {}}
        >
          {() => {
            return (
              <Form>
                <CollapseArea
                  nodeId={id}
                  initOpen={false}
                  label={t("WF_Startnode.model_configuration")}
                >
                  <div className="px-2 flex gap-2">
                    <ModelConfiguration afterOnChange={handleChangeModel} />
                    <ModelStatsConfig />
                  </div>
                </CollapseArea>
                <CollapseArea
                  nodeId={id}
                  label={t("WF_Startnode.memory_configuration")}
                >
                  <div className="px-2">
                    <SlideAndNumField
                      title="Window Size"
                      min={0}
                      max={20}
                      step={1}
                      name="memory_history_turn"
                    />
                  </div>
                </CollapseArea>
              </Form>
            );
          }}
        </Formik>

        <CollapseArea label={t("WF_Startnode.prompt_configuration")}>
          <PromptArea node={node} handleUpdate={handleUpdate} />
        </CollapseArea>
      </div>
    </div>
  );
};

export default LLMNodeDrawer;
