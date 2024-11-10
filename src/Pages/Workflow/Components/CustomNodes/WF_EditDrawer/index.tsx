import cachedKeys from "@/Constants/cachedKeys";
import { useGet, useSave } from "@/Stores/useStore";
import { NodeTypeWorkflow } from "@/Types/workflow";
import { Box, Drawer } from "@mui/material";
import LLMNodeDrawer from "../WF_LlmNode/LLMNodeDrawer";
import { NodeProps } from "@xyflow/react";

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

  const renderEditingNode = () => {
    if (!node) return null;
    switch (nodeEditing?.type) {
      case NodeTypeWorkflow.LLM:
        return <LLMNodeDrawer node={node} />;
      default:
        return null;
    }
  };

  //! Render
  return (
    <Drawer
      variant="persistent"
      anchor="right"
      open={!!nodeEditing && !!node && node.id === nodeEditing.id}
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
          width: "50vw",
          height: "100vh",
          transition: "all 0.5s ease",
          position: "relative",
        }}
        role="presentation"
      >
        {renderEditingNode()}
      </Box>
    </Drawer>
  );
}
