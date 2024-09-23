import { useCallback, useEffect, useState } from "react";
import knowledgeService, {
  PayloadSegment,
} from "../../Services/knowledge.service";
import { AxiosResponse } from "axios";
import { FileData } from "./useGetListFolderKnowledge";

export interface FileDataResponse {
  status_code: number;
  message: string;
  file_data: FileData;
}


const useGetFileData = (payload?: PayloadSegment, isTrigger = true) => {
  const [data, setData] = useState<FileData | null>(null);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState();

  const callApi = useCallback(() => {
    if (!payload) return;
    return knowledgeService.getDataFile(payload);
  }, [payload]);

  const transformResponse = useCallback(
    (response?: AxiosResponse<FileDataResponse>) => {
      if (response && response?.data?.status_code === 200) {
        setData(response.data.file_data);
      }
    },
    []
  );

  const refetch = useCallback(async () => {
    if(!isTrigger) return;
    try {
      const response = await callApi();
      transformResponse(response);
    } catch (error: any) {
      setError(error);
    }
  }, [callApi, isTrigger]);

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
  }, [isTrigger, callApi]);

  return {
    data,
    isLoading,
    error,
    refetch,
  };
};

export default useGetFileData;
