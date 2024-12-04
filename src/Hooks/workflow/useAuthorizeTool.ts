import queryKey from "@/Constants/queryKey";
import workflowService from "@/Services/workflow.service";
import { AuthorizePayload } from "@/Types/workflow";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";

export default function useAuthorizeTool() {
  const queryClient = useQueryClient();

  const handleAuthorizeTool = useMutation({
    mutationFn: (payload: AuthorizePayload) => workflowService.authorizeTool(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKey.CHECK_TOOL],
      });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Something went wrong");
    },
  });

  return { handleAuthorizeTool };
}
