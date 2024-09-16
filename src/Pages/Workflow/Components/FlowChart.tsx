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
import { NodeTypes, nodeTypes } from "./AddNodes";
import AnimatedSVGEdge from "./CustomEdges";
import { Box, useTheme } from "@mui/material";
import { useSave } from "../../../Stores/useStore";
import cachedKeys from "../../../Constants/cachedKeys";
import reactFlowService from "@/Services/reactFlowService";
import { useAuth } from "@/Providers/AuthenticationProvider";
import CommonStyles from "@/Components/CommonStyles";
import CommonIcons from "@/Components/CommonIcons";
import { cloneDeep } from "lodash";

const edgeTypes = {
  animatedSvg: AnimatedSVGEdge,
};

interface IFlowChart {
  initNodes: Node[];
  listNode: { name: string; label: string }[];
  botId?: string;
  isMultiAgent?: boolean;
  initEdges?: Edge[];
}

export default function FlowChart(props: IFlowChart) {
  const { isMultiAgent, initEdges } = props;
  const edgeReconnectSuccessful = useRef(true);
  const [nodes, setNodes, onNodesChange] = useNodesState(
    (props?.initNodes as Node[]) ?? []
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState(initEdges ?? []);
  const { screenToFlowPosition, updateNode } = useReactFlow();
  const save = useSave();
  const theme = useTheme();

  const { userId } = useAuth();

  const onReconnectStart = useCallback(() => {
    edgeReconnectSuccessful.current = false;
  }, []);

  const onReconnect = useCallback(
    (oldEdge: Edge, newConnection: Connection) => {
      try {
        edgeReconnectSuccessful.current = true;
        setEdges((els) => {
          const newEdges = reconnectEdge(oldEdge, newConnection, els);

          if (props?.botId && userId) {
            reactFlowService.updateEdges(
              props.botId as string,
              userId as string,
              cloneDeep(newEdges).map((elm) => {
                return {
                  dest_node: elm.target,
                  src_node: elm.source,
                };
              })
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
        setEdges((eds) => {
          const newEdges = eds.filter((e) => e.id !== edge.id);

          if (props?.botId && userId) {
            reactFlowService.updateEdges(
              props.botId as string,
              userId as string,
              cloneDeep(newEdges).map((elm) => {
                return {
                  dest_node: elm.target,
                  src_node: elm.source,
                };
              })
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
      const onFailed = () => {
        setEdges((eds: any) => {
          return eds.filter((edge: Edge) => {
            return (
              edge.source !== connection.source ||
              edge.target !== connection.target
            );
          });
        });
      };

      return setEdges((eds: any) => {
        const newEdges = [...eds, connection].map((edge) => {
          return {
            src_node: edge.source as string,
            dest_node: edge.target as string,
          };
        });

        reactFlowService.updateEdges(
          props.botId as string,
          userId as string,
          newEdges,
          onFailed
        );

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

    [setEdges]
  );

  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();

      const type = event.dataTransfer.getData("application/reactflow");

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
        data: { label: `${type} node` },
      };

      setNodes((nds) =>
        nds
          .filter((node) => node.type !== NodeTypes.helperNode)
          .concat(newNode as any)
      );

      if (isMultiAgent) {
        const onSuccess = (id: string) => {
          updateNode(newNode.id, {
            id: id,
            data: {
              label: `Agent ${id}`,
            },
          });
        };

        const onFailed = () => {
          save(`${newNode.id}_remove`, true);
        };

        if (props.botId) {
          reactFlowService.createFlow(
            props.botId,
            userId as string,
            onSuccess,
            onFailed,
            JSON.stringify(newNode)
          );
        }
      }
    },
    [screenToFlowPosition, isMultiAgent, setNodes, updateNode, props.botId]
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

  useEffect(() => {
    save(cachedKeys.FLOW_NODES, nodes);
  }, [save, nodes]);

  useEffect(() => {
    save(cachedKeys.FLOW_EDGES, edges);
  }, [edges, save]);

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        position: "relative",
        "& .handle": {
          height: "10px",
          width: "10px",
          borderRadius: "50%",
          background: "#4e40e5",
          transition: "all 0.3s ease",
          "&:hover": {
            height: "20px",
            width: "20px",
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
        snapToGrid
      >
        <CommonStyles.Button
          isIcon
          sx={{
            background: theme.colors.custom.backgroundCard,
            position: "absolute",
            top: "10px",
            right: "10px",
            cursor: "pointer",
            zIndex: 1000,
            borderRadius: "8px",
          }}
          onClick={() => {
            save(cachedKeys.OPEN_CHAT, true);
          }}
        >
          <CommonIcons.ChatBubble />
        </CommonStyles.Button>
        <Controls />
        <MiniMap />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      </ReactFlow>
      <Toolbar listNode={props.listNode} />
    </Box>
  );
}
