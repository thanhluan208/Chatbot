import React, { useCallback, useEffect } from "react";
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
} from "@xyflow/react";
import { v4 as uuid } from "uuid";

import "@xyflow/react/dist/style.css";
import Toolbar from "./Toolbar";
import { nodeTypes } from "./AddNodes";
import AnimatedSVGEdge from "./CustomEdges";
import { Box } from "@mui/material";
import { useSave } from "../../../Stores/useStore";
import cachedKeys from "../../../Constants/cachedKeys";
import reactFlowService from "@/Services/reactFlowService";
import { useAuth } from "@/Providers/AuthenticationProvider";

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
  const [nodes, setNodes, onNodesChange] = useNodesState(
    (props?.initNodes as Node[]) ?? []
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState(initEdges ?? []);
  const { screenToFlowPosition, updateNode } = useReactFlow();
  const save = useSave();

  const { userId } = useAuth();

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
            return edge.source !== connection.source || edge.target !== connection.target;
          });
        });
      }

      return setEdges((eds: any) => {
        const newEdges = [...eds, connection].map((edge) => {
          return {
            src_node: edge.source as string,
            dest_node: edge.target as string,
          }
        });

        reactFlowService.updateEdges(props.botId as string, userId as string, newEdges, onFailed);

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

      setNodes((nds) => nds.concat(newNode as any));

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
      >
        <Controls />
        <MiniMap />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      </ReactFlow>
      <Toolbar listNode={props.listNode} />
    </Box>
  );
}
