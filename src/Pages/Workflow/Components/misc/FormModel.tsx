import CollapseArea from "@/Components/CommonStyles/CollapseArea";
import { Form, Formik } from "formik";
import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import ModelConfiguration from "./ModelConfiguration";
import ModelStatsConfig from "./ModelStatsConfig";
import { Memory, Model } from "../CustomNodes/WF_LlmNode/type";
import SlideAndNumField from "@/Pages/ChatbotConfigure/components/GenerateDiversity/components/SlideAndNumField";
import { modelOptions } from "@/Constants/options";

interface FormModelProps {
  nodeId: string;
  model: Model;
  handleUpdateNodeData: (nodeId: string, payload: any) => void;
  memory?: Memory;
}

const FormModel = ({
  nodeId,
  model,
  handleUpdateNodeData,
  memory,
}: FormModelProps) => {
  const { t } = useTranslation("node");

  const initialValues = useMemo(() => {
    const foundModel = modelOptions.find((elm) => {
      return elm.value === model?.name;
    });
    return {
      model: foundModel ?? modelOptions[0],
      temperature: model?.completion_params?.temperature ?? 1.21,
      top_p: model?.completion_params?.top_p ?? 0.9,
      history_turn: model?.completion_params?.history_turn ?? 3,
      max_tokens: model?.completion_params?.max_tokens ?? 2048,
      frequency_penalty: model?.completion_params?.frequency_penalty ?? 0,
      presence_penalty: model?.completion_params?.presence_penalty ?? 0,
      memory_history_turn: memory?.history_turn ?? 3,
    };
  }, [model, memory]);

  const handleChangeModel = useCallback(
    (value: string) => {
      const modelFound = modelOptions.find((elm) => elm.value === value);
      if (!modelFound) return;
      const payload: any = {
        model: {
          ...model,
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

      handleUpdateNodeData(nodeId, payload);
    },
    [model]
  );

  return (
    <Formik
      initialValues={initialValues}
      enableReinitialize
      onSubmit={() => {}}
    >
      {() => {
        return (
          <Form>
            <CollapseArea
              nodeId={nodeId}
              initOpen={true}
              label={t("WF_Startnode.model_configuration")}
            >
              <div className="px-2 flex gap-2">
                <ModelConfiguration afterOnChange={handleChangeModel} />
                <ModelStatsConfig nodeId={nodeId} handleUpdateNodeData={handleUpdateNodeData}/>
              </div>
            </CollapseArea>
            {memory && (
              <CollapseArea
                nodeId={nodeId}
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
            )}
          </Form>
        );
      }}
    </Formik>
  );
};

export default FormModel;
