import cachedKeys from "@/Constants/cachedKeys";
import { useGet, useSave } from "@/Stores/useStore";
import { NodeTypeWorkflow } from "@/Types/workflow";
import { Box, Drawer } from "@mui/material";
import LLMNodeDrawer from "../WF_LlmNode/LLMNodeDrawer";
import { NodeProps } from "@xyflow/react";
import VarAggNodeDrawer from "../WF_VariableAggregator/VarAggNodeDrawer";
import { useCallback } from "react";
import KnowledgeNodeDrawer from "../WF_Knowledge/KnowledgeNodeDrawer";
import ConditionNodeDrawer from "../WF_ConditionNode/ConditionNodeDrawer";
import ParamExtractorDrawer from "../WF_ParamExtractor/ParamExtractorDrawer";
import QuestClassifierNodeDrawer from "../WF_QuestClassifier/QuestClassifierNodeDrawer";

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
      case NodeTypeWorkflow.KNOWLEDGE_RETRIEVAL:
        return <KnowledgeNodeDrawer node={node} />;
      case NodeTypeWorkflow.IF_ELSE:
        return <ConditionNodeDrawer node={node} />;
      case NodeTypeWorkflow.PARAMETER_EXTRACTOR:
        return <ParamExtractorDrawer node={node} />;
      case NodeTypeWorkflow.QUESTION_CLASSIFIER:
        return <QuestClassifierNodeDrawer node={node} />;
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
