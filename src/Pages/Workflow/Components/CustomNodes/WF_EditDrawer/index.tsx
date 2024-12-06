import cachedKeys from "@/Constants/cachedKeys";
import { useGet, useSave } from "@/Stores/useStore";
import { NodeTypeWorkflow } from "@/Types/workflow";
import { Box, Drawer, useTheme } from "@mui/material";
import LLMNodeDrawer from "../WF_LlmNode/LLMNodeDrawer";
import { NodeProps } from "@xyflow/react";
import VarAggNodeDrawer from "../WF_VariableAggregator/VarAggNodeDrawer";
import { useCallback } from "react";
import CodeNodeDrawer from "../WF_CodeNode/components/CodeNodeDrawer";
import KnowledgeNodeDrawer from "../WF_Knowledge/KnowledgeNodeDrawer";
import ConditionNodeDrawer from "../WF_ConditionNode/ConditionNodeDrawer";
import ParamExtractorDrawer from "../WF_ParamExtractor/ParamExtractorDrawer";
import QuestClassifierNodeDrawer from "../WF_QuestClassifier/QuestClassifierNodeDrawer";
import AnswerNodeDrawer from "../WF_AnswerNode/AnswerNodeDrawer";
import VariableAssignerNodeDrawer from "../WF_VarAssigner/VariableAssignerNodeDrawer";
import HTTPNodeDrawer from "../WF_HttpRequestNode/HTTPNodeDrawer";
import ToolNodeDrawer from "../WF_Tool/ToolNodeDrawer";

interface WF_EditDrawerProps {
  node: NodeProps;
}

export default function WF_EditDrawer({ node }: WF_EditDrawerProps) {
  //! State
  const nodeEditing = useGet("NODE_EDITING");
  const save = useSave();
  const theme = useTheme();

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
      case NodeTypeWorkflow.KNOWLEDGE_RETRIEVAL:
        return <KnowledgeNodeDrawer node={node} />;
      case NodeTypeWorkflow.IF_ELSE:
        return <ConditionNodeDrawer node={node} />;
      case NodeTypeWorkflow.PARAMETER_EXTRACTOR:
        return <ParamExtractorDrawer node={node} />;
      case NodeTypeWorkflow.QUESTION_CLASSIFIER:
        return <QuestClassifierNodeDrawer node={node} />;
      case NodeTypeWorkflow.ANSWER:
        return <AnswerNodeDrawer node={node} />;
      case NodeTypeWorkflow.VARIABLE:
        return <VariableAssignerNodeDrawer node={node} />;
      case NodeTypeWorkflow.HTTP_REQUEST:
        return <HTTPNodeDrawer node={node} />;
      case NodeTypeWorkflow.CODE:
        return <CodeNodeDrawer node={node} />;
      case NodeTypeWorkflow.TOOL:
        return <ToolNodeDrawer node={node} />
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
      PaperProps={{
        className: "no-scrollbar",
        sx: {
          top: "unset",
          right: "20px",
          bottom: "80px",
          height: "calc(100% - 140px)",
          borderRadius: "20px",
          border: `solid 1px ${theme.colors.custom.borderColor}`,
          boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
        },
      }}
    >
      <Box
        id="wrapper"
        sx={{
          width: "min(50vw, 600px)",
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
