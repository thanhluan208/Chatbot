import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandList,
} from "@/Components/ui/command";
import { Box, PopperPlacementType, SxProps, useTheme } from "@mui/material";
import { NodeTypes, nodeTypes } from "./AddNodes";
import { useCallback } from "react";
import { Node, useReactFlow } from "@xyflow/react";
import { v4 as uuid } from "uuid";
import { useSave } from "@/Stores/useStore";
import reactFlowService from "@/Services/reactFlowService";
import { useParams } from "react-router-dom";
import { useAuth } from "@/Providers/AuthenticationProvider";
import CommonStyles from "@/Components/CommonStyles";
import CommonIcons from "@/Components/CommonIcons";
import { WORKFLOW_ICON } from "@/Constants/common";
import { CommandItem } from "cmdk";

interface ListNodeProps {
  open?: boolean;
  anchorEl?: HTMLElement | null;
  listNode: {
    name: string;
    label: string;
    description?: string;
    hidden?: boolean;
  }[];
  placement?: PopperPlacementType;
  sxContainer?: SxProps;
  isHelperNode?: boolean;
  helperPosition?: { x: number; y: number };
}

const ListNode = ({
  listNode,
  helperPosition,
  isHelperNode,
}: ListNodeProps) => {
  const theme = useTheme();
  const { setNodes, updateNode } = useReactFlow();
  const save = useSave();

  const params = useParams();
  const botId = params?.botId;
  const { userId } = useAuth();

  const onDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    nodeType: keyof typeof nodeTypes,
    label: string
  ) => {
    event.dataTransfer.setData(
      "application/reactflow",
      JSON.stringify({ nodeType, label })
    );
    event.dataTransfer.effectAllowed = "move";
  };

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

  return (
    <Command
      className="rounded-sm"
      style={{
        backgroundColor: theme.colors.custom.backgroundCard,
        color: theme.colors.custom.normalColorTypo,
      }}
    >
      
      <CommandList>
        <CommandEmpty>No variables found!.</CommandEmpty>
        <CommandGroup>
          <div className="flex flex-col gap-2">
            {listNode.map((node) => {
              if (node.hidden) return null;
              return (
                <CommandItem key={node.name} value={node.label}>
                  <div
                    className="px-3 py-1 backdrop-blur cursor-grab flex justify-between items-center rounded-md border "
                    onDragStart={(event) =>
                      onDragStart(
                        event,
                        node.name as keyof typeof nodeTypes,
                        node.label
                      )
                    }
                    draggable
                    style={{
                      border: `1px solid ${theme.palette.primary.main}`,
                      boxShadow:
                        "0 6px 8px 0 rgba(29,28,35,.06),0 0 2px 0 rgba(29,28,35,.18)",
                    }}
                  >
                    <div>
                      <div className="flex gap-1 items-center">
                        <div
                          className="w-6 h-6 flex items-center justify-center rounded-md"
                          style={{
                            background: theme.palette.primary.main,
                          }}
                        >
                          {
                            WORKFLOW_ICON[
                              node.name as keyof typeof WORKFLOW_ICON
                            ]
                          }
                        </div>
                        <CommonStyles.Typography
                          type={isHelperNode ? "semiBold12" : "semiBold16"}
                        >
                          {node.label}
                        </CommonStyles.Typography>
                      </div>
                      <CommonStyles.Typography
                        type={isHelperNode ? "normal10" : "normal16"}
                        sx={{ opacity: 0.5 }}
                      >
                        {node.description}
                      </CommonStyles.Typography>
                    </div>
                    <CommonStyles.Button
                      variant="outlined"
                      startIcon={<CommonIcons.Add />}
                      sx={{
                        border: `1px solid ${theme.palette.primary.main}`,
                      }}
                      onClick={() => {
                        handleAddNode(node);
                      }}
                    >
                      <CommonStyles.Typography
                        type={isHelperNode ? "semiBold12" : "semiBold16"}
                      >
                        Add
                      </CommonStyles.Typography>
                    </CommonStyles.Button>
                  </div>
                </CommandItem>
              );
            })}
          </div>
        </CommandGroup>
      </CommandList>
    </Command>
  );
};

export default ListNode;
