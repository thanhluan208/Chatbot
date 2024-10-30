import React, { Fragment, useMemo } from "react";
import { Handle, NodeProps, Position } from "@xyflow/react";
import { Box, useTheme } from "@mui/material";
import { v4 as uuid } from "uuid";
import { Code } from "lucide-react";
import EditLabelNode from "@/Components/CommonStyles/EditLabelNode";
import CollapseArea from "@/Components/CommonStyles/CollapseArea";
import GradientBorder from "../../GradientBorder";
import Editor from "./components/Editor";

const WF_CodeNode = (props: NodeProps) => {
  //! State
  const theme = useTheme();

  const handleid = useMemo(() => {
    return uuid();
  }, []);

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
                <Code className="w-3.5 h-3.5" color="#fff" />
              </Box>
              <EditLabelNode
                data={props.data}
                nodeId={props.id}
                positionAbsoluteX={props.positionAbsoluteX}
                positionAbsoluteY={props.positionAbsoluteY}
              />
            </Box>
          }
        >
            <Editor />
        </CollapseArea>
      </GradientBorder>
      <Handle
        type="source"
        position={Position.Right}
        id={handleid}
        isConnectable={true}
        className="handle"
        style={{
          right: "3px",
        }}
      />
    </Fragment>
  );
};

export default React.memo(WF_CodeNode);
