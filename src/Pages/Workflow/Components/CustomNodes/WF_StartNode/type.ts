export interface NodeDataStart {
  name?: string;
  title: string;
  desc: string;
  iteration_id: null;
  position: string;
  type: string;
  variables: Variable[];
}

export interface Variable {
  variable: string;
  label: string;
  description: string;
  type: string;
  required: boolean;
  max_length: number;
  options: null;
  detault: null;
  hint: null;
}
