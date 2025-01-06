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
  Python = "python3",
  Javascript = "javascript"
}

export enum VariablesType{
  String = "String",
  Number = "Number",
  Object = "Object",
  "Array[String]" = "Array[String]",
  "Array[Number]" = "Array[Number]",
  "Array[Object]" = "Array[Object]"
}
