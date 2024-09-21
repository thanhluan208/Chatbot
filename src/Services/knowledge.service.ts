import { getFileRaw, getFolderKnowledge, getListKnowledgeFile, getSegments } from "../Constants/api";
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

export interface PayloadSegment {
  user_id: string;
  knowledge_storage_id: string;
  file_name: string;
}

class KnowledgeServices {
  getListFolder(filters: GetListFilter) {
    return httpServices.post(getFolderKnowledge,filters);
  }
  getListFiles(payload: PayloadKnowledgeDetail) {
    return httpServices.post(getListKnowledgeFile, payload);
  }
  getListSegments(payload: PayloadSegment) {
    return httpServices.post(getSegments, payload);
  }
  getRawFile(payload: PayloadKnowledgeDetail) {
    return httpServices.post(getFileRaw, payload);
  }
}

export default new KnowledgeServices();
