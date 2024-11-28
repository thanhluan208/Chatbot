import { VariablesOut } from "@/Types/workflow";

export interface NodeDataVariable {
  name?: string;
  type: string;
  title: string;
  desc: string;
  iteration_id?: string;
  position: string;
  variable: string;
  value: string;
  variable_out: VariablesOut[]
}
