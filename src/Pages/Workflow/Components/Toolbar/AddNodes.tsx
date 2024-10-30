import React from "react";
import { Box, ClickAwayListener } from "@mui/material";
import CommonStyles from "../../../../Components/CommonStyles";
import StartNode from "../CustomNodes/StartNode";
import LLMNode from "../CustomNodes/LLMNode";
import EndNode from "../CustomNodes/EndNode";
import MultiAgentStartNode from "../CustomNodes/MultiAgentStartNode";
import MultiAgentNode from "../CustomNodes/MultiAgentNode";
import AddNodePopper from "./AddNodePopper";
import HelperNode from "../CustomNodes/HelperNode";
import WF_StartNode from "../CustomNodes/WF_StartNode";
import WF_LlmNode from "../CustomNodes/WF_LlmNode";
import WF_ConditionNode from "../CustomNodes/WF_ConditionNode";
import WF_CodeNode from "../CustomNodes/WF_CodeNode";
import { NodeTypeWorkflow } from "@/Types/workflow";

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
  [`customNode_WF_${NodeTypeWorkflow.START}`]: WF_StartNode,
  [`customNode_WF_${NodeTypeWorkflow.LLM}`]: WF_LlmNode,
  [`customNode_WF_${NodeTypeWorkflow.IF_ELSE}`]: WF_ConditionNode,
  [`customNode_WF_${NodeTypeWorkflow.CODE}`]: WF_CodeNode,
};

export enum CustomNodeTypes {
  initNode = "initNode",
}

interface IAddNodes {
  listNode: {
    name: string;
    label: string;
    description?: string;
    hidden?: boolean;
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
        <AddNodePopper listNode={listNode} anchorEl={anchorEl} open={open} />
        <CommonStyles.Button
          onClick={handleClick}
          variant="contained"
          sx={{
            textWrap: "nowrap",
            overflow: "hidden",
          }}
        >
          Add node
        </CommonStyles.Button>
      </Box>
    </ClickAwayListener>
  );
};

export default AddNodes;
