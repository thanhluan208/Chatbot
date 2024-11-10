import React, { Fragment } from "react";
import { Handle, NodeProps, Position } from "@xyflow/react";
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

const WF_StartNode = (props: NodeProps) => {
  //! State
  const { data, id, positionAbsoluteX, positionAbsoluteY } = props;
  const theme = useTheme();
  const { workflowId } = useParams();
  const save = useSave();

  //! Function

  const handleClickNode = () => {
    save(cachedKeys.NODE_EDITING, {
      type: NodeTypeWorkflow.LLM,
      id: id,
    });
  };

  //! Render
  return (
    <Fragment>
      <div onClick={handleClickNode}>
        <GradientBorder {...props}>
          <CollapseArea
            sxContainer={{ marginTop: 0 }}
            label={
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
                <EditLabelNode
                  data={data}
                  nodeId={id}
                  positionAbsoluteX={positionAbsoluteX}
                  positionAbsoluteY={positionAbsoluteY}
                  workflowId={workflowId}
                />
              </Box>
            }
          ></CollapseArea>
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
      {createPortal(<WF_EditDrawer node={props} />, document.body)}
    </Fragment>
  );
};

export default React.memo(WF_StartNode);
