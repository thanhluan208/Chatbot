import httpServices from "@/Services/httpServices";
import { Workflow } from "@/Types/workflow";
import type { AxiosRequestConfig } from "axios";
import { useQuery } from "react-query";

interface UseGetWorkflowStoreParams {
  payload: GetWorkflowStorePayload;
}

export const useGetWorkflowStore = ({ payload }: UseGetWorkflowStoreParams) => {
  let url = `/workflow/list_workflows`;
  const queryKey = ["get-option-scenario", payload] as const;

  const config: AxiosRequestConfig = {
    method: "post",
    params: {},
  };

  return [
    queryKey,
    useQuery({
      queryKey,
      refetchOnWindowFocus: false,
      queryFn: async () => {
        const response = await httpServices.post(url, payload, config);
        return response.data as GetWorkflowStoreResponse;
      },
    }),
  ] as const;
};

interface GetWorkflowStorePayload extends Record<string, unknown> {
  user_id: string;
  visual_option: string;
  search_filter?: string;
  catafories_filter?: string;
  limit?: number;
  page?: number;
}

export interface GetWorkflowStoreResponse {
  status_code: number;
  message: string;
  total_workflows: number;
  total_pages: number;
  list_workflows: Workflow[];
}
