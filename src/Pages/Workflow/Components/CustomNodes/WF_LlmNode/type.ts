export enum PromptType {
  SYSTEM = "SYSTEM",
  USER = "USER",
  ASSISTANT = "ASSISTANT",
  MEMORY = "MEMORY",
}

export interface LlmNodeData {
  name?: string;
  title?: string;
  type: string;
  desc: string;
  position: string;
  model: Model;
  prompt_template: PromptTemplate[];
  memory: Memory;
  vision: Vision;
  iteration_id: null;
  variable_out: VariableOut[];
}
export interface VariableOut {
  type: string;
  variable: string;
}

export interface Memory {
  history_turn: number;
  conversation_id: string;
  position_index_in_chat_messages: number;
}

export interface Model {
  completion_params: CompletionParams;
  name: string;
  provider?: string;
}

export interface CompletionParams {
  max_tokens: number;
  temperature: number;
  top_p: number;
  frequency_penalty: number;
  presence_penalty: number;
  history_turn?: number;
}

export interface PromptTemplate {
  id: string;
  role: string;
  text: string;
}

export interface Vision {
  configs: Configs;
  enabled: boolean;
}

export interface Configs {
  detail: string;
}

export enum PromptRoleEnum {
  SYSTEM = "system",
  USER = "user",
  ASSISTANT = "assistant",
  Memory = "memory",
}

export interface ModelOption {
  name: string;
  history_turn: FrequencyPenalty;
  max_tokens: FrequencyPenalty;
  temperature: FrequencyPenalty;
  top_p: FrequencyPenalty;
  frequency_penalty: FrequencyPenalty;
  presence_penalty: FrequencyPenalty;
  img: string;
  label: string;
  value: string;
  group: string;
}

export interface FrequencyPenalty {
  default: number;
  min: number;
  max: number;
}
