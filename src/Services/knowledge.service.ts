import { getFolderKnowledge, getListKnowledgeFile } from "../Constants/api";
import httpServices from "./httpServices";

export interface PayloadKnowledgeDetail {
  user_input: string;
  knowledge_input: string;
}

class KnowledgeServices {
  getListFolder(id: string) {
    return httpServices.post(getFolderKnowledge, {
      user_input: id,
    });
  }
  getListFiles(payload: PayloadKnowledgeDetail) {
    return httpServices.post(getListKnowledgeFile, payload);
  }
}

export default new KnowledgeServices();
