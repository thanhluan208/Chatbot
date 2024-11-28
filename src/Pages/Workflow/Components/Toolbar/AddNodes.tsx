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
import WF_ParamExtractor from "../CustomNodes/WF_ParamExtractor";
import useWorkflowMutate from "@/Hooks/workflow/useWorkflowMutate";
import WF_QuestClassifier from "../CustomNodes/WF_QuestClassifier";
import WF_VarAssigner from "../CustomNodes/WF_VarAssigner";
import WF_AnswerNode from "../CustomNodes/WF_AnswerNode";
import WF_HttpRequestNode from "../CustomNodes/WF_HttpRequestNode";

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
  [`customNode_WF_${NodeTypeWorkflow.PARAMETER_EXTRACTOR}`]: WF_ParamExtractor,
  [`customNode_WF_${NodeTypeWorkflow.QUESTION_CLASSIFIER}`]: WF_QuestClassifier,
  [`customNode_WF_${NodeTypeWorkflow.VARIABLE}`]: WF_VarAssigner,
  [`customNode_WF_${NodeTypeWorkflow.ANSWER}`]: WF_AnswerNode,
  [`customNode_WF_${NodeTypeWorkflow.HTTP_REQUEST}`]: WF_HttpRequestNode,
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
  const { handleAddNodeWorkflow } = useWorkflowMutate();
  const save = useSave();

  const params = useParams();
  const botId = params?.botId;
  const workflowId = params?.workflowId;
  const { userId } = useAuth();

  //! Function
  const handleAddNode = useCallback(
    (node: { name: string; label: string; description?: string }) => {
      if (!setNodes) return;
      const nodeId = uuid();

      const onFailed = () => {
        save(`${nodeId}_remove`, true);
      };

      setNodes((nodes) => {
        if (!userId) return nodes;

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

          const onSuccess = (id: string, nodeData?: any) => {
            console.log("onSuccess", id, nodeData);
            updateNode(newNode.id, {
              id: id,
              data: nodeData,
              selected: true,
            });
          };

          newNodes.push(newNode);

          if (botId) {
            reactFlowService.createFlow(
              botId,
              userId,
              onSuccess,
              onFailed,
              JSON.stringify(newNode)
            );
          }

          if (workflowId) {
            handleAddNodeWorkflow.mutate(
              {
                user_id: userId,
                workflow_id: workflowId,
                position: JSON.stringify(position),
                node_type: node.name?.replace(
                  "customNode_WF_",
                  ""
                ) as NodeTypeWorkflow,
              },
              {
                onSuccess: (res) => {
                  onSuccess(res.data.node_id, {
                    ...res.data?.node_data?.data,
                    variable_out: res?.data?.node_data?.variables_out,
                    label: res.data.node_id,
                  });
                },
                onError: onFailed,
              }
            );
          }
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

          const onSuccess = (id: string, nodeData?: any) => {
            updateNode(newNode.id, {
              id: id,
              data: nodeData,
              selected: true,
            });
          };

          newNodes.push(newNode);
          if (botId) {
            reactFlowService.createFlow(
              botId,
              userId,
              onSuccess,
              onFailed,
              JSON.stringify(newNode)
            );
          }

          if (workflowId) {
            handleAddNodeWorkflow.mutate(
              {
                user_id: userId,
                workflow_id: workflowId,
                position: JSON.stringify(
                  helperPosition ?? {
                    x: 0,
                    y: 0,
                  }
                ),
                node_type: node.name?.replace(
                  "customNode_WF_",
                  ""
                ) as NodeTypeWorkflow,
              },
              {
                onSuccess: (res) => {
                  onSuccess(res.data.node_id, {
                    ...res.data?.node_data?.data,
                    variable_out: res?.data?.node_data?.variables_out,
                    label: res.data.node_id,
                  });
                },
                onError: onFailed,
              }
            );
          }
        }
        return newNodes;
      });
    },
    [
      setNodes,
      updateNode,
      userId,
      botId,
      workflowId,
      helperPosition,
      handleAddNodeWorkflow,
    ]
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
            if (node.name === `customNode_WF_${NodeTypeWorkflow.START}`)
              return null;

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
