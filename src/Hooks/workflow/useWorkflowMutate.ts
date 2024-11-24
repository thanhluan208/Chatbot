import queryKey from "@/Constants/queryKey";
import { ConditionNodeData } from "@/Pages/Workflow/Components/CustomNodes/WF_ConditionNode/type";
import { KnowledgeNodeData } from "@/Pages/Workflow/Components/CustomNodes/WF_Knowledge/type";
import { LlmNodeData } from "@/Pages/Workflow/Components/CustomNodes/WF_LlmNode/type";
import { NodeDataParamExtractor } from "@/Pages/Workflow/Components/CustomNodes/WF_ParamExtractor/type";
import { NodeDataVarAgg } from "@/Pages/Workflow/Components/CustomNodes/WF_VariableAggregator/type";
import { useAuth } from "@/Providers/AuthenticationProvider";
import workflowService from "@/Services/workflow.service";
import {
  AddEdgePayload,
  addNodeWorkflowPayload,
  deleteWorkflowPayload,
  UpdateNodeDataPayload,
} from "@/Types/workflow";
import { useReactFlow } from "@xyflow/react";
import { cloneDeep } from "lodash";
import { useCallback } from "react";
import { useMutation, useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

export default function useWorkflowMutate() {
  const queryClient = useQueryClient();
  const { workflowId } = useParams();
  const { userId } = useAuth();
  const { updateNode, getNode } = useReactFlow();

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

  const handleUpdateNodePosition = useCallback(
    (nodeId: string, position: any) => {
      if (!workflowId || !userId) return;

      const node = getNode(nodeId);

      if (!node) return;

      const nodeData = cloneDeep(node?.data);

      delete nodeData?.title;
      delete nodeData?.type;
      delete nodeData?.label;
      delete nodeData?.iteration_id;
      delete nodeData?.variable_out;
      delete nodeData?.startNode;
      delete nodeData?.user_id;

      nodeData.name = nodeId;

      const payload: any = {
        workflow_id: workflowId,
        user_id: userId,
        node_id: nodeId,
        node_data: {
          ...nodeData,
          position: JSON.stringify(position),
        },
      };

      handleUpdateNodeData.mutate(payload);
    },
    [workflowId, userId, updateNode, getNode]
  );

  //! WF_LLM
  const handleUpdateNodeDataLLM = useCallback(
    (
      nodeId: string,
      payload: Partial<LlmNodeData>,
      onSuccess?: () => void,
      onFailed?: () => void
    ) => {
      if (!workflowId || !userId || !nodeId) return;

      const nodeData = getNode(nodeId)?.data as unknown as LlmNodeData;

      const updatePayload: Partial<LlmNodeData> = {
        name: nodeId,
        desc: nodeData.desc,
        memory: nodeData.memory,
        position: nodeData.position,
        prompt_template: nodeData.prompt_template,
        ...payload,
        model: {
          ...nodeData.model,
          ...payload?.model,
        },
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
            updateNode &&
              updateNode(nodeId, {
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
    },
    [workflowId, userId]
  );

  //! WF_VariableAggregator
  const handleUpdateNodeDataVarAgg = useCallback(
    (
      nodeId: string,
      payload: Partial<NodeDataVarAgg>,
      onSuccess?: () => void,
      onFailed?: () => void
    ) => {
      if (!workflowId || !userId || !nodeId) return;

      const nodeData = getNode(nodeId)?.data as unknown as NodeDataVarAgg;

      const { advanced_settings, ...rest } = payload;

      const updatePayload: Partial<NodeDataVarAgg> = {
        name: nodeId,
        desc: nodeData.desc,
        position: nodeData.position,
        advanced_settings: {
          ...nodeData.advanced_settings,
          ...advanced_settings,
        },
        variables: nodeData.variables,
        ...rest,
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
            updateNode &&
              updateNode(nodeId, {
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
    },
    [workflowId, userId, updateNode, getNode]
  );

  //! WF_Knowledge
  const handleUpdateNodeDataKnowledge = useCallback(
    (
      nodeId: string,
      payload: Partial<KnowledgeNodeData>,
      onSuccess?: () => void,
      onFailed?: () => void
    ) => {
      if (!workflowId || !userId || !nodeId) return;

      const nodeData = getNode(nodeId)?.data as unknown as KnowledgeNodeData;

      const updatePayload: Partial<KnowledgeNodeData> = {
        name: nodeId,
        desc: nodeData.desc,
        position: nodeData.position,
        knowledge_storage_ids: nodeData.knowledge_storage_ids,
        top_k_text_rerank: nodeData.top_k_text_rerank,
        top_k_text_retrieval: nodeData.top_k_text_retrieval,
        query_variable_selector: nodeData.query_variable_selector,
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
            updateNode &&
              updateNode(nodeId, {
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
    },
    [workflowId, userId, updateNode, getNode]
  );

  //! WF_ConditionNode
  const handleUpdateNodeDataCondition = useCallback(
    (
      nodeId: string,
      payload: Partial<ConditionNodeData>,
      onSuccess?: () => void,
      onFailed?: () => void
    ) => {
      if (!workflowId || !userId || !nodeId) return;

      const nodeData = getNode(nodeId)?.data as unknown as ConditionNodeData;

      const updatePayload: Partial<ConditionNodeData> = {
        name: nodeId,
        desc: nodeData.desc,
        position: nodeData.position,
        cases: nodeData?.cases,
        ...payload,
      };

      const handleFailed = () => {
        onFailed && onFailed();
        updateNode(nodeId, {
          data: {
            ...nodeData,
          },
        });
      };

      updateNode &&
        updateNode(nodeId, {
          data: {
            ...nodeData,
            ...updatePayload,
          },
        });

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
              handleFailed();
            }
            onSuccess && onSuccess();
          },
          onError: () => {
            handleFailed();
          },
        }
      );
    },
    [workflowId, userId, updateNode, getNode]
  );

  //! WF_ParamExtractor
  const handleUpdateNodeDataParamExtractor = useCallback(
    (
      nodeId: string,
      payload: Partial<NodeDataParamExtractor>,
      onSuccess?: () => void,
      onFailed?: () => void
    ) => {
      if (!workflowId || !userId || !nodeId) return;

      const nodeData = getNode(nodeId)
        ?.data as unknown as NodeDataParamExtractor;

      const updatePayload: Partial<NodeDataParamExtractor> = {
        name: nodeId,
        desc: nodeData.desc,
        position: nodeData.position,
        outputs_instruction: nodeData.outputs_instruction,
        prompt_template: nodeData.prompt_template,
        outputs: nodeData.outputs,
        ...payload,
        model: {
          ...nodeData.model,
          ...payload?.model,
        },
      };

      const handleFailed = () => {
        onFailed && onFailed();
        updateNode(nodeId, {
          data: {
            ...nodeData,
          },
        });
      };

      updateNode &&
        updateNode(nodeId, {
          data: {
            ...nodeData,
            ...updatePayload,
          },
        });

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
              handleFailed();
            }
            onSuccess && onSuccess();
          },
          onError: () => {
            handleFailed();
          },
        }
      );
    },
    [workflowId, userId, updateNode, getNode]
  );

  return {
    handleCreateWorkflow,
    handleDeleteWorkflow,
    handleAddNodeWorkflow,
    handleUpdateNodeData,
    handleAddEdge,
    handleRemoveEdge,
    handleUpdateNodeDataLLM,
    handleUpdateNodeDataVarAgg,
    handleUpdateNodePosition,
    handleUpdateNodeDataKnowledge,
    handleUpdateNodeDataCondition,
    handleUpdateNodeDataParamExtractor,
  };
}
