import { useCallback, useEffect, useState } from "react";
import botService from "../../Services/bot.service";
import { AxiosResponse } from "axios";

export interface BotResponse {
  status_code: number;
  permission_level: string;
  message: string;
  bot_data: BotData;
}

export interface BotData {
  user_id: string;
  tools: any[];
  system_prompt: string;
  llm: Llm;
  knowledge_storage_ids: any[];
  mode: string;
  bot_name: string;
  description: string;
  user_name: string;
}

export interface Llm {
  class_name: string;
  model: string;
  temperature: number;
  max_tokens: null;
  additional_kwargs: AdditionalKwargs;
}

export interface AdditionalKwargs {}

const useGetBotData = (
  payload: {
    bot_id: string;
    user_id: string;
  },
  isTrigger = true
) => {
  const [data, setData] = useState<BotData | null>(null);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState();

  const callApi = useCallback(() => {
    if (!payload) return;
    return botService.getBotData(payload);
  }, [payload]);

  const transformResponse = useCallback(
    (response?: AxiosResponse<BotResponse>) => {
      if (response) {
        setData(response.data.bot_data);
      }
    },
    []
  );

  const refetch = useCallback(async () => {
    try {
      const response = await callApi();
      transformResponse(response);
    } catch (error: any) {
      setError(error);
    }
  }, []);

  useEffect(() => {
    let shouldSetData = true;

    if (isTrigger) {
      (async () => {
        try {
          setLoading(true);
          const response = await callApi();

          if (shouldSetData) {
            transformResponse(response);
          }
        } catch (error: any) {
          setError(error);
        } finally {
          setLoading(false);
        }
      })();

      return () => {
        shouldSetData = false;
      };
    }
  }, [isTrigger]);

  return {
    data,
    isLoading,
    error,
    refetch,
  };
};

export default useGetBotData;
