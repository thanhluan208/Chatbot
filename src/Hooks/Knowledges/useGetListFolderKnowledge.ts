import { useCallback, useEffect, useState } from "react";
import knowledgeService from "../../Services/knowledge.service";
import { useAuth } from "../../Providers/AuthenticationProvider";
import { IKnowledgeFolder } from "../../Pages/ChatbotConfigure/components/Configure/Knowledge/KnowledgeFolder";
import moment from "moment";

export interface KnowledgeFolderResponse {
  knowledge_storage_id: string;
  knowledge_storage_name: string;
  description: string;
  created_at: Date;
  size: string;
  quantity: string;
}

const useGetListFolderKnowledge = (isTrigger = true) => {
  const [data, setData] = useState<IKnowledgeFolder[] | []>([]);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState();
  const { userId } = useAuth();

  const callApi = useCallback(() => {
    if (!userId) return;
    return knowledgeService.getListFolder(userId);
  }, [userId]);

  const transformResponse = useCallback((response: any) => {
    if (response) {
      setData(
        response.data.list_knowledges.map((item: KnowledgeFolderResponse) => {
          return {
            id: item.knowledge_storage_id,
            title: item.knowledge_storage_name,
            description: item.description,
            createdAt: moment(item.created_at).format("DD/MM/YYYY HH:mm"),
            size: item?.size || "0 Byte",
            quantity: item?.quantity || 0,
          };
        })
      );
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
