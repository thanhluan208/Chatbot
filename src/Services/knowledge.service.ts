import { getFolderKnowledge, getListKnowledgeFile } from "../Constants/api";
import httpServices from "./httpServices";

export interface PayloadKnowledgeDetail {
  user_id: string;
  knowledge_storage_id: string;
}

class KnowledgeServices {
  getListFolder(id: string) {
    return httpServices.post(getFolderKnowledge, {
      user_id: id,
    });
  }
  getListFiles(payload: PayloadKnowledgeDetail) {
    return httpServices.post(getListKnowledgeFile, payload);
  }
}

export default new KnowledgeServices();
