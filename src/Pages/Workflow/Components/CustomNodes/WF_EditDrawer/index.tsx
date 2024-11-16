import cachedKeys from "@/Constants/cachedKeys";
import { useGet, useSave } from "@/Stores/useStore";
import { NodeTypeWorkflow } from "@/Types/workflow";
import { Box, Drawer } from "@mui/material";
import LLMNodeDrawer from "../WF_LlmNode/LLMNodeDrawer";
import { NodeProps } from "@xyflow/react";
import VarAggNodeDrawer from "../WF_VariableAggregator/VarAggNodeDrawer";
import { useCallback } from "react";
import CodeNodeDrawer from "../WF_CodeNode/components/CodeNodeDrawer";

interface WF_EditDrawerProps {
  node: NodeProps;
}

export default function WF_EditDrawer({ node }: WF_EditDrawerProps) {
  //! State
  const nodeEditing = useGet("NODE_EDITING");
  const save = useSave();

  //! Function
  const handleClose = (_: {}, reason: "backdropClick" | "escapeKeyDown") => {
    if (reason === "backdropClick") return;
    save(cachedKeys.NODE_EDITING, null);
  };

  const renderEditingNode = useCallback(() => {
    if (!node) return null;
    switch (nodeEditing?.type) {
      case NodeTypeWorkflow.LLM:
        return <LLMNodeDrawer node={node} />;
      case NodeTypeWorkflow.VARIABLE_AGGREGATOR:
        return <VarAggNodeDrawer node={node} />;
      case NodeTypeWorkflow.CODE:
        return <CodeNodeDrawer node={node} />;
      default:
        return null;
    }
  }, [node, nodeEditing?.type]);

  //! Render
  return (
    <Drawer
      variant="persistent"
      anchor="right"
      open={!!nodeEditing && !!node && node?.id === nodeEditing?.id}
      onClose={handleClose}
      hideBackdrop
      onKeyDown={(e) => {
        e.stopPropagation();
      }}
      onDoubleClick={(e) => {
        e.stopPropagation();
      }}
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <Box
        id="wrapper"
        sx={{
          width: "min(50vw, 600px)",
          height: "100vh",
          transition: "all 0.5s ease",
          position: "relative",
        }}
        role="presentation"
      >
        {node?.id === nodeEditing?.id && renderEditingNode()}
      </Box>
    </Drawer>
  );
}
