export interface NodeDataQuestClassifier {
  name?: string;
  type: string;
  title: string;
  desc: string;
  iteration_id?: string;
  position: string;
  query_variable_selector: string[];
  model: Model;
  memory: Memory;
  classes: Class[];
  instruction: string;
}

export interface Class {
  id: string;
  name: string;
}

export interface Memory {
  history_turn: number;
  conversation_id: string;
}

export interface Model {
  completion_params: CompletionParams;
  name: string;
  provider: string;
}

export interface CompletionParams {
  max_tokens: number;
  temperature: number;
  top_p: number;
  frequency_penalty: number;
  presence_penalty: number;
}
