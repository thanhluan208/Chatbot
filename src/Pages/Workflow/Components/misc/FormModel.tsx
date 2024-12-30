import CollapseArea from "@/Components/CommonStyles/CollapseArea";
import { modelOptions } from "@/Constants/options";
import SlideAndNumField from "@/Pages/ChatbotConfigure/components/GenerateDiversity/components/SlideAndNumField";
import { Form, Formik, FormikProps, useFormikContext } from "formik";
import { useEffect, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Memory, Model } from "../CustomNodes/WF_LlmNode/type";
import ModelConfiguration from "./ModelConfiguration";
import ModelStatsConfig from "./ModelStatsConfig";

const FormikEffect = () => {
  const { values, dirty, submitForm } = useFormikContext<any>();
  const debounceRef = useRef<number | null>(null);

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      if (!dirty) return;

      submitForm();
    }, 500);
  }, [values, dirty]);
  return null;
};
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
  const formikRef = useRef<FormikProps<any> | null>(null);

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

  const handleChangeModel = (value: string) => {
    const modelFound = modelOptions.find((elm) => {
      return elm.value === value;
    });

    if (!modelFound) return;

    formikRef.current?.setValues({
      model: modelFound,
      temperature: Number(modelFound.temperature.default),
      top_p: Number(modelFound.top_p?.default),
      history_turn: Number(modelFound.history_turn?.default),
      max_tokens: Number(modelFound.max_tokens?.default),
      frequency_penalty: Number(modelFound.frequency_penalty?.default),
      presence_penalty: Number(modelFound.presence_penalty?.default),
    });
  };

  const handleSubmit = (values: any) => {
    const payload: any = {
      model: {
        name: values.model.value,
        completion_params: {
          temperature: Number(values.temperature),
          top_p: Number(values.top_p),
          history_turn: Number(values.history_turn),
          max_tokens: Number(values.max_tokens),
          frequency_penalty: Number(values.frequency_penalty),
          presence_penalty: Number(values.presence_penalty),
        },
      },
      memory: {
        history_turn: values.memory_history_turn,
      },
    };

    nodeId && handleUpdateNodeData && handleUpdateNodeData(nodeId, payload);
  };

  return (
    <Formik
      initialValues={initialValues}
      enableReinitialize
      onSubmit={handleSubmit}
      formikRef={formikRef}
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
                <FormikEffect />
                <ModelConfiguration afterOnChange={handleChangeModel} />
                <ModelStatsConfig />
              </div>
            </CollapseArea>
            {memory && (
              <CollapseArea
                initOpen={false}
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
