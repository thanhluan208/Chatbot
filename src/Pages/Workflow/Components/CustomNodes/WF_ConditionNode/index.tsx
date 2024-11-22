import React, { Fragment } from "react";
import { Handle, NodeProps, Position } from "@xyflow/react";
import { Box, useTheme } from "@mui/material";
import { TrendingUpDown } from "lucide-react";
import EditLabelNode from "@/Components/CommonStyles/EditLabelNode";
import GradientBorder from "../../GradientBorder";
import NodeForm from "./components/NodeForm";
import WF_EditDrawer from "../WF_EditDrawer";
import { createPortal } from "react-dom";
import { NodeTypeWorkflow } from "@/Types/workflow";
import { useSave } from "@/Stores/useStore";
import cachedKeys from "@/Constants/cachedKeys";
import { ConditionNodeData } from "./type";
import CommonStyles from "@/Components/CommonStyles";
import CollapseArea from "@/Components/CommonStyles/CollapseArea";

const WF_ConditionNode = (props: NodeProps) => {
  //! State
  const { id } = props;
  const theme = useTheme();
  const save = useSave();

  const nodeData = props?.data as unknown as ConditionNodeData;

  //! Function
  const handleClickNode = () => {
    save(cachedKeys.NODE_EDITING, {
      type: NodeTypeWorkflow.IF_ELSE,
      id: id,
    });
  };

  //! Render
  return (
    <Fragment>
      <div onClick={handleClickNode}>
        <GradientBorder {...props}>
          <Fragment>
            <CollapseArea
              label={
                <div className="flex flex-col gap-2">
                  <Box className="flex gap-2 items-center px-3 py-2">
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
                      <TrendingUpDown className="w-3.5 h-3.5" color="#fff" />
                    </Box>
                    <EditLabelNode nodeId={id} />
                  </Box>

                  {nodeData?.desc && (
                    <CommonStyles.Typography className="px-4 opacity-60 my-2">
                      {nodeData?.desc}
                    </CommonStyles.Typography>
                  )}
                </div>
              }
            >
              <NodeForm cases={nodeData?.cases} />
            </CollapseArea>
          </Fragment>
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
      {createPortal(<WF_EditDrawer node={props} />, document.body)}
    </Fragment>
  );
};

export default React.memo(WF_ConditionNode);
