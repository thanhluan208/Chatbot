import { useReactFlow } from "@xyflow/react";
import useWorkflowMutate from "./useWorkflowMutate";
import { useAuth } from "@/Providers/AuthenticationProvider";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { useCallback } from "react";

const useNodeWorkflowInit = (nodeId: string) => {
  const { t } = useTranslation("node");
  const { handleUpdateNodeData } = useWorkflowMutate();
  const { getNode } = useReactFlow();
  const { userId } = useAuth();
  const { workflowId } = useParams();

  const handleUpdateNode = useCallback(
    async (updateData: unknown, onSuccess?: () => void) => {
      const curNode = getNode(nodeId);

      if (!userId || !nodeId || !workflowId || !curNode) return;
      const toastId = toast.info(t("WF_Startnode.processing"), {
        isLoading: true,
        autoClose: false,
      });

      const payload = {
        user_id: userId,
        workflow_id: workflowId,
        node_id: nodeId,
        node_data: updateData,
      };

      const response = await handleUpdateNodeData.mutateAsync(payload);
      if (response?.status_code === 200) {
        toast.update(toastId, {
          render: t("WF_Startnode.processed"),
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });

        onSuccess && onSuccess();
      } else {
        toast.update(toastId, {
          render: response?.message || t("WF_Startnode.failed"),
          type: "error",
          isLoading: false,
          autoClose: 2000,
        });
      }
    },
    [getNode, handleUpdateNodeData, userId, nodeId, workflowId, t]
  );

  return { handleUpdateNode };
};

export default useNodeWorkflowInit;
