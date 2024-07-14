import React from "react";
import { Box, Fade, ClickAwayListener } from "@mui/material";
import { Popper } from "@mui/base";
import CommonStyles from "../../../Components/CommonStyles";
import LoadCheckPoint from "./CustomNodes/LoadCheckPoint";

export const nodeTypes = {
  customNode_loadCheckPoint: LoadCheckPoint,
};

export enum CustomNodeTypes {
  initNode = "initNode",
}

const AddNodes = () => {
  //! State
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );

  //! Function
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const onDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    nodeType: keyof typeof nodeTypes
  ) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  //! Render
  const open = Boolean(anchorEl);

  return (
    <ClickAwayListener onClickAway={() => setAnchorEl(null)}>
      <Box>
        <Popper
          open={open}
          anchorEl={anchorEl}
          placement={"top"}
          transition
          keepMounted={false}
          modifiers={[
            {
              name: "arrow",
              enabled: true,
            },
          ]}
        >
          {({ TransitionProps }) => (
            <Fade {...TransitionProps} timeout={350}>
              <Box
                sx={{
                  width: "500px",
                  background: "#fff",
                  boxShadow: "0 5px 10px rgba(0,0,0,0.2)",
                  borderRadius: "12px",
                  padding: "10px 20px",
                  marginBottom: "20px",
                }}
              >
                <CommonStyles.Typography type="semiBold16">
                  Drag the node to the canvas, or double click on the canvas to
                  add a node
                </CommonStyles.Typography>
                <Box
                  onDragStart={(event) =>
                    onDragStart(event, "customNode_loadCheckPoint")
                  }
                  draggable
                >
                  Load Check Point
                </Box>
              </Box>
            </Fade>
          )}
        </Popper>
        <CommonStyles.Button onClick={handleClick} variant="contained">
          Add node
        </CommonStyles.Button>
      </Box>
    </ClickAwayListener>
  );
};

export default AddNodes;
