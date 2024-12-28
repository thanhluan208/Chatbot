import queryKey from "@/Constants/queryKey";
import { useAuth } from "@/Providers/AuthenticationProvider";
import { useQuery } from "react-query";
import knowledgeService, {
  PayloadKnowledgeDetail,
} from "../../Services/knowledge.service";
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
  sharing_with_bots: string[];
  list_files: ListFiles;
  avatar_url: string;
}

export interface ListFiles {
  [key: string]: FileData;
}

const useGetKnowledgeDetail = (
  filters?: PayloadKnowledgeDetail,
  enabled?: boolean
) => {
  const { userId } = useAuth();

  const {data, ...rest} = useQuery({
    queryKey: [queryKey.KNOWLEDGE_FOLDER_LIST, filters],
    queryFn: () => {
      return knowledgeService.getDetail(filters)
    },
    enabled: !!userId && enabled,
  });


  return {
    data: data?.knowledge_storage_data,
    ...rest
  }
};

export default useGetKnowledgeDetail;
