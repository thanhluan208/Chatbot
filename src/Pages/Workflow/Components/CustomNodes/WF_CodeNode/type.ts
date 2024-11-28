export interface CodeNodeData {
  name?: string;
  type: string;
  title: string;
  desc: string;
  iteration_id?: string;
  position: string;
  variables: Variable[];
  code_language: string;
  outputs: Outputs;
  code: string;
}

export interface Outputs {
  result: Result;
}

export interface Result {
  type: string;
}

export interface Variable {
  variable: string;
  value_selector: any[];
}
