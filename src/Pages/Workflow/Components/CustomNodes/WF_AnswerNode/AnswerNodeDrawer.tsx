import CommonStyles from "@/Components/CommonStyles";
import EditLabelNode from "@/Components/CommonStyles/EditLabelNode";
import { useTheme } from "@mui/material";
import { NodeProps } from "@xyflow/react";
import { Component, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import cachedKeys from "@/Constants/cachedKeys";
import { useSave } from "@/Stores/useStore";
import useWorkflowMutate from "@/Hooks/workflow/useWorkflowMutate";
import DescriptionInput from "../../DescriptionInput";
import VarOutList from "../../misc/VarOutList";
import CollapseArea from "@/Components/CommonStyles/CollapseArea";
import { NodeDataAnswer } from "./type";
import EditorPrompt from "../../misc/EditorPromtpt";
import { useCallback } from "react";

interface AnswerNodeDrawerProps {
  node?: NodeProps;
}
const AnswerNodeDrawer = ({ node }: AnswerNodeDrawerProps) => {
  const theme = useTheme();
  const { workflowId } = useParams();
  const save = useSave();
  const { t } = useTranslation("node");
  const {} = useWorkflowMutate();

  const { handleUpdateNodeDataAnswer } = useWorkflowMutate();

  if (!node) return null;

  const nodeData = node?.data as unknown as NodeDataAnswer;

  const handleUpdate = (payload: Partial<NodeDataAnswer>) => {
    handleUpdateNodeDataAnswer(node?.id, payload);
  };

  const handleUpdateAnswer = useCallback(
    (id: string, value: string) => {
      handleUpdateNodeDataAnswer(id, {
        answer: value,
      });
    },
    [handleUpdateNodeDataAnswer]
  );

  return (
    <div
      className="py-4"
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <div className="flex flex-col  sticky top-0 px-6 py-4 z-50 backdrop-blur-3xl">
        <div className="flex justify-between">
          <div className="flex items-center gap-2 ">
            <div
              className="w-6 h-6 flex items-center justify-center rounded-md"
              style={{
                background: theme.palette.primary.main,
              }}
            >
              <Component className="w-3.5 h-3.5" color="#fff" />
            </div>
            <EditLabelNode nodeId={node.id} workflowId={workflowId} />
          </div>

          <CommonStyles.Button
            isIcon
            sx={{
              position: "absolute",
              top: 16,
              right: 16,
            }}
            onClick={() => {
              save(cachedKeys.NODE_EDITING, null);
            }}
          >
            <X size={24} />
          </CommonStyles.Button>
        </div>
        <DescriptionInput value={nodeData.desc} handleUpdate={handleUpdate} />
      </div>

      <div className="px-3">
        <CollapseArea
          label={
            <CommonStyles.Typography type="semiBold16">
              {t("WF_AnswerNode.answer")}
            </CommonStyles.Typography>
          }
        >
          <EditorPrompt
            id={node?.id}
            nodeId={node?.id}
            value={nodeData?.answer}
            handleChangeEditor={handleUpdateAnswer}
          />
        </CollapseArea>
      </div>
      <hr className="my-2 mx-4 opacity-20" />
      <div className="px-3">
        <VarOutList nodeData={nodeData} />
      </div>
    </div>
  );
};

export default AnswerNodeDrawer;
