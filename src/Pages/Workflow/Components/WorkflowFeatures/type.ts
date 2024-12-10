export interface ResponseRunWorkflow {
  event: EventEnum;
  node_id: string;
  node_type: string;
  start_at: number;
  finished_at: number;
  failed_reason: null;
  index: number;
  parallel_id?: string;
  parallel_start_node_id?: string;
  parent_parallel_start_node_id?: string;
  in_iteration_id: null;
  predecessor_node_id: null;
  running_status: string;
  outputs?: Record<string, string | null>;
}

export enum EventEnum {
  GRAPH_RUN_STARTED = "graph_run_started",
  NODE_RUN_STARTED = "node_run_started",
  NODE_RUN_SUCCEEDED = "node_run_succeeded",
  GRAPH_RUN_SUCCEEDED = "graph_run_succeeded",
}
