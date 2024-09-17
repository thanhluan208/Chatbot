import { Box, Collapse, SxProps, useTheme } from "@mui/material";
import CommonStyles from "../../../../Components/CommonStyles";
import CommonIcons from "../../../../Components/CommonIcons";
import React from "react";

interface ICollapseArea {
  children?: React.ReactNode;
  label: string | React.ReactNode;
  sxContainer?: SxProps,
  initOpen?:boolean
}

const CollapseArea = (props: ICollapseArea) => {
  //! State
  const { label,sxContainer,initOpen = true} = props;
  const [open, setOpen] = React.useState(initOpen);
  const theme = useTheme()
  //! Function

  //! Render
  return (
    <Box
      sx={{
        padding: "8px",
        background: theme.colors.custom.backgroundSecondary,
        borderRadius:'12px',
        marginTop:'20px',
        ...sxContainer
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
        <CommonStyles.Button isIcon onClick={() => setOpen((prev) => !prev)}>
          <CommonIcons.ExpandMore
            sx={{
              transform: !open ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.3s ease",
            }}
          />
        </CommonStyles.Button>
          {label || "Inputs"}
      </Box>
      <Collapse in={open}>{props.children}</Collapse>
    </Box>
  );
};

export default CollapseArea;
