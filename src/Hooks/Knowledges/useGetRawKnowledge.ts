import { useCallback, useEffect, useState } from "react";
import knowledgeService, {
  PayloadKnowledgeDetail,
} from "../../Services/knowledge.service";
import { AxiosResponse } from "axios";

export interface KnowledgeFileRaw {
  status_code: number;
  message: string;
  file_url: string;
}

const useGetRawKnowledge = (
  payload?: PayloadKnowledgeDetail,
  isTrigger = true
) => {
  const [data, setData] = useState<string>("");
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState();


  const callApi = useCallback(() => {
    if (!payload) return;
    return knowledgeService.getRawFile(payload);
  }, [payload]);

  const transformResponse = useCallback(
    (response?: AxiosResponse<KnowledgeFileRaw>) => {
      if (response && response?.data?.status_code === 200) {
        setData(response.data.file_url);
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

export default useGetRawKnowledge;
