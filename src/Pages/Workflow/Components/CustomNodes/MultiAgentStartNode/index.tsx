import React, { useMemo } from "react";
import { Handle, Position } from "@xyflow/react";
import { Box, useTheme } from "@mui/material";
import { v4 as uuid } from "uuid";
import CommonStyles from "@/Components/CommonStyles";

const MultiAgentStartNode = () => {
  //! State
  const theme = useTheme()
  const handleid = useMemo(() => {
    return uuid();
  }, []);

  //! Function

  //! Render
  return (
    <Box
      sx={{
        borderRadius: "8px",
        background: theme.palette.primary.main,
        border: "solid 2px transparent",
        minWidth: "200px",
        boxShadow: "0 0 8px 0 rgba(29,28,35,.06),0 0 2px 0 rgba(29,28,35,.18)",
        "&:hover": {
          boxShadow: "0 0 1px rgba(0,0,0,.3),0 4px 14px rgba(0,0,0,.1)",
        },
        padding: "12px",
      }}
    >
      <CommonStyles.Typography type="bold14" textAlign="center" color="#fff">
        Start node
      </CommonStyles.Typography>
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

export default React.memo(MultiAgentStartNode);
