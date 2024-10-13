import botService from "../../Services/bot.service";
import { AxiosResponse } from "axios";
import { useAuth } from "@/Providers/AuthenticationProvider";
import { Mode } from "@/Pages/ChatbotConfigure/components/Develop";
import { useQuery } from "react-query";
import queryKey from "@/Constants/queryKey";

export interface BotResponse {
  status_code: number;
  permission_level: string;
  message: string;
  bot_data: BotData;
}

export interface BotData {
  all_conversation?: string[];
  avatar_url: string;
  user_id: string;
  tools: any[];
  system_prompt: string;
  llm: Llm;
  knowledge_storage_ids: KnowledgeStorage[];
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

export interface KnowledgeStorage {
  knowledge_storage_id: string;
  knowledge_storage_name: string;
  description: string;
  permission_level: string;
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
  bot_id: string;
  info: string;
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
  const { userId } = useAuth();

  const query = useQuery<AxiosResponse<BotResponse>>({
    queryKey: [queryKey.BOT_DATA, payload],
    queryFn: () => {
      return botService.getBotData({
        bot_id: payload.bot_id,
        user_id: userId as string,
      });
    },
    enabled: isTrigger && !!userId,
  });

  return query;
};

export default useGetBotData;
