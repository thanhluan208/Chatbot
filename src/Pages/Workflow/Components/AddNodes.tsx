import React from "react";
import { Box, Fade, ClickAwayListener } from "@mui/material";
import { Popper } from "@mui/base";
import CommonStyles from "../../../Components/CommonStyles";
import StartNode from "./CustomNodes/StartNode";
import LLMNode from "./CustomNodes/LLMNode";
import EndNode from "./CustomNodes/EndNode";
import MultiAgentStartNode from "./CustomNodes/MultiAgentStartNode";
import MultiAgentNode from "./CustomNodes/MultiAgentNode";

export enum NodeTypes {
  startNode = "startNode",
  llmNode = "llmNode",
  endNode = "endNode",
  multiAgentStartNode = "multiAgentStartNode",
  multiAgentNode = "multiAgentNode",
}

export const nodeTypes = {
  customNode_startNode: StartNode,
  customNode_llmNode: LLMNode,
  customNode_endNode: EndNode,
  customNode_mutliAgentStartNode: MultiAgentStartNode,
  customNode_multiAgentNode: MultiAgentNode,
};

export enum CustomNodeTypes {
  initNode = "initNode",
}

interface IAddNodes {
  listNode: {
    name: string;
    label: string;
  }[];
}

const AddNodes = ({ listNode = [] }: IAddNodes) => {
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
                {listNode.map((node) => {
                  return (
                    <Box
                      key={node.name}
                      onDragStart={(event) =>
                        onDragStart(event, node.name as keyof typeof nodeTypes)
                      }
                      draggable
                    >
                      {node.label}
                    </Box>
                  );
                })}
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
