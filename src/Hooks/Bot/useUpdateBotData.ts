import { updateBotParams } from "@/Constants/api";
import queryKey from "@/Constants/queryKey";
import { initialValueEngine } from "@/Pages/ChatbotConfigure/components/EngineButton";
import { useAuth } from "@/Providers/AuthenticationProvider";
import httpServices from "@/Services/httpServices";
import { useRef } from "react";
import { useMutation, useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

const useUpdateBotData = () => {
  const toastId = useRef<string | null>(null);
  const queryClient = useQueryClient();
  const { userId } = useAuth();
  const { botId } = useParams();

  const mutation = useMutation(
    async (values: initialValueEngine) => {
      console.log("values", values);
      if (!userId || !botId) return;
      toastId.current = toast.loading(`Processing...`, {
        isLoading: true,
        autoClose: 3000,
      }) as string;

      const payload: any = {
        user_id: userId,
        bot_id: botId,
        llm_name: values.model.value,
        model_params: {
          temperature:
            values?.temperature ?? values?.model?.temperature.default,
          top_p: values?.top_p ?? values.model.top_p?.default ?? 1,
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

      return await httpServices.post(updateBotParams, payload);
    },
    {
      onSuccess: (response) => {
        if (!response) return;
        toastId.current &&
          toast.update(toastId.current, {
            render: response?.data?.message ?? "Bot data updated successfully",
            type: response.data.status_code === 200 ? "success" : "error",
            isLoading: false,
            autoClose: 2000,
          });
        if (response.data.status_code === 200) {
          queryClient.refetchQueries(queryKey.BOT_DATA);
        }
      },
      onError: () => {
        toastId.current &&
          toast.update(toastId.current, {
            render: "Bot data update failed",
            type: "error",
            isLoading: false,
            autoClose: 2000,
          });
      },
    }
  );

  return mutation;
};

export default useUpdateBotData;
