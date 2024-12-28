import { ModelOption, modelOptions } from "@/Constants/options";
import { BotData } from "@/Hooks/Bot/useGetBotData";
import useUpdateBotData from "@/Hooks/Bot/useUpdateBotData";
import ModelConfiguration from "@/Pages/Workflow/Components/misc/ModelConfiguration";
import ModelStatsConfig from "@/Pages/Workflow/Components/misc/ModelStatsConfig";
import { useGet } from "@/Stores/useStore";
import { Form, Formik, FormikProps } from "formik";
import { Fragment, useMemo, useRef } from "react";
import FormikEffect from "./FormikEffect";

export interface initialValueEngine {
  model: ModelOption;
  generationDiversity: string;
  temperature: number;
  top_p: number;
  max_tokens: number;
  frequency_penalty: number;
  presence_penalty: number;
}

const EngineButton = () => {
  //! State
  const botData: BotData = useGet("BOT_DATA");
  const formikRef = useRef<FormikProps<initialValueEngine> | null>(null);

  const { mutate, isLoading } = useUpdateBotData();

  const initialValue: initialValueEngine = useMemo(() => {
    const foundModel = modelOptions.find((elm) => {
      return elm.value === botData?.llm?.model;
    });

    return {
      model: foundModel ?? modelOptions[5],
      generationDiversity: "precise",
      temperature: botData?.llm?.temperature ?? 1.21,
      top_p: botData?.llm?.top_p ?? 0.9,
      max_tokens: botData?.llm?.max_tokens ?? 2048,
      frequency_penalty: botData?.llm?.frequency_penalty ?? 0,
      presence_penalty: botData?.llm?.presence_penalty ?? 0,
    };
  }, [botData]);

  const handleSubmit = async (values: initialValueEngine) => {
    if (isLoading) return;
    mutate(values);
  };

  //! Function
  const handleChangeModel = (value: string) => {
    const foundModel = modelOptions.find((elm) => {
      return elm.value === value;
    });

    formikRef.current?.setFieldValue("model", foundModel);
  };

  //! Render
  return (
    <Fragment>
      <Formik
        initialValues={initialValue}
        onSubmit={handleSubmit}
        enableReinitialize
        innerRef={formikRef}
      >
        {() => {
          return (
            <Form>
              <div className="px-2 flex gap-2">
                <FormikEffect />
                <ModelConfiguration afterOnChange={handleChangeModel} />
                <ModelStatsConfig />
              </div>
            </Form>
          );
        }}
      </Formik>
    </Fragment>
  );
};

export default EngineButton;
