import React, { useCallback, useEffect, useRef } from "react";
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  BackgroundVariant,
  useReactFlow,
  MarkerType,
  Node,
  Edge,
  reconnectEdge,
} from "@xyflow/react";
import { v4 as uuid } from "uuid";

import "@xyflow/react/dist/style.css";
import Toolbar from "./Toolbar";
import { NodeTypes, nodeTypes } from "./Toolbar/AddNodes";
import AnimatedSVGEdge from "./CustomEdges";
import { Box, useTheme } from "@mui/material";
import { useSave } from "../../../Stores/useStore";
import cachedKeys from "../../../Constants/cachedKeys";
import reactFlowService from "@/Services/reactFlowService";
import { useAuth } from "@/Providers/AuthenticationProvider";
import { cloneDeep } from "lodash";
import { detectDiff } from "@/Helpers";
import httpServices from "@/Services/httpServices";
import { deleteBotNode, removeNodeWorkflowAPI } from "@/Constants/api";
import { toast } from "react-toastify";
import useWorkflowMutate from "@/Hooks/workflow/useWorkflowMutate";
import { useQueryClient } from "react-query";
import queryKey from "@/Constants/queryKey";
import { AddEdgePayload, NodeTypeWorkflow } from "@/Types/workflow";

const edgeTypes = {
  animatedSvg: AnimatedSVGEdge,
};

interface IFlowChart {
  initNodes: Node[];
  listNode: { name: string; label: string }[];
  botId?: string;
  isMultiAgent?: boolean;
  initEdges?: Edge[];
  workflowId?: string;
}

export type HistoryFlow = {
  nodes: Node[];
  edges: Edge[];
}[];

export default function FlowChart(props: IFlowChart) {
  const { isMultiAgent, initEdges = [], initNodes, workflowId } = props;
  const edgeReconnectSuccessful = useRef(true);
  const [nodes, setNodes, onNodesChange] = useNodesState(
    (initNodes as Node[]) ?? []
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState([] as Edge[]);
  const { screenToFlowPosition, updateNode, getNodes, getEdges, getNode } =
    useReactFlow();
  const save = useSave();
  const theme = useTheme();
  const queryClient = useQueryClient();


  const { handleAddNodeWorkflow, handleAddEdge, handleRemoveEdge } =
    useWorkflowMutate();

  const { userId } = useAuth();

  const onReconnectStart = useCallback(() => {
    edgeReconnectSuccessful.current = false;
  }, []);

  useEffect(() => {
    setEdges(initEdges as Edge[]);
  }, [initEdges]);

  const onReconnect = useCallback(
    (oldEdge: Edge, newConnection: Connection) => {
      if (
        newConnection.source === newConnection.target ||
        oldEdge.target === newConnection.target
      )
        return;

      const onFailed = () => {
        setEdges((eds) =>
          eds.filter(
            (edge) =>
              edge.sourceHandle !== newConnection.sourceHandle ||
              edge.targetHandle !== newConnection.targetHandle
          )
        );
      };

      try {
        edgeReconnectSuccessful.current = true;
        setEdges((els) => {
          const newEdges = reconnectEdge(oldEdge, newConnection, els);

          if (props?.botId && userId) {
            reactFlowService.updateEdge(
              true,
              props.botId as string,
              newConnection.source,
              newConnection.target,
              onFailed
            );
            return newEdges;
          }

          if (workflowId && userId) {
            handleAddEdge.mutate(
              {
                user_id: userId,
                workflow_id: workflowId,
                src_node_id: newConnection.source,
                dest_node_id: newConnection.target,
              },
              {
                onSuccess: (response) => {
                  if (response.status_code !== 200) {
                    onFailed();
                  }
                },
                onError: () => {
                  onFailed();
                },
              }
            );

            handleRemoveEdge.mutate(
              {
                user_id: userId,
                workflow_id: workflowId,
                edge_id: `${oldEdge.source}-source-${oldEdge.target}-target`,
              },
              {
                onSuccess: (response) => {
                  if (response.status_code !== 200) {
                    onFailed();
                  }
                  queryClient.invalidateQueries({
                    queryKey: [queryKey.WORKFLOW_VAR_SELECTOR],
                  });
                },
                onError: () => {
                  onFailed();
                },
              }
            );

            return newEdges;
          }

          return els;
        });
      } catch (error) {
        console.log("err", error);
      }
    },
    [props?.botId, userId]
  );

  const onReconnectEnd = useCallback(
    (_: any, edge: Edge) => {
      if (!edgeReconnectSuccessful.current) {
        const onFailed = () => {
          setEdges((eds) => {
            return addEdge(edge, eds);
          });
        };

        setEdges((eds) => {
          const newEdges = eds.filter((e) => e.id !== edge.id);

          if (props?.botId && userId) {
            reactFlowService.updateEdge(
              false,
              props.botId as string,
              edge.source,
              edge.target,
              onFailed
            );
            return newEdges;
          }

          if (workflowId && userId) {
            handleRemoveEdge.mutate(
              {
                user_id: userId,
                workflow_id: workflowId,
                edge_id: `${edge.source}-source-${edge.target}-target`,
              },
              {
                onSuccess: (response) => {
                  if (response.status_code !== 200) {
                    onFailed();
                  }
                  queryClient.invalidateQueries({
                    queryKey: [queryKey.WORKFLOW_VAR_SELECTOR],
                  });
                },
                onError: () => {
                  onFailed();
                },
              }
            );

            return newEdges;
          }

          return eds;
        });
      }

      edgeReconnectSuccessful.current = true;
    },
    [props?.botId, userId]
  );

  const onDragStop = async (_: React.MouseEvent, node: Node) => {
    //TODO: HISTORY FEATURE
    // handleSaveHistory(newNodes, getEdges());
    if (isMultiAgent) {
      const info = {
        position: node.position,
        data: node.data,
        measured: node.measured,
      };
      reactFlowService.updateFlow(
        props.botId as string,
        node.id,
        JSON.stringify(info)
      );
    }
  };

  const onConnect = useCallback(
    (connection: Connection) => {
      if (connection.source === connection.target) {
        return;
      }

      const onFailed = () => {
        setEdges((eds) =>
          eds.filter(
            (edge) =>
              edge.sourceHandle !== connection.sourceHandle ||
              edge.targetHandle !== connection.targetHandle
          )
        );
      };
      if (props.botId) {
        reactFlowService.updateEdge(
          true,
          props.botId,
          connection.source,
          connection.target,
          onFailed
        );
      }

      if (workflowId && userId) {
        const sourceNode = getNode(connection.source);
        const isConditionNode =
          sourceNode?.type === `customNode_WF_${NodeTypeWorkflow.IF_ELSE}`;

        const payload: AddEdgePayload = {
          user_id: userId,
          workflow_id: workflowId,
          src_node_id: connection.source,
          dest_node_id: connection.target,
        };

        if (isConditionNode && connection.sourceHandle) {
          payload.source_handle = connection.sourceHandle;
        }

        handleAddEdge.mutate(payload, {
          onSuccess: (response) => {
            if (response.status_code !== 200) {
              onFailed();
            }
            queryClient.invalidateQueries({
              queryKey: [queryKey.WORKFLOW_VAR_SELECTOR],
            });
          },
          onError: () => {
            onFailed();
          },
        });
      }

      return setEdges((eds: any) => {
        return addEdge(
          {
            ...connection,
            type: "animatedSvg",
            markerEnd: {
              type: MarkerType.ArrowClosed,
              width: 20,
              height: 20,
              color: "#4e40e5",
            },
            deletable: true,
          } as never,
          eds
        );
      });
    },

    [setEdges, getNode, props.botId, workflowId, userId]
  );

  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();

      const { nodeType: type, label } = JSON.parse(
        event.dataTransfer.getData("application/reactflow")
      );

      if (typeof type === "undefined" || !type) {
        return;
      }

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      const newNode = {
        id: uuid(),
        type,
        position,
        data: { label: `${label}` },
      };

      setNodes((nds) => {
        const newNodes = nds
          .filter((node) => node.type !== NodeTypes.helperNode)
          .concat(newNode as any);

        return newNodes;
      });

      const onSuccess = (id: string, nodeData?: any) => {
        updateNode(newNode.id, {
          id: id,
          data: nodeData,
        });
      };

      const onFailed = () => {
        save(`${newNode.id}_remove`, true);
      };

      if (isMultiAgent && props.botId) {
        reactFlowService.createFlow(
          props.botId,
          userId as string,
          onSuccess,
          onFailed,
          JSON.stringify(newNode)
        );
      }
      if (!isMultiAgent && workflowId) {
        handleAddNodeWorkflow.mutate(
          {
            user_id: userId as string,
            workflow_id: workflowId as string,
            position: JSON.stringify(position),
            node_type: type?.replace("customNode_WF_", ""),
          },
          {
            onSuccess: (res) => {
              onSuccess(res.data.node_id, {
                ...res.data?.node_data?.data,
                variables_out: res?.data?.variables_out,
                label: res.data.node_id,
              });
            },
            onError: onFailed,
          }
        );
      }
    },
    [
      screenToFlowPosition,
      isMultiAgent,
      setNodes,
      updateNode,
      props.botId,
      workflowId,
    ]
  );

  const onDoubleClick = useCallback(
    (event: React.MouseEvent<Element, MouseEvent>) => {
      event.preventDefault();
      if (nodes.some((node) => node.type === NodeTypes.helperNode)) {
        return;
      }

      const id = uuid();
      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode = {
        id: id,
        type: NodeTypes.helperNode,
        position,
        data: {
          listnode: props.listNode,
        },
      };

      setNodes((nds) => nds.concat(newNode as any));
    },
    [props?.listNode, nodes]
  );

  const onPaneClick = useCallback(() => {
    if (nodes.some((elm) => elm.type === NodeTypes.helperNode))
      setNodes((nodes) =>
        nodes.filter((elm) => elm.type !== NodeTypes.helperNode)
      );
  }, [nodes]);

  const handleSaveHistory = useCallback(
    (nodes: Node[], edges: Edge[]) => {
      save(
        cachedKeys.HISTORY,
        (state: any) => {
          const validNodes =
            cloneDeep(nodes).filter((node) => !node?.data?.isPlaceholder) ?? [];
          const validEdges =
            cloneDeep(edges).filter((edge) => !edge?.data?.isPlaceholder) ?? [];

          const history: HistoryFlow = [...(state[cachedKeys.HISTORY] ?? [])];

          if (history.length === 0) {
            return [
              {
                nodes: validNodes,
                edges: validEdges,
              },
            ];
          } else {
            const { nodes: prevNodes, edges: prevEdges } =
              history[history.length - 1];

            const diffNode = detectDiff(prevNodes, validNodes);
            const diffEdge = detectDiff(prevEdges, validEdges);
            if (!diffNode && !diffEdge) {
              return state[cachedKeys.HISTORY];
            }

            history.push({
              nodes: validNodes,
              edges: validEdges,
            });
          }

          return history;
        },
        true
      );
    },
    [getNodes, getEdges]
  );

  const handleDeleteNode = useCallback(
    async (nodes: Node[]) => {
      const promise: Promise<any>[] = [];

      const deleteEdges = cloneDeep(edges).filter((edge) => {
        return (
          nodes.some((node) => node.id === edge.source) ||
          nodes.some((node) => node.id === edge.target)
        );
      });

      nodes.forEach((node) => {
        const payload = {
          node_id: node.id,
          user_id: userId,
          bot_id: props.botId,
          workflow_id: workflowId,
        };

        promise.push(
          httpServices.post(
            workflowId ? removeNodeWorkflowAPI : deleteBotNode,
            payload
          )
        );
      });

      const response = await Promise.allSettled(promise);
      save(
        cachedKeys.NODE_EDITING,
        (state: any) => {
          const nodeEditing = state[cachedKeys.NODE_EDITING];
          if (nodeEditing) {
            const found = nodes.find((node) => node.id === nodeEditing.id);
            if (found) {
              return null;
            }
          }
          return state[cachedKeys.NODE_EDITING];
        },
        true
      );

      const failedNodes: Node[] = [];

      response.forEach((res, index) => {
        if (res.status === "rejected") {
          toast.error(`Failed to delete ${nodes[index].data?.label}`);
          failedNodes.push(nodes[index]);
        }
      });

      if (failedNodes.length > 0) {
        setNodes((nodes) => nodes.concat(failedNodes));
        setEdges((edges) => edges.concat(deleteEdges));
      }
    },
    [props?.botId, edges, userId]
  );

  const nodeColor = (node: Node) => {
    if (node.selected) {
      return "#4e40e5";
    } else if (node.data?.startNode) {
      return theme.palette.secondary.main;
    } else if (node.data?.currentNode) {
      return theme.palette.success.main;
    }

    return "";
  };

  useEffect(() => {
    save(cachedKeys.SAVE_HISTORY, handleSaveHistory);
  }, [handleSaveHistory, save]);

  useEffect(() => {
    return () => {
      save(cachedKeys.HISTORY, []);
    };
  }, []);

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        position: "relative",
        "& .handle": {
          height: "15px",
          width: "15px",
          borderRadius: "50%",
          background: "#4e40e5",
          transition: "all 0.3s ease",
          "&:hover": {
            height: "30px",
            width: "30px",
          },
        },
      }}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onNodeDragStop={onDragStop}
        fitView
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        minZoom={0.1}
        onPaneClick={onPaneClick}
        zoomOnDoubleClick={false}
        colorMode={theme?.palette?.mode}
        onContextMenu={onDoubleClick}
        onReconnect={onReconnect}
        onReconnectEnd={onReconnectEnd}
        onReconnectStart={onReconnectStart}
        onViewportChange={(viewport) => {
          const zoom = viewport.zoom;
          save(cachedKeys.VIEWPORT, zoom);
        }}
        selectionKeyCode={"shift"}
        panOnScroll={true}
        onNodesDelete={handleDeleteNode}
      >
        <Controls />
        <MiniMap nodeColor={nodeColor} />
        <Background
          variant={BackgroundVariant.Dots}
          gap={12}
          size={1}
          bgColor={theme.colors.custom.background}
        />
      </ReactFlow>
      <Toolbar listNode={props.listNode} />
    </Box>
  );
}
