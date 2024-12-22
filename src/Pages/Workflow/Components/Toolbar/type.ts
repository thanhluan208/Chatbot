export interface ToolProvider {
  provider: string;
  identity: ToolProviderIdentity;
  credentials_for_provider?: CredentialsForProvider;
  tools: Tool[];
  [key: string]: any;
}

export interface CredentialsForProvider {
  [key: string]: APIKey;
}

export interface APIKey {
  type: string;
  required: boolean;
  label: LabelClass;
  placeholder: LabelClass;
  help: LabelClass;
  url: string;
}

export interface LabelClass {
  vi_VN?: string;
  en_US: string;
  zh_Hans: string;
  pt_BR: string;
}

export interface ToolProviderIdentity {
  author: string;
  name: string;
  label: LabelClass;
  description: LabelClass;
  icon: string;
  tags: string[];
}

export interface Tool {
  name: string;
  identity: ToolIdentity;
  description: ToolDescription;
  parameters: Parameter[];
  tags?: string[];
  provider?: ToolProviderIdentity;
}

export interface ToolDescription {
  human: LabelClass;
  llm: string;
}

export interface ToolIdentity {
  name: string;
  author: string;
  label: LabelClass;
}

export interface Parameter {
  name: string;
  type: ParameterType;
  required: boolean;
  label: LabelClass;
  human_description: LabelClass;
  llm_description: string;
  form: ParameterForm;
  options?: ParameterOption[];
}

export enum ParameterForm {
  LLM = "llm",
  FORM = "form",
}

export enum ParameterType {
  SELECT = "select",
  STRING = "string",
  NUMBER = "number",
}

export interface ParameterOption {
  value: string;
  label: {
    [key: string]: string;
  };
}
