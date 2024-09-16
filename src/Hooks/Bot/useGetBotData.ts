import { useCallback, useEffect, useState } from "react";
import botService from "../../Services/bot.service";
import { AxiosResponse } from "axios";
import { useAuth } from "@/Providers/AuthenticationProvider";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Mode } from "@/Pages/ChatbotConfigure/components/Develop";

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
  mode: Mode;
  bot_name: string;
  description: string;
  user_name: string;
  permission_level: string;
  visibility: string;
  has_multi_agent: boolean;
  nodes?: {
    [key: string]: NodeData;
  };
  flow_nodes: Flow;
}

export interface Flow {
  nodes: string[];
  edges: any[];
  start_node: string;
  current_node: string;
  scenario: string;
}

export interface NodeData {
  class_name: string;
  metadata: Metadata;
  node_id: string;
  knowledge_storage_ids: any[];
  bot_id: string,
  info: string
}

export interface Metadata {
  user_id: string;
  tools: any[];
  system_prompt: string;
  llm: Llm;
  knowledge_storage_ids: any[];
}

export interface Llm {
  class_name: string;
  model: string;
  temperature: number;
  max_tokens: number;
  additional_kwargs: AdditionalKwargs;
  top_p: number;
  frequency_penalty: number;
  presence_penalty: number;
}

export interface AdditionalKwargs {}

export interface The70C273785020429095A7B6C205Ad597A {
  class_name: string;
  metadata: Metadata;
  node_id: string;
  knowledge_storage_ids: any[];
}

export interface Metadata {
  user_id: string;
  tools: any[];
  system_prompt: string;
  llm: Llm;
  knowledge_storage_ids: any[];
}

export interface Llm {
  class_name: string;
  model: string;
  temperature: number;
  max_tokens: number;
  additional_kwargs: AdditionalKwargs;
  top_p: number;
  frequency_penalty: number;
  presence_penalty: number;
}

export interface AdditionalKwargs {}

export interface Llm {
  class_name: string;
  model: string;
  temperature: number;
  max_tokens: number;
  additional_kwargs: AdditionalKwargs;
  history_turn: number;
  top_p: number;
  frequency_penalty: number;
  presence_penalty: number;
}

export interface AdditionalKwargs {}

export interface AdditionalKwargs {}

const useGetBotData = (
  payload: {
    bot_id: string;
    user_id?: string;
  },
  isTrigger = true
) => {
  const [data, setData] = useState<BotData | null>(null);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<string>();
  const { userId } = useAuth();
  const navigate = useNavigate();

  const callApi = useCallback(() => {
    if (!payload.bot_id || !userId) return;

    return botService.getBotData({
      bot_id: payload.bot_id,
      user_id: userId as string,
    });
  }, [payload, userId]);

  const transformResponse = useCallback(
    (response?: AxiosResponse<BotResponse>) => {
      if (response?.data.permission_level === "no permission") {
        toast.error(
          response.data.message ?? "No permission to access this bot"
        );
        setError(response.data.message ?? "No permission to access this bot");

        navigate(-1);
        return;
      }
      if (response) {
        setData({
          ...response.data.bot_data,
          permission_level: response.data.permission_level,
        });
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
          toast.error("Failed to retrieve bot data. Please try again later");
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
