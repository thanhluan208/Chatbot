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
} from "@xyflow/react";
import { v4 as uuid } from "uuid";

import "@xyflow/react/dist/style.css";
import Toolbar from "./Toolbar";
import { nodeTypes } from "./AddNodes";
import AnimatedSVGEdge from "./CustomEdges";
import { Box } from "@mui/material";
import { useSave } from "../../../Stores/useStore";
import cachedKeys from "../../../Constants/cachedKeys";

const edgeTypes = {
  animatedSvg: AnimatedSVGEdge,
};

const initNodes = [
  {
    id: "b7e48d14-235b-4238-bdac-cd54ae7796e2",
    type: "customNode_startNode",
    position: {
      x: -320,
      y: 241,
    },
    data: {
      label: "customNode_startNode node",
    },
    measured: {
      width: 1002,
      height: 275,
    },
    selected: false,
    dragging: false,
  },
  {
    id: "c372a3b5-85fa-4b7d-a1e5-1913df8d6721",
    type: "customNode_endNode",
    position: {
      x: 1301,
      y: 175,
    },
    data: {
      label: "customNode_endNode node",
    },
    measured: {
      width: 500,
      height: 367,
    },
    selected: true,
    dragging: false,
  },
];

export default function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { screenToFlowPosition } = useReactFlow();
  const save = useSave();

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
    },
    [screenToFlowPosition]
  );

  console.log("nodes", { nodes, edges });
  useEffect(() => {
    save(cachedKeys.FLOW_NODES, nodes);
  }, [save, nodes]);

  useEffect(() => {
    save(cachedKeys.FLOW_EDGES, edges);
  }, [edges, save]);

  return (
    <div>
      <Box
        sx={{
          width: "100vw",
          height: "100vh",
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
        >
          <Controls />
          <MiniMap />
          <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        </ReactFlow>
        <Toolbar />
      </Box>
    </div>
  );
}
