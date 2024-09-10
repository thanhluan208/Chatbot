import { useCallback, useEffect, useState } from "react";
import knowledgeService from "../../Services/knowledge.service";
import { useAuth } from "../../Providers/AuthenticationProvider";
import { IKnowledgeFolder } from "../../Pages/ChatbotConfigure/components/Configure/Knowledge/KnowledgeFolder";
import moment from "moment";
import { AxiosResponse } from "axios";
import { convertSize } from "../../Helpers";

export interface KnowledgeFolderResponse {
  status_code: number;
  message: string;
  list_knowledges: ListKnowledge[];
}

export interface ListKnowledge {
  knowledge_storage_id: string;
  knowledge_storage_name: string;
  description: string;
  owner_id: string;
  created_at: Date;
  user_name: string;
  permission_level: string;
  visibility: string;
  sharing_with_bots: string[];
  list_files: ListFiles;
}

export interface ListFiles {
  [key: string]: TestPDF;
}

export interface TestPDF {
  name: string;
  creation_date: Date;
  last_modified_date: Date;
  file_size: number;
  file_type: string;
  n_points: number;
}

interface Filters {
  search_filter?: string;
  visual_option?: string;
}

const useGetListFolderKnowledge = (filters?: Filters, isTrigger = true) => {
  const [data, setData] = useState<IKnowledgeFolder[] | []>([]);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState();
  const { userId } = useAuth();

  const callApi = useCallback(() => {
    if (!userId) return;
    return knowledgeService.getListFolder({
      user_id: userId,
      visual_option: "public",
      ...filters,
    });
  }, [userId, filters]);

  const transformResponse = useCallback(
    (response?: AxiosResponse<KnowledgeFolderResponse>) => {
      if (response) {
        const data = response.data.list_knowledges.map((item) => {
          return {
            id: item.knowledge_storage_id,
            title: item.knowledge_storage_name,
            description: item.description,
            createdAt: moment(item.created_at).format("DD/MM/YYYY HH:mm"),
            size: convertSize(
              Object.values(item.list_files).reduce(
                (acc, cur) => acc + cur.file_size,
                0
              )
            ),
            quantity: `${Object.keys(item.list_files).length || 0}`,
            sharingWithBots: item.sharing_with_bots,
            userName: item.user_name,
            owner_id: item.owner_id,
          };
        });

        setData(data);
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

export default useGetListFolderKnowledge;
