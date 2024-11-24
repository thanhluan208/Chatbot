import useWorkflowMutate from "@/Hooks/workflow/useWorkflowMutate";
import { NodeTypeWorkflow } from "@/Types/workflow";
import { useReactFlow } from "@xyflow/react";
import React, { useCallback, useRef } from "react";

const UpdateNodePos = ({ id }: { id: string }) => {
  const { getNode } = useReactFlow();

  const node = getNode(id);

  if (!node) return;

  const nodePos = useRef(JSON.stringify(node?.position));
  const nodeType = node?.type;

  const deboundRef = React.useRef<NodeJS.Timeout | null>(null);
  const isFirstRender = React.useRef(true);

  const {
    handleUpdateNodeDataCondition,
    handleUpdateNodeDataKnowledge,
    handleUpdateNodeDataLLM,
    handleUpdateNodeDataVarAgg,
  } = useWorkflowMutate();

  const handleUpdateNodePosition = useCallback(
    (position: string) => {
      const payload = {
        position: position,
      };

      switch (nodeType) {
        case `customNode_WF_${NodeTypeWorkflow.IF_ELSE}`:
          handleUpdateNodeDataCondition(id, payload);
          break;
        case `customNode_WF_${NodeTypeWorkflow.KNOWLEDGE_RETRIEVAL}`:
          handleUpdateNodeDataKnowledge(id, payload);
          break;
        case `customNode_WF_${NodeTypeWorkflow.LLM}`:
          handleUpdateNodeDataLLM(id, payload);
          break;
        case `customNode_WF_${NodeTypeWorkflow.VARIABLE_AGGREGATOR}`:
          handleUpdateNodeDataVarAgg(id, payload);
          break;
      }
    },
    [
      handleUpdateNodeDataCondition,
      handleUpdateNodeDataKnowledge,
      handleUpdateNodeDataLLM,
      handleUpdateNodeDataVarAgg,
      id,
      nodeType,
    ]
  );

  React.useEffect(() => {
    if (deboundRef.current) clearTimeout(deboundRef.current);
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    deboundRef.current = setTimeout(() => {
      if (nodePos.current === JSON.stringify(node?.position)) return;
      handleUpdateNodePosition &&
        handleUpdateNodePosition(JSON.stringify(node?.position));
      nodePos.current = JSON.stringify(node?.position);
      isFirstRender.current = true;
    }, 500);
  }, [id, handleUpdateNodePosition, node?.position]);

  return null;
};

export default UpdateNodePos;
