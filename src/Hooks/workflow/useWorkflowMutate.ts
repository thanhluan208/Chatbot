import queryKey from "@/Constants/queryKey";
import workflowService from "@/Services/workflow.service";
import {  deleteWorkflowPayload } from "@/Types/workflow";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";

export default function useWorkflowMutate() {
  const queryClient = useQueryClient();

  const handleCreateWorkflow = useMutation({
    mutationFn: (payload: FormData) =>
      workflowService.createWorkflow(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKey.WORKFLOW],
      });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Something went wrong");
    },
  });

  const handleDeleteWorkflow = useMutation({
    mutationFn: (payload: deleteWorkflowPayload) =>
      workflowService.deleteWorkflow(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKey.WORKFLOW],
      });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Something went wrong");
    },
  });

  const handleAddNodeWorkflow = useMutation({
    mutationFn: (payload: any) => workflowService.addNodeWorkflow(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKey.WORKFLOW_DETAIL],
      });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Something went wrong");
    },
  });

  return { handleCreateWorkflow, handleDeleteWorkflow, handleAddNodeWorkflow };
}
