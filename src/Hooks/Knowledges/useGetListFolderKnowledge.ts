import queryKey from "@/Constants/queryKey";
import { convertSize } from "@/Helpers";
import { IKnowledgeFolder } from "@/Pages/ChatbotConfigure/components/Configure/Knowledge/KnowledgeFolder";
import { useAuth } from "@/Providers/AuthenticationProvider";
import knowledgeService from "@/Services/knowledge.service";
import moment from "moment";
import { useMemo } from "react";
import { useQuery } from "react-query";

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
  sharing_with_bots: any[];
  list_files: ListFiles;
  avatar_url: string;
}

export interface ListFiles {}

export interface ListFiles {
  [key: string]: FileData;
}

export interface FileData {
  name: string;
  creation_date: Date;
  last_modified_date: Date;
  file_size: number;
  file_type: string;
  n_points: number;
  process_status: FileStatus;
}

export enum FileStatus {
  PROCESSING = "processing",
  SUCCESS = "success",
  IN_QUEUE = "in_queue",
  FAILED = "failed",
}

interface Filters {
  search_filter?: string;
  visual_option?: string;
}

export default function useGetListFolderKnowledge(filters?: Filters) {
  const { userId } = useAuth();

  const query = useQuery({
    queryKey: [queryKey.KNOWLEDGE_FOLDER_LIST, filters],
    queryFn: () =>
      knowledgeService.getListFolder({
        user_id: userId as string,
        visual_option: "public",
        ...filters,
      }),
    enabled: !!userId,
  });

  const { data, ...rest } = query;

  const parseData: IKnowledgeFolder[] = useMemo(() => {
    if(!data?.list_knowledges) return [];

    return data?.list_knowledges.map((item) => {
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
        quantity: `${Object.keys(item?.list_files)?.length || 0}`,
        sharingWithBots: item.sharing_with_bots,
        userName: item.user_name,
        owner_id: item.owner_id,
        permission_level: item.permission_level,
        avatar: item.avatar_url,
      };
    })
  },[data])

  return {
    ...rest,
    data: parseData,
  };
}
