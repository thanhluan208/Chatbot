export interface AddOrRemoveKnowledgeFromBotPayload {
  user_id: string;
  knowledge_storage_ids: string[];
  bot_id: string;
  isAdd?: boolean
}
