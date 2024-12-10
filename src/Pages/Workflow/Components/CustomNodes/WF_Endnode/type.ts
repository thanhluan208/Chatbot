export interface NodeDataEnd {
  name?: string;
  title: string;
  desc: string;
  iteration_id: null;
  position: string;
  type: string;
  outputs: Output[];
}

export interface Output {
  variable: string;
  value_selector: string[];
  save_to_memory: boolean;
}
