import queryKey from "@/Constants/queryKey";
import { useAuth } from "@/Providers/AuthenticationProvider";
import workflowService from "@/Services/workflow.service";
import { useQuery } from "react-query";

export default function useGetWorkflowDetail(id: string) {
  const { userId } = useAuth();

  return useQuery({
    queryKey: [queryKey.WORKFLOW_DETAIL, id],
    queryFn: () =>
      workflowService.getWorkflowDetail({
        user_id: userId as string,
        workflow_id: id,
      }),
    enabled: !!userId && !!id,
  });
}
