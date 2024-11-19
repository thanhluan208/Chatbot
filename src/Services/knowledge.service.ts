import {
  getFileData,
  getFileRaw,
  getFolderKnowledge,
  getKnowledgeDetail,
  getListKnowledgeFile,
  getSegments,
} from "../Constants/api";
import httpServices from "./httpServices";
import { KnowledgeFolderResponse } from "@/Hooks/Knowledges/useGetListFolderKnowledge";

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
  getListFolder(filters: GetListFilter): Promise<KnowledgeFolderResponse> {
    return httpServices
      .post(getFolderKnowledge, filters)
      .then((response) => response.data);
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
  getDataFile(payload: PayloadSegment) {
    return httpServices.post(getFileData, payload);
  }
  getDetail(payload: PayloadKnowledgeDetail) {
    return httpServices.post(getKnowledgeDetail, payload);
  }
}

export default new KnowledgeServices();
