import { useCallback, useEffect, useState } from "react";
import knowledgeService from "../../Services/knowledge.service";

const useGetListFolderKnowledge = (id: string, isTrigger = true) => {
  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState();

  const callApi = useCallback(() => {
    if (!id) return;
    return knowledgeService.getListFolder(id);
  }, [id]);

  const transformResponse = useCallback((response: any) => {
    if (response) {
      setData(response.data.list_knowledges);
    }
  }, []);

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

export default useGetListFolderKnowledge;
