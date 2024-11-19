import useWorkflowMutate from "@/Hooks/workflow/useWorkflowMutate";
import { useReactFlow } from "@xyflow/react";
import React from "react";

const UpdateNodePos = ({ id }: { id: string }) => {
  const { getNode } = useReactFlow();

  const node = getNode(id);

  if (!node) return;

  const deboundRef = React.useRef<NodeJS.Timeout | null>(null);
  const isFirstRender = React.useRef(true);

  const { handleUpdateNodePosition } = useWorkflowMutate();

  React.useEffect(() => {
    if (deboundRef.current) clearTimeout(deboundRef.current);
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    deboundRef.current = setTimeout(() => {
        handleUpdateNodePosition && handleUpdateNodePosition(id, node?.position);
      isFirstRender.current = true;
    }, 500);
  }, [id, handleUpdateNodePosition, node?.position]);

  return null;
};

export default UpdateNodePos;
