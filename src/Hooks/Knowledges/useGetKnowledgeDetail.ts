import { useCallback, useEffect, useState } from "react";
import knowledgeService, {
  PayloadKnowledgeDetail,
} from "../../Services/knowledge.service";
import { AxiosResponse } from "axios";
import { FileData } from "./useGetListFolderKnowledge";

export interface KnowledgeDetailResponse {
  status_code: number;
  message: string;
  knowledge_storage_data: KnowledgeStorageData;
}

export interface KnowledgeStorageData {
  knowledge_storage_id: string;
  knowledge_storage_name: string;
  description: string;
  owner_id: string;
  created_at: Date;
  user_name: string;
  visibility: string;
  sharing_with_bots: any[];
  list_files: ListFiles;
  avatar_url: string;
}

export interface ListFiles {
  [key: string]: FileData;
}



const useGetKnowledgeDetail = (
  payload?: PayloadKnowledgeDetail,
  isTrigger = true
) => {
  const [data, setData] = useState<KnowledgeStorageData | null>(null);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState();

  const callApi = useCallback(() => {
    if (!payload) return;
    return knowledgeService.getDetail(payload);
  }, [payload]);

  const transformResponse = useCallback(
    (response?: AxiosResponse<KnowledgeDetailResponse>) => {
      if (response && response?.data?.status_code === 200) {
        setData(response.data.knowledge_storage_data);
      }
    },
    []
  );

  const refetch = useCallback(async () => {
    try {
      const response = await callApi();
      transformResponse(response);
    } catch (error: any) {
      setError(error);
    }
  }, [callApi]);

  useEffect(() => {
    let shouldSetData = true;
    console.log("trigger", isTrigger);
    if (isTrigger) {
      (async () => {
        try {
          setLoading(true);
          const response = await callApi();

          if (shouldSetData) {
            transformResponse(response);
          }
        } catch (error: any) {
          setError(error);
        } finally {
          setLoading(false);
        }
      })();

      return () => {
        shouldSetData = false;
      };
    }
  }, [isTrigger, callApi]);

  return {
    data,
    isLoading,
    error,
    refetch,
  };
};

export default useGetKnowledgeDetail;
