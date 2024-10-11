import CommonStyles from "@/Components/CommonStyles";
import CollapseArea from "@/Components/CommonStyles/CollapseArea";
import { updateNodeLLM, updateScenario, updateSystemPrompt } from "@/Constants/api";
import { modelOptions } from "@/Constants/options";
import httpServices from "@/Services/httpServices";
import { FastField, Form, Formik } from "formik";
import React, { useCallback, useMemo, useRef } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import EngineSelect from "../../LLMNode/SingleTab/EngineSelect";
import GenerationDiversity from "@/Pages/ChatbotConfigure/components/GenerationDiversity";
import Advance from "@/Pages/ChatbotConfigure/components/GenerateDiversity/components/Advance";
import InputAndOutputSettings from "@/Pages/ChatbotConfigure/components/InputAndOutputSettings";
import { Box } from "@mui/material";
import CommonIcons from "@/Components/CommonIcons";
import CommonField from "@/Components/CommonFields";

interface NodeFormProps {
  data: {
    [key: string]: unknown;
  };
  nodeId: string;
}

const NodeForm = ({ data, nodeId }: NodeFormProps) => {
  //! State
  const timeoutRef = useRef<any>(null);
  const params = useParams();

  const botId = params?.botId;

  const initialValue = useMemo(() => {
    const botData: any = {
      llm: data.llm,
      scenario: data.scenario,
      system_prompt: data.system_prompt,
    };

    const foundModel = modelOptions.find((elm) => {
      return elm.value === botData?.llm?.model;
    });
    return {
      scenario: botData?.scenario ?? "",
      system_prompt: botData?.system_prompt ?? "",
      model: foundModel ?? modelOptions[0],
      generationDiversity: "precise",
      temperature: botData?.llm?.temperature ?? 1.21,
      top_p: botData?.llm?.top_p ?? 0.9,
      history_turn: botData?.llm?.history_turn ?? 3,
      max_tokens: botData?.llm?.max_tokens ?? 2048,
      frequency_penalty: botData?.llm?.frequency_penalty ?? 0,
      presence_penalty: botData?.llm?.presence_penalty ?? 0,
    };
  }, [data]);

  //! Function
  const afterOnChangePrompt = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        httpServices
          .post(updateSystemPrompt, {
            bot_id: botId,
            node_id: nodeId,
            system_prompt: event.target.value,
          })
          .catch((err) => {
            console.log("err", err);
            toast.error("Failed to update system prompt");
          });
      }, 500);
    },
    [botId, nodeId]
  );

  const afterOnChangeScenario = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        httpServices
          .post(updateScenario, {
            bot_id: botId,
            node_id: nodeId,
            scenario: event.target.value,
          })
          .catch((err) => {
            console.log("err", err);
            toast.error("Failed to update system prompt");
          });
      }, 500);
    },
    [botId, nodeId]
  );

  const handleSubmit = useCallback(async (values: any) => {
    const toastId = toast.loading(`Saving agent ${nodeId}...`, {
      isLoading: true,
      autoClose: false,
    });

    try {
      const response = await httpServices.post(updateNodeLLM, {
        bot_id: botId,
        node_id: nodeId,
        llm_name: values.model.value,
        model_params: {
          temperature: values.temperature ?? 1.21,
          top_p: values.top_p ?? 0.9,
          history_turn: values.history_turn ?? 3,
          max_tokens: values.max_tokens ?? 2048,
          frequency_penalty: values.frequency_penalty ?? 0,
          presence_penalty: values.presence_penalty ?? 0,
        },
      });

      if (response?.data?.status_code === 200) {
        toast.update(toastId, {
          isLoading: false,
          render: "Agent saved successfully!",
          type: toast.TYPE.SUCCESS,
          autoClose: 2000,
        });
      } else {
        toast.update(toastId, {
          isLoading: false,
          render: "Failed to save agent!",
          type: toast.TYPE.ERROR,
          autoClose: 2000,
        });
      }
    } catch (error) {
      console.log("error", error);
      toast.update(toastId, {
        isLoading: false,
        render: "Failed to save agent!",
        type: toast.TYPE.ERROR,
        autoClose: 2000,
      });
    }
  }, []);

  //! Render
  return (
    <Formik initialValues={initialValue} onSubmit={handleSubmit}>
      {({ isSubmitting }) => {
        return (
          <Form>
            <CollapseArea
              nodeId={nodeId}
              dataKey="modelConfiguration"
              initOpen={!!data?.currentNode}
              key={data?.currentNode + nodeId + "modelConfiguration"}
              label={
                <CommonStyles.Typography type="semiBold14">
                  Model Configuration
                </CommonStyles.Typography>
              }
            >
              <EngineSelect name="model" />
              <GenerationDiversity />
              <Advance />
              <InputAndOutputSettings />
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  marginTop: "20px",
                }}
              >
                <CommonStyles.Button
                  variant="contained"
                  type="submit"
                  startIcon={<CommonIcons.Save />}
                  disabled={isSubmitting}
                >
                  Save
                </CommonStyles.Button>
              </Box>
            </CollapseArea>

            <CollapseArea
              nodeId={nodeId}
              dataKey="scenario"
              initOpen={!!data?.currentNode}
              key={data?.currentNode + nodeId + "scenario"}
              label={
                <CommonStyles.Typography type="semiBold14">
                  Scenario{" "}
                  <span
                    style={{
                      color: "#FF0000",
                    }}
                  >
                    *
                  </span>
                </CommonStyles.Typography>
              }
            >
              <FastField
                name="scenario"
                component={CommonField.InputField}
                multiline
                minRows={3}
                maxRows={3}
                fullWidth
                maxChar={6000}
                afterOnChange={afterOnChangeScenario}
              />
            </CollapseArea>

            <CollapseArea
              nodeId={nodeId}
              dataKey="agentPrompt"
              initOpen={
                !!data?.currentNode || !!data?.agentPrompt
              }
              key={data?.currentNode + nodeId + "agentPrompt"}
              label={
                <CommonStyles.Typography type="semiBold14">
                  Agent prompt
                  <span
                    style={{
                      color: "#FF0000",
                    }}
                  >
                    *
                  </span>
                </CommonStyles.Typography>
              }
            >
              <FastField
                name="system_prompt"
                component={CommonField.InputField}
                multiline
                minRows={3}
                maxRows={3}
                fullWidth
                maxChar={6000}
                afterOnChange={afterOnChangePrompt}
              />
            </CollapseArea>
          </Form>
        );
      }}
    </Formik>
  );
};

export default NodeForm;
