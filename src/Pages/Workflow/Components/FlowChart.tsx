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
}

export default function FlowChart(props: IFlowChart) {
  const [nodes, setNodes, onNodesChange] = useNodesState(
    (props?.initNodes as Node[]) ?? []
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { screenToFlowPosition, updateNode } = useReactFlow();
  const save = useSave();

  const { userId } = useAuth();

  const onConnect = useCallback(
    (connection: Connection) =>
      setEdges((eds: any) => {
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
      }),
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

      const onSuccess = (id: string) => {
        updateNode(newNode.id, {
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
          onFailed
        );
      }
    },
    [screenToFlowPosition]
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
        height: "100%s",
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
