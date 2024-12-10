import React, { Fragment } from "react";
import { Handle, NodeProps, Position } from "@xyflow/react";
import { Box, useTheme } from "@mui/material";
import { House } from "lucide-react";
import InputArea from "./components/InputArea";
import CollapseArea from "@/Components/CommonStyles/CollapseArea";
import GradientBorder from "../../GradientBorder";
import { NodeData, Variable } from "@/Types/workflow";
import CommonStyles from "@/Components/CommonStyles";

const WF_StartNode = (props: NodeProps) => {
  //! State
  const theme = useTheme();
  const data = props?.data as unknown as NodeData;

  //! Function

  //! Render
  return (
    <Fragment>
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
                <House className="w-3.5 h-3.5" color="#fff" />
              </Box>
              <CommonStyles.Typography type="semiBold14">
                Start
              </CommonStyles.Typography>
            </Box>
          }
        >
          <InputArea
            nodeId={props.id}
            variables={data?.variables as Variable[]}
          />
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
    </Fragment>
  );
};

const MemoizedWF_StartNode = React.memo(WF_StartNode);
export default MemoizedWF_StartNode;
