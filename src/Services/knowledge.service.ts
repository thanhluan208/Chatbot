import { getFolderKnowledge, getListKnowledgeFile } from "../Constants/api";
import httpServices from "./httpServices";

interface GetListFilter {
  user_id: string;
  search_filter?: string;
  visual_option?: string;
}

export interface PayloadKnowledgeDetail {
  user_id: string;
  knowledge_storage_id: string;
}

class KnowledgeServices {
  getListFolder(filters: GetListFilter) {
    return httpServices.post(getFolderKnowledge,filters);
  }
  getListFiles(payload: PayloadKnowledgeDetail) {
    return httpServices.post(getListKnowledgeFile, payload);
  }
}

export default new KnowledgeServices();
