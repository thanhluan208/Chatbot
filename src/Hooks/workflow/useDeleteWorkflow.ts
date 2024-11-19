import queryKey from "@/Constants/queryKey";
import workflowService from "@/Services/workflow.service";
import { deleteWorkflowPayload } from "@/Types/workflow";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";

export default function useDeleteWorkflow() {
  const QueryClient = useQueryClient();

  const handleDeleteWorkflow = useMutation({
    mutationFn: (payload: deleteWorkflowPayload) =>
      workflowService.deleteWorkflow(payload),
    onSuccess: () => {
      QueryClient.invalidateQueries({
        queryKey: [queryKey.WORKFLOW],
      });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Something went wrong");
    },
  });

  return { handleDeleteWorkflow };
}
