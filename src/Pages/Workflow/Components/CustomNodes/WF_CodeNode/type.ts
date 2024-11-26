export interface CodeNodeData {
    name?: string;
    title?: string;
    type: string;
    desc: string;
    position: string;
    variables: Variable[];
    code_language: string;
    code: string;
    outputs: Outputs;
    variables_out: VariableOut[];
}

export interface VariableOut {
  type: string;
  variable: string;
}

export interface NodeDataCode {
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

export enum ParamType {
  INPUT = "Input",
  REFERENCE = "Reference"
}

export enum CodeNodeLanguage {
  JS = "Javascript",
  PYTHON = "Python"
}

export enum OutputDataType {
  STRING = "String",
  INTEGER = "Integer",
  BOOLEAN = "Boolean",
  NUMBER = "Number",
  OBJECT = "Object",
  ARRAY_STRING = "Array<String>",
  ARRAY_INT = "Array<Integer>",
  ARRAY_BOOL = "Array<Boolean>",
  ARRAY_NUMBER = "Array<Number>",
  ARRAY_OBJECT = "Array<Object>"
}