import queryKey from "@/Constants/queryKey";
import { LlmNodeData } from "@/Pages/Workflow/Components/CustomNodes/WF_LlmNode/type";
import { useAuth } from "@/Providers/AuthenticationProvider";
import workflowService from "@/Services/workflow.service";
import {
  AddEdgePayload,
  addNodeWorkflowPayload,
  deleteWorkflowPayload,
  UpdateNodeDataPayload,
} from "@/Types/workflow";
import { useReactFlow } from "@xyflow/react";
import { useCallback } from "react";
import { useMutation, useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

export default function useWorkflowMutate() {
  const queryClient = useQueryClient();
  const { workflowId } = useParams();
  const { userId } = useAuth();
  const { updateNode } = useReactFlow();

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
    mutationFn: (payload: addNodeWorkflowPayload) =>
      workflowService.addNodeWorkflow(payload),
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Something went wrong");
    },
  });

  const handleUpdateNodeData = useMutation({
    mutationFn: (payload: UpdateNodeDataPayload) =>
      workflowService.updateNodeData(payload),
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

  //! WF_LLM
  const handleUpdateNodeDataLLM = useCallback((
    nodeId: string,
    nodeData: LlmNodeData,
    payload: Partial<LlmNodeData>,
    onSuccess?: () => void,
    onFailed?: () => void
  ) => {
    if (!workflowId || !userId) return;

    const updatePayload: Partial<LlmNodeData> = {
      name: nodeId,
      desc: nodeData.desc,
      memory: nodeData.memory,
      position: nodeData.position,
      prompt_template: nodeData.prompt_template,
      model: nodeData.model,
      ...payload,
    };

    handleUpdateNodeData.mutate(
      {
        workflow_id: workflowId,
        user_id: userId,
        node_id: nodeId,
        node_data: updatePayload,
      },
      {
        onSuccess: (response) => {
          if (response?.status_code !== 200) {
            toast.error(response?.message);
            onFailed && onFailed();
          }
          updateNode && updateNode(nodeId, {
            data: {
              ...nodeData,
              ...updatePayload,
            },
          });
          onSuccess && onSuccess();
        },
        onError: () => {
          onFailed && onFailed();
        },
      }
    );
  },[workflowId, userId]);

  return {
    handleCreateWorkflow,
    handleDeleteWorkflow,
    handleAddNodeWorkflow,
    handleUpdateNodeData,
    handleAddEdge,
    handleRemoveEdge,
    handleUpdateNodeDataLLM,
  };
}
