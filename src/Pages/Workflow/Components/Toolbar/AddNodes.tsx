import React, { useCallback } from "react";
import { useTheme } from "@mui/material";
import CommonStyles from "../../../../Components/CommonStyles";
import StartNode from "../CustomNodes/StartNode";
import LLMNode from "../CustomNodes/LLMNode";
import EndNode from "../CustomNodes/EndNode";
import MultiAgentStartNode from "../CustomNodes/MultiAgentStartNode";
import MultiAgentNode from "../CustomNodes/MultiAgentNode";
import HelperNode from "../CustomNodes/HelperNode";
import WF_StartNode from "../CustomNodes/WF_StartNode";
import WF_LlmNode from "../CustomNodes/WF_LlmNode";
import WF_ConditionNode from "../CustomNodes/WF_ConditionNode";
import WF_CodeNode from "../CustomNodes/WF_CodeNode";
import WF_LtmNode from "../CustomNodes/WF_LtmNode";
import { NodeTypeWorkflow } from "@/Types/workflow";
import WF_VariableAggregator from "../CustomNodes/WF_VariableAggregator";
import WF_Knowledge from "../CustomNodes/WF_Knowledge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import { WORKFLOW_ICON } from "@/Constants/common";
import { Node, useReactFlow } from "@xyflow/react";
import { v4 as uuid } from "uuid";
import { useSave } from "@/Stores/useStore";
import reactFlowService from "@/Services/reactFlowService";
import { useParams } from "react-router-dom";
import { useAuth } from "@/Providers/AuthenticationProvider";

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
  [`customNode_WF_${NodeTypeWorkflow.LONG_TERM_MEMORY}`]: WF_LtmNode,
  [`customNode_WF_${NodeTypeWorkflow.VARIABLE_AGGREGATOR}`]:
    WF_VariableAggregator,
  [`customNode_WF_${NodeTypeWorkflow.KNOWLEDGE_RETRIEVAL}`]: WF_Knowledge,
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
  initOpen?: boolean;
  helperPosition?: { x: number; y: number };
}

const AddNodes = ({ listNode = [], initOpen, helperPosition }: IAddNodes) => {
  //! State
  const [open, setOpen] = React.useState(initOpen);
  const theme = useTheme();
  const { setNodes, updateNode } = useReactFlow();
  const save = useSave();

  const params = useParams();
  const botId = params?.botId;
  const { userId } = useAuth();

  //! Function
  const handleAddNode = useCallback(
    (node: { name: string; label: string; description?: string }) => {
      if (!setNodes) return;
      const nodeId = uuid();

      const onSuccess = (id: string) => {
        updateNode(nodeId, {
          id: id,
          data: {
            label: `Agent ${id}`,
          },
        });
      };

      const onFailed = () => {
        save(`${nodeId}_remove`, true);
      };

      console.log("adding node");

      setNodes((nodes) => {
        const newNodes = nodes.filter(
          (node) => node.type !== NodeTypes.helperNode
        );
        const lastnode: Node = newNodes[newNodes.length - 1];
        if (lastnode) {
          const position = helperPosition ?? {
            x: lastnode.position.x + (lastnode.measured?.width ?? 200) + 100,
            y: lastnode.position.y,
          };
          const newNode = {
            id: nodeId,
            type: node.name,
            position,
            data: { label: `${node.label} node` },
          };
          newNodes.push(newNode);

          reactFlowService.createFlow(
            botId as string,
            userId as string,
            onSuccess,
            onFailed,
            JSON.stringify(newNode)
          );
        } else {
          const newNode = {
            id: nodeId,
            type: node.name,
            position: helperPosition ?? {
              x: 0,
              y: 0,
            },
            data: { label: `${node.label} node` },
          };
          newNodes.push(newNode);
          reactFlowService.createFlow(
            botId as string,
            userId as string,
            onSuccess,
            onFailed,
            JSON.stringify(newNode)
          );
        }
        return newNodes;
      });
    },
    [setNodes]
  );

  //! Render

  return (
    <DropdownMenu open={open}>
      <DropdownMenuTrigger asChild>
        <button
          className="px-3 py-1 rounded-md flex items-center justify-center"
          style={{
            background: theme.palette.primary.main,
          }}
          onClick={() => setOpen(!open)}
        >
          <CommonStyles.Typography
            type="semiBold16"
            color="#fff"
            className="text-nowrap"
          >
            Add Node
          </CommonStyles.Typography>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-56"
        style={{
          background: theme.colors.custom.backgroundCard,
          border: `1px solid ${theme.colors.custom.borderColor}`,
          color: theme.colors.custom.normalColorTypo,
        }}
      >
        <DropdownMenuGroup>
          {listNode.map((node) => {
            return (
              <DropdownMenuSub key={node.name}>
                <DropdownMenuSubTrigger
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();

                    console.log("adding node", node);
                    handleAddNode(node);
                  }}
                  className="flex cursor-grab gap-2 w-full items-center data-[state=open]:bg-transparent focus:bg-transparent"
                >
                  <div
                    className="w-6 h-6 flex items-center justify-center rounded-md"
                    style={{
                      background: theme.palette.primary.main,
                    }}
                  >
                    {WORKFLOW_ICON[node.name as keyof typeof WORKFLOW_ICON]}
                  </div>
                  <CommonStyles.Typography type="semiBold14">
                    {node.label}
                  </CommonStyles.Typography>
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent
                    className="px-3 py-2"
                    style={{
                      background: theme.colors.custom.backgroundCard,
                      border: `1px solid ${theme.colors.custom.borderColor}`,
                    }}
                  >
                    <div className="flex gap-2">
                      <div
                        className="w-6 h-6 flex items-center justify-center rounded-md"
                        style={{
                          background: theme.palette.primary.main,
                        }}
                      >
                        {WORKFLOW_ICON[node.name as keyof typeof WORKFLOW_ICON]}
                      </div>
                      <CommonStyles.Typography type="semiBold14">
                        {node.label}
                      </CommonStyles.Typography>
                    </div>
                    <CommonStyles.Typography>
                      {node.description}
                    </CommonStyles.Typography>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
            );
          })}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AddNodes;
