import { useCallback, useEffect, useState } from "react";
import knowledgeService, {
  PayloadKnowledgeDetail,
} from "../../Services/knowledge.service";
import { AxiosResponse } from "axios";
import { ListFile } from "./useGetListFolderKnowledge";

export interface KnowledgeFile {
  status_code: number;
  message: string;
  list_files: { [key: string]: ListFile };
}

const useGetListKnowledgeFiles = (
  payload?: PayloadKnowledgeDetail,
  isTrigger = true
) => {
  const [data, setData] = useState<ListFile[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState();

  console.log("data", data);

  const callApi = useCallback(() => {
    if (!payload) return;
    return knowledgeService.getListFiles(payload);
  }, [payload]);

  const transformResponse = useCallback(
    (response?: AxiosResponse<KnowledgeFile>) => {
      if (response) {
        setData(Object.values(response.data.list_files));
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
  }, []);

  useEffect(() => {
    let shouldSetData = true;

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
  }, [isTrigger]);

  return {
    data,
    isLoading,
    error,
    refetch,
  };
};

export default useGetListKnowledgeFiles;
