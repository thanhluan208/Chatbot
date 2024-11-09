import { Box, Collapse, SxProps } from "@mui/material";
import CommonStyles from ".";
import CommonIcons from "../CommonIcons";
import React, { useEffect } from "react";
import { isString } from "lodash";

interface ICollapseArea {
  children?: React.ReactNode;
  label: string | React.ReactNode;
  sxContainer?: SxProps;
  initOpen?: boolean;
  nodeId?: string;
  dataKey?: string;
}

const CollapseArea = (props: ICollapseArea) => {
  //! State
  const { label, sxContainer, initOpen = true, nodeId, dataKey } = props;
  const [open, setOpen] = React.useState(
    initOpen ||
      !!JSON.parse(localStorage.getItem(nodeId || "") || "{}")[
        dataKey as string
      ] ||
      false
  );
  //! Function

  useEffect(() => {
    if (!isString(dataKey) || !nodeId) return;
    const nodecache = localStorage.getItem(nodeId);
    if (!nodecache) {
      localStorage.setItem(nodeId, JSON.stringify({ [dataKey]: open }));
    } else {
      const parsed = JSON.parse(nodecache);
      localStorage.setItem(
        nodeId,
        JSON.stringify({ ...parsed, [dataKey]: open })
      );
    }
  }, [open, nodeId, dataKey]);

  //! Render
  return (
    <Box
      sx={{
        padding: "8px",
        borderRadius: "12px",
        marginTop: "20px",
        ...sxContainer,
      }}
    >
      <Box
        className="collapse-header"
        sx={{
          display: "flex",
          gap: "8px",
          marginBottom: "12px",
          alignItems: "center",
        }}
      >
        <CommonStyles.Button
          isIcon
          hasBorder={false}
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            setOpen((prev) => !prev);
          }}
          isRound={false}
        >
          <CommonIcons.ExpandMore
            sx={{
              transform: !open ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.3s ease",
            }}
          />
        </CommonStyles.Button>
        <CommonStyles.Typography width="100%" type="semiBold16">
          {label || "Inputs"}
        </CommonStyles.Typography>
      </Box>
      <Collapse in={open}>{props.children}</Collapse>
    </Box>
  );
};

export default CollapseArea;
