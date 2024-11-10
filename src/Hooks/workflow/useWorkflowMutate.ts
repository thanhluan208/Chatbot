import queryKey from "@/Constants/queryKey";
import workflowService from "@/Services/workflow.service";
import { AddEdgePayload, addNodeWorkflowPayload, deleteWorkflowPayload, UpdateNodeDataPayload } from "@/Types/workflow";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";

export default function useWorkflowMutate() {
  const queryClient = useQueryClient();

  const handleCreateWorkflow = useMutation({
    mutationFn: (payload: FormData) => workflowService.createWorkflow(payload),
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
    mutationFn: (payload: addNodeWorkflowPayload) => workflowService.addNodeWorkflow(payload),
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Something went wrong");
    },
  });

  const handleUpdateNodeData = useMutation({
    mutationFn: (payload: UpdateNodeDataPayload) => workflowService.updateNodeData(payload),
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Something went wrong");
    },
  });

  const handleAddEdge = useMutation({
    mutationFn: (payload: AddEdgePayload) => workflowService.addEdge(payload),
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Something went wrong");
    },
  });

  const handleRemoveEdge = useMutation({
    mutationFn: (payload: any) => workflowService.removeEdge(payload),
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Something went wrong");
    },
  });

  return {
    handleCreateWorkflow,
    handleDeleteWorkflow,
    handleAddNodeWorkflow,
    handleUpdateNodeData,
    handleAddEdge,
    handleRemoveEdge,
  };
}
