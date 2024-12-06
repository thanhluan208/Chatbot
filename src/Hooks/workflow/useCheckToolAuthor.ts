import queryKey from "@/Constants/queryKey";
import workflowService from "@/Services/workflow.service";
import { CheckToolAuthorPayload } from "@/Types/workflow";
import { useQuery } from "react-query";

export default function useCheckToolAuthor(
  query: CheckToolAuthorPayload,
  enabled = true
) {
  return useQuery({
    queryKey: [queryKey.CHECK_TOOL, query],
    queryFn: () => workflowService.checkToolAuthor(query),
    enabled: enabled,
  });
}
