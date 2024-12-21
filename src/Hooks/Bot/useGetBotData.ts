import botService from "../../Services/bot.service";
import { AxiosResponse } from "axios";
import { useAuth } from "@/Providers/AuthenticationProvider";
import { useQuery } from "react-query";
import queryKey from "@/Constants/queryKey";

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
  knowledge_storage_ids: KnowledgeStorageID[];
  mode: string;
  history_turn: number;
  bot_name: string;
  description: string;
  user_name: string;
  number_of_turn_chats: number;
  stars: number;
  visibility: string;
  has_multi_agent: boolean;
  all_conversation: string[];
  avatar_url: string;
  background_url: string;
  flow_nodes: FlowNodes;
  nodes: Record<string, Node>;
}

export interface FlowNodes {
  current_node: string;
  start_node: string;
  nodes: Record<string, Node>;
  edges: Edge[];
}

export interface KnowledgeStorageID {
  knowledge_storage_id: string;
  knowledge_storage_name: string;
  description: string;
  permission_level: string;
}

export interface Edge {
  src_node: string;
  dest_node: string;
}
export interface Node {
  class_name: string;
  metadata: Metadata;
  node_id: string;
  info: string;
  bot_id: string;
  scenario: string;
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
  credits: number;
}

export interface AdditionalKwargs {
  history_turn: HistoryTurn;
  rate_limit: RateLimit;
  user_id: string;
  force_update_user_credit: boolean;
}

export interface HistoryTurn {
  default: number;
  min: number;
  max: number;
}

export interface RateLimit {
  free: Free;
  standard: Free;
}

export interface Free {
  cost: Cost;
  rpm: number;
  rpd: number;
  tpm: number;
  accepted_exceed: AcceptedExceed;
}

export interface AcceptedExceed {
  rpm: number;
  rpd: number;
  tpm: number;
}

export interface Cost {
  credits: number;
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
  credits: number;
}

export interface AdditionalKwargs {
  history_turn: HistoryTurn;
  rate_limit: RateLimit;
  user_id: string;
  force_update_user_credit: boolean;
}

export interface HistoryTurn {
  default: number;
  min: number;
  max: number;
}

export interface RateLimit {
  free: Free;
  standard: Free;
}

export interface Free {
  cost: Cost;
  rpm: number;
  rpd: number;
  tpm: number;
  accepted_exceed: AcceptedExceed;
}

export interface AcceptedExceed {
  rpm: number;
  rpd: number;
  tpm: number;
}

export interface Cost {
  credits: number;
}

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
