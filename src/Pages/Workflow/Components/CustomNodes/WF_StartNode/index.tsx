import React, { useMemo } from "react";
import { Handle, NodeProps, Position } from "@xyflow/react";
import { Box, useTheme } from "@mui/material";
import { v4 as uuid } from "uuid";
import { House } from "lucide-react";
import EditLabelNode from "@/Components/CommonStyles/EditLabelNode";
import InputArea from "./components/InputArea";
import CollapseArea from "@/Components/CommonStyles/CollapseArea";

const WF_StartNode = (props: NodeProps) => {
  //! State
  const theme = useTheme();

  const handleid = useMemo(() => {
    return uuid();
  }, []);

  //! Function

  //! Render
  return (
    <Box
      sx={{
        borderRadius: "8px",
        background: theme.colors.custom.backgroundCard,
        border: "solid 2px transparent",
        width: "400px",
        boxShadow: "0 0 8px 0 rgba(29,28,35,.06),0 0 2px 0 rgba(29,28,35,.18)",
        "&:hover": {
          boxShadow: "0 0 1px rgba(0,0,0,.3),0 4px 14px rgba(0,0,0,.1)",
        },
      }}
    >
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
              <House className="w-3.5 h-3.5" />
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
        <InputArea />
      </CollapseArea>

      <Handle
        type="source"
        position={Position.Right}
        id={handleid}
        isConnectable={true}
        className="handle"
      />
    </Box>
  );
};

export default React.memo(WF_StartNode);
