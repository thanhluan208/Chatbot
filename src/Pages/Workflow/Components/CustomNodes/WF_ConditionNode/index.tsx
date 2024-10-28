import React, { Fragment } from "react";
import { Handle, NodeProps, Position } from "@xyflow/react";
import { Box, useTheme } from "@mui/material";
import { TrendingUpDown } from "lucide-react";
import EditLabelNode from "@/Components/CommonStyles/EditLabelNode";
import GradientBorder from "../../GradientBorder";
import NodeForm from "./components/NodeForm";


const WF_ConditionNode = (props: NodeProps) => {
  //! State
  const { id, data, positionAbsoluteX, positionAbsoluteY } = props;
  const theme = useTheme();

  //! Function

  //! Render
  return (
    <Fragment>
      <GradientBorder {...props}>
        <Fragment>
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
            <EditLabelNode
              data={data}
              nodeId={id}
              positionAbsoluteX={positionAbsoluteX}
              positionAbsoluteY={positionAbsoluteY}
            />
          </Box>

          <NodeForm />
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
    </Fragment>
  );
};

export default React.memo(WF_ConditionNode);
