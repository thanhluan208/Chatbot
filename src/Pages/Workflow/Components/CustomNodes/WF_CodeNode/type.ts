export interface CodeNodeData {
    name?: string;
    title?: string;
    type: string;
    desc: string;
    position: string;
    input: CodeNodeInput[];
    code: CodeNodeCode;
    output: CodeNodeOutput[]
}

export interface CodeNodeInput{
    paramName: string;
    paramType: string;
    value?: string | number | boolean | object
            | string[] | number[] | boolean[] | object[]
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