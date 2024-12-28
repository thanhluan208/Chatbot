import queryKey from "@/Constants/queryKey";
import workflowService from "@/Services/workflow.service";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";

export default function useCreateWorkflow() {
  const queryClient = useQueryClient();

  const handleCreateWorkflow = useMutation({
    mutationFn: (payload: FormData) => workflowService.createWorkflow(payload),
    onSuccess: (response) => {
      if (response?.data?.status_code === 200) {
        queryClient.invalidateQueries({
          queryKey: [queryKey.WORKFLOW],
        });
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Something went wrong");
    },
  });

  return { handleCreateWorkflow };
}
