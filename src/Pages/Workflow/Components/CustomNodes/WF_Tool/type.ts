export interface NodeDataTool {
  name?: string;
  type: string;
  title: string;
  desc: string;
  iteration_id?: string;
  position: string;
  provider_id: string;
  provider_type: string;
  tool_name: string;
  tool_configurations: ToolConfigurations;
  tool_parameters: ToolParameters;
  provider_credentials_valid: boolean;
}

export interface ToolConfigurations {}

export interface ToolParameters {
  [key: string]: Parameter
}

export interface Parameter {
  value: string;
  type: string;
}
