import React, { Fragment } from "react";
import { Handle, NodeProps, Position, useReactFlow } from "@xyflow/react";
import { Box, useTheme } from "@mui/material";
import { Component } from "lucide-react";
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
import { LlmNodeData } from "./type";
import useWorkflowMutate from "@/Hooks/workflow/useWorkflowMutate";
import FormModel from "../../misc/FormModel";
import VarOutList from "../../misc/VarOutList";

const WF_StartNode = (props: NodeProps) => {
  //! State
  const { data, id, selected } = props;
  const theme = useTheme();
  const { workflowId } = useParams();
  const save = useSave();
  const { updateNode } = useReactFlow();

  const { handleUpdateNodeDataLLM } = useWorkflowMutate();

  const nodeData = data as unknown as LlmNodeData;

  //! Function

  const handleClickNode = () => {
    updateNode(id, {
      selected: true,
    });
    setTimeout(() => {
      save(cachedKeys.NODE_EDITING, {
        type: NodeTypeWorkflow.LLM,
        id: id,
      });
    }, 0);
  };

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
                    <Component className="w-3.5 h-3.5" color="#fff" />
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
              handleUpdateNodeData={handleUpdateNodeDataLLM}
              model={nodeData?.model}
              nodeId={id}
              memory={nodeData?.memory}
            />

            <VarOutList nodeData={nodeData} />
          </CollapseArea>
        </GradientBorder>

        <Handle
          type="source"
          position={Position.Right}
          id={`${props?.id}-source`}
          isConnectable={true}
          className="handle"
          style={{
            right: "3px",
          }}
        />
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

export default React.memo(WF_StartNode);
