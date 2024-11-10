import CommonStyles from "@/Components/CommonStyles";
import CollapseArea from "@/Components/CommonStyles/CollapseArea";
import EditLabelNode from "@/Components/CommonStyles/EditLabelNode";
import { modelOptions } from "@/Constants/options";
import { useTheme } from "@mui/material";
import { NodeProps } from "@xyflow/react";
import { Form, Formik, FormikHelpers } from "formik";
import { Component, X } from "lucide-react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import EngineSelect from "../LLMNode/SingleTab/EngineSelect";
import Advance from "@/Pages/ChatbotConfigure/components/GenerateDiversity/components/Advance";
import InputAndOutputSettings from "@/Pages/ChatbotConfigure/components/InputAndOutputSettings";
import CommonIcons from "@/Components/CommonIcons";
import cachedKeys from "@/Constants/cachedKeys";
import { useSave } from "@/Stores/useStore";
import PromptArea from "./PromptArea";
import SlideAndNumField from "@/Pages/ChatbotConfigure/components/GenerateDiversity/components/SlideAndNumField";
import { LlmNodeData } from "./type";
import useWorkflowMutate from "@/Hooks/workflow/useWorkflowMutate";
import { toast } from "react-toastify";
import { useAuth } from "@/Providers/AuthenticationProvider";

interface LLMNodeDrawerProps {
  node?: NodeProps;
}
const LLMNodeDrawer = ({ node }: LLMNodeDrawerProps) => {
  const theme = useTheme();
  const { workflowId } = useParams();
  const save = useSave();
  const { userId } = useAuth();
  const { t } = useTranslation("node");
  const { handleUpdateNodeData } = useWorkflowMutate();

  if (!node) return null;

  const { data, positionAbsoluteX, positionAbsoluteY, id } = node;

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

  const handleSubmit = (
    values: any,
    { setSubmitting, resetForm }: FormikHelpers<any>
  ) => {
    if (!workflowId || !userId) return;
    setSubmitting(true);
    const payload = {
      ...nodeData,
      model: {
        ...nodeData.model,
        name: values.model.value,
        completion_params: {
          temperature: values.temperature,
          top_p: values.top_p,
          history_turn: values.history_turn,
          max_tokens: values.max_tokens,
          frequency_penalty: values.frequency_penalty,
          presence_penalty: values.presence_penalty,
        },
      },
    };

    handleUpdateNodeData.mutate(
      {
        workflow_id: workflowId,
        user_id: userId,
        node_id: id,
        node_data: payload,
      },
      {
        onSuccess: (response) => {
          if (response?.status_code !== 200) {
            toast.error(response?.message);
            resetForm();
          }
          setSubmitting(false);
        },
        onError: () => {
          resetForm();
          setSubmitting(false);
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
      <div className="flex justify-between items-end sticky top-0 px-6 py-4 z-50 backdrop-blur-3xl">
        <div className="flex items-center gap-2 ">
          <div
            className="w-6 h-6 flex items-center justify-center rounded-md"
            style={{
              background: theme.palette.primary.main,
            }}
          >
            <Component className="w-3.5 h-3.5" color="#fff" />
          </div>
          <EditLabelNode
            data={data}
            nodeId={node.id}
            positionAbsoluteX={positionAbsoluteX}
            positionAbsoluteY={positionAbsoluteY}
            workflowId={workflowId}
          />
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

      <div className="px-6">
        <Formik
          initialValues={initialValues}
          enableReinitialize
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => {
            return (
              <Form>
                <CollapseArea
                  nodeId={id}
                  initOpen={false}
                  label={
                    <CommonStyles.Typography type="semiBold14">
                      {t("WF_Startnode.model_configuration")}
                    </CommonStyles.Typography>
                  }
                >
                  <div className="px-2">
                    <EngineSelect name="model" />
                    <Advance />
                    <InputAndOutputSettings />
                  </div>
                  <div className="flex justify-end mt-5">
                    <CommonStyles.Button
                      variant="contained"
                      type="submit"
                      startIcon={<CommonIcons.Save />}
                      disabled={isSubmitting}
                    >
                      Save
                    </CommonStyles.Button>
                  </div>
                </CollapseArea>
                <CollapseArea
                  nodeId={id}
                  label={
                    <CommonStyles.Typography type="semiBold14">
                      {t("WF_Startnode.memory_configuration")}
                    </CommonStyles.Typography>
                  }
                  sxContainer={{px: 2}}
                >
                  <SlideAndNumField
                    title="Window Size"
                    min={0}
                    max={20}
                    step={1}
                    name="memory_history_turn"
                  />
                </CollapseArea>
              </Form>
            );
          }}
        </Formik>

        <CollapseArea
          label={
            <CommonStyles.Typography type="semiBol16">
              {t("WF_Startnode.prompt_configuration")}
            </CommonStyles.Typography>
          }
        >
          <PromptArea node={node} />
        </CollapseArea>
      </div>
    </div>
  );
};

export default LLMNodeDrawer;
