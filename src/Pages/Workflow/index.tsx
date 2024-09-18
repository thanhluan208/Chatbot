import { Box,  } from "@mui/material";
import FlowChart from "./Components/FlowChart";
import { ReactFlowProvider } from "@xyflow/react";
import { useEffect } from "react";
import { useSave } from "@/Stores/useStore";
import cachedKeys from "@/Constants/cachedKeys";

const initNodes = [
  {
    id: "c372a3b5-85fa-4b7d-a1e5-1913df8d6721",
    type: "customNode_mutliAgentStartNode",
    position: {
      x: 1301,
      y: 175,
    },
    data: {
      label: "customNode_mutliAgentStartNode node",
      isRoot: true
    },
    measured: {
      width: 500,
      height: 367,
    },
    dragging: false,
    selectable: false
  },
];

const listNode = [
  {
    name: "customNode_multiAgentNode",
    label: "Multi Agent Node",
    description: "Create an agent",
  },
];

const Workflow = () => {
  //! State
  const save = useSave();

  //! Function

  useEffect(() => {
    save(cachedKeys.HISTORY, [
      {
        nodes: initNodes,
        edges: [],
      },
    ]);
  }, [initNodes]);

  //! Render
  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
      }}
    >
      <ReactFlowProvider>
        <FlowChart initNodes={initNodes} listNode={listNode} botId="123"/>
      </ReactFlowProvider>
    </Box>
  );


};

export default Workflow;
