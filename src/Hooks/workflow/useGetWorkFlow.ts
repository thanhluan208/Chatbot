import queryKey from "@/Constants/queryKey";
import workflowService from "@/Services/workflow.service";
import { queryWorkflow } from "@/Types/workflow";
import { useQuery } from "react-query";

export default function useGetWorkflows(query: queryWorkflow) {
  return useQuery({
    queryKey: [queryKey.WORKFLOW, query],
    queryFn: () => workflowService.getWorkflows(query),
  });
}
