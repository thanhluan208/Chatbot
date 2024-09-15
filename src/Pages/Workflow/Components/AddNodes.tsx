import React from "react";
import { Box, ClickAwayListener } from "@mui/material";
import CommonStyles from "../../../Components/CommonStyles";
import StartNode from "./CustomNodes/StartNode";
import LLMNode from "./CustomNodes/LLMNode";
import EndNode from "./CustomNodes/EndNode";
import MultiAgentStartNode from "./CustomNodes/MultiAgentStartNode";
import MultiAgentNode from "./CustomNodes/MultiAgentNode";
import AddNodePopper from "./AddNodePopper";
import HelperNode from "./CustomNodes/HelperNode";

export enum NodeTypes {
  startNode = "customNode_startNode",
  llmNode = "customNode_llmNode",
  endNode = "customNode_endNode",
  multiAgentStartNode = "customNode_mutliAgentStartNode",
  multiAgentNode = "customNode_multiAgentNode",
  helperNode = "customNode_helperNode",
}

export const nodeTypes = {
  customNode_startNode: StartNode,
  customNode_llmNode: LLMNode,
  customNode_endNode: EndNode,
  customNode_mutliAgentStartNode: MultiAgentStartNode,
  customNode_multiAgentNode: MultiAgentNode,
  customNode_helperNode: HelperNode,
};

export enum CustomNodeTypes {
  initNode = "initNode",
}

interface IAddNodes {
  listNode: {
    name: string;
    label: string;
    description?: string;
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

  //! Render
  const open = Boolean(anchorEl);

  return (
    <ClickAwayListener onClickAway={() => setAnchorEl(null)}>
      <Box>
        <AddNodePopper listNode={listNode} anchorEl={anchorEl} open={open}/>
        <CommonStyles.Button onClick={handleClick} variant="contained">
          Add node
        </CommonStyles.Button>
      </Box>
    </ClickAwayListener>
  );
};

export default AddNodes;
