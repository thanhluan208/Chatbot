import { Box } from "@mui/material";
import { NodeProps } from "@xyflow/react";
import React, { useMemo, useRef } from "react";
import AddNodePopper from "../../Toolbar/AddNodePopper";

const HelperNode = (props: NodeProps) => {
  //! State
  const helperNode = useRef<HTMLDivElement>(null);
  const listNode = useMemo(() => {
    if (!props?.data?.listnode) return [];

    return props?.data?.listnode;
  }, [props?.data]);

  const position = useMemo(() => {
    return {
      x: props?.positionAbsoluteX,
      y: props?.positionAbsoluteY,
    };
  }, [props?.positionAbsoluteX, props?.positionAbsoluteY]);

  //! Function

  //! Render
  return (
    <Box
      ref={helperNode}
      className="helperNode"
      sx={{
        height: "10px",
        width: "10px",
      }}
    >
      <AddNodePopper
        listNode={listNode as any}
        open={!!helperNode?.current}
        anchorEl={helperNode?.current}
        placement="right"
        sxContainer={{
          width: "400px",
        }}
        isHelperNode
        helperPosition={position}
        enableSearch
        enableTool
      />
    </Box>
  );
};

export default React.memo(HelperNode);
