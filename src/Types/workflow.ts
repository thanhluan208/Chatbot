import { CommonResponse } from "./common";

export interface createWorkflowPayload {
  user_id: string;
  workflow_name: string;
  workflow_description: string;
  avatar_file_input?: File | string;
}

export interface CreateWorkflowResponse {
  status_code: number;
  message: string;
  runtime: string;
  workflow_id: string;
  conversation_id: string;
}

export interface deleteWorkflowPayload {
  user_id: string;
  workflow_id: string;
}

export interface addNodeWorkflowPayload {
  user_id: string;
  workflow_id: string;
  position?: {
    x: number;
    y: number;
  };
  from_node_id?: string;
  source_handle?: string;
  node_type: NodeTypeWorkflow;
}

export interface queryWorkflow {
  user_id: string;
  search_filter?: string;
  visual_option?: VisualOption;
}

export interface queryWorkflowDetail {
  user_id: string;
  workflow_id: string;
}

export interface WorkflowDetailResponse extends CommonResponse {
  workflow_data: WorkflowDetail;
}

export interface WorkflowDetail {
  created_at: Date;
  created_by: string;
  features: Features;
  graph: Graph;
  owner_id: string;
  system_variables: SystemVariables;
  updated_at: Date;
  updated_by: string;
  workflow_id: string;
  avatar_url: string;
}

export interface Features {
  opening_statement: null;
  suggested_questions: any[];
  suggested_questions_after_answer: AnnotationReply;
  speech_to_text: AnnotationReply;
  text_to_speech: AnnotationReply;
  retriever_resource: AnnotationReply;
  annotation_reply: AnnotationReply;
  more_like_this: AnnotationReply;
  sensitive_word_avoidance: SensitiveWordAvoidance;
  system_parameters: SystemParameters;
}

export interface AnnotationReply {
  enabled: boolean;
}

export interface SensitiveWordAvoidance {
  enabled: boolean;
  type: string;
  configs: any[];
}

export interface SystemParameters {}

export interface Graph {
  nodes: Nodes;
  edges: SystemParameters;
}

export interface Nodes {
  start: End;
  end: End;
}

export interface End {
  data: Data;
  variables_out: VariablesOut[];
  id: string;
}

export interface Data {
  title: string;
  desc: string;
  position: string;
  type: string;
  outputs?: Output[];
  variables?: Variable[];
}

export interface Output {
  variable: string;
  value_selector: any[];
  save_to_memory: boolean;
}

export interface Variable {
  variable: string;
  label: string;
  description: string;
  type: string;
  required: boolean;
  max_length: number;
  options: null;
  detault: null;
  hint: null;
}

export interface VariablesOut {
  variable: string;
  type: string;
}

export interface SystemVariables {
  conversation_id: string;
  user_id: string;
}

export interface WorkflowResponse extends CommonResponse {
  list_workflows: Workflow[];
}

export interface Workflow {
  workflow_id: string;
  workflow_name: string;
  description: string;
  owner_id: string;
  created_at: Date;
  user_name: string;
  permission_level: string;
  visibility: string;
  avatar_url: string;
}

export enum VisualOption {
  PUBLIC = "public",
  SHARED = "shared",
  OWNED = "owned",
}

export enum NodeTypeWorkflow {
  START = "start",
  END = "end",
  ANSWER = "answer",
  LONG_TERM_MEMORY = "long-term-memory",
  LLM = "llm",
  KNOWLEDGE_RETRIEVAL = "knowledge-retrieval",
  IF_ELSE = "if-else",
  CODE = "code",
  TEMPLATE_TRANSFORM = "template-transform",
  QUESTION_CLASSIFIER = "question-classifier",
  HTTP_REQUEST = "http-request",
  TOOL = "tool",
  VARIABLE_AGGREGATOR = "variable-aggregator",
  VARIABLE_ASSIGNER = "variable-assigner",
  LOOP = "loop",
  ITERATION = "iteration",
  ITERATION_START = "iteration-start",
  PARAMETER_EXTRACTOR = "parameter-extractor",
  CONVERSATION_VARIABLE_ASSIGNER = "assigner",
}
