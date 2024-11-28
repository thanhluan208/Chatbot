import { VariablesOut } from "@/Types/workflow";

export interface NodeDataVarAgg {
  name?: string;
  type: string;
  title: string;
  desc: string;
  iteration_id: null;
  position: string;
  output_type: string;
  variables: string[][];
  advanced_settings: AdvancedSettings;
  variable_out: VariablesOut[];
}

export interface AdvancedSettings {
  group_enabled: boolean;
  groups: Group[];
}

export interface VariableSelector {
  value: string[];
  type: string;
}

export interface Group {
  output_type: string;
  group_name: string;
  variables: string[][];
  newName?: string;
}
