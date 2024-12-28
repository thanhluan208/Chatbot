import { KnowledgeDetailResponse } from "@/Hooks/Knowledges/useGetKnowledgeDetail";
import { KnowledgeFolderResponse } from "@/Hooks/Knowledges/useGetListFolderKnowledge";
import { AddOrRemoveKnowledgeFromBotPayload } from "@/Types/knowledge";
import {
  getFileData,
  getFileRaw,
  getFolderKnowledge,
  getKnowledgeDetail,
  getListKnowledgeFile,
  getSegments,
  removeKnowledgeFromBot,
  updateKnowledgeToBot,
} from "../Constants/api";
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
  getDetail(payload?: PayloadKnowledgeDetail): Promise<KnowledgeDetailResponse> {
    return httpServices.post(getKnowledgeDetail, payload).then((response) => response.data);
  }

  removeKnowledgeFromBot(payload: Omit<AddOrRemoveKnowledgeFromBotPayload, "isAdd">) {
    return httpServices.post(removeKnowledgeFromBot, payload);
  }

  addKnowledgeToBot(payload: Omit<AddOrRemoveKnowledgeFromBotPayload, "isAdd">) {
    return httpServices.post(updateKnowledgeToBot, payload);
  }
}

export default new KnowledgeServices();
