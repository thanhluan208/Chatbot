export interface KnowledgeNodeData {
  name?: string;
  title: string;
  type: string;
  desc: string;
  iteration_id: null;
  position: string;
  user_id: string;
  knowledge_storage_ids: any[];
  top_k_text_retrieval: number;
  query_variable_selector: any[];
  top_k_text_rerank: number;
}
