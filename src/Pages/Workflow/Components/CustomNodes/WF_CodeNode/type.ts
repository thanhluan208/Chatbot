import { UUID } from "crypto";

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
  [key: string]: Output;
}

export interface Output {
  type: string;
}

export interface Variable {
  variable: string;
  value_selector: any[];
}

export enum CodeLanguage{
  PYTHON= "python3",
  JS= "javascript"
}
