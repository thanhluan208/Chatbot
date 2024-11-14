import queryKey from "@/Constants/queryKey";
import { useAuth } from "@/Providers/AuthenticationProvider";
import workflowService from "@/Services/workflow.service";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";

export default function useGetVariableSelectors(nodeId?: string) {
  const { userId } = useAuth();
  const { workflowId } = useParams();

  return useQuery({
    queryKey: [queryKey.WORKFLOW_VAR_SELECTOR, userId, workflowId, nodeId],
    queryFn: () => workflowService.getVarSelectors({
        user_id: userId as string,
        workflow_id: workflowId as string,
        node_id: nodeId as string,
    }),
    enabled: !!userId && !!workflowId && !!nodeId,
  });
}
