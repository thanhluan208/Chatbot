import { StartNodeInputType } from "@/Types/workflow";

export interface NodeDataParamExtractor {
  name?: string;
  type: string;
  title: string;
  desc: string;
  iteration_id?: string;
  position: string;
  model: Model;
  prompt_template: string;
  outputs_instruction: string;
  outputs: Outputs;
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

export interface Outputs {
  [key: string]: {
    type: StartNodeInputType;
    desc: string;
  };
}

export interface Output {
  id: string,
  type: StartNodeInputType;
  desc: string;
  name: string;
}
