export interface ConditionNodeData {
  name?: string;
  title: string;
  type: string;
  desc: string;
  position: string;
  cases: Case[];
  iteration_id?: string;
}

export interface Case {
  case_id: string;
  conditions: Condition[];
  id: string;
  logical_operator: string;
}

export interface Condition {
  comparison_operator: ComparisonOperator;
  value?: string;
  varType?: string;
  variable_selector?: string[];
}

export enum ComparisonOperator {
  CONTAINS = "contains",
  NOT_CONTAINS = "not contains",
  START_WITH = "start with",
  END_WITH = "end with",
  IS = "is",
  IS_NOT = "is not",
  EMPTY = "empty",
  NOT_EMPTY = "not empty",
}

export const ComparisonOperatorOptions = [
  { value: "contains", label: "Contains" },
  { value: "not contains", label: "Not Contains" },
  { value: "start with", label: "Start With" },
  { value: "end with", label: "End With" },
  { value: "is", label: "Is" },
  { value: "is not", label: "Is Not" },
  { value: "is empty", label: "Is Empty" },
  { value: "is not empty", label: "Is Not Empty" },
];
