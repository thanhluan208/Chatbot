import { Node } from "@xyflow/react"

export enum VarType {
    string = 'string',
    number = 'number',
    secret = 'secret',
    boolean = 'boolean',
    object = 'object',
    file = 'file',
    array = 'array',
    arrayString = 'array[string]',
    arrayNumber = 'array[number]',
    arrayObject = 'array[object]',
    arrayFile = 'array[file]',
    any = 'any',
  }

export type Var = {
    variable: string
    type: VarType
    children?: Var[] // if type is obj, has the children struct
    isParagraph?: boolean
    isSelect?: boolean
    options?: string[]
    required?: boolean
    des?: string
  }

export type NodeOutPutVar = {
  nodeId: string;
  title: string;
  vars: Var[];
  isStartNode?: boolean;
};

export type WorkflowVariableBlockType = {
  show?: boolean;
  variables?: NodeOutPutVar[];
  workflowNodesMap?: Record<string, Pick<Node["data"], "title" | "type">>;
  onInsert?: () => void;
  onDelete?: () => void;
};

export const FILE_STRUCT: Var[] = [
  {
    variable: 'name',
    type: VarType.string,
  },
  {
    variable: 'size',
    type: VarType.number,
  },
  {
    variable: 'type',
    type: VarType.string,
  },
  {
    variable: 'extension',
    type: VarType.string,
  },
  {
    variable: 'mime_type',
    type: VarType.string,
  },
  {
    variable: 'transfer_method',
    type: VarType.string,
  },
  {
    variable: 'url',
    type: VarType.string,
  },
]

export enum BlockEnum {
  Start = 'start',
  End = 'end',
  Answer = 'answer',
  LLM = 'llm',
  KnowledgeRetrieval = 'knowledge-retrieval',
  QuestionClassifier = 'question-classifier',
  IfElse = 'if-else',
  Code = 'code',
  TemplateTransform = 'template-transform',
  HttpRequest = 'http-request',
  VariableAssigner = 'variable-assigner',
  VariableAggregator = 'variable-aggregator',
  Tool = 'tool',
  ParameterExtractor = 'parameter-extractor',
  Iteration = 'iteration',
  DocExtractor = 'document-extractor',
  ListFilter = 'list-operator',
  IterationStart = 'iteration-start',
  Assigner = 'assigner', // is now named as VariableAssigner
}