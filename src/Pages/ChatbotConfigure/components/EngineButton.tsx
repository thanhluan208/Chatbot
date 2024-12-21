import { updateBotParams } from "@/Constants/api";
import { ModelOption, modelOptions } from "@/Constants/options";
import { BotData } from "@/Hooks/Bot/useGetBotData";
import ModelConfiguration from "@/Pages/Workflow/Components/misc/ModelConfiguration";
import ModelStatsConfig from "@/Pages/Workflow/Components/misc/ModelStatsConfig";
import { useAuth } from "@/Providers/AuthenticationProvider";
import httpServices from "@/Services/httpServices";
import { useGet } from "@/Stores/useStore";
import { Form, Formik, FormikHelpers } from "formik";
import { Fragment, useMemo } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

export interface initialValueEngine {
  model: ModelOption;
  generationDiversity: string;
  temperature: number;
  top_p: number;
  history_turn: number;
  max_tokens: number;
  outputFormat: string;
  frequency_penalty: number;
  presence_penalty: number;
}

const EngineButton = () => {
  //! State
  const params = useParams();
  const { userId } = useAuth();
  const botData: BotData = useGet("BOT_DATA");
  const refetchBotData = useGet("REFETCH_BOT_DATA");

  const initialValue: initialValueEngine = useMemo(() => {
    const foundModel = modelOptions.find((elm) => {
      return elm.value === botData?.llm?.model;
    });
    return {
      model: foundModel ?? modelOptions[5],
      generationDiversity: "precise",
      temperature: botData?.llm?.temperature ?? 1.21,
      top_p: botData?.llm?.top_p ?? 0.9,
      history_turn: 3,
      max_tokens: botData?.llm?.max_tokens ?? 2048,
      frequency_penalty: botData?.llm?.frequency_penalty ?? 0,
      presence_penalty: botData?.llm?.presence_penalty ?? 0,
      outputFormat: "text",
    };
  }, [botData]);

  const handleSubmit = async (
    values: initialValueEngine,
    formikHelper: FormikHelpers<initialValueEngine>
  ) => {
    if (!params?.botId || !userId) return;
    formikHelper.setSubmitting(true);
    const toastId = toast.loading("Saving..., please wait", {
      isLoading: true,
      autoClose: false,
    });

    try {
      const payload: any = {
        user_id: userId,
        bot_id: params.botId,
        llm_name: values.model.value,
        model_params: {
          temperature:
            values?.temperature ?? values?.model?.temperature.default,
          top_p: values?.top_p ?? values.model.top_p?.default ?? 1,
          history_turn:
            values?.history_turn ?? values.model.history_turn.default,
          max_tokens: values?.max_tokens ?? values.model.max_tokens.default,
        },
      };

      if (payload.llm_name.includes("gpt")) {
        payload.model_params = {
          ...payload.model_params,
          frequency_penalty: values?.frequency_penalty ?? 0,
          presence_penalty: values?.presence_penalty ?? 0,
        };
      }

      await httpServices.post(updateBotParams, payload);

      refetchBotData && (await refetchBotData());

      toast.update(toastId, {
        isLoading: false,
        render: "Saved successfully",
        type: toast.TYPE.SUCCESS,
        autoClose: 2000,
      });
      formikHelper.setSubmitting(false);
    } catch (error) {
      console.log("error", error);
      toast.update(toastId, {
        isLoading: false,
        render: "Save failed",
        type: toast.TYPE.ERROR,
        autoClose: 2000,
      });
      formikHelper.setSubmitting(false);
    }
  };

  //! Function

  //! Render
  return (
    <Fragment>
      <Formik initialValues={initialValue} onSubmit={handleSubmit}>
        {() => {
          return (
            <Form>
              <div className="px-2 flex gap-2">
                <ModelConfiguration />
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
