import React, { Fragment, useCallback } from "react";
import { Handle, NodeProps, Position, useReactFlow } from "@xyflow/react";
import { Box, useTheme } from "@mui/material";
import { Plus, Shapes, Trash } from "lucide-react";
import EditLabelNode from "@/Components/CommonStyles/EditLabelNode";
import CollapseArea from "@/Components/CommonStyles/CollapseArea";
import GradientBorder from "../../GradientBorder";
import { useParams } from "react-router-dom";
import { useSave } from "@/Stores/useStore";
import cachedKeys from "@/Constants/cachedKeys";
import { NodeTypeWorkflow } from "@/Types/workflow";
import WF_EditDrawer from "../WF_EditDrawer";
import { createPortal } from "react-dom";
import CommonStyles from "@/Components/CommonStyles";
import VarOutList from "../../misc/VarOutList";
import { NodeDataQuestClassifier } from "./type";
import useWorkflowMutate from "@/Hooks/workflow/useWorkflowMutate";
import FormModel from "../../misc/FormModel";
import { useTranslation } from "react-i18next";
import { cloneDeep } from "lodash";
import { v4 as uuidv4 } from "uuid";

const WF_QuestClassifier = (props: NodeProps) => {
  //! State
  const { id, selected } = props;
  const theme = useTheme();
  const { workflowId } = useParams();
  const { t } = useTranslation("node");
  const save = useSave();
  const { updateNode } = useReactFlow();
  const { handleUpdateNodeDataQuestClassifier } = useWorkflowMutate();

  const nodeData = props.data as unknown as NodeDataQuestClassifier;

  //! Function

  const handleClickNode = () => {
    updateNode(id, {
      selected: true,
    });
    setTimeout(() => {
      save(cachedKeys.NODE_EDITING, {
        type: NodeTypeWorkflow.QUESTION_CLASSIFIER,
        id: id,
      });
    }, 0);
  };

  const handleRemoveClass = useCallback(
    (classId: string) => {
      const newClasses = nodeData.classes.filter((item) => item.id !== classId);

      handleUpdateNodeDataQuestClassifier(id, {
        classes: newClasses,
      });
    },
    [handleUpdateNodeDataQuestClassifier, id, nodeData.classes]
  );

  const handleAddClass = useCallback(
    (e: any) => {
      e.stopPropagation();
      const newClasses = cloneDeep(nodeData.classes);
      newClasses.push({
        id: uuidv4(),
        name: "",
      });

      handleUpdateNodeDataQuestClassifier(id, {
        classes: newClasses,
      });
    },
    [handleUpdateNodeDataQuestClassifier, id, nodeData.classes]
  );

  //! Render
  return (
    <Fragment>
      <div onClick={handleClickNode}>
        <GradientBorder {...props}>
          <CollapseArea
            sxContainer={{ marginTop: 0 }}
            label={
              <div className="flex flex-col gap-2">
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <Box
                    sx={{
                      width: "24px",
                      height: "24px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "8px",
                      background: theme.palette.primary.main,
                    }}
                  >
                    <Shapes className="w-3.5 h-3.5" color="#fff" />
                  </Box>
                  <EditLabelNode nodeId={id} workflowId={workflowId} />
                </Box>
                {nodeData?.desc && (
                  <CommonStyles.Typography className="px-4 opacity-60 my-2">
                    {nodeData?.desc}
                  </CommonStyles.Typography>
                )}
              </div>
            }
          >
            <FormModel
              handleUpdateNodeData={handleUpdateNodeDataQuestClassifier}
              model={nodeData?.model}
              nodeId={id}
            />

            <div className="pl-3 pr-8 my-4">
              <div className="flex items-center justify-between w-full">
                <CommonStyles.Typography type="semiBold16">
                  {t("WF_QuestionClassifier.classes")}
                </CommonStyles.Typography>
                <CommonStyles.Button isIcon onClick={handleAddClass}>
                  <Plus size={16} />
                </CommonStyles.Button>
              </div>
              <div className="px-1 py-1 mt-4  flex flex-col gap-2">
                {nodeData?.classes?.map((item, index) => {
                  return (
                    <div
                      className="relative w-full px-3 rounded-lg py-1 flex items-center justify-between"
                      style={{
                        border: `solid 1px ${theme.colors.custom.borderColor}`,
                        background: theme.colors.custom.background,
                      }}
                      key={item.id}
                    >
                      <div>
                        <CommonStyles.Typography type="semiBold16">
                          {`Class ${index + 1}`}
                        </CommonStyles.Typography>
                        <CommonStyles.Typography className="opacity-50">
                          {item.name}
                        </CommonStyles.Typography>
                      </div>
                      <CommonStyles.Button
                        isIcon
                        color="error"
                        hasBorder={false}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveClass(item.id);
                        }}
                      >
                        <Trash size={16} />
                      </CommonStyles.Button>
                      <Handle
                        type="source"
                        position={Position.Right}
                        id={item.id}
                        isConnectable={true}
                        className="handle"
                        style={{
                          right: "-25px",
                        }}
                        // isValidConnection={(connection) => {
                        //   const edges = getEdges();

                        //   const edgeToTarget = edges.filter(
                        //     (elm) => elm.target === connection.target
                        //   );

                        //   return edgeToTarget.every(
                        //     (elm) => elm.sourceHandle !== handleid
                        //   );
                        // }}
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            <VarOutList nodeData={nodeData} />
          </CollapseArea>
        </GradientBorder>

        <Handle
          type="target"
          position={Position.Left}
          id={`${props?.id}-target`}
          isConnectable={true}
          className="handle"
          style={{
            left: "3px",
          }}
        />
      </div>
      {selected && createPortal(<WF_EditDrawer node={props} />, document.body)}
    </Fragment>
  );
};

export default React.memo(WF_QuestClassifier);
