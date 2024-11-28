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

export interface CodeNodeInput{
    paramName: string;
    paramType: string;
    value?: String | any;
}

export interface CodeNodeCode{
    language: string;
    code: string;
}

export interface CodeNodeOutput{
    varName: string;
    varDataType: string;
    children?: any;
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