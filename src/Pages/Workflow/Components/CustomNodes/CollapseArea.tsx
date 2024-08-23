import { Box, Collapse } from "@mui/material";
import CommonStyles from "../../../../Components/CommonStyles";
import CommonIcons from "../../../../Components/CommonIcons";
import React from "react";

interface ICollapseArea {
  children?: React.ReactNode;
  label: string;
}

const CollapseArea = (props: ICollapseArea) => {
  //! State
  const { label } = props;
  const [open, setOpen] = React.useState(true);

  //! Function

  //! Render
  return (
    <Box
      sx={{
        marginTop: "20px",
        padding: "8px",
        background: "#f9f9f9",
      }}
    >
      <Box
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
        <CommonStyles.Typography type="semiBold16">
          {label || "Inputs"}
        </CommonStyles.Typography>
      </Box>
      <Collapse in={open}>{props.children}</Collapse>
    </Box>
  );
};

export default CollapseArea;
