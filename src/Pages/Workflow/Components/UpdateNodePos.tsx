import useWorkflowMutate from "@/Hooks/workflow/useWorkflowMutate";
import { NodeTypeWorkflow } from "@/Types/workflow";
import { useReactFlow } from "@xyflow/react";
import React, { useRef } from "react";

const UpdateNodePos = ({ id }: { id: string }) => {
  const { getNode } = useReactFlow();

  const node = getNode(id);

  if (!node) return;

  const nodePos = useRef(JSON.stringify(node?.position));
  const nodeType = node?.type;

  const deboundRef = React.useRef<number | null>(null);
  const isFirstRender = React.useRef(true);

  const { handleUpdateNodePosition } = useWorkflowMutate();

  React.useEffect(() => {
    if (deboundRef.current) clearTimeout(deboundRef.current);
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    deboundRef.current = setTimeout(() => {
      if (nodePos.current === JSON.stringify(node?.position)) return;
      handleUpdateNodePosition &&
        handleUpdateNodePosition(
          node?.id,
          JSON.stringify(node?.position),
          nodeType as NodeTypeWorkflow
        );
      nodePos.current = JSON.stringify(node?.position);
      isFirstRender.current = true;
    }, 500);
  }, [id, handleUpdateNodePosition, node?.position, node?.id, nodeType]);

  return null;
};

export default UpdateNodePos;
